import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import Providers from "@/components/providers";
import CartLink from "@/components/CartLink";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: {
    default: "Dhara Luxe — The New Way of Luxury",
    template: "%s | Dhara Luxe",
  },
  description:
    "Dhara Luxe crafts vegan, cruelty-free handbags with timeless silhouettes and sustainable materials.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Dhara Luxe — The New Way of Luxury",
    description:
      "Vegan, cruelty-free, and handcrafted luxury handbags in earthy, minimal aesthetics.",
    url: "/",
    siteName: "Dhara Luxe",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Dhara Luxe — Vegan Luxury Handbags",
      },
    ],
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <header className="border-b border-black/10">
            <div className="container-luxe h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.svg" alt="Dhara Luxe" width={110} height={28} />
              </Link>
              <nav className="hidden md:flex items-center gap-8 text-sm">
                <Link href="/shop" className="hover:opacity-80">Shop</Link>
                <Link href="/about" className="hover:opacity-80">About</Link>
                <Link href="/contact" className="hover:opacity-80">Contact</Link>
                <CartLink />
                <Link href="/account" className="hover:opacity-80">Account</Link>
              </nav>
            </div>
          </header>
          <main>
            {children}
          </main>
          <footer className="mt-20 border-t border-black/10">
            <div className="container-luxe py-10 text-sm text-muted flex flex-col md:flex-row items-center justify-between gap-4">
              <p>© {new Date().getFullYear()} Dhara Luxe. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/privacy" className="hover:opacity-80">Privacy</Link>
                <Link href="/terms" className="hover:opacity-80">Terms</Link>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
