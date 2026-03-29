import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns – KnottyVibes",
};

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="section-title mb-10">Shipping & Returns</h1>

      <div className="space-y-10">
        <Section title="Shipping Policy">
          <ul className="space-y-3 text-brown/70 text-sm leading-relaxed">
            <li>🚚 <strong>Free shipping</strong> on all orders above ₹999.</li>
            <li>📦 Orders below ₹999 have a flat shipping fee of <strong>₹99</strong>.</li>
            <li>⏱️ All orders are dispatched within <strong>2–3 business days</strong> of payment confirmation.</li>
            <li>🗓️ Estimated delivery: <strong>5–7 business days</strong> across India.</li>
            <li>📍 We currently ship within India only.</li>
            <li>🔔 You will receive a tracking link via email once your order is dispatched.</li>
          </ul>
        </Section>

        <Section title="Handmade & Made-to-Order">
          <p className="text-brown/70 text-sm leading-relaxed">
            Many of our products are handmade to order. This means each piece is crafted
            specifically for you after your purchase. While this may add 1–2 extra days,
            it ensures you receive the freshest, most lovingly made product possible.
          </p>
        </Section>

        <Section title="Returns & Exchanges">
          <ul className="space-y-3 text-brown/70 text-sm leading-relaxed">
            <li>💛 We take great care in packing every order — but if something arrives damaged or incorrect, we&apos;ll make it right.</li>
            <li>📸 Contact us within <strong>48 hours</strong> of delivery with photos of the issue.</li>
            <li>🔁 We offer a <strong>replacement or store credit</strong> for damaged/wrong items.</li>
            <li>❌ We do not accept returns for change of mind, as all products are handmade.</li>
          </ul>
        </Section>

        <Section title="Cancellations">
          <p className="text-brown/70 text-sm leading-relaxed">
            Orders can be cancelled within <strong>12 hours</strong> of placing them.
            After that, production may have already begun. Write to us at{" "}
            <a href="mailto:knottyvibes74@gmail.com" className="text-terracotta hover:underline">
              knottyvibes74@gmail.com
            </a>{" "}
            as soon as possible and we&apos;ll do our best to help.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="font-display text-xl text-brown-dark mb-4">{title}</h2>
      {children}
    </div>
  );
}
