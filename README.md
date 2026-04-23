# plexadd

Public request board for movies, TV shows, music, and books. Built with Next.js for Vercel, using Supabase as a lightweight backend.

## Stack

- Next.js App Router
- Tailwind CSS
- Supabase Postgres via server-side REST calls
- TMDB for movie and TV search
- MusicBrainz for song and album search
- Open Library for book search
- Telegram Bot API for new request notifications

## Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env`.
3. Fill in the environment variables:

```bash
SUPABASE_URL=
SUPABASE_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
TMDB_API_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

`SUPABASE_SECRET_KEY` is the current server-side key. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the current client-side key from the Connect dialog. This app currently uses the secret key on the server. The publishable key is included to match current Supabase naming, but the app does not yet use it directly. The old legacy `service_role` key is no longer needed here.

## Supabase Schema Workflow

This repo is now prepared for the CLI migration workflow.

- Canonical migration file:
  [supabase/migrations/20260318213000_create_requests.sql](/home/alvin/Documents/projects/plexadd/supabase/migrations/20260318213000_create_requests.sql)
- Legacy copy of the schema:
  [supabase/schema.sql](/home/alvin/Documents/projects/plexadd/supabase/schema.sql)

Recommended flow:

1. Install the Supabase CLI or run it through `npx`
2. Log in:

```bash
npx supabase login
```

3. Link this repo to your Supabase project:

```bash
npx supabase link --project-ref <your-project-ref>
```

You can get `<your-project-ref>` from your Supabase dashboard URL:

```text
https://supabase.com/dashboard/project/<your-project-ref>
```

4. Push the migration:

```bash
npm run db:push
```

If `npx supabase` is not available yet, install the CLI first:

```bash
npm install --save-dev supabase
```

The current official Supabase migration flow is `supabase login`, `supabase link`, then `supabase db push`.

## Getting Telegram Chat ID

- Create a bot with BotFather and copy the bot token into `TELEGRAM_BOT_TOKEN`.
- Send a message to your bot from your Telegram account.
- Open `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
- Find your personal `chat.id` and place it in `TELEGRAM_CHAT_ID`

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploying To Vercel

- Push the project to a Git repository.
- Import it into Vercel.
- Add the same environment variables in the Vercel project settings.
- Deploy.

## Notes

- Anonymous visitors can add requests and view the full list.
- Only the admin account can delete requests.
- If Telegram is not configured, the app still works without notifications.
