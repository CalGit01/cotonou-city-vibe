-- Cotonou City Vibe - schéma Supabase
-- À coller tel quel dans le SQL Editor du dashboard Supabase, puis "Run".

-- 1. PROFILS (état joueur, aligné sur src/features/play/game.ts)
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text not null,
  avatar        text,
  money         integer not null default 20000,
  day           integer not null default 1,
  time_minutes  integer not null default 420,
  skill         integer not null default 0,
  job_id        text,
  home_id       text,
  needs         jsonb not null default '{"hunger":80,"energy":80,"hygiene":80,"bladder":80,"fun":70,"social":70}'::jsonb,
  bankrupt      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  last_seen_at  timestamptz not null default now()
);
create unique index if not exists profiles_username_key
  on public.profiles (lower(username));

-- 2. FAVORIS (lieux aimés, synchronisés multi-appareils)
create table if not exists public.favorites (
  user_id    uuid not null references auth.users(id) on delete cascade,
  venue_id   text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, venue_id)
);

-- 3. VISITES (journal des lieux visités)
create table if not exists public.visits (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  venue_id   text not null,
  note       text,
  created_at timestamptz not null default now()
);
create index if not exists visits_venue_idx on public.visits (venue_id);
create index if not exists visits_user_idx on public.visits (user_id);

-- 4. CHAT (salons temps réel)
create table if not exists public.chat_messages (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  channel    text not null default 'global',
  body       text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists chat_channel_idx
  on public.chat_messages (channel, created_at desc);

-- 5. updated_at automatique
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 6. Création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_username  text;
  final_username text;
begin
  base_username := coalesce(
    nullif(trim(new.raw_user_meta_data->>'username'), ''),
    'joueur_' || substr(new.id::text, 1, 8)
  );
  final_username := base_username;
  begin
    insert into public.profiles (id, username) values (new.id, final_username);
  exception when unique_violation then
    final_username := left(base_username, 24) || '_' || substr(new.id::text, 1, 4);
    insert into public.profiles (id, username) values (new.id, final_username);
  end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7. Backfill : profils pour les comptes déjà créés
do $$
declare
  r    record;
  base text;
  uname text;
begin
  for r in
    select u.id, u.raw_user_meta_data
    from auth.users u
    where not exists (select 1 from public.profiles p where p.id = u.id)
  loop
    base := coalesce(
      nullif(trim(r.raw_user_meta_data->>'username'), ''),
      'joueur_' || substr(r.id::text, 1, 8)
    );
    uname := base;
    begin
      insert into public.profiles (id, username) values (r.id, uname);
    exception when unique_violation then
      uname := left(base, 24) || '_' || substr(r.id::text, 1, 4);
      insert into public.profiles (id, username) values (r.id, uname);
    end;
  end loop;
end $$;

-- 8. Row Level Security
alter table public.profiles       enable row level security;
alter table public.favorites      enable row level security;
alter table public.visits         enable row level security;
alter table public.chat_messages  enable row level security;

-- profiles : lecture publique (présence, classements), écriture de soi
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select using (true);

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- favorites : privés
drop policy if exists favorites_select on public.favorites;
create policy favorites_select on public.favorites for select
  using (auth.uid() = user_id);

drop policy if exists favorites_insert on public.favorites;
create policy favorites_insert on public.favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists favorites_delete on public.favorites;
create policy favorites_delete on public.favorites for delete
  using (auth.uid() = user_id);

-- visits : lecture publique (compteurs), écriture de soi
drop policy if exists visits_select on public.visits;
create policy visits_select on public.visits for select using (true);

drop policy if exists visits_insert on public.visits;
create policy visits_insert on public.visits for insert
  with check (auth.uid() = user_id);

-- chat : lecture publique, écriture de soi
drop policy if exists chat_select on public.chat_messages;
create policy chat_select on public.chat_messages for select using (true);

drop policy if exists chat_insert on public.chat_messages;
create policy chat_insert on public.chat_messages for insert
  with check (auth.uid() = user_id);

-- 9. Realtime sur le chat et les profils
do $$ begin
  alter publication supabase_realtime add table public.chat_messages;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.profiles;
exception when duplicate_object then null; end $$;
