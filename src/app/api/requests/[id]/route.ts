import { NextResponse } from "next/server";
import { deleteRequest } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-session";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await deleteRequest(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not delete request.",
      },
      { status: 500 },
    );
  }
}
