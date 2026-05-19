create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diagnosis_results (
  user_id uuid primary key references auth.users(id) on delete cascade,
  result jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.action_logs (
  user_id uuid not null references auth.users(id) on delete cascade,
  day integer not null,
  log jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  stripe_checkout_session_id text not null unique,
  stripe_customer_id text,
  product text not null,
  amount_total integer,
  currency text,
  status text not null,
  purchased_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists purchases_user_product_status_idx
  on public.purchases (user_id, product, status);

alter table public.profiles enable row level security;
alter table public.diagnosis_results enable row level security;
alter table public.action_logs enable row level security;
alter table public.purchases enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can read own diagnosis"
  on public.diagnosis_results for select
  using (auth.uid() = user_id);

create policy "Users can read own action logs"
  on public.action_logs for select
  using (auth.uid() = user_id);

create policy "Users can read own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);
