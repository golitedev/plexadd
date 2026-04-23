alter table public.requests
drop constraint if exists requests_media_type_check;

alter table public.requests
add constraint requests_media_type_check
check (media_type in ('movie', 'tv', 'song', 'album', 'book'));

alter table public.requests
drop constraint if exists requests_source_check;

alter table public.requests
add constraint requests_source_check
check (source in ('tmdb', 'musicbrainz', 'openlibrary'));
