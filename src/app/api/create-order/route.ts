import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { OrderItem, ShippingAddress } from "@/types/database";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const Razorpay = (await import("razorpay")).default;
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  try {
    const body = await req.json();
    const { items, customer, shipping_address } = body as {
      items: OrderItem[];
      customer: { name: string; email: string; phone: string };
      shipping_address: ShippingAddress;
    };

    if (!items?.length || !customer || !shipping_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 999 ? 0 : 99;
    const amount = Math.round((subtotal + shipping) * 100); // paise

    const rzpOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `kv_${Date.now()}`,
    });

    // Save order to Supabase
    const { error } = await supabase.from("orders").insert({
      razorpay_order_id: rzpOrder.id,
      razorpay_payment_id: null,
      status: "created",
      amount: subtotal + shipping,
      currency: "INR",
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address,
      items,
    });

    if (error) throw error;

    return NextResponse.json({
      order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
