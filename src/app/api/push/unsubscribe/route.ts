import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { endpoint } = await request.json();

  if (!endpoint) {
    return NextResponse.json({ error: "falta endpoint" }, { status: 400 });
  }

  await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);

  return NextResponse.json({ ok: true });
}
