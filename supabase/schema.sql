-- PreFlop member auth schema
-- Run this in Supabase SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  membership_status text not null default 'inactive'
    check (membership_status in ('inactive', 'free', 'trialing', 'active', 'past_due', 'canceled')),
  plan text not null default 'free'
    check (plan in ('free', 'monthly', 'annual')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invite_codes (
  code text primary key,
  max_uses integer not null default 1 check (max_uses > 0),
  used_count integer not null default 0 check (used_count >= 0),
  membership_status text not null default 'free'
    check (membership_status in ('free', 'trialing', 'active')),
  plan text not null default 'free'
    check (plan in ('free', 'monthly', 'annual')),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.invite_redemptions (
  id uuid primary key default gen_random_uuid(),
  code text not null references public.invite_codes(code),
  user_id uuid not null references auth.users(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (code, user_id)
);

alter table public.profiles enable row level security;
alter table public.invite_codes enable row level security;
alter table public.invite_redemptions enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Do not add a general update policy for profiles.
-- Membership status must be changed only by security definer functions,
-- server-side automation, or the Supabase service role.

drop policy if exists "Users can read own invite redemptions" on public.invite_redemptions;
create policy "Users can read own invite redemptions"
  on public.invite_redemptions
  for select
  using (auth.uid() = user_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.claim_invite_code(invite_code_input text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_code text := upper(trim(invite_code_input));
  invite public.invite_codes%rowtype;
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'not_authenticated';
  end if;

  select *
  into invite
  from public.invite_codes
  where code = normalized_code
    and used_count < max_uses
    and (expires_at is null or expires_at > now())
  for update;

  if not found then
    raise exception 'invalid_invite_code';
  end if;

  insert into public.invite_redemptions (code, user_id)
  values (invite.code, current_user_id)
  on conflict (code, user_id) do nothing;

  if found then
    update public.invite_codes
    set used_count = used_count + 1
    where code = invite.code;
  end if;

  update public.profiles
  set
    membership_status = invite.membership_status,
    plan = invite.plan
  where id = current_user_id;

  return true;
end;
$$;

grant execute on function public.claim_invite_code(text) to authenticated;

-- Initial free invite codes. Change these before sharing broadly.
insert into public.invite_codes (code, max_uses, membership_status, plan)
values
  ('PREFLOP-2026', 20, 'free', 'free'),
  ('YUJI-WEEKLY', 20, 'free', 'free'),
  ('RANGE-LAB', 20, 'free', 'free')
on conflict (code) do nothing;
