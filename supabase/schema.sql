-- Curious Lab: user profiles and roles
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.

-- 1. Profiles: one row per login, linked to Supabase Auth.
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  employee_id text not null unique,
  full_name   text not null,
  role        text not null default 'employee' check (role in ('admin', 'employee')),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 2. Helper: is the signed-in user an active admin?
--    security definer so it can read profiles without tripping RLS recursion.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and active
  );
$$;

-- 3. Read access: everyone can read their own profile; admins can read all.
--    There are deliberately NO insert/update/delete policies: all writes go
--    through the /api/admin-users server function, which uses the service key.
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "admins read all profiles" on public.profiles;
create policy "admins read all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());


-- ---------------------------------------------------------------------------
-- 4. FIRST ADMIN (do this once, after running everything above)
--
--   a) Dashboard -> Authentication -> Users -> Add user -> Create new user
--        Email:    admin@curiouslab.local      (use your own ID before the @)
--        Password: choose a strong one
--        Tick "Auto Confirm User"
--
--   b) Then run this, with the same ID and your name:
--
-- insert into public.profiles (id, employee_id, full_name, role)
-- select id, 'admin', 'Your Name', 'admin'
-- from auth.users where email = 'admin@curiouslab.local';
--
--   You can now log in to the portal with ID "admin" and that password,
--   and create everyone else from the Admin page.
-- ---------------------------------------------------------------------------
