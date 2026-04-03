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
  copyAction: string;
  deleteAction: string;
  addPanelTitle: string;
  addPanelSubtitle: string;
  manualMusic: {
    title: string;
    subtitle: string;
    nameLabel: Record<"song" | "album", string>;
    namePlaceholder: Record<"song" | "album", string>;
    artistLabel: string;
    artistPlaceholder: string;
    submit: string;
  };
  listTitle: Record<Section, string>;
  listSubtitle: string;
  itemsLabel: string;
  emptyState: string;
  loading: string;
  confirmDelete: string;
  setupWarning: string;
    feedback: {
      added: string;
      copied: string;
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
    title: "",
    subtitle:
      "Find and request movies, TV shows, and music for Alvin’s Plex server.",
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
      album: "Album",
      song: "Single",
    },
    searchLabel: {
      movie: "Search for a movie",
      tv: "Search for a TV show",
      song: "Search for a single",
      album: "Search for an album",
    },
    searchPlaceholder: {
      movie: "Start typing a movie title",
      tv: "Start typing a TV show title",
      song: "Start typing a single title",
      album: "Start typing an album title",
    },
    searching: "Searching…",
    searchHint: "Type at least two characters to search.",
    noResults: "No results found for that search.",
    addAction: "Add",
    copyAction: "Copy",
    deleteAction: "Delete",
    addPanelTitle: "Add a new request",
    addPanelSubtitle: "Search the catalog, choose a result, and add it directly to the list.",
    manualMusic: {
      title: "Manual request",
      subtitle: "Add a music request manually if it does not show up in search.",
      nameLabel: {
        album: "Album name",
        song: "Single name",
      },
      namePlaceholder: {
        album: "Enter an album name",
        song: "Enter a single name",
      },
      artistLabel: "Artist name",
      artistPlaceholder: "Enter an artist name",
      submit: "Add manual request",
    },
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
      copied: "Copied to clipboard.",
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
      song: "Single",
      album: "Album",
    },
  },
  sv: {
    title: "",
    subtitle:
      "Hitta och önska filmer, TV-serier och musik till Alvins Plex-server.",
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
      album: "Album",
      song: "Singel",
    },
    searchLabel: {
      movie: "Sök efter film",
      tv: "Sök efter TV-serie",
      song: "Sök efter singel",
      album: "Sök efter album",
    },
    searchPlaceholder: {
      movie: "Börja skriva en filmtitel",
      tv: "Börja skriva en serietitel",
      song: "Börja skriva en singeltitel",
      album: "Börja skriva ett album",
    },
    searching: "Söker…",
    searchHint: "Skriv minst två tecken för att söka.",
    noResults: "Inga träffar för sökningen.",
    addAction: "Lägg till",
    copyAction: "Kopiera",
    deleteAction: "Ta bort",
    addPanelTitle: "Lägg till en ny önskning",
    addPanelSubtitle: "Sök i katalogen, välj ett resultat och lägg till det direkt i listan.",
    manualMusic: {
      title: "Manuell önskning",
      subtitle: "Lägg till en musikönskning manuellt om den inte dyker upp i sökningen.",
      nameLabel: {
        album: "Albumnamn",
        song: "Singelnamn",
      },
      namePlaceholder: {
        album: "Ange ett albumnamn",
        song: "Ange ett singelnamn",
      },
      artistLabel: "Artistnamn",
      artistPlaceholder: "Ange ett artistnamn",
      submit: "Lägg till manuellt",
    },
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
      copied: "Kopierad till urklipp.",
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
      song: "Singel",
      album: "Album",
    },
  },
  es: {
    title: "",
    subtitle:
      "Busca y solicita películas, series y música para el servidor Plex de Alvin.",
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
      album: "Álbum",
      song: "Sencillo",
    },
    searchLabel: {
      movie: "Buscar una película",
      tv: "Buscar una serie",
      song: "Buscar un sencillo",
      album: "Buscar un álbum",
    },
    searchPlaceholder: {
      movie: "Empieza a escribir un título",
      tv: "Empieza a escribir una serie",
      song: "Empieza a escribir un sencillo",
      album: "Empieza a escribir un álbum",
    },
    searching: "Buscando…",
    searchHint: "Escribe al menos dos caracteres para buscar.",
    noResults: "No se encontraron resultados.",
    addAction: "Añadir",
    copyAction: "Copiar",
    deleteAction: "Eliminar",
    addPanelTitle: "Añadir una nueva petición",
    addPanelSubtitle: "Busca en el catálogo, elige un resultado y añádelo directamente a la lista.",
    manualMusic: {
      title: "Solicitud manual",
      subtitle: "Añade una petición de música manualmente si no aparece en la búsqueda.",
      nameLabel: {
        album: "Nombre del álbum",
        song: "Nombre del sencillo",
      },
      namePlaceholder: {
        album: "Escribe el nombre del álbum",
        song: "Escribe el nombre del sencillo",
      },
      artistLabel: "Nombre del artista",
      artistPlaceholder: "Escribe el nombre del artista",
      submit: "Añadir manualmente",
    },
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
      copied: "Copiado al portapapeles.",
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
      song: "Sencillo",
      album: "Álbum",
    },
  },
};
