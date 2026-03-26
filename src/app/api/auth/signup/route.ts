import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { sendWelcomeEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Send welcome email (non-blocking)
  if (process.env.RESEND_API_KEY) {
    sendWelcomeEmail({ to: email, name }).catch(console.error);
  }

  return NextResponse.json({ user: data.user });
}
