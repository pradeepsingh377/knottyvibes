import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation({
  to, name, orderId, items, total,
}: {
  to: string;
  name: string;
  orderId: string;
  items: { name: string; quantity: number; price: number; image?: string }[];
  total: number;
}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = total - subtotal;

  const itemRows = items.map((i) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f5efe6;vertical-align:middle">
        <div style="display:flex;align-items:center;gap:12px">
          ${i.image ? `<img src="${i.image}" alt="${i.name}" width="48" height="48" style="border-radius:8px;object-fit:cover;flex-shrink:0"/>` : ""}
          <span style="font-size:14px;color:#4a2e16">${i.name}</span>
        </div>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f5efe6;text-align:center;color:#8b6245;font-size:13px">×${i.quantity}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f5efe6;text-align:right;color:#4a2e16;font-size:14px">₹${(i.price * i.quantity).toLocaleString("en-IN")}</td>
    </tr>`).join("");

  return resend.emails.send({
    from: "KnottyVibes <orders@knottyvibes.art>",
    to,
    subject: "Your KnottyVibes order is confirmed! 🎉",
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#faf7f2;padding:32px;border-radius:12px">
        <!-- Header -->
        <div style="text-align:center;margin-bottom:28px">
          <h1 style="font-size:26px;color:#4a2e16;margin:0">KnottyVibes</h1>
          <p style="color:#c4704f;font-style:italic;margin:4px 0 0;font-size:13px">Made slow, made meaningful</p>
        </div>

        <h2 style="font-size:22px;color:#4a2e16;margin-bottom:4px">Thank you, ${name}! 🎉</h2>
        <p style="color:#8b6245;margin-top:0;font-size:14px">Your order has been confirmed and is being lovingly prepared.</p>

        <!-- Order ref -->
        <p style="font-size:12px;color:#c4b89a;margin-bottom:20px">Order ref: <span style="font-family:monospace;color:#8b6245">${orderId.slice(-10).toUpperCase()}</span></p>

        <!-- Items -->
        <div style="background:white;border-radius:12px;padding:20px;margin-bottom:16px">
          <table style="width:100%;border-collapse:collapse">
            ${itemRows}
            <!-- Subtotal -->
            <tr>
              <td colspan="2" style="padding-top:14px;font-size:13px;color:#8b6245">Subtotal</td>
              <td style="padding-top:14px;text-align:right;font-size:13px;color:#8b6245">₹${subtotal.toLocaleString("en-IN")}</td>
            </tr>
            <!-- Shipping -->
            <tr>
              <td colspan="2" style="padding-top:6px;font-size:13px;color:#8b6245">Shipping</td>
              <td style="padding-top:6px;text-align:right;font-size:13px;color:#8b6245">${shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}</td>
            </tr>
            <!-- Total -->
            <tr>
              <td colspan="2" style="padding-top:12px;border-top:1px solid #f5efe6;font-weight:bold;color:#4a2e16;font-size:15px">Total</td>
              <td style="padding-top:12px;border-top:1px solid #f5efe6;text-align:right;font-weight:bold;color:#c4704f;font-size:15px">₹${total.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>

        <!-- Info -->
        <div style="background:#fff8f3;border-radius:12px;padding:16px;margin-bottom:20px;font-size:13px;color:#8b6245">
          <p style="margin:0 0 6px">🚚 <strong>Expected dispatch:</strong> 2–3 business days</p>
          <p style="margin:0">📦 <strong>Delivery:</strong> 5–7 business days after dispatch</p>
        </div>

        <p style="font-size:13px;color:#8b6245">Questions? Write to <a href="mailto:knottyvibes74@gmail.com" style="color:#c4704f">knottyvibes74@gmail.com</a></p>
        <p style="font-size:12px;color:#c4b89a;margin-top:28px;text-align:center">Made with love · KnottyVibes · <a href="https://knottyvibes.art" style="color:#c4b89a">knottyvibes.art</a></p>
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
    from: "KnottyVibes <hello@knottyvibes.art>",
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
