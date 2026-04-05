import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendShippingNotification } from "@/lib/resend";
import { checkAdminAuth } from "@/lib/admin-auth";

const adminSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  const { fulfillment_status, tracking_id, tracking_url, admin_notes } = body;

  const supabase = adminSupabase();

  const updates: Record<string, unknown> = {};
  if (fulfillment_status) updates.fulfillment_status = fulfillment_status;
  if (tracking_id !== undefined) updates.tracking_id = tracking_id;
  if (tracking_url !== undefined) updates.tracking_url = tracking_url;
  if (admin_notes !== undefined) updates.admin_notes = admin_notes;
  if (fulfillment_status === "shipped") updates.shipped_at = new Date().toISOString();
  if (fulfillment_status === "delivered") updates.delivered_at = new Date().toISOString();

  const { data: order, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send shipping email when marked as shipped
  if (fulfillment_status === "shipped" && process.env.RESEND_API_KEY) {
    sendShippingNotification({
      to: order.customer_email,
      name: order.customer_name,
      orderId: order.razorpay_order_id,
      trackingId: tracking_id ?? order.tracking_id,
      trackingUrl: tracking_url ?? order.tracking_url,
    }).catch(console.error);
  }

  return NextResponse.json(order);
}
