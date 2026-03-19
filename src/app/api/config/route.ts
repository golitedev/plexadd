import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getSetupState } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    adminAuthenticated: await isAdminAuthenticated(),
    setup: getSetupState(),
  });
}
