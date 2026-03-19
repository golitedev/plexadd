import type { Language, MediaType, Section } from "@/lib/types";

export const DEFAULT_LANGUAGE: Language = "en";
export const LANGUAGE_OPTIONS: Language[] = ["en", "sv", "es"];
export const SECTION_OPTIONS: Section[] = ["movies", "tv", "music"];

export const languageNames: Record<Language, string> = {
  en: "EN",
  sv: "SV",
  es: "ES",
};

type Dictionary = {
  title: string;
  subtitle: string;
  languageLabel: string;
  adminLogin: string;
  adminLogout: string;
  adminUsername: string;
  adminPassword: string;
  adminSubmit: string;
  sections: Record<Section, string>;
  musicModes: Record<"song" | "album", string>;
  searchLabel: Record<MediaType, string>;
  searchPlaceholder: Record<MediaType, string>;
  searching: string;
  searchHint: string;
  noResults: string;
  addAction: string;
  deleteAction: string;
  addPanelTitle: string;
  addPanelSubtitle: string;
  listTitle: Record<Section, string>;
  listSubtitle: string;
  itemsLabel: string;
  emptyState: string;
  loading: string;
  confirmDelete: string;
  setupWarning: string;
  feedback: {
    added: string;
    deleted: string;
    loggedIn: string;
    loggedOut: string;
  };
  errors: {
    generic: string;
    invalidLogin: string;
  };
  labels: Record<MediaType, string>;
};

