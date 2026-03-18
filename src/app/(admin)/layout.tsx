import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminHeader } from '@/components/layout/admin-header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <div className="pl-60">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
