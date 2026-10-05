-- Accounts: saved gear lists and trip checklists, owned by auth.users.
-- Every table has row-level security so users can only touch their own rows.

-- Gear lists ------------------------------------------------------------------

create table public.lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  is_favorites boolean not null default false,
  created_at timestamptz not null default now()
);

create index lists_user_id_idx on public.lists (user_id);
-- Exactly one Favorites list per user.
create unique index lists_one_favorites_idx on public.lists (user_id) where is_favorites;

create table public.list_items (
  list_id uuid not null references public.lists (id) on delete cascade,
  product_id text not null,
  created_at timestamptz not null default now(),
  primary key (list_id, product_id)
);

-- Trips -----------------------------------------------------------------------

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  template_id text,
  created_at timestamptz not null default now()
);

create index trips_user_id_idx on public.trips (user_id);

create table public.trip_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  label text not null check (char_length(label) between 1 and 120),
  section text not null,
  product_slug text,
  gear_category text,
  gear_subcategory text,
  checked boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index trip_items_trip_id_idx on public.trip_items (trip_id, position);

-- Row-level security ----------------------------------------------------------

alter table public.lists enable row level security;
alter table public.list_items enable row level security;
alter table public.trips enable row level security;
alter table public.trip_items enable row level security;

create policy "Own lists" on public.lists
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Items in own lists" on public.list_items
  for all to authenticated
  using (exists (select 1 from public.lists l where l.id = list_id and l.user_id = (select auth.uid())))
  with check (exists (select 1 from public.lists l where l.id = list_id and l.user_id = (select auth.uid())));

create policy "Own trips" on public.trips
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Items in own trips" on public.trip_items
  for all to authenticated
  using (exists (select 1 from public.trips t where t.id = trip_id and t.user_id = (select auth.uid())))
  with check (exists (select 1 from public.trips t where t.id = trip_id and t.user_id = (select auth.uid())));

-- The Favorites list is permanent; users can rename it but not delete it.
create policy "Favorites cannot be deleted" on public.lists
  as restrictive for delete to authenticated
  using (not is_favorites);

-- Every new user starts with a Favorites list ---------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.lists (user_id, name, is_favorites) values (new.id, 'Favorites', true);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Account deletion (required by the App Store) --------------------------------

create function public.delete_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_account() from public, anon;
grant execute on function public.delete_account() to authenticated;
