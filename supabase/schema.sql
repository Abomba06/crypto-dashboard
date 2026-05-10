-- Read-only mobile dashboard schema.
-- Run this in the Supabase SQL editor for the project used by Expo.
-- The mobile app uses only the publishable key and reads from these tables.

create extension if not exists pgcrypto;

create table if not exists public.account_snapshots (
  id uuid primary key default gen_random_uuid(),
  total_value numeric not null,
  today_pnl numeric not null,
  open_pnl numeric not null,
  daily_loss_limit numeric not null,
  buying_power numeric not null,
  regime text not null,
  top_mover text not null,
  health text not null check (health in ('nominal', 'watch', 'critical')),
  recent_error text,
  signal_accuracy numeric not null,
  last_updated text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  name text not null,
  price numeric not null,
  size numeric not null,
  avg_entry numeric not null,
  pnl numeric not null,
  pnl_pct numeric not null,
  trend text not null check (trend in ('bullish', 'bearish', 'neutral')),
  stop_loss numeric not null,
  tp1 numeric not null,
  tp2 numeric not null,
  sparkline numeric[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.signals (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  setup text not null,
  regime text not null,
  score numeric not null,
  sentiment text not null check (sentiment in ('bullish', 'bearish', 'neutral')),
  trend_score numeric not null,
  action text not null check (action in ('buy', 'sell', 'hold')),
  reason text not null,
  status text not null check (status in ('accepted', 'candidate', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.market_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  impact text not null check (impact in ('high', 'medium', 'low')),
  sentiment text not null check (sentiment in ('bullish', 'bearish', 'neutral')),
  confirmation text not null check (confirmation in ('confirmed', 'pending', 'rejected')),
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  side text not null check (side in ('buy', 'sell')),
  quantity numeric not null,
  price numeric not null,
  timestamp timestamptz not null default now(),
  pnl numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.bot_logs (
  id uuid primary key default gen_random_uuid(),
  level text not null check (level in ('info', 'warn', 'error')),
  message text not null,
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.candidate_evaluations (
  id uuid primary key default gen_random_uuid(),
  signal_id text not null,
  evaluation text not null,
  score numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.rejected_signal_evaluations (
  id uuid primary key default gen_random_uuid(),
  signal_id text not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.bot_state (
  id uuid primary key default gen_random_uuid(),
  status text not null check (status in ('running', 'paused', 'stopped')),
  last_active timestamptz not null default now(),
  uptime numeric not null,
  version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.research_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  content text not null,
  author text not null,
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.account_snapshots enable row level security;
alter table public.positions enable row level security;
alter table public.signals enable row level security;
alter table public.market_events enable row level security;
alter table public.trades enable row level security;
alter table public.bot_logs enable row level security;
alter table public.candidate_evaluations enable row level security;
alter table public.rejected_signal_evaluations enable row level security;
alter table public.bot_state enable row level security;
alter table public.research_reports enable row level security;

drop policy if exists "Allow public read account snapshots" on public.account_snapshots;
drop policy if exists "Allow public read positions" on public.positions;
drop policy if exists "Allow public read signals" on public.signals;
drop policy if exists "Allow public read market events" on public.market_events;
drop policy if exists "Allow public read trades" on public.trades;
drop policy if exists "Allow public read bot logs" on public.bot_logs;
drop policy if exists "Allow public read candidate evaluations" on public.candidate_evaluations;
drop policy if exists "Allow public read rejected evaluations" on public.rejected_signal_evaluations;
drop policy if exists "Allow public read bot state" on public.bot_state;
drop policy if exists "Allow public read research reports" on public.research_reports;

create policy "Allow public read account snapshots" on public.account_snapshots for select using (true);
create policy "Allow public read positions" on public.positions for select using (true);
create policy "Allow public read signals" on public.signals for select using (true);
create policy "Allow public read market events" on public.market_events for select using (true);
create policy "Allow public read trades" on public.trades for select using (true);
create policy "Allow public read bot logs" on public.bot_logs for select using (true);
create policy "Allow public read candidate evaluations" on public.candidate_evaluations for select using (true);
create policy "Allow public read rejected evaluations" on public.rejected_signal_evaluations for select using (true);
create policy "Allow public read bot state" on public.bot_state for select using (true);
create policy "Allow public read research reports" on public.research_reports for select using (true);
