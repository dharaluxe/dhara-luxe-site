import './globals.css';
import { PropsWithChildren } from 'react';
import { Metadata } from 'next';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Dhara Luxe — The New Way of Luxury',
  description: 'Dhara Luxe — Vegan, eco-friendly, handcrafted luxury handbags.',
  openGraph: {
    title: 'Dhara Luxe',
    description: 'Vegan luxury handbags — eco-friendly, cruelty-free, handcrafted.',
    images: [{ url: '/og-image.jpg' }]
  }
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="font-body bg-dhara-offwhite text-dhara-green">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <header className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between">
              <div className="text-xl font-heading">Dhara Luxe</div>
              <nav className="space-x-6">
                <a href="/" className="text-sm">Shop</a>
                <a href="/about" className="text-sm">About</a>
                <a href="/contact" className="text-sm">Contact</a>
                <a href="/cart" className="text-sm">Cart</a>
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="max-w-6xl mx-auto p-6 mt-24 text-sm text-gray-500">
            © {new Date().getFullYear()} Dhara Luxe — All rights reserved.
          </footer>
        </motion.div>
      </body>
    </html>
  );
}
