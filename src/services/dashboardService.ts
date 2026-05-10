import { supabase } from '../utils/supabase/client';
import {
  portfolioSummary,
  positions,
  signals,
  marketEvents,
  trades,
  logs,
  evaluations,
  researchReports,
  variantReports,
  comparisonReports,
  botState,
} from '../data/mockData';
import {
  AccountSnapshot,
  Position,
  Trade,
  Order,
  Signal,
  MarketEvent,
  CatalystEvent,
  CandidateEvaluation,
  RejectedSignalEvaluation,
  BotLog,
  BotState,
  ResearchReport,
  RealtimePayload,
} from '../types/supabase';

// Helper to convert Supabase row to app format
const mapAccountSnapshot = (row: AccountSnapshot): typeof portfolioSummary => ({
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

const mapPosition = (row: Position): typeof positions[0] => ({
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

const mapSignal = (row: Signal): typeof signals[0] => ({
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

const mapMarketEvent = (row: MarketEvent): typeof marketEvents[0] => ({
  id: row.id,
  title: row.title,
  description: row.description,
  impact: row.impact,
  sentiment: row.sentiment,
  confirmation: row.confirmation,
  timestamp: row.timestamp,
  createdAt: row.created_at,
});

const mapTrade = (row: Trade): typeof trades[0] => ({
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

const mapBotLog = (row: BotLog): typeof logs[0] => ({
  id: row.id,
  timestamp: row.timestamp,
  severity: row.level,
  message: row.message,
});

const mapBotState = (row: BotState): typeof botState => ({
  id: row.id,
  status: row.status,
  lastActive: row.last_active,
  uptime: row.uptime,
  version: row.version,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapResearchReport = (row: ResearchReport): typeof researchReports[0] => ({
  id: row.id,
  name: row.title,
  summary: row.summary,
  metrics: {},
  notes: row.content,
});

// Service with Supabase integration and mock fallbacks
export const dashboardService = {
  // Portfolio Summary
  async getPortfolioSummary(): Promise<typeof portfolioSummary> {
    try {
      const { data, error } = await supabase
        .from('account_snapshots')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.warn('Supabase account_snapshots error, using mock data:', error);
        return portfolioSummary;
      }

      return mapAccountSnapshot(data);
    } catch (err) {
      console.warn('Failed to fetch portfolio summary, using mock data:', err);
      return portfolioSummary;
    }
  },

  // Positions
  async getPositions(): Promise<typeof positions> {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Supabase positions error, using mock data:', error);
        return positions;
      }

      return data.map(mapPosition);
    } catch (err) {
      console.warn('Failed to fetch positions, using mock data:', err);
      return positions;
    }
  },

  // Signals
  async getSignals(): Promise<typeof signals> {
    try {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error || !data || data.length === 0) {
        console.warn('Supabase signals error, using mock data:', error);
        return signals;
      }

      return data.map(mapSignal);
    } catch (err) {
      console.warn('Failed to fetch signals, using mock data:', err);
      return signals;
    }
  },

  // Market Events
  async getMarketEvents(): Promise<typeof marketEvents> {
    try {
      const { data, error } = await supabase
        .from('market_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error || !data || data.length === 0) {
        console.warn('Supabase market_events error, using mock data:', error);
        return marketEvents;
      }

      return data.map(mapMarketEvent);
    } catch (err) {
      console.warn('Failed to fetch market events, using mock data:', err);
      return marketEvents;
    }
  },

  // Trades
  async getTrades(): Promise<typeof trades> {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error || !data || data.length === 0) {
        console.warn('Supabase trades error, using mock data:', error);
        return trades;
      }

      return data.map(mapTrade);
    } catch (err) {
      console.warn('Failed to fetch trades, using mock data:', err);
      return trades;
    }
  },

  // Bot Logs
  async getLogs(): Promise<typeof logs> {
    try {
      const { data, error } = await supabase
        .from('bot_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error || !data || data.length === 0) {
        console.warn('Supabase bot_logs error, using mock data:', error);
        return logs;
      }

      return data.map(mapBotLog);
    } catch (err) {
      console.warn('Failed to fetch logs, using mock data:', err);
      return logs;
    }
  },

  // Evaluations (combining candidate and rejected)
  async getEvaluations(): Promise<typeof evaluations> {
    try {
      const [candidatesRes, rejectedRes] = await Promise.all([
        supabase.from('candidate_evaluations').select('*').order('created_at', { ascending: false }).limit(25),
        supabase.from('rejected_signal_evaluations').select('*').order('created_at', { ascending: false }).limit(25),
      ]);

      if (candidatesRes.error || rejectedRes.error) {
        console.warn('Supabase evaluations error, using mock data:', candidatesRes.error || rejectedRes.error);
        return evaluations;
      }

      const candidates = candidatesRes.data?.map(c => ({ ...c, type: 'candidate' as const })) || [];
      const rejected = rejectedRes.data?.map(r => ({ ...r, type: 'rejected' as const })) || [];

      if (candidates.length === 0 && rejected.length === 0) {
        return evaluations;
      }

      return [...candidates, ...rejected];
    } catch (err) {
      console.warn('Failed to fetch evaluations, using mock data:', err);
      return evaluations;
    }
  },

  // Research Reports
  async getResearchReports(): Promise<typeof researchReports> {
    try {
      const { data, error } = await supabase
        .from('research_reports')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error || !data || data.length === 0) {
        console.warn('Supabase research_reports error, using mock data:', error);
        return researchReports;
      }

      return data.map(mapResearchReport);
    } catch (err) {
      console.warn('Failed to fetch research reports, using mock data:', err);
      return researchReports;
    }
  },

  // Variant Reports (fallback to mock)
  getVariantReports: () => Promise.resolve(variantReports),

  // Comparison Reports (fallback to mock)
  getComparisonReports: () => Promise.resolve(comparisonReports),

  // Bot State
  async getBotState(): Promise<typeof botState> {
    try {
      const { data, error } = await supabase
        .from('bot_state')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.warn('Supabase bot_state error, using mock data:', error);
        return botState;
      }

      return mapBotState(data);
    } catch (err) {
      console.warn('Failed to fetch bot state, using mock data:', err);
      return botState;
    }
  },

  // Realtime subscriptions
  subscribeToPortfolioSummary(callback: (data: typeof portfolioSummary) => void) {
    const channel = supabase.channel('account_snapshots_changes').on(
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

  subscribeToPositions(callback: (data: typeof positions) => void) {
    const channel = supabase.channel('positions_changes').on(
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

  subscribeToTrades(callback: (data: typeof trades) => void) {
    const channel = supabase.channel('trades_changes').on(
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

  subscribeToSignals(callback: (data: typeof signals) => void) {
    const channel = supabase.channel('signals_changes').on(
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

  subscribeToLogs(callback: (data: typeof logs) => void) {
    const channel = supabase.channel('bot_logs_changes').on(
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

  subscribeToBotState(callback: (data: typeof botState) => void) {
    const channel = supabase.channel('bot_state_changes').on(
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
