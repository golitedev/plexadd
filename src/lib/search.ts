import { getRequiredEnv, getSetupState } from "@/lib/env";
import type { Language, MediaType, SearchResult } from "@/lib/types";

const musicBrainzHeaders = {
  "User-Agent": "plexadd/0.1.0 (personal request board)",
  Accept: "application/json",
};

function normalizeYear(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const match = value.match(/\d{4}/);
  return match ? Number(match[0]) : null;
}

function tmdbLanguage(language: Language) {
  return language === "sv" ? "sv-SE" : language === "es" ? "es-ES" : "en-US";
}

export async function searchCatalog({
  query,
  mediaType,
  language,
}: {
  query: string;
  mediaType: MediaType;
  language: Language;
}) {
  if (mediaType === "movie" || mediaType === "tv") {
    return searchTmdb(query, mediaType, language);
  }

  if (mediaType === "book") {
    return searchOpenLibrary(query);
  }

  return searchMusicBrainz(query, mediaType);
}

async function searchTmdb(query: string, mediaType: "movie" | "tv", language: Language) {
  const { tmdbApiKey } = getRequiredEnv();

  if (!getSetupState().tmdb) {
    throw new Error("TMDB is not configured.");
  }

  const url = new URL(`https://api.themoviedb.org/3/search/${mediaType}`);
  url.searchParams.set("api_key", tmdbApiKey);
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("language", tmdbLanguage(language));

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("TMDB search failed.");
  }

  const payload = (await response.json()) as {
    results: Array<{
      id: number;
      title?: string;
      name?: string;
      release_date?: string;
      first_air_date?: string;
      poster_path?: string | null;
    }>;
  };

  return payload.results.slice(0, 8).map<SearchResult>((item) => ({
    mediaType,
    title: mediaType === "movie" ? item.title ?? "Untitled" : item.name ?? "Untitled",
    subtitle: null,
    releaseYear: normalizeYear(mediaType === "movie" ? item.release_date : item.first_air_date),
    imageUrl: item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : null,
    source: "tmdb",
    sourceId: String(item.id),
  }));
}

async function searchMusicBrainz(query: string, mediaType: "song" | "album") {
  const url =
    mediaType === "song"
      ? new URL("https://musicbrainz.org/ws/2/recording")
      : new URL("https://musicbrainz.org/ws/2/release-group");

  url.searchParams.set(
    "query",
    mediaType === "album" ? `${query} AND primarytype:album` : query,
  );
  url.searchParams.set("limit", "8");
  url.searchParams.set("fmt", "json");

  const response = await fetch(url, {
    headers: musicBrainzHeaders,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("MusicBrainz search failed.");
  }

  const payload = (await response.json()) as {
    recordings?: Array<{
      id: string;
      title: string;
      "artist-credit"?: Array<{ name: string }>;
      "first-release-date"?: string;
    }>;
    "release-groups"?: Array<{
      id: string;
      title: string;
      "artist-credit"?: Array<{ name: string }>;
      "first-release-date"?: string;
    }>;
  };

  const items =
    mediaType === "song" ? payload.recordings ?? [] : payload["release-groups"] ?? [];

  return items.map<SearchResult>((item) => ({
    mediaType,
    title: item.title,
    subtitle: item["artist-credit"]?.map((artist) => artist.name).join(", ") ?? null,
    releaseYear: normalizeYear(item["first-release-date"]),
    imageUrl:
      mediaType === "album"
        ? `https://coverartarchive.org/release-group/${item.id}/front-250`
        : null,
    source: "musicbrainz",
    sourceId: item.id,
  }));
}

async function searchOpenLibrary(query: string) {
  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("q", query);
  url.searchParams.set(
    "fields",
    "key,title,author_name,first_publish_year,cover_i",
  );
  url.searchParams.set("limit", "8");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "plexadd/0.1.0 (personal request board)",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Open Library search failed.");
  }

  const payload = (await response.json()) as {
    docs: Array<{
      key: string;
      title: string;
      author_name?: string[];
      first_publish_year?: number;
      cover_i?: number;
    }>;
  };

  return payload.docs.map<SearchResult>((item) => ({
    mediaType: "book",
    title: item.title,
    subtitle: item.author_name?.join(", ") ?? null,
    releaseYear: item.first_publish_year ?? null,
    imageUrl: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : null,
    source: "openlibrary",
    sourceId: item.key,
  }));
}
