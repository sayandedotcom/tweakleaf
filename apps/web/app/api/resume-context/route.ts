import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { data } = await request.json();

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  // const { data: resume, error } = await supabase
  //   .from("users")
  //   .update({ resume_context: data })
  //   .eq("user_id", userId)
  //   .select();

  const { data: resume, error } = await supabase
    .from("threads")
    .insert({ thread_id: "data", user_id: userId })
    .select();

  console.log(resume);

  console.log(error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: resume });
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  const { data: resume, error } = await supabase
    .from("users")
    .select("resume_context")
    .eq("user_id", userId)
    .select();

  console.log(resume);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: resume });
}