export const dictionaries: Record<Language, Dictionary> = {
  en: {
    title: "Alvin’s Plex request board",
    subtitle:
      "Search for a movie, TV show, song, or album, add it to the board, and keep the queue visible for everyone.",
    languageLabel: "Language",
    adminLogin: "Login",
    adminLogout: "Log out",
    adminUsername: "Username",
    adminPassword: "Password",
    adminSubmit: "Log in",
    sections: {
      movies: "Movies",
      tv: "TV Shows",
      music: "Music",
    },
    musicModes: {
      song: "Song",
      album: "Album",
    },
    searchLabel: {
      movie: "Search for a movie",
      tv: "Search for a TV show",
      song: "Search for a song",
      album: "Search for an album",
    },
    searchPlaceholder: {
      movie: "Start typing a movie title",
      tv: "Start typing a TV show title",
      song: "Start typing a song title",
      album: "Start typing an album title",
    },
    searching: "Searching…",
    searchHint: "Type at least two characters to search.",
    noResults: "No results found for that search.",
    addAction: "Add",
    deleteAction: "Delete",
    addPanelTitle: "Add a new request",
    addPanelSubtitle: "Search the catalog, choose a result, and add it directly to the list.",
    listTitle: {
      movies: "Movie requests",
      tv: "TV requests",
      music: "Music requests",
    },
    listSubtitle: "Newest requests stay at the top.",
    itemsLabel: "items",
    emptyState: "No requests in this section yet.",
    loading: "Loading…",
    confirmDelete: "Delete this request?",
    setupWarning:
      "Setup is incomplete. Add the Supabase and admin environment variables before deploying.",
    feedback: {
      added: "Request added.",
      deleted: "Request deleted.",
      loggedIn: "Admin session active.",
      loggedOut: "Admin session closed.",
    },
    errors: {
      generic: "Something went wrong.",
      invalidLogin: "Invalid username or password.",
    },
    labels: {
      movie: "Movie",
      tv: "TV Show",
      song: "Song",
      album: "Album",
    },
  },
  sv: {
    title: "Alvins Plex-önskelista",
    subtitle:
      "Sök efter film, serier, låtar eller album, lägg till dem i listan och låt alla se kön.",
    languageLabel: "Språk",
    adminLogin: "Login",
    adminLogout: "Logga ut",
    adminUsername: "Användarnamn",
    adminPassword: "Lösenord",
    adminSubmit: "Logga in",
    sections: {
      movies: "Filmer",
      tv: "TV-serier",
      music: "Musik",
    },
    musicModes: {
      song: "Låt",
      album: "Album",
    },
    searchLabel: {
      movie: "Sök efter film",
      tv: "Sök efter TV-serie",
      song: "Sök efter låt",
      album: "Sök efter album",
    },
    searchPlaceholder: {
      movie: "Börja skriva en filmtitel",
      tv: "Börja skriva en serietitel",
      song: "Börja skriva en låttitel",
      album: "Börja skriva ett album",
    },
    searching: "Söker…",
    searchHint: "Skriv minst två tecken för att söka.",
    noResults: "Inga träffar för sökningen.",
    addAction: "Lägg till",
    deleteAction: "Ta bort",
    addPanelTitle: "Lägg till en ny önskning",
    addPanelSubtitle: "Sök i katalogen, välj ett resultat och lägg till det direkt i listan.",
    listTitle: {
      movies: "Filmönskningar",
      tv: "TV-önskningar",
      music: "Musikönskningar",
    },
    listSubtitle: "Nyaste önskningarna ligger överst.",
    itemsLabel: "poster",
    emptyState: "Inga önskningar i den här sektionen än.",
    loading: "Laddar…",
    confirmDelete: "Ta bort den här önskningen?",
    setupWarning:
      "Installationen är inte klar. Lägg till miljövariabler för Supabase och admin innan deploy.",
    feedback: {
      added: "Önskningen lades till.",
      deleted: "Önskningen togs bort.",
      loggedIn: "Adminsession aktiv.",
      loggedOut: "Adminsession avslutad.",
    },
    errors: {
      generic: "Något gick fel.",
      invalidLogin: "Fel användarnamn eller lösenord.",
    },
    labels: {
      movie: "Film",
      tv: "TV-serie",
      song: "Låt",
      album: "Album",
    },
  },
  es: {
    title: "Tablero de solicitudes de Plex de Alvin",
    subtitle:
      "Busca una película, serie, canción o álbum, añádelo a la lista y deja la cola visible para todos.",
    languageLabel: "Idioma",
    adminLogin: "Login",
    adminLogout: "Cerrar sesión",
    adminUsername: "Usuario",
    adminPassword: "Contraseña",
    adminSubmit: "Entrar",
    sections: {
      movies: "Películas",
      tv: "Series",
      music: "Música",
    },
    musicModes: {
      song: "Canción",
      album: "Álbum",
    },
    searchLabel: {
      movie: "Buscar una película",
      tv: "Buscar una serie",
      song: "Buscar una canción",
      album: "Buscar un álbum",
    },
    searchPlaceholder: {
      movie: "Empieza a escribir un título",
      tv: "Empieza a escribir una serie",
      song: "Empieza a escribir una canción",
      album: "Empieza a escribir un álbum",
    },
    searching: "Buscando…",
    searchHint: "Escribe al menos dos caracteres para buscar.",
    noResults: "No se encontraron resultados.",
    addAction: "Añadir",
    deleteAction: "Eliminar",
    addPanelTitle: "Añadir una nueva petición",
    addPanelSubtitle: "Busca en el catálogo, elige un resultado y añádelo directamente a la lista.",
    listTitle: {
      movies: "Pedidos de películas",
      tv: "Pedidos de series",
      music: "Pedidos de música",
    },
    listSubtitle: "Las peticiones más nuevas quedan arriba.",
    itemsLabel: "elementos",
    emptyState: "Todavía no hay peticiones en esta sección.",
    loading: "Cargando…",
    confirmDelete: "¿Eliminar esta petición?",
    setupWarning:
      "La configuración no está completa. Añade las variables de entorno de Supabase y admin antes de desplegar.",
    feedback: {
      added: "Petición añadida.",
      deleted: "Petición eliminada.",
      loggedIn: "Sesión admin activa.",
      loggedOut: "Sesión admin cerrada.",
    },
    errors: {
      generic: "Algo salió mal.",
      invalidLogin: "Usuario o contraseña inválidos.",
    },
    labels: {
      movie: "Película",
      tv: "Serie",
      song: "Canción",
      album: "Álbum",
    },
  },
};
