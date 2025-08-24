import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { data } = await request.json();

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  const { data: coverletter, error } = await supabase
    .from("users")
    .insert({ coverletter_context: data, user_id: userId })
    .select();

  console.log(coverletter);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: coverletter });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: coverletter, error } = await supabase
    .from("users")
    .select("coverletter_context")
    .select();

  console.log(coverletter);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: coverletter });
}
