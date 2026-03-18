import 'server-only';
import { db } from '@/lib/db';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: process.env.S3_REGION ?? 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
  },
});

const BUCKET = process.env.S3_BUCKET ?? 'digital-products';

export class FulfillmentService {
  /**
   * Fulfill an order after verified payment.
   * Only call this after server-side payment confirmation.
   */
  async fulfillOrder(orderId: string) {
    const order = await db.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (order.status !== 'PAID') {
      throw new Error('Cannot fulfill unpaid order');
    }

    const results = [];

    for (const item of order.items) {
      if (item.fulfilled) continue;

      let deliveryData: Record<string, unknown> = {};

      switch (item.deliveryType) {
        case 'DOWNLOAD':
          deliveryData = await this.fulfillDownload(item.productId, orderId);
          break;
        case 'LICENSE_KEY':
          deliveryData = await this.fulfillLicenseKey(item.productId, orderId);
          break;
        case 'PRIVATE_LINK':
          deliveryData = await this.fulfillPrivateLink(item.productId, orderId);
          break;
      }

      await db.orderItem.update({
        where: { id: item.id },
        data: {
          fulfilled: true,
          deliveryData: deliveryData as object,
        },
      });

      results.push({ itemId: item.id, deliveryType: item.deliveryType, deliveryData });
    }

    const allFulfilled = await db.orderItem.count({
      where: { orderId, fulfilled: false },
    });

    await db.order.update({
      where: { id: orderId },
      data: {
        fulfillmentStatus: allFulfilled === 0 ? 'FULFILLED' : 'PARTIALLY_FULFILLED',
      },
    });

    return results;
  }

  /** Generate a presigned download URL for digital product assets. */
  async getDownloadUrl(storageKey: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: storageKey,
    });

    return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
  }

  /** Generate a delivery token for accessing downloads. */
  async createDeliveryToken(orderId: string, orderItemId: string): Promise<string> {
    const token = uuidv4();

    const item = await db.orderItem.findUniqueOrThrow({
      where: { id: orderItemId },
    });

    if (item.orderId !== orderId || !item.fulfilled) {
      throw new Error('Item not eligible for delivery');
    }

    // Store token in delivery data
    const deliveryData = (item.deliveryData as Record<string, unknown>) ?? {};
    deliveryData.deliveryToken = token;
    deliveryData.tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await db.orderItem.update({
      where: { id: orderItemId },
      data: { deliveryData: deliveryData as object },
    });

    return token;
  }

  /** Re-send delivery for an order item. */
  async resendDelivery(orderItemId: string) {
    const item = await db.orderItem.findUniqueOrThrow({
      where: { id: orderItemId },
      include: { order: true },
    });

    if (!item.fulfilled) {
      throw new Error('Item has not been fulfilled yet');
    }

    // Generate fresh delivery token
    const token = await this.createDeliveryToken(item.orderId, item.id);

    return { token, email: item.order.customerEmail };
  }

  private async fulfillDownload(productId: string, orderId: string) {
    const assets = await db.productAsset.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
    });

    const downloadLinks = assets.map((asset) => ({
      fileName: asset.fileName,
      fileSize: asset.fileSize,
      storageKey: asset.storageKey,
    }));

    return {
      type: 'download',
      assets: downloadLinks,
      orderId,
    };
  }

  private async fulfillLicenseKey(productId: string, orderId: string) {
    // Claim an available license key
    const key = await db.licenseKey.findFirst({
      where: { productId, status: 'AVAILABLE' },
    });

    if (!key) {
      throw new Error(`No available license keys for product ${productId}`);
    }

    await db.licenseKey.update({
      where: { id: key.id },
      data: {
        status: 'CLAIMED',
        orderId,
        claimedAt: new Date(),
      },
    });

    return {
      type: 'license_key',
      licenseKey: key.key,
      keyId: key.id,
    };
  }

  private async fulfillPrivateLink(productId: string, orderId: string) {
    const token = uuidv4();

    const assets = await db.productAsset.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
    });

    return {
      type: 'private_link',
      token,
      assets: assets.map((a) => ({ fileName: a.fileName, storageKey: a.storageKey })),
      orderId,
    };
  }
}

export const fulfillmentService = new FulfillmentService();
