import nodemailer from "nodemailer";

export type OrderEmailPayload = {
  to: string;
  subject: string;
  order: {
    id: string;
    amount: number;
    items: Array<{ id: string; name: string; price: number; quantity: number; image?: string }>;
    shipping?: any;
    created_at?: string;
  };
};

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass },
  });
}

export async function sendOrderEmail(payload: OrderEmailPayload) {
  const transporter = getTransport();
  if (!transporter) return;

  const fmt = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const list = (payload.order.items || [])
    .map((it) => `<tr><td style="padding:4px 8px">${it.name} × ${it.quantity}</td><td style="padding:4px 8px;text-align:right">₹${fmt.format(Number(it.price) * Number(it.quantity || 1))}</td></tr>`) 
    .join("");

  const shipping = payload.order.shipping || {};
  const from = process.env.SMTP_FROM || `Dhara Luxe <no-reply@dharaluxe.local>`;

  const html = `
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px">
    <h2 style="margin:0 0 8px">Order Confirmed</h2>
    <p style="margin:0 0 16px;color:#444">Thank you for your purchase. Your order <strong>#${payload.order.id.slice(0,8)}</strong> has been confirmed.</p>
    <table style="width:100%;border-collapse:collapse">
      ${list}
      <tr>
        <td style="padding:8px;border-top:1px solid #ddd"><strong>Total</strong></td>
        <td style="padding:8px;border-top:1px solid #ddd;text-align:right"><strong>₹${fmt.format(payload.order.amount || 0)}</strong></td>
      </tr>
    </table>
    <div style="margin-top:16px;color:#444">
      <p style="margin:0 0 4px"><strong>Shipping to</strong></p>
      <p style="margin:0">${shipping.full_name || ""}</p>
      <p style="margin:0">${shipping.line1 || ""}${shipping.line2 ? ", " + shipping.line2 : ""}</p>
      <p style="margin:0">${shipping.city || ""}, ${shipping.state || ""} ${shipping.pincode || ""}</p>
      <p style="margin:0">${shipping.country || ""}</p>
    </div>
    <p style="margin-top:24px;color:#666">We’ll notify you when your order ships.</p>
  </div>`;

  await transporter.sendMail({
    from,
    to: payload.to,
    subject: payload.subject,
    html,
  });
}
