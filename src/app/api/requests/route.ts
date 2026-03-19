import { NextResponse } from "next/server";
import { insertRequest, listRequests } from "@/lib/db";
import { getSetupState } from "@/lib/env";
import { sendTelegramNotification } from "@/lib/telegram";
import type { SearchResult } from "@/lib/types";

export async function GET() {
  if (!getSetupState().supabase) {
    return NextResponse.json({ requests: [] });
  }

  try {
    const requests = await listRequests();
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not load requests.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!getSetupState().supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const body = (await request.json()) as Partial<SearchResult>;

  if (
    !body.mediaType ||
    !body.title ||
    !body.source ||
    !body.sourceId ||
    !["movie", "tv", "song", "album"].includes(body.mediaType)
  ) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  try {
    const created = await insertRequest({
      mediaType: body.mediaType,
      title: body.title,
      subtitle: body.subtitle ?? null,
      releaseYear: body.releaseYear ?? null,
      imageUrl: body.imageUrl ?? null,
      source: body.source,
      sourceId: body.sourceId,
    });

    await sendTelegramNotification(created);

    return NextResponse.json({ request: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not create request.",
      },
      { status: 500 },
    );
  }
}
