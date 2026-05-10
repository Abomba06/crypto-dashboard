export type TrendLabel = 'bullish' | 'bearish' | 'neutral';
export type SignalStatus = 'accepted' | 'candidate' | 'rejected';
export type SentimentLabel = 'bullish' | 'bearish' | 'neutral';
export type EventConfirmation = 'confirmed' | 'pending' | 'rejected';

export interface PortfolioSummary {
  totalValue: number;
  todayPnL: number;
  openPnL: number;
  dailyLossLimit: number;
  buyingPower: number;
  regime: string;
  topMover: string;
  health: 'nominal' | 'watch' | 'critical';
  recentError: string;
  signalAccuracy: number;
  lastUpdated: string;
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  price: number;
  size: number;
  avgEntry: number;
  pnl: number;
  pnlPct: number;
  trend: TrendLabel;
  stopLoss: number;
  tp1: number;
  tp2: number;
  sparkline: number[];
  createdAt: string;
  updatedAt: string;
}

export interface Signal {
  id: string;
  symbol: string;
  setup: string;
  regime: string;
  score: number;
  sentiment: SentimentLabel;
  trendScore: number;
  action: 'buy' | 'sell' | 'hold';
  reason: string;
  status: SignalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  sentiment: SentimentLabel;
  confirmation: EventConfirmation;
  timestamp: string;
  createdAt: string;
}

export interface Trade {
  id: string;
  timestamp: string;
  symbol: string;
  action: 'buy' | 'sell';
  price: number;
  avgEntry: number;
  stop: number;
  tp1: number;
  tp2: number;
  quantity: number;
  score: number;
  confidence: number;
  sentiment: SentimentLabel;
  reason: string;
  note: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  severity: 'info' | 'warn' | 'error';
  message: string;
}

export interface EvaluationRecord {
  id: string;
  symbol: string;
  eventType: string;
  status: 'accepted' | 'rejected';
  rejectionReason: string;
  forwardReturn: number;
  mfe: number;
  mae: number;
  tp1Hit: boolean;
  stopHit: boolean;
  sentiment: number;
}

export interface ResearchReport {
  id: string;
  name: string;
  summary: string;
  metrics: Record<string, number>;
  notes: string;
}

export interface VariantReport {
  id: string;
  variant: string;
  winRate: number;
  avgReturn: number;
  riskReward: number;
  observations: string;
}

export interface ComparisonReport {
  id: string;
  label: string;
  current: number;
  benchmark: number;
  delta: number;
}

export interface BotState {
  id: string;
  status: 'running' | 'paused' | 'stopped';
  lastActive: string;
  uptime: number;
  version: string;
  createdAt: string;
  updatedAt: string;
}
