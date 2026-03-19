"use client";

import Image from "next/image";
import { useDeferredValue, useEffect, useEffectEvent, useRef, useState } from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  SECTION_OPTIONS,
  dictionaries,
  languageNames,
} from "@/lib/i18n";
import type {
  AppConfig,
  Language,
  MediaType,
  RequestRecord,
  SearchResult,
  Section,
} from "@/lib/types";

const languageStorageKey = "plexadd-language";

function sectionForMediaType(mediaType: MediaType): Section {
  return mediaType === "movie"
    ? "movies"
    : mediaType === "tv"
      ? "tv"
      : "music";
}

function mediaTypeForSection(section: Section, musicMode: "song" | "album"): MediaType {
  if (section === "movies") {
    return "movie";
  }

  if (section === "tv") {
    return "tv";
  }

  return musicMode;
}

function formatRequestMeta(
  request: RequestRecord,
  language: Language,
  labelMap: Record<MediaType, string>,
) {
  const bits = [labelMap[request.mediaType]];

  if (request.subtitle) {
    bits.push(request.subtitle);
  }

  if (request.releaseYear) {
    bits.push(String(request.releaseYear));
  }

  bits.push(
    new Intl.DateTimeFormat(language, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(request.createdAt)),
  );

  return bits.join("  •  ");
}

