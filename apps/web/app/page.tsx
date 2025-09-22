import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Dhara Luxe hero"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-4xl md:text-7xl font-heading text-dhara-beige leading-tight">
            Dhara Luxe
          </h1>
          <p className="mt-6 text-lg max-w-xl mx-auto text-white/90">
            The New Way of Luxury — Vegan, eco-friendly, handcrafted handbags.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/shop" className="px-6 py-3 bg-dhara-gold text-white rounded">
              Shop Collection
            </Link>
            <Link href="/about" className="px-6 py-3 border border-white/30 text-white rounded">
              Our Story
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured products (placeholder) */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="font-heading text-3xl mb-6">Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Sample product placeholders */}
          {[1, 2, 3].map((id) => (
            <article key={id} className="bg-white rounded shadow-sm overflow-hidden">
              <div className="relative h-72">
                <Image src={`/products/sample-${id}.jpg`} alt="product" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Sample Bag {id}</h3>
                <p className="mt-2 text-sm text-gray-600">₹12,000</p>
                <div className="mt-4">
                  <Link href={`/product/sample-bag-${id}`} className="text-sm text-dhara-green">View</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-dhara-beige py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-heading text-2xl mb-2">Join the waitlist</h3>
          <p className="text-sm text-gray-700 mb-6">Exclusive drops and early access. Vegan luxury, redefined.</p>

          <form action="/api/waitlist/subscribe" method="post" className="flex flex-col sm:flex-row gap-3 justify-center">
            <input name="email" required type="email" placeholder="Your email" className="px-4 py-3 rounded border w-full sm:w-auto" />
            <button className="px-6 py-3 bg-dhara-green text-white rounded">Join</button>
          </form>
        </div>
      </section>
    </main>
  );
}
