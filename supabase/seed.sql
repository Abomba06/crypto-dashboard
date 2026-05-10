-- Optional sample rows for local validation.
-- Run after supabase/schema.sql if you want the app to show live Supabase rows immediately.

insert into public.account_snapshots (
  total_value,
  today_pnl,
  open_pnl,
  daily_loss_limit,
  buying_power,
  regime,
  top_mover,
  health,
  recent_error,
  signal_accuracy,
  last_updated
) values (
  174250.42,
  1245.23,
  -312.85,
  1500,
  42310,
  'Momentum Pulse',
  'SOL',
  'nominal',
  'Last fetch delay 1.8s',
  92,
  '11:28 AM UTC'
);

insert into public.positions (
  symbol,
  name,
  price,
  size,
  avg_entry,
  pnl,
  pnl_pct,
  trend,
  stop_loss,
  tp1,
  tp2,
  sparkline
) values
  ('BTCUSD', 'Bitcoin', 68425.12, 0.75, 65870, 19388.34, 5.87, 'bullish', 64000, 69500, 71000, array[66300,66700,67050,67500,68000,68425]),
  ('ETHUSD', 'Ethereum', 3760.45, 12.4, 3885, -1542.10, -3.97, 'bearish', 3600, 3900, 4100, array[3880,3850,3820,3780,3750,3760]);

insert into public.signals (
  symbol,
  setup,
  regime,
  score,
  sentiment,
  trend_score,
  action,
  reason,
  status
) values
  ('BTCUSD', 'Breakout + RSI', 'Trend', 82, 'bullish', 76, 'buy', 'Key resistance flip with long momentum', 'accepted'),
  ('ETHUSD', 'Mean Reversion', 'Range', 54, 'neutral', 48, 'hold', 'Consolidation inside 20EMA', 'candidate');

insert into public.market_events (
  title,
  description,
  impact,
  sentiment,
  confirmation
) values
  ('SOL partnership announced with global exchange', 'ChainMoves reports major partnership announcement', 'high', 'bullish', 'confirmed'),
  ('Regulation talk pressures BTC futures premiums', 'CryptoPulse reports regulatory discussions affecting BTC', 'medium', 'bearish', 'pending');

insert into public.trades (
  symbol,
  side,
  quantity,
  price,
  pnl
) values
  ('BTCUSD', 'buy', 0.75, 65870, null),
  ('ETHUSD', 'sell', 7, 3890, -245);

insert into public.bot_logs (
  level,
  message
) values
  ('info', 'Daily risk limits validated, no breaches.'),
  ('warn', 'API polling delayed by 2.1 seconds on market data feed.');

insert into public.bot_state (
  status,
  uptime,
  version
) values (
  'running',
  86400,
  '2.1.4'
);

insert into public.research_reports (
  title,
  summary,
  content,
  author
) values (
  'Momentum Alpha',
  'Top performing variant in the current market regime with robust drawdown control.',
  'Detailed analysis of momentum strategies and execution signals.',
  'AI Analyst'
);
