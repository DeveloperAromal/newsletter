import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Supabase Auth Error:", authError.message);
      return NextResponse.json(
        { error: authError.message || "Failed to sign up user." },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        {
          message:
            "User signed up, but verification is required. Please check your email.",
        },
        { status: 200 }
      );
    }

    const { data, error: dbError } = await supabase.from("users").insert([
      {
        name,
        email,
        uid: authData.user.id,
      },
    ]);

    if (dbError) {
      console.error("Database Insert Error:", dbError.message);
      return NextResponse.json(
        { error: "Failed to create user profile in database." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully!", user: data },
      { status: 201 }
    );
  } catch (e) {
    console.error("Unexpected Error:", e);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
