import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get order counts per email
  const { data: orders } = await supabase
    .from("orders")
    .select("customer_email, amount, status");

  const orderMap: Record<string, { count: number; total: number }> = {};
  (orders ?? []).forEach((o) => {
    if (o.status === "paid") {
      if (!orderMap[o.customer_email]) orderMap[o.customer_email] = { count: 0, total: 0 };
      orderMap[o.customer_email].count += 1;
      orderMap[o.customer_email].total += Number(o.amount);
    }
  });

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.user_metadata?.full_name ?? "—",
    created_at: u.created_at,
    last_sign_in: u.last_sign_in_at,
    confirmed: !!u.confirmed_at,
    orders: orderMap[u.email ?? ""]?.count ?? 0,
    spent: orderMap[u.email ?? ""]?.total ?? 0,
  }));

  return NextResponse.json(users);
}
