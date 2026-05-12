import { hasSupabaseConfig, supabase } from '../utils/supabase/client';
import {
  AccountSnapshot,
  Position,
  Trade,
  Signal,
  MarketEvent,
  CandidateEvaluation,
  RejectedSignalEvaluation,
  BotLog,
  BotState,
  ResearchReport,
} from '../types/supabase';
import {
  BotState as AppBotState,
  ComparisonReport as AppComparisonReport,
  EvaluationRecord,
  LogEntry,
  MarketEvent as AppMarketEvent,
  PortfolioSummary,
  Position as AppPosition,
  ResearchReport as AppResearchReport,
  Signal as AppSignal,
  Trade as AppTrade,
  VariantReport as AppVariantReport,
} from '../types/trading';

const noOpSubscription = {
  unsubscribe: () => undefined,
};

const canReadSupabase = () => hasSupabaseConfig && supabase !== null;
const missingTableMessage = 'Could not find the table';

export type DataSourceStatus = {
  configured: boolean;
  connected: boolean;
  message: string;
};

const isMissingTableError = (error: { message?: string } | null | undefined) =>
  Boolean(error?.message?.includes(missingTableMessage));

const requireSupabase = () => {
  if (!canReadSupabase()) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  }

  return supabase!;
};

const readError = (table: string, error: { message?: string } | null | undefined) =>
  isMissingTableError(error)
    ? `Supabase table "${table}" is missing. Run supabase/schema.sql.`
    : `Supabase read failed for "${table}": ${error?.message ?? 'Unknown error'}.`;

const requireRows = <T>(table: string, data: T[] | null | undefined, error: { message?: string } | null | undefined) => {
  if (error) {
    throw new Error(readError(table, error));
  }

  if (!data || data.length === 0) {
    throw new Error(`Supabase table "${table}" has no rows.`);
  }

  return data;
};

const requireRow = <T>(table: string, data: T | null | undefined, error: { message?: string } | null | undefined) => {
  if (error) {
    throw new Error(readError(table, error));
  }

  if (!data) {
    throw new Error(`Supabase table "${table}" has no rows.`);
  }

  return data;
};

// Helper to convert Supabase row to app format
const mapAccountSnapshot = (row: AccountSnapshot): PortfolioSummary => ({
  totalValue: row.total_value,
  todayPnL: row.today_pnl,
  openPnL: row.open_pnl,
  dailyLossLimit: row.daily_loss_limit,
  buyingPower: row.buying_power,
  regime: row.regime,
  topMover: row.top_mover,
  health: row.health,
  recentError: row.recent_error || '',
  signalAccuracy: row.signal_accuracy,
  lastUpdated: row.last_updated,
});

const mapAccountSnapshotValue = (row: AccountSnapshot) => row.total_value;

