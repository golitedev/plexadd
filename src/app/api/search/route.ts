import { NextResponse } from "next/server";
import { searchCatalog } from "@/lib/search";
import type { Language, MediaType } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";
  const mediaType = searchParams.get("mediaType") as MediaType | null;
  const language = (searchParams.get("language") as Language | null) ?? "en";

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  if (!mediaType || !["movie", "tv", "song", "album", "book"].includes(mediaType)) {
    return NextResponse.json({ error: "Invalid media type." }, { status: 400 });
  }

  try {
    const results = await searchCatalog({ query, mediaType, language });
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Search failed.",
      },
      { status: 500 },
    );
  }
}
