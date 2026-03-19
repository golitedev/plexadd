import { NextResponse } from "next/server";
import { areAdminCredentialsValid, createAdminSession } from "@/lib/admin-session";
import { getSetupState } from "@/lib/env";

export async function POST(request: Request) {
  if (!getSetupState().admin) {
    return NextResponse.json({ error: "Admin is not configured." }, { status: 503 });
  }

  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (!body.username || !body.password) {
    return NextResponse.json({ error: "Missing credentials." }, { status: 400 });
  }

  if (!areAdminCredentialsValid(body.username, body.password)) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  await createAdminSession();

  return NextResponse.json({ success: true });
}
