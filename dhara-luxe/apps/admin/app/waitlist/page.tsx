async function getWaitlist() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/waitlist`, { cache: "no-store" });
  if (!res.ok) return { items: [] } as any;
  return res.json();
}

export default async function WaitlistPage() {
  const data = await getWaitlist();
  const items: any[] = data.items || [];

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Waitlist</h1>
          <p className="text-sm text-muted mt-1">Newsletter & early access</p>
        </div>
        <a href="/api/waitlist/export" className="btn btn-primary">Export CSV</a>
      </div>
      <div className="overflow-x-auto card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-muted">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {items.map((w) => (
              <tr key={w.email + w.created_at} className="border-t border-[color:var(--surface-border)]">
                <td className="px-4 py-3">{w.email}</td>
                <td className="px-4 py-3">{new Date(w.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={2}>No waitlist entries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
