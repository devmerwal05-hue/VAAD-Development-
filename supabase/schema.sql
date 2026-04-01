create table if not exists public.site_content (
  id bigint generated always as identity primary key,
  section text not null,
  key text not null,
  value text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint site_content_section_key_unique unique (section, key)
);

create table if not exists public.contact_submissions_v2 (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  project_type text not null,
  budget_range text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'archived')),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.site_content enable row level security;
alter table public.contact_submissions_v2 enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content
for select
using (true);

insert into storage.buckets (id, name, public)
values ('vaad-assets', 'vaad-assets', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read VAAD assets" on storage.objects;
create policy "Public can read VAAD assets"
on storage.objects
for select
using (bucket_id = 'vaad-assets');

create or replace function public.touch_site_content_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists touch_site_content_updated_at on public.site_content;
create trigger touch_site_content_updated_at
before update on public.site_content
for each row
execute function public.touch_site_content_updated_at();
