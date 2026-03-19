create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  media_type text not null check (media_type in ('movie', 'tv', 'song', 'album')),
  title text not null,
  subtitle text,
  release_year integer,
  source text not null check (source in ('tmdb', 'musicbrainz')),
  source_id text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists requests_created_at_idx on public.requests (created_at desc);
create index if not exists requests_media_type_idx on public.requests (media_type, created_at desc);

alter table public.requests enable row level security;
