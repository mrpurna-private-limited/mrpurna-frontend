-- Run this script in the Supabase SQL Editor.
create table if not exists public.client_users (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null unique check (char_length(email) <= 254),
  phone text not null check (char_length(trim(phone)) between 7 and 30),
  created_at timestamptz not null default now()
);

alter table public.client_users enable row level security;

drop policy if exists "Anyone can read client users" on public.client_users;
create policy "Anyone can read client users"
  on public.client_users for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can create client users" on public.client_users;
create policy "Anyone can create client users"
  on public.client_users for insert
  to anon, authenticated
  with check (true);

alter table public.client_users replica identity full;
alter publication supabase_realtime add table public.client_users;
