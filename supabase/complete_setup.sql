-- Complete Supabase setup for the Expo Crypto Dashboard.
-- Paste this whole file into the Supabase SQL editor and run it.
-- It creates the read-only dashboard tables, enables public SELECT via RLS,
-- and inserts starter rows for every dataset the app currently reads.

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

insert into public.account_snapshots (
  id, total_value, today_pnl, open_pnl, daily_loss_limit, buying_power,
  regime, top_mover, health, recent_error, signal_accuracy, last_updated
) values (
  '11111111-1111-1111-1111-111111111111',
  174250.42, 1245.23, -312.85, 1500, 42310,
  'Momentum Pulse', 'SOL', 'nominal', 'Last fetch delay 1.8s', 92, '11:28 AM UTC'
) on conflict (id) do update set
  total_value = excluded.total_value,
  today_pnl = excluded.today_pnl,
  open_pnl = excluded.open_pnl,
  daily_loss_limit = excluded.daily_loss_limit,
  buying_power = excluded.buying_power,
  regime = excluded.regime,
  top_mover = excluded.top_mover,
  health = excluded.health,
  recent_error = excluded.recent_error,
  signal_accuracy = excluded.signal_accuracy,
  last_updated = excluded.last_updated,
  updated_at = now();

insert into public.positions (
  id, symbol, name, price, size, avg_entry, pnl, pnl_pct, trend, stop_loss, tp1, tp2, sparkline
) values
  ('22222222-2222-2222-2222-222222222221', 'BTCUSD', 'Bitcoin', 68425.12, 0.75, 65870, 19388.34, 5.87, 'bullish', 64000, 69500, 71000, array[66300,66700,67050,67500,68000,68425]),
  ('22222222-2222-2222-2222-222222222222', 'ETHUSD', 'Ethereum', 3760.45, 12.4, 3885, -1542.10, -3.97, 'bearish', 3600, 3900, 4100, array[3880,3850,3820,3780,3750,3760]),
  ('22222222-2222-2222-2222-222222222223', 'SOLUSD', 'Solana', 188.12, 345, 184.5, 1206.60, 1.77, 'bullish', 172, 198, 210, array[182,184,186,188,187,188])
on conflict (id) do update set
  symbol = excluded.symbol,
  name = excluded.name,
  price = excluded.price,
  size = excluded.size,
  avg_entry = excluded.avg_entry,
  pnl = excluded.pnl,
  pnl_pct = excluded.pnl_pct,
  trend = excluded.trend,
  stop_loss = excluded.stop_loss,
  tp1 = excluded.tp1,
  tp2 = excluded.tp2,
  sparkline = excluded.sparkline,
  updated_at = now();

insert into public.signals (
  id, symbol, setup, regime, score, sentiment, trend_score, action, reason, status
) values
  ('33333333-3333-3333-3333-333333333331', 'BTCUSD', 'Breakout + RSI', 'Trend', 82, 'bullish', 76, 'buy', 'Key resistance flip with long momentum', 'accepted'),
  ('33333333-3333-3333-3333-333333333332', 'ETHUSD', 'Mean Reversion', 'Range', 54, 'neutral', 48, 'hold', 'Consolidation inside 20EMA', 'candidate'),
  ('33333333-3333-3333-3333-333333333333', 'LINKUSD', 'News spike', 'Volatility', 31, 'bearish', 28, 'sell', 'Weak follow-through after earnings update', 'rejected')
on conflict (id) do update set
  symbol = excluded.symbol,
  setup = excluded.setup,
  regime = excluded.regime,
  score = excluded.score,
  sentiment = excluded.sentiment,
  trend_score = excluded.trend_score,
  action = excluded.action,
  reason = excluded.reason,
  status = excluded.status,
  updated_at = now();

insert into public.market_events (
  id, title, description, impact, sentiment, confirmation, timestamp
) values
  ('44444444-4444-4444-4444-444444444441', 'SOL partnership announced with global exchange', 'ChainMoves reports major partnership announcement', 'high', 'bullish', 'confirmed', now() - interval '1 hour'),
  ('44444444-4444-4444-4444-444444444442', 'Regulation talk pressures BTC futures premiums', 'CryptoPulse reports regulatory discussions affecting BTC', 'medium', 'bearish', 'pending', now() - interval '3 hours'),
  ('44444444-4444-4444-4444-444444444443', 'ETF inflows support altcoin market breadth', 'MarketDepth reports ETF inflows supporting altcoins', 'medium', 'bullish', 'confirmed', now() - interval '5 hours')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  impact = excluded.impact,
  sentiment = excluded.sentiment,
  confirmation = excluded.confirmation,
  timestamp = excluded.timestamp;

insert into public.trades (
  id, symbol, side, quantity, price, timestamp, pnl
) values
  ('55555555-5555-5555-5555-555555555551', 'BTCUSD', 'buy', 0.75, 65870, now() - interval '2 hours', null),
  ('55555555-5555-5555-5555-555555555552', 'ETHUSD', 'sell', 7, 3890, now() - interval '13 hours', -245)
on conflict (id) do update set
  symbol = excluded.symbol,
  side = excluded.side,
  quantity = excluded.quantity,
  price = excluded.price,
  timestamp = excluded.timestamp,
  pnl = excluded.pnl;

insert into public.bot_logs (
  id, level, message, timestamp
) values
  ('66666666-6666-6666-6666-666666666661', 'info', 'Daily risk limits validated, no breaches.', now() - interval '5 minutes'),
  ('66666666-6666-6666-6666-666666666662', 'warn', 'API polling delayed by 2.1 seconds on market data feed.', now() - interval '9 minutes'),
  ('66666666-6666-6666-6666-666666666663', 'error', 'Order placement failed: insufficient buying power for ETHUSD candidate.', now() - interval '11 minutes')
on conflict (id) do update set
  level = excluded.level,
  message = excluded.message,
  timestamp = excluded.timestamp;

insert into public.candidate_evaluations (
  id, signal_id, evaluation, score
) values
  ('77777777-7777-7777-7777-777777777771', 'BTCUSD', 'Breakout candidate accepted after risk checks.', 2.3)
on conflict (id) do update set
  signal_id = excluded.signal_id,
  evaluation = excluded.evaluation,
  score = excluded.score;

insert into public.rejected_signal_evaluations (
  id, signal_id, reason
) values
  ('88888888-8888-8888-8888-888888888881', 'ETHUSD', 'Model confidence below threshold.')
on conflict (id) do update set
  signal_id = excluded.signal_id,
  reason = excluded.reason;

insert into public.bot_state (
  id, status, last_active, uptime, version
) values (
  '99999999-9999-9999-9999-999999999991', 'running', now(), 86400, '2.1.4'
) on conflict (id) do update set
  status = excluded.status,
  last_active = excluded.last_active,
  uptime = excluded.uptime,
  version = excluded.version,
  updated_at = now();

insert into public.research_reports (
  id, title, summary, content, author, timestamp
) values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'Momentum Alpha',
  'Top performing variant in the current market regime with robust drawdown control.',
  'Detailed analysis of momentum strategies and execution signals.',
  'AI Analyst',
  now()
) on conflict (id) do update set
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  author = excluded.author,
  timestamp = excluded.timestamp;
