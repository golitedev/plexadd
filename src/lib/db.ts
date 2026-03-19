import { getRequiredEnv, getSetupState } from "@/lib/env";
import type { RequestRecord, SearchResult } from "@/lib/types";

type RequestRow = {
  id: string;
  media_type: RequestRecord["mediaType"];
  title: string;
  subtitle: string | null;
  release_year: number | null;
  image_url: string | null;
  source: RequestRecord["source"];
  source_id: string;
  created_at: string;
};

function mapRow(row: RequestRow): RequestRecord {
  return {
    id: row.id,
    mediaType: row.media_type,
    title: row.title,
    subtitle: row.subtitle,
    releaseYear: row.release_year,
    imageUrl: row.image_url,
    source: row.source,
    sourceId: row.source_id,
    createdAt: row.created_at,
  };
}

async function supabaseRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const { supabaseUrl, supabaseSecretKey } = getRequiredEnv();

  if (!getSetupState().supabase) {
    throw new Error("Supabase is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabaseSecretKey,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Supabase request failed.");
  }

  const text = await response.text();

  if (!text) {
    return null as T;
  }

  return JSON.parse(text) as T;
}

export async function listRequests() {
  const rows = await supabaseRequest<RequestRow[]>(
    "requests?select=id,media_type,title,subtitle,release_year,image_url,source,source_id,created_at&order=created_at.desc",
  );

  return rows.map(mapRow);
}

export async function insertRequest(input: SearchResult) {
  const row = await supabaseRequest<RequestRow>("requests", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      media_type: input.mediaType,
      title: input.title,
      subtitle: input.subtitle,
      release_year: input.releaseYear,
      image_url: input.imageUrl,
      source: input.source,
      source_id: input.sourceId,
    }),
  });

  return mapRow(row);
}

export async function deleteRequest(id: string) {
  await supabaseRequest<unknown>(`requests?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal",
    },
  });
}
