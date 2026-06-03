create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  auth_provider text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists auth_provider text;

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

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan_type text not null default 'plus_monthly',
  status text not null,
  source text not null default 'direct_plus',
  plus_start_day integer not null default 1,
  linked_7day_purchase_id uuid references public.purchases(id) on delete set null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plus_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null,
  anxiety_level integer,
  topics text[],
  memo text,
  created_at timestamptz not null default now()
);

create table if not exists public.plus_line_rewrites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null,
  original_text text not null,
  rewrite_soft text,
  rewrite_honest text,
  rewrite_hold text,
  created_at timestamptz not null default now()
);

create table if not exists public.plus_calm_works (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null,
  fact_text text,
  imagination_text text,
  message_text text,
  decision text,
  created_at timestamptz not null default now()
);

create table if not exists public.plus_weekly_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null,
  week_number integer not null,
  did_text text,
  changed_text text,
  next_text text,
  created_at timestamptz not null default now()
);

create table if not exists public.plus_action_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null,
  day_number integer not null,
  note text,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_status_idx
  on public.subscriptions (user_id, status);

create index if not exists subscriptions_email_status_idx
  on public.subscriptions (lower(user_email), status);

create index if not exists plus_action_logs_user_day_idx
  on public.plus_action_logs (user_id, day_number);

alter table public.profiles enable row level security;
alter table public.diagnosis_results enable row level security;
alter table public.action_logs enable row level security;
alter table public.purchases enable row level security;
alter table public.subscriptions enable row level security;
alter table public.plus_checkins enable row level security;
alter table public.plus_line_rewrites enable row level security;
alter table public.plus_calm_works enable row level security;
alter table public.plus_weekly_reflections enable row level security;
alter table public.plus_action_logs enable row level security;

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

create policy "Users can read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can read own plus checkins"
  on public.plus_checkins for select
  using (auth.uid() = user_id);

create policy "Users can read own plus line rewrites"
  on public.plus_line_rewrites for select
  using (auth.uid() = user_id);

create policy "Users can read own plus calm works"
  on public.plus_calm_works for select
  using (auth.uid() = user_id);

create policy "Users can read own plus weekly reflections"
  on public.plus_weekly_reflections for select
  using (auth.uid() = user_id);

create policy "Users can read own plus action logs"
  on public.plus_action_logs for select
  using (auth.uid() = user_id);
