-- Label Vanlife Sprint 0 — Supabase RLS
-- Apply only after the Prisma baseline migration, using an administrative connection.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.users
    where id = (select auth.uid())::text and role = 'ADMIN'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email, role, "createdAt", "updatedAt")
  values (new.id::text, coalesce(new.email, ''), 'VISITOR', now(), now())
  on conflict (id) do update set email = excluded.email, "updatedAt" = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email on auth.users
  for each row execute function public.handle_new_auth_user();

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.member_cards enable row level security;
alter table public.establishment_profiles enable row level security;
alter table public.places enable row level security;
alter table public.place_applications enable row level security;
alter table public.place_scores enable row level security;
alter table public.place_reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.roadtrips enable row level security;
alter table public.roadtrip_etapes enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.passport_stamps enable row level security;
alter table public.payments enable row level security;
alter table public.checkout_orders enable row level security;
alter table public.stripe_events enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_categories enable row level security;
alter table public.support_tickets enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_logs enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "users_read_own_or_admin" on public.users;
create policy "users_read_own_or_admin" on public.users for select to authenticated
using (id = (select auth.uid())::text or (select public.is_admin()));

drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own" on public.profiles for all to authenticated
using ("userId" = (select auth.uid())::text or (select public.is_admin()))
with check ("userId" = (select auth.uid())::text or (select public.is_admin()));

drop policy if exists "memberships_read_own_or_admin" on public.memberships;
create policy "memberships_read_own_or_admin" on public.memberships for select to authenticated
using ("userId" = (select auth.uid())::text or (select public.is_admin()));

drop policy if exists "member_cards_read_own_or_admin" on public.member_cards;
create policy "member_cards_read_own_or_admin" on public.member_cards for select to authenticated
using ("userId" = (select auth.uid())::text or (select public.is_admin()));

drop policy if exists "establishments_own_or_admin" on public.establishment_profiles;
create policy "establishments_own_or_admin" on public.establishment_profiles for all to authenticated
using ("userId" = (select auth.uid())::text or (select public.is_admin()))
with check ("userId" = (select auth.uid())::text or (select public.is_admin()));

drop policy if exists "places_public_read" on public.places;
create policy "places_public_read" on public.places for select to anon, authenticated
using (status = 'PUBLISHED' or (select public.is_admin()) or "createdById" = (select auth.uid())::text);
drop policy if exists "places_owner_write" on public.places;
create policy "places_owner_write" on public.places for all to authenticated
using ("createdById" = (select auth.uid())::text or (select public.is_admin()))
with check ("createdById" = (select auth.uid())::text or (select public.is_admin()));

drop policy if exists "applications_own_or_admin" on public.place_applications;
create policy "applications_own_or_admin" on public.place_applications for all to authenticated
using ("userId" = (select auth.uid())::text or (select public.is_admin()))
with check ("userId" = (select auth.uid())::text or (select public.is_admin()));

drop policy if exists "scores_public_read" on public.place_scores;
create policy "scores_public_read" on public.place_scores for select to anon, authenticated using (true);
drop policy if exists "scores_admin_write" on public.place_scores;
create policy "scores_admin_write" on public.place_scores for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "reviews_public_read" on public.place_reviews;
create policy "reviews_public_read" on public.place_reviews for select to anon, authenticated using (true);
drop policy if exists "reviews_own_write" on public.place_reviews;
create policy "reviews_own_write" on public.place_reviews for all to authenticated
using ("userId" = (select auth.uid())::text or (select public.is_admin()))
with check ("userId" = (select auth.uid())::text or (select public.is_admin()));

drop policy if exists "favorites_own" on public.favorites;
create policy "favorites_own" on public.favorites for all to authenticated
using ("userId" = (select auth.uid())::text)
with check ("userId" = (select auth.uid())::text);

drop policy if exists "roadtrips_read_public_or_own" on public.roadtrips;
create policy "roadtrips_read_public_or_own" on public.roadtrips for select to anon, authenticated
using ("isPublic" or "userId" = (select auth.uid())::text or (select public.is_admin()));
drop policy if exists "roadtrips_own_write" on public.roadtrips;
create policy "roadtrips_own_write" on public.roadtrips for all to authenticated
using ("userId" = (select auth.uid())::text or (select public.is_admin()))
with check ("userId" = (select auth.uid())::text or (select public.is_admin()));

drop policy if exists "roadtrip_steps_via_trip" on public.roadtrip_etapes;
create policy "roadtrip_steps_via_trip" on public.roadtrip_etapes for select to anon, authenticated
using (exists (select 1 from public.roadtrips r where r.id = "roadTripId" and (r."isPublic" or r."userId" = (select auth.uid())::text or (select public.is_admin()))));
drop policy if exists "roadtrip_steps_owner_write" on public.roadtrip_etapes;
create policy "roadtrip_steps_owner_write" on public.roadtrip_etapes for all to authenticated
using (exists (select 1 from public.roadtrips r where r.id = "roadTripId" and (r."userId" = (select auth.uid())::text or (select public.is_admin()))))
with check (exists (select 1 from public.roadtrips r where r.id = "roadTripId" and (r."userId" = (select auth.uid())::text or (select public.is_admin()))));

drop policy if exists "badges_public_read" on public.badges;
create policy "badges_public_read" on public.badges for select to anon, authenticated using (true);
drop policy if exists "user_badges_read_own" on public.user_badges;
create policy "user_badges_read_own" on public.user_badges for select to authenticated
using ("userId" = (select auth.uid())::text or (select public.is_admin()));
drop policy if exists "passport_own" on public.passport_stamps;
create policy "passport_own" on public.passport_stamps for all to authenticated
using ("userId" = (select auth.uid())::text)
with check ("userId" = (select auth.uid())::text);

drop policy if exists "payments_read_own_or_admin" on public.payments;
create policy "payments_read_own_or_admin" on public.payments for select to authenticated
using ("userId" = (select auth.uid())::text or (select public.is_admin()));
drop policy if exists "orders_read_own_or_admin" on public.checkout_orders;
create policy "orders_read_own_or_admin" on public.checkout_orders for select to authenticated
using ("userId" = (select auth.uid())::text or (select public.is_admin()));

drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read" on public.blog_posts for select to anon, authenticated
using (status = 'PUBLISHED' or (select public.is_admin()));
drop policy if exists "blog_posts_admin_write" on public.blog_posts;
create policy "blog_posts_admin_write" on public.blog_posts for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "blog_categories_public_read" on public.blog_categories;
create policy "blog_categories_public_read" on public.blog_categories for select to anon, authenticated using (true);
drop policy if exists "blog_categories_admin_write" on public.blog_categories;
create policy "blog_categories_admin_write" on public.blog_categories for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "support_own" on public.support_tickets;
create policy "support_own" on public.support_tickets for all to authenticated
using ("userId" = (select auth.uid())::text or (select public.is_admin()))
with check ("userId" = (select auth.uid())::text or (select public.is_admin()));
drop policy if exists "notifications_own" on public.notifications;
create policy "notifications_own" on public.notifications for all to authenticated
using ("userId" = (select auth.uid())::text or (select public.is_admin()))
with check ("userId" = (select auth.uid())::text or (select public.is_admin()));
drop policy if exists "admin_logs_admin_read" on public.admin_logs;
create policy "admin_logs_admin_read" on public.admin_logs for select to authenticated
using ((select public.is_admin()));

-- stripe_events and newsletter_subscribers intentionally have no client policies.
-- They are accessible only through trusted server connections that bypass RLS.
