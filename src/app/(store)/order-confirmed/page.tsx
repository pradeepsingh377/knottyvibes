import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <CheckCircle size={64} className="mx-auto text-sage mb-6" />
      <h1 className="font-display text-4xl text-brown-dark mb-3">Thank you!</h1>
      <p className="text-brown/70 text-lg mb-2">Your order has been placed successfully.</p>

      {order_id && (
        <p className="text-sm text-brown/50 mb-8">
          Order ID: <span className="font-mono text-brown/70">{order_id}</span>
        </p>
      )}

      <div className="bg-sand/40 rounded-2xl p-6 text-left mb-10">
        <h2 className="font-display text-lg text-brown-dark mb-3">What&apos;s next?</h2>
        <ul className="space-y-2 text-sm text-brown/70">
          <li>📧 A confirmation email will be sent to you shortly</li>
          <li>🤲 Your item will be carefully handcrafted and packed</li>
          <li>🚚 Expected dispatch within 2–3 business days</li>
          <li>📦 Delivery in 5–7 business days across India</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
        <Link href="/" className="btn-outline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
