export function getRequiredEnv() {
  return {
    supabaseUrl: process.env.SUPABASE_URL ?? "",
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY ?? "",
    supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    tmdbApiKey: process.env.TMDB_API_KEY ?? "",
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
    telegramChatId: process.env.TELEGRAM_CHAT_ID ?? "",
    adminUsername: process.env.ADMIN_USERNAME ?? "",
    adminPassword: process.env.ADMIN_PASSWORD ?? "",
    adminSessionSecret: process.env.ADMIN_SESSION_SECRET ?? "",
  };
}

export function getSetupState() {
  const env = getRequiredEnv();

  return {
    supabase: Boolean(env.supabaseUrl && env.supabaseSecretKey),
    admin: Boolean(env.adminUsername && env.adminPassword && env.adminSessionSecret),
    tmdb: Boolean(env.tmdbApiKey),
    telegram: Boolean(env.telegramBotToken && env.telegramChatId),
  };
}
