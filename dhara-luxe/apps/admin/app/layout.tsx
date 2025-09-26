import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dhara Luxe Admin",
    template: "%s | Dhara Luxe Admin",
  },
  description: "Admin dashboard for managing products, orders, and customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <header className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Dhara Luxe" width={110} height={28} />
              <span className="text-sm text-muted">Admin</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="hover:opacity-80">Dashboard</Link>
              <Link href="/products" className="hover:opacity-80">Products</Link>
              <Link href="/orders" className="hover:opacity-80">Orders</Link>
              <Link href="/waitlist" className="hover:opacity-80">Waitlist</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">{children}</main>
        <footer className="border-t border-black/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 text-xs text-muted">
            © {new Date().getFullYear()} Dhara Luxe Admin
          </div>
        </footer>
      </body>
    </html>
  );
}
