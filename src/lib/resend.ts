import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation({
  to, name, orderId, items, total,
}: {
  to: string;
  name: string;
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}) {
  const itemRows = items
    .map((i) => `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #f5efe6">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f5efe6;text-align:center">×${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f5efe6;text-align:right">₹${(i.price * i.quantity).toLocaleString("en-IN")}</td>
    </tr>`)
    .join("");

  return resend.emails.send({
    from: "KnottyVibes <orders@knottyvibes.art>",
    to,
    subject: "Your KnottyVibes order is confirmed! 🎉",
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#faf7f2;padding:32px;border-radius:12px">
        <h1 style="font-size:28px;color:#4a2e16;margin-bottom:4px">Thank you, ${name}!</h1>
        <p style="color:#8b6245;margin-top:0">Your order has been confirmed.</p>
        <div style="background:white;border-radius:8px;padding:20px;margin:24px 0">
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#6b4423">
            ${itemRows}
            <tr>
              <td colspan="2" style="padding-top:12px;font-weight:bold;color:#4a2e16">Total</td>
              <td style="padding-top:12px;font-weight:bold;color:#c4704f;text-align:right">₹${total.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>
        <p style="font-size:13px;color:#8b6245">🚚 Expected dispatch in 2–3 business days. You'll receive a tracking update soon.</p>
        <p style="font-size:13px;color:#8b6245">Questions? Reply to this email or write to <a href="mailto:knottyvibes74@gmail.com" style="color:#c4704f">knottyvibes74@gmail.com</a></p>
        <p style="font-size:12px;color:#c4b89a;margin-top:32px">Made with love · KnottyVibes</p>
      </div>
    `,
  });
}

export async function sendShippingNotification({
  to, name, orderId, trackingId, trackingUrl,
}: {
  to: string; name: string; orderId: string;
  trackingId?: string; trackingUrl?: string;
}) {
  const trackingSection = trackingId
    ? `<div style="background:white;border-radius:8px;padding:20px;margin:24px 0;text-align:center">
        <p style="font-size:13px;color:#8b6245;margin:0 0 8px">Tracking ID</p>
        <p style="font-size:18px;font-weight:bold;color:#4a2e16;letter-spacing:1px;margin:0">${trackingId}</p>
        ${trackingUrl ? `<a href="${trackingUrl}" style="display:inline-block;margin-top:12px;background:#c4704f;color:white;padding:10px 24px;border-radius:999px;text-decoration:none;font-size:13px">Track your order →</a>` : ""}
      </div>`
    : `<p style="font-size:13px;color:#8b6245">Tracking details will be shared soon.</p>`;

  return resend.emails.send({
    from: "KnottyVibes <orders@knottyvibes.art>",
    to,
    subject: "Your KnottyVibes order has shipped! 🚚",
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#faf7f2;padding:32px;border-radius:12px">
        <h1 style="font-size:28px;color:#4a2e16;margin-bottom:4px">It's on its way, ${name}! 🎉</h1>
        <p style="color:#8b6245;margin-top:0">Your handcrafted order has been dispatched.</p>
        ${trackingSection}
        <p style="font-size:13px;color:#8b6245">Expected delivery in 3–5 business days.</p>
        <p style="font-size:13px;color:#8b6245">Order ref: <span style="font-family:monospace">${orderId.slice(-8)}</span></p>
        <p style="font-size:13px;color:#8b6245">Questions? Write to <a href="mailto:knottyvibes74@gmail.com" style="color:#c4704f">knottyvibes74@gmail.com</a></p>
        <p style="font-size:12px;color:#c4b89a;margin-top:32px">Made with love · KnottyVibes</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
  return resend.emails.send({
    from: "KnottyVibes <knottyvibes74@gmail.com>",
    to,
    subject: "Welcome to KnottyVibes 💛",
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#faf7f2;padding:32px;border-radius:12px">
        <h1 style="font-size:28px;color:#4a2e16">Welcome, ${name}! 🎉</h1>
        <p style="color:#8b6245">You're now part of the KnottyVibes family — a community that loves slow, handmade, meaningful things.</p>
        <a href="https://knottyvibes.art/shop" style="display:inline-block;background:#c4704f;color:white;padding:12px 28px;border-radius:999px;text-decoration:none;font-size:14px;margin-top:16px">Explore the Shop</a>
        <p style="font-size:12px;color:#c4b89a;margin-top:32px">Made with love · KnottyVibes</p>
      </div>
    `,
  });
}
