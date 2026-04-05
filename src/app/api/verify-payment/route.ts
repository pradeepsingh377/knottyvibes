import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmation } from "@/lib/resend";

// Use service role to bypass RLS for order updates
function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    // Verify HMAC signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      console.error("Signature mismatch", { expected, received: razorpay_signature });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = adminSupabase();

    // Mark order as paid
    const { data: order, error } = await supabase
      .from("orders")
      .update({ status: "paid", razorpay_payment_id, fulfillment_status: "processing" })
      .eq("razorpay_order_id", razorpay_order_id)
      .select()
      .single();

    if (error) {
      console.error("Order update error:", error);
      throw error;
    }

    // Decrement stock for each item
    if (order?.items) {
      for (const item of order.items as { product_id: string; quantity: number }[]) {
        await supabase.rpc("decrement_stock", {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });
      }
    }

    // Send confirmation email (non-blocking)
    if (order && process.env.RESEND_API_KEY) {
      sendOrderConfirmation({
        to: order.customer_email,
        name: order.customer_name,
        orderId: razorpay_order_id,
        items: order.items,
        total: order.amount,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("verify-payment error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
