export type Language = "en" | "sv" | "es";
export type Section = "movies" | "tv" | "music";
export type MediaType = "movie" | "tv" | "song" | "album";
export type SourceType = "tmdb" | "musicbrainz";

export type RequestRecord = {
  id: string;
  mediaType: MediaType;
  title: string;
  subtitle: string | null;
  releaseYear: number | null;
  imageUrl: string | null;
  source: SourceType;
  sourceId: string;
  createdAt: string;
};

export type SearchResult = {
  mediaType: MediaType;
  title: string;
  subtitle: string | null;
  releaseYear: number | null;
  imageUrl: string | null;
  source: SourceType;
  sourceId: string;
};

export type AppConfig = {
  adminAuthenticated: boolean;
  setup: {
    supabase: boolean;
    admin: boolean;
    tmdb: boolean;
    telegram: boolean;
  };
};
