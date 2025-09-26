import Image from "next/image";
import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container-luxe py-24 md:py-32 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="mb-6">
              <Image src="/logo.svg" alt="Dhara Luxe" width={140} height={40} />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl leading-tight tracking-tight">
              Dhara Luxe — The New Way of Luxury
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted max-w-prose">
              Vegan, cruelty-free, and handcrafted handbags that marry timeless silhouettes with modern minimalism.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="btn btn-primary">
                Shop the Collection
              </Link>
              <Link href="#waitlist" className="btn btn-ghost">
                Join the Waitlist
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-[var(--radius)] shadow-[var(--shadow-soft)] bg-[url('/hero.svg')] bg-cover bg-center" aria-label="Hero image placeholder">
            {/* Placeholder gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent rounded-[var(--radius)]" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-luxe py-16 md:py-24 grid sm:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-serif text-xl text-foreground">Eco-friendly</h3>
          <p className="text-sm text-muted mt-2">Sustainably sourced materials with low-impact processes.</p>
        </div>
        <div className="card p-6">
          <h3 className="font-serif text-xl text-foreground">Cruelty-free</h3>
          <p className="text-sm text-muted mt-2">Premium vegan alternatives without compromise.</p>
        </div>
        <div className="card p-6">
          <h3 className="font-serif text-xl text-foreground">Handcrafted</h3>
          <p className="text-sm text-muted mt-2">Meticulous craftsmanship for enduring quality.</p>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="container-luxe py-16 md:py-24">
        <div className="rounded-2xl p-8 md:p-12 bg-brand text-brand-contrast grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">Be first to know</h2>
            <p className="mt-2 opacity-90">Join our newsletter for early access to launches and exclusive drops.</p>
          </div>
          <WaitlistForm />
        </div>
      </section>
    </div>
  );
}
