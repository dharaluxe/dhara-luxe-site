export default function AboutPage() {
  return (
    <section className="container-luxe py-16 md:py-24">
      <h1 className="font-serif text-4xl mb-6">Our Story</h1>
      <p className="text-muted max-w-3xl">
        Dhara Luxe is a celebration of refined minimalism. We craft vegan, cruelty-free handbags with
        sustainable materials and ethical processes. Each piece is designed for longevity—timeless silhouettes,
        impeccable details, and effortless elegance.
      </p>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        <div className="p-6 border border-black/10 rounded-2xl bg-white/60"><h3 className="font-serif text-xl">Sustainability</h3><p className="text-sm text-muted mt-2">Low-impact materials and circular-minded choices.</p></div>
        <div className="p-6 border border-black/10 rounded-2xl bg-white/60"><h3 className="font-serif text-xl">Craft</h3><p className="text-sm text-muted mt-2">Hand-finished details and rigorous quality standards.</p></div>
        <div className="p-6 border border-black/10 rounded-2xl bg-white/60"><h3 className="font-serif text-xl">Design</h3><p className="text-sm text-muted mt-2">Quiet luxury with modern, functional silhouettes.</p></div>
      </div>
    </section>
  );
}