const mapPosition = (row: Position): AppPosition => ({
  id: row.id,
  symbol: row.symbol,
  name: row.name,
  price: row.price,
  size: row.size,
  avgEntry: row.avg_entry,
  pnl: row.pnl,
  pnlPct: row.pnl_pct,
  trend: row.trend,
  stopLoss: row.stop_loss,
  tp1: row.tp1,
  tp2: row.tp2,
  sparkline: row.sparkline,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapSignal = (row: Signal): AppSignal => ({
  id: row.id,
  symbol: row.symbol,
  setup: row.setup,
  regime: row.regime,
  score: row.score,
  sentiment: row.sentiment,
  trendScore: row.trend_score,
  action: row.action,
  reason: row.reason,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapMarketEvent = (row: MarketEvent): AppMarketEvent => ({
  id: row.id,
  title: row.title,
  description: row.description,
  impact: row.impact,
  sentiment: row.sentiment,
  confirmation: row.confirmation,
  timestamp: row.timestamp,
  createdAt: row.created_at,
});

const mapTrade = (row: Trade): AppTrade => ({
  id: row.id,
  timestamp: row.timestamp,
  symbol: row.symbol,
  action: row.side,
  price: row.price,
  avgEntry: row.price,
  stop: Math.round(row.price * 0.98),
  tp1: Math.round(row.price * 1.01),
  tp2: Math.round(row.price * 1.02),
  quantity: row.quantity,
  score: 0,
  confidence: 0.5,
  sentiment: 'neutral',
  reason: row.pnl !== null ? `PnL: ${row.pnl}` : 'Executed trade',
  note: `order_id=${row.id}; side=${row.side};`,
});

const mapBotLog = (row: BotLog): LogEntry => ({
  id: row.id,
  timestamp: row.timestamp,
  severity: row.level,
  message: row.message,
});

const mapBotState = (row: BotState): AppBotState => ({
  id: row.id,
  status: row.status,
  lastActive: row.last_active,
  uptime: row.uptime,
  version: row.version,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapResearchReport = (row: ResearchReport): AppResearchReport => ({
  id: row.id,
  name: row.title,
  summary: row.summary,
  metrics: {},
  notes: row.content,
});

const mapCandidateEvaluation = (row: CandidateEvaluation): EvaluationRecord => ({
  id: row.id,
  symbol: row.signal_id,
  eventType: 'candidate',
  status: 'accepted',
  rejectionReason: '',
  forwardReturn: row.score,
  mfe: 0,
  mae: 0,
  tp1Hit: false,
  stopHit: false,
  sentiment: row.score,
});

const mapRejectedEvaluation = (row: RejectedSignalEvaluation): EvaluationRecord => ({
  id: row.id,
  symbol: row.signal_id,
  eventType: 'rejected',
  status: 'rejected',
  rejectionReason: row.reason,
  forwardReturn: 0,
  mfe: 0,
  mae: 0,
  tp1Hit: false,
  stopHit: false,
  sentiment: 0,
});

// Service with Supabase integration only. Missing data throws visible app errors.
export const dashboardService = {
  async getDataSourceStatus(): Promise<DataSourceStatus> {
    if (!canReadSupabase()) {
      return {
        configured: false,
        connected: false,
        message: 'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
      };
    }

    try {
      const { data, error } = await requireSupabase()
        .from('account_snapshots')
        .select('id')
        .limit(1);

      if (error) {
        return {
          configured: true,
          connected: false,
          message: readError('account_snapshots', error),
        };
      }

      if (!data || data.length === 0) {
        return {
          configured: true,
          connected: true,
          message: 'Connected to Supabase, but account_snapshots has no rows.',
        };
      }

      return {
        configured: true,
        connected: true,
        message: 'Connected to Supabase. Reading live dashboard data.',
      };
    } catch (err) {
      return {
        configured: true,
        connected: false,
        message: `Supabase connection failed: ${err instanceof Error ? err.message : 'Unknown error'}.`,
      };
    }
  },

  // Portfolio Summary
  async getPortfolioSummary(): Promise<PortfolioSummary> {
    const { data, error } = await requireSupabase()
      .from('account_snapshots')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    return mapAccountSnapshot(requireRow('account_snapshots', data, error));
  },

  async getPortfolioHistory(): Promise<number[]> {
    const { data, error } = await requireSupabase()
      .from('account_snapshots')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(24);

    return requireRows('account_snapshots', data, error)
      .slice()
      .reverse()
      .map(mapAccountSnapshotValue);
  },

  // Positions
  async getPositions(): Promise<AppPosition[]> {
    const { data, error } = await requireSupabase()
      .from('positions')
      .select('*')
      .order('updated_at', { ascending: false });

    return requireRows('positions', data, error).map(mapPosition);
  },

  // Signals
  async getSignals(): Promise<AppSignal[]> {
    const { data, error } = await requireSupabase()
      .from('signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    return requireRows('signals', data, error).map(mapSignal);
  },

  // Market Events
  async getMarketEvents(): Promise<AppMarketEvent[]> {
    const { data, error } = await requireSupabase()
      .from('market_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);

    return requireRows('market_events', data, error).map(mapMarketEvent);
  },

  // Trades
  async getTrades(): Promise<AppTrade[]> {
    const { data, error } = await requireSupabase()
      .from('trades')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    return requireRows('trades', data, error).map(mapTrade);
  },

  // Bot Logs
  async getLogs(): Promise<LogEntry[]> {
    const { data, error } = await requireSupabase()
      .from('bot_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    return requireRows('bot_logs', data, error).map(mapBotLog);
  },

  // Evaluations (combining candidate and rejected)
  async getEvaluations(): Promise<EvaluationRecord[]> {
    const client = requireSupabase();
    const [candidatesRes, rejectedRes] = await Promise.all([
      client.from('candidate_evaluations').select('*').order('created_at', { ascending: false }).limit(25),
      client.from('rejected_signal_evaluations').select('*').order('created_at', { ascending: false }).limit(25),
    ]);

    if (candidatesRes.error) {
      throw new Error(readError('candidate_evaluations', candidatesRes.error));
    }

    if (rejectedRes.error) {
      throw new Error(readError('rejected_signal_evaluations', rejectedRes.error));
    }

    const candidates = candidatesRes.data ?? [];
    const rejected = rejectedRes.data ?? [];

    if (candidates.length === 0 && rejected.length === 0) {
      throw new Error('Supabase evaluation tables have no rows.');
    }

    return [...candidates.map(mapCandidateEvaluation), ...rejected.map(mapRejectedEvaluation)];
  },

  // Research Reports
  async getResearchReports(): Promise<AppResearchReport[]> {
    const { data, error } = await requireSupabase()
      .from('research_reports')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);

    return requireRows('research_reports', data, error).map(mapResearchReport);
  },

  getVariantReports: async (): Promise<AppVariantReport[]> => {
    throw new Error('Variant reports are not backed by a Supabase table yet.');
  },

  getComparisonReports: async (): Promise<AppComparisonReport[]> => {
    throw new Error('Comparison reports are not backed by a Supabase table yet.');
  },

  // Bot State
  async getBotState(): Promise<AppBotState> {
    const { data, error } = await requireSupabase()
      .from('bot_state')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    return mapBotState(requireRow('bot_state', data, error));
  },

  // Realtime subscriptions
  subscribeToPortfolioSummary(callback: (data: PortfolioSummary) => void) {
    if (!canReadSupabase()) return noOpSubscription;

    const channel = supabase!.channel('account_snapshots_changes').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'account_snapshots',
      },
      (payload: any) => {
        if (payload.new) {
          callback(mapAccountSnapshot(payload.new));
        }
      }
    );

    channel.subscribe();
    return channel;
  },

  subscribeToPositions(callback: (data: AppPosition[]) => void) {
    if (!canReadSupabase()) return noOpSubscription;

    const channel = supabase!.channel('positions_changes').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'positions',
      },
      async () => {
        const positions = await dashboardService.getPositions();
        callback(positions);
      }
    );

    channel.subscribe();
    return channel;
  },

  subscribeToTrades(callback: (data: AppTrade[]) => void) {
    if (!canReadSupabase()) return noOpSubscription;

    const channel = supabase!.channel('trades_changes').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'trades',
      },
      async () => {
        const trades = await dashboardService.getTrades();
        callback(trades);
      }
    );

    channel.subscribe();
    return channel;
  },

  subscribeToSignals(callback: (data: AppSignal[]) => void) {
    if (!canReadSupabase()) return noOpSubscription;

    const channel = supabase!.channel('signals_changes').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'signals',
      },
      async () => {
        const signals = await dashboardService.getSignals();
        callback(signals);
      }
    );

    channel.subscribe();
    return channel;
  },

  subscribeToLogs(callback: (data: LogEntry[]) => void) {
    if (!canReadSupabase()) return noOpSubscription;

    const channel = supabase!.channel('bot_logs_changes').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bot_logs',
      },
      async () => {
        const logs = await dashboardService.getLogs();
        callback(logs);
      }
    );

    channel.subscribe();
    return channel;
  },

  subscribeToBotState(callback: (data: AppBotState) => void) {
    if (!canReadSupabase()) return noOpSubscription;

    const channel = supabase!.channel('bot_state_changes').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bot_state',
      },
      (payload: any) => {
        if (payload.new) {
          callback(mapBotState(payload.new));
        }
      }
    );

    channel.subscribe();
    return channel;
  },
};
