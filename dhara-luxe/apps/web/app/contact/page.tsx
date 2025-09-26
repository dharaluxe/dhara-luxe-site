export default function ContactPage() {
  return (
    <section className="container-luxe py-16 md:py-24">
      <h1 className="font-serif text-4xl mb-6">Contact Us</h1>
      <p className="text-muted max-w-2xl mb-8">We'd love to hear from you. Send us a message and our team will get back to you shortly.</p>
      <form className="max-w-2xl grid gap-4" onSubmit={(e)=>e.preventDefault()}>
        <div className="grid md:grid-cols-2 gap-4">
          <input className="rounded-xl px-4 py-3 border border-black/10" placeholder="Name" required />
          <input type="email" className="rounded-xl px-4 py-3 border border-black/10" placeholder="Email" required />
        </div>
        <textarea className="rounded-xl px-4 py-3 border border-black/10 min-h-40" placeholder="Message" required />
        <button className="btn btn-primary w-fit" type="submit">Send Message</button>
      </form>
    </section>
  );
}
