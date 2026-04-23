alter table public.requests
add column if not exists requested_language text;

alter table public.requests
add column if not exists wants_audiobook boolean not null default false;

alter table public.requests
add column if not exists wants_ebook boolean not null default false;

alter table public.requests
drop constraint if exists requests_requested_language_check;

alter table public.requests
add constraint requests_requested_language_check
check (requested_language in ('en', 'sv', 'es') or requested_language is null);
