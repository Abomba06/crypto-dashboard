import { Database } from './database';

// Re-export types from Supabase generated types
export type AccountSnapshot = Database['public']['Tables']['account_snapshots']['Row'];
export type Position = Database['public']['Tables']['positions']['Row'];
export type Trade = Database['public']['Tables']['trades']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type Signal = Database['public']['Tables']['signals']['Row'];
export type MarketEvent = Database['public']['Tables']['market_events']['Row'];
export type CatalystEvent = Database['public']['Tables']['catalyst_events']['Row'];
export type CandidateEvaluation = Database['public']['Tables']['candidate_evaluations']['Row'];
export type RejectedSignalEvaluation = Database['public']['Tables']['rejected_signal_evaluations']['Row'];
export type BotLog = Database['public']['Tables']['bot_logs']['Row'];
export type BotState = Database['public']['Tables']['bot_state']['Row'];
export type ResearchReport = Database['public']['Tables']['research_reports']['Row'];

// For realtime subscriptions
export interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T | null;
  old: T | null;
  errors?: any;
}