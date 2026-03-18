import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Store — Premium Digital Products",
  description: "Discover and purchase premium digital products with instant delivery. Pay securely with Cash App Pay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
