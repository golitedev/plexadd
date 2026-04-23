export type Language = "en" | "sv" | "es";
export type Section = "movies" | "tv" | "music" | "books";
export type MediaType = "movie" | "tv" | "song" | "album" | "book";
export type SourceType = "tmdb" | "musicbrainz" | "openlibrary";
export type BookRequestLanguage = "en" | "sv" | "es";

export type RequestRecord = {
  id: string;
  mediaType: MediaType;
  title: string;
  subtitle: string | null;
  releaseYear: number | null;
  imageUrl: string | null;
  source: SourceType;
  sourceId: string;
  requestedLanguage: BookRequestLanguage | null;
  wantsAudiobook: boolean;
  wantsEbook: boolean;
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
  requestedLanguage?: BookRequestLanguage | null;
  wantsAudiobook?: boolean;
  wantsEbook?: boolean;
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
