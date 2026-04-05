import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getShippingSettings } from "@/lib/settings";
import type { ShippingAddress } from "@/types/database";

function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === "rzp_test_placeholder") {
    return NextResponse.json({ error: "Payment not configured yet" }, { status: 503 });
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Razorpay = require("razorpay");
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const body = await req.json();
    const { items, customer, shipping_address } = body as {
      items: { product_id: string; quantity: number }[];
      customer: { name: string; email: string; phone: string };
      shipping_address: ShippingAddress;
    };

    if (!items?.length || !customer || !shipping_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = adminSupabase();

    // Fetch real prices from DB — never trust client
    const productIds = items.map((i) => i.product_id);
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("id, name, price, stock, images")
      .in("id", productIds);

    if (fetchError || !products) throw fetchError ?? new Error("Products not found");

    // Validate stock and build order items
    const orderItems = [];
    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) return NextResponse.json({ error: `Product not found: ${item.product_id}` }, { status: 400 });
      if (product.stock < item.quantity) return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      orderItems.push({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] ?? null,
      });
    }

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const { shipping_fee, free_shipping_threshold } = await getShippingSettings();
    const shipping = subtotal >= free_shipping_threshold ? 0 : shipping_fee;
    const amount = Math.round((subtotal + shipping) * 100); // paise

    const rzpOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `kv_${Date.now()}`,
    });

    const { error } = await supabase.from("orders").insert({
      razorpay_order_id: rzpOrder.id,
      razorpay_payment_id: null,
      status: "created",
      fulfillment_status: "pending",
      amount: subtotal + shipping,
      currency: "INR",
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address,
      items: orderItems,
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