export function PlexaddApp() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [section, setSection] = useState<Section>("movies");
  const [musicMode, setMusicMode] = useState<"song" | "album">("album");
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [manualMusicName, setManualMusicName] = useState("");
  const [manualArtistName, setManualArtistName] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isMutatingRequest, setIsMutatingRequest] = useState<string | null>(null);
  const [showInlineMobileLanguage, setShowInlineMobileLanguage] = useState(false);
  const headerRowRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const loginButtonRef = useRef<HTMLButtonElement | null>(null);

  const dictionary = dictionaries[language];
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const activeMediaType = mediaTypeForSection(section, musicMode);

  const filteredRequests = requests.filter((request) => {
    if (section === "music") {
      return request.mediaType === "song" || request.mediaType === "album";
    }

    return sectionForMediaType(request.mediaType) === section;
  });

  const runSearch = useEffectEvent(async (query: string, mediaType: MediaType) => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsLoadingSearch(false);
      return;
    }

    setIsLoadingSearch(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(trimmed)}&mediaType=${mediaType}&language=${language}`,
      );
      const payload = (await response.json()) as
        | { results: SearchResult[] }
        | { error: string };

      if (!response.ok || !("results" in payload)) {
        throw new Error("error" in payload ? payload.error : dictionary.errors.generic);
      }

      setSearchResults(payload.results);
    } catch (error) {
      setSearchResults([]);
      setErrorMessage(error instanceof Error ? error.message : dictionary.errors.generic);
    } finally {
      setIsLoadingSearch(false);
    }
  });

  async function loadConfig() {
    try {
      const response = await fetch("/api/config", { cache: "no-store" });
      const payload = (await response.json()) as AppConfig;
      setConfig(payload);
    } catch {
      setConfig(null);
    }
  }

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(languageStorageKey);

    if (storedLanguage && storedLanguage in dictionaries) {
      setLanguage(storedLanguage as Language);
      document.documentElement.lang = storedLanguage;
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(languageStorageKey, language);
    document.cookie = `plexadd_language=${language}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = language;
  }, [language]);

  const updateMobileLanguagePlacement = useEffectEvent(() => {
    if (window.innerWidth >= 768) {
      setShowInlineMobileLanguage(false);
      return;
    }

    const rowWidth = headerRowRef.current?.clientWidth ?? 0;
    const logoWidth = logoRef.current?.offsetWidth ?? 0;
    const loginWidth = loginButtonRef.current?.offsetWidth ?? 0;
    const compactLanguageWidth = 104;
    const totalWidth = logoWidth + loginWidth + compactLanguageWidth + 24;

    setShowInlineMobileLanguage(totalWidth <= rowWidth);
  });

  useEffect(() => {
    updateMobileLanguagePlacement();

    const handleResize = () => updateMobileLanguagePlacement();
    window.addEventListener("resize", handleResize);

    if (typeof ResizeObserver === "undefined") {
      return () => window.removeEventListener("resize", handleResize);
    }

    const observer = new ResizeObserver(() => updateMobileLanguagePlacement());

    [headerRowRef.current, logoRef.current, loginButtonRef.current].forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [config?.adminAuthenticated, language]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialRequests() {
      setIsLoadingRequests(true);

      try {
        const response = await fetch("/api/requests", { cache: "no-store" });
        const payload = (await response.json()) as
          | { requests: RequestRecord[] }
          | { error: string };

        if (!response.ok || !("requests" in payload)) {
          throw new Error("error" in payload ? payload.error : dictionary.errors.generic);
        }

        if (isMounted) {
          setRequests(payload.requests);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : dictionary.errors.generic);
        }
      } finally {
        if (isMounted) {
          setIsLoadingRequests(false);
        }
      }
    }

    void loadInitialRequests();
    void loadConfig();

    return () => {
      isMounted = false;
    };
  }, [dictionary.errors.generic]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void runSearch(deferredSearchQuery, activeMediaType);
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [activeMediaType, deferredSearchQuery]);

  useEffect(() => {
    setSearchQuery("");
    setSearchResults([]);
    setManualMusicName("");
    setManualArtistName("");
    setErrorMessage(null);
  }, [section, musicMode]);

  async function handleAddRequest(result: SearchResult, mutationKey = result.sourceId) {
    setIsMutatingRequest(mutationKey);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });

      const payload = (await response.json()) as
        | { request: RequestRecord }
        | { error: string };

      if (!response.ok || !("request" in payload)) {
        throw new Error("error" in payload ? payload.error : dictionary.errors.generic);
      }

      setRequests((current) => [payload.request, ...current]);
      setSearchQuery("");
      setSearchResults([]);
      setStatusMessage(dictionary.feedback.added);
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : dictionary.errors.generic);
      return false;
    } finally {
      setIsMutatingRequest(null);
    }
  }

  async function handleAddManualMusicRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = manualMusicName.trim();
    const artist = manualArtistName.trim();

    if (!title || !artist) {
      return;
    }

    const normalizedTitle = title.toLowerCase().replace(/\s+/g, "-");
    const normalizedArtist = artist.toLowerCase().replace(/\s+/g, "-");

    const created = await handleAddRequest(
      {
        mediaType: musicMode,
        title,
        subtitle: artist,
        releaseYear: null,
        imageUrl: null,
        source: "musicbrainz",
        sourceId: `manual-${musicMode}-${normalizedTitle}-${normalizedArtist}-${Date.now()}`,
      },
      "manual-request",
    );

    if (created) {
      setManualMusicName("");
      setManualArtistName("");
    }
  }

  async function handleDeleteRequest(id: string) {
    setIsMutatingRequest(id);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as
        | { success: true }
        | { error: string };

      if (!response.ok || !("success" in payload)) {
        throw new Error("error" in payload ? payload.error : dictionary.errors.generic);
      }

      setRequests((current) => current.filter((request) => request.id !== id));
      setStatusMessage(dictionary.feedback.deleted);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : dictionary.errors.generic);
    } finally {
      setIsMutatingRequest(null);
    }
  }

  async function handleAdminLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingLogin(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const payload = (await response.json()) as
        | { success: true }
        | { error: string };

      if (!response.ok || !("success" in payload)) {
        throw new Error("error" in payload ? payload.error : dictionary.errors.invalidLogin);
      }

      setPassword("");
      setUsername("");
      setIsAdminPanelOpen(false);
      setStatusMessage(dictionary.feedback.loggedIn);
      await loadConfig();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : dictionary.errors.invalidLogin);
    } finally {
      setIsSubmittingLogin(false);
    }
  }

  async function handleAdminLogout() {
    setErrorMessage(null);
    setStatusMessage(null);

    await fetch("/api/admin/logout", { method: "POST" });
    await loadConfig();
    setStatusMessage(dictionary.feedback.loggedOut);
  }

  const sectionCounts = {
    movies: requests.filter((request) => request.mediaType === "movie").length,
    tv: requests.filter((request) => request.mediaType === "tv").length,
    music: requests.filter(
      (request) => request.mediaType === "song" || request.mediaType === "album",
    ).length,
  };

  return (
    <main className="min-h-screen bg-[#000000]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[7px] border border-[#1f1f1f] bg-[#0a0a0a]">
          <div className="flex flex-col gap-5 px-4 py-4 sm:px-6">
            <div className="space-y-3">
              <div ref={headerRowRef} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div ref={logoRef}>
                    <Image
                      src="/logo/plexadd-logo.svg"
                      alt="Plexadd"
                      width={180}
                      height={36}
                      priority
                      className="h-8 w-auto shrink-0"
                    />
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {showInlineMobileLanguage ? (
                    <div className="inline-flex h-10 w-fit items-center rounded-[999px] border border-[#1f1f1f] bg-[#0a0a0a] p-1 md:hidden">
                      {LANGUAGE_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`flex h-8 w-8 items-center justify-center rounded-[999px] text-xs leading-none transition-colors ${
                            language === option
                              ? "bg-[#ededed] text-[#0a0a0a]"
                              : "text-[#9f9f9f] hover:bg-[#111111] hover:text-[#ededed]"
                          }`}
                          onClick={() => setLanguage(option)}
                        >
                          {languageNames[option]}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div className="hidden h-10 w-fit items-center rounded-[999px] border border-[#1f1f1f] bg-[#0a0a0a] p-1 md:inline-flex">
                    {LANGUAGE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`flex h-8 w-10 items-center justify-center rounded-[999px] text-sm leading-none transition-colors ${
                          language === option
                            ? "bg-[#ededed] text-[#0a0a0a]"
                            : "text-[#9f9f9f] hover:bg-[#111111] hover:text-[#ededed]"
                        }`}
                        onClick={() => setLanguage(option)}
                      >
                        {languageNames[option]}
                      </button>
                    ))}
                  </div>

                  {config?.adminAuthenticated ? (
                    <button
                      ref={loginButtonRef}
                      type="button"
                      className="h-10 whitespace-nowrap rounded-[999px] border border-[#1f1f1f] bg-[#0a0a0a] px-4 text-sm font-medium text-[#ededed] transition-colors hover:border-[#2a2a2a] hover:bg-[#111111]"
                      onClick={() => void handleAdminLogout()}
                    >
                      {dictionary.adminLogout}
                    </button>
                  ) : (
                    <button
                      ref={loginButtonRef}
                      type="button"
                      className="h-10 whitespace-nowrap rounded-[999px] bg-[#ededed] px-4 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-[#ffffff]"
                      onClick={() => setIsAdminPanelOpen((current) => !current)}
                    >
                      {dictionary.adminLogin}
                    </button>
                  )}
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
                {dictionary.subtitle}
              </p>

              {!showInlineMobileLanguage ? (
                <div className="inline-flex h-10 w-fit items-center rounded-[999px] border border-[#1f1f1f] bg-[#0a0a0a] p-1 md:hidden">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`flex h-8 w-8 items-center justify-center rounded-[999px] text-xs leading-none transition-colors ${
                        language === option
                          ? "bg-[#ededed] text-[#0a0a0a]"
                          : "text-[#9f9f9f] hover:bg-[#111111] hover:text-[#ededed]"
                      }`}
                      onClick={() => setLanguage(option)}
                    >
                      {languageNames[option]}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <nav className="grid gap-2 sm:grid-cols-3">
              {SECTION_OPTIONS.map((option) => {
                const isActive = option === section;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`flex items-center justify-between rounded-[6px] border px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "border-[#1f1f1f] bg-[#111111] text-[#ededed]"
                        : "border-[#1f1f1f] bg-[#0a0a0a] text-[var(--color-text-muted)] hover:border-[#2a2a2a] hover:bg-[#111111] hover:text-[#ededed]"
                    }`}
                    onClick={() => setSection(option)}
                  >
                    <span className="font-medium">{dictionary.sections[option]}</span>
                    <span className="font-mono text-xs">{sectionCounts[option]}</span>
                  </button>
                );
              })}
            </nav>

            {isAdminPanelOpen && !config?.adminAuthenticated ? (
              <form
                className="grid gap-3 rounded-[7px] border border-[#1f1f1f] bg-[#0a0a0a] p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end"
                onSubmit={(event) => void handleAdminLogin(event)}
              >
                <label className="flex flex-col gap-1 text-sm text-[var(--color-text-muted)]">
                  <span>{dictionary.adminUsername}</span>
                  <input
                    className="h-11 rounded-[6px] border border-[#1f1f1f] bg-[#000000] px-3 text-[#ededed] outline-none transition-colors focus:border-[#ededed]"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-[var(--color-text-muted)]">
                  <span>{dictionary.adminPassword}</span>
                  <input
                    type="password"
                    className="h-11 rounded-[6px] border border-[#1f1f1f] bg-[#000000] px-3 text-[#ededed] outline-none transition-colors focus:border-[#ededed]"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </label>
                <div className="flex md:self-end">
                  <button
                    type="submit"
                    className="h-11 w-full min-w-28 rounded-[6px] bg-[#ededed] px-4 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-[#ffffff] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmittingLogin}
                  >
                    {isSubmittingLogin ? dictionary.loading : dictionary.adminSubmit}
                  </button>
                </div>
              </form>
            ) : null}

            {config && (!config.setup.supabase || !config.setup.admin) ? (
              <div className="rounded-[6px] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] px-4 py-3 text-sm text-[var(--color-text)]">
                {dictionary.setupWarning}
              </div>
            ) : null}
          </div>
        </header>

        <div className="mt-4 grid gap-4 lg:items-start lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          <section className="min-w-0 self-start rounded-[7px] border border-[#1f1f1f] bg-[#0a0a0a]">
            <div className="border-b border-[var(--color-border-soft)] px-4 py-4 sm:px-5">
              <h2 className="text-base font-semibold text-[var(--color-text)]">
                {dictionary.addPanelTitle}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {dictionary.addPanelSubtitle}
              </p>
            </div>

            <div className="space-y-4 p-4 sm:p-5">
              {section === "music" ? (
                <div className="grid grid-cols-2 gap-2">
                  {(["album", "song"] as const).map((option) => {
                    const isActive = option === musicMode;

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`h-11 rounded-[6px] border text-sm transition-colors ${
                          isActive
                            ? "border-[#1f1f1f] bg-[#111111] text-[#ededed]"
                            : "border-[#1f1f1f] bg-[#0a0a0a] text-[var(--color-text-muted)] hover:border-[#2a2a2a] hover:bg-[#111111] hover:text-[#ededed]"
                        }`}
                        onClick={() => setMusicMode(option)}
                      >
                        {dictionary.musicModes[option]}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <label className="flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
                <span>{dictionary.searchLabel[activeMediaType]}</span>
                <input
                  className="h-12 rounded-[6px] border border-[#1f1f1f] bg-[#000000] px-4 text-[#ededed] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[#ededed]"
                  placeholder={dictionary.searchPlaceholder[activeMediaType]}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </label>

              <div className="max-h-[28rem] overflow-hidden overflow-y-auto rounded-[7px] border border-[#171717] bg-[#000000]">
                {isLoadingSearch ? (
                  <div className="px-4 py-6 text-sm text-[var(--color-text-muted)]">
                    {dictionary.searching}
                  </div>
                ) : searchQuery.trim().length < 2 ? (
                  <div className="px-4 py-6 text-sm text-[var(--color-text-muted)]">
                    {dictionary.searchHint}
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-[var(--color-text-muted)]">
                    {dictionary.noResults}
                  </div>
                ) : (
                  <ul className="divide-y divide-[var(--color-border-soft)]">
                    {searchResults.map((result) => (
                      <li key={`${result.mediaType}-${result.sourceId}`}>
                        <div className="flex min-w-0 items-start gap-3 px-4 py-3">
                          <Poster
                            imageUrl={result.imageUrl}
                            title={result.title}
                            mediaType={result.mediaType}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-[var(--color-text)]">
                              {result.title}
                            </div>
                            <div className="mt-1 truncate text-xs leading-5 text-[var(--color-text-muted)]">
                              {[dictionary.labels[result.mediaType], result.subtitle, result.releaseYear]
                                .filter(Boolean)
                                .join("  •  ")}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="shrink-0 rounded-[6px] bg-[#ededed] px-3 py-2 text-xs font-medium text-[#0a0a0a] transition-colors hover:bg-[#ffffff] disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() => void handleAddRequest(result)}
                            disabled={isMutatingRequest === result.sourceId}
                          >
                            {isMutatingRequest === result.sourceId
                              ? dictionary.loading
                              : dictionary.addAction}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {section === "music" ? (
                <form
                  className="space-y-4 rounded-[7px] border border-[#1f1f1f] bg-[#000000] p-4"
                  onSubmit={(event) => void handleAddManualMusicRequest(event)}
                >
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text)]">
                      {dictionary.manualMusic.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      {dictionary.manualMusic.subtitle}
                    </p>
                  </div>

                  <label className="flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
                    <span>{dictionary.manualMusic.nameLabel[musicMode]}</span>
                    <input
                      className="h-12 rounded-[6px] border border-[#1f1f1f] bg-[#000000] px-4 text-[#ededed] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[#ededed]"
                      placeholder={dictionary.manualMusic.namePlaceholder[musicMode]}
                      value={manualMusicName}
                      onChange={(event) => setManualMusicName(event.target.value)}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
                    <span>{dictionary.manualMusic.artistLabel}</span>
                    <input
                      className="h-12 rounded-[6px] border border-[#1f1f1f] bg-[#000000] px-4 text-[#ededed] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[#ededed]"
                      placeholder={dictionary.manualMusic.artistPlaceholder}
                      value={manualArtistName}
                      onChange={(event) => setManualArtistName(event.target.value)}
                    />
                  </label>

                  <button
                    type="submit"
                    className="h-11 w-full rounded-[6px] bg-[#ededed] px-4 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-[#ffffff] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={
                      isMutatingRequest === "manual-request" ||
                      !manualMusicName.trim() ||
                      !manualArtistName.trim()
                    }
                  >
                    {isMutatingRequest === "manual-request"
                      ? dictionary.loading
                      : dictionary.manualMusic.submit}
                  </button>
                </form>
              ) : null}
            </div>
          </section>

          <section className="min-w-0 rounded-[7px] border border-[#1f1f1f] bg-[#0a0a0a] lg:flex lg:max-h-[calc(100vh-16rem)] lg:min-h-0 lg:flex-col lg:overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-[var(--color-border-soft)] px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text)]">
                  {dictionary.listTitle[section]}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {dictionary.listSubtitle}
                </p>
              </div>

              <div className="font-mono text-xs text-[var(--color-text-muted)]">
                {filteredRequests.length} {dictionary.itemsLabel}
              </div>
            </div>

            {statusMessage ? (
              <div className="border-b border-[var(--color-border-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--color-text)]">
                {statusMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="border-b border-[var(--color-border-soft)] bg-[var(--color-danger-soft)] px-4 py-3 text-sm text-[var(--color-text)]">
                {errorMessage}
              </div>
            ) : null}

            <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
              {isLoadingRequests ? (
                <div className="px-4 py-10 text-sm text-[var(--color-text-muted)]">
                  {dictionary.loading}
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="px-4 py-10 text-sm text-[var(--color-text-muted)]">
                  {dictionary.emptyState}
                </div>
              ) : (
                <ul className="divide-y divide-[var(--color-border-soft)]">
                  {filteredRequests.map((request) => (
                    <li key={request.id}>
                      <div className="flex min-w-0 items-start gap-3 px-4 py-4 sm:px-5">
                        <Poster
                          imageUrl={request.imageUrl}
                          title={request.title}
                          mediaType={request.mediaType}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-[var(--color-text)]">
                            {request.title}
                          </div>
                          <div className="mt-1 truncate text-xs leading-5 text-[var(--color-text-muted)]">
                            {formatRequestMeta(request, language, dictionary.labels)}
                          </div>
                        </div>

                        {config?.adminAuthenticated ? (
                          <button
                            type="button"
                            className="shrink-0 rounded-[6px] border border-[#1f1f1f] bg-[#111111] px-3 py-2 text-xs font-medium text-[#ededed] transition-colors hover:border-[#2a2a2a] hover:bg-[#151515] disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() => void handleDeleteRequest(request.id)}
                            disabled={isMutatingRequest === request.id}
                          >
                            {isMutatingRequest === request.id
                              ? dictionary.loading
                              : dictionary.deleteAction}
                          </button>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Poster({
  imageUrl,
  title,
  mediaType,
}: {
  imageUrl: string | null;
  title: string;
  mediaType: MediaType;
}) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const isMusic = mediaType === "song" || mediaType === "album";
  const dimensions = isMusic
    ? {
        width: 64,
        height: 64,
        className: "h-16 w-16 shrink-0 rounded-[5px] border border-[var(--color-border)] object-cover",
      }
    : {
        width: 48,
        height: 64,
        className: "h-16 w-12 shrink-0 rounded-[5px] border border-[var(--color-border)] object-cover",
      };

  if (!imageUrl || failedImageUrl === imageUrl) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-[5px] border border-[var(--color-border)] bg-[var(--color-surface-strong)] text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-muted)] ${
          isMusic ? "h-16 w-16" : "h-16 w-12"
        }`}
      >
        N/A
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={title}
      width={dimensions.width}
      height={dimensions.height}
      className={dimensions.className}
      onError={() => setFailedImageUrl(imageUrl)}
    />
  );
}
