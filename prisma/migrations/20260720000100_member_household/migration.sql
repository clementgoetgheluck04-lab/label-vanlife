alter table public.profiles
  add column if not exists age integer;

alter table public.profiles
  drop constraint if exists profiles_age_check;
alter table public.profiles
  add constraint profiles_age_check check (age is null or age between 18 and 120);

create table if not exists public.member_companions (
  id text primary key,
  "userId" text not null references public.users(id) on delete cascade on update cascade,
  "firstName" text not null,
  "lastName" text not null,
  age integer not null check (age between 0 and 120),
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null
);

create index if not exists member_companions_user_id_idx
  on public.member_companions ("userId");

alter table public.member_companions enable row level security;

drop policy if exists "member_companions_read_own_or_admin" on public.member_companions;
create policy "member_companions_read_own_or_admin"
  on public.member_companions for select to authenticated
  using ("userId" = (select auth.uid())::text or (select public.is_admin()));
