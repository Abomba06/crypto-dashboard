export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      account_snapshots: {
        Row: {
          id: string
          total_value: number
          today_pnl: number
          open_pnl: number
          daily_loss_limit: number
          buying_power: number
          regime: string
          top_mover: string
          health: 'nominal' | 'watch' | 'critical'
          recent_error: string | null
          signal_accuracy: number
          last_updated: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          total_value: number
          today_pnl: number
          open_pnl: number
          daily_loss_limit: number
          buying_power: number
          regime: string
          top_mover: string
          health: 'nominal' | 'watch' | 'critical'
          recent_error?: string | null
          signal_accuracy: number
          last_updated: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          total_value?: number
          today_pnl?: number
          open_pnl?: number
          daily_loss_limit?: number
          buying_power?: number
          regime?: string
          top_mover?: string
          health?: 'nominal' | 'watch' | 'critical'
          recent_error?: string | null
          signal_accuracy?: number
          last_updated?: string
          created_at?: string
          updated_at?: string
        }
      }
      positions: {
        Row: {
          id: string
          symbol: string
          name: string
          price: number
          size: number
          avg_entry: number
          pnl: number
          pnl_pct: number
          trend: 'bullish' | 'bearish' | 'neutral'
          stop_loss: number
          tp1: number
          tp2: number
          sparkline: number[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          symbol: string
          name: string
          price: number
          size: number
          avg_entry: number
          pnl: number
          pnl_pct: number
          trend: 'bullish' | 'bearish' | 'neutral'
          stop_loss: number
          tp1: number
          tp2: number
          sparkline: number[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          name?: string
          price?: number
          size?: number
          avg_entry?: number
          pnl?: number
          pnl_pct?: number
          trend?: 'bullish' | 'bearish' | 'neutral'
          stop_loss?: number
          tp1?: number
          tp2?: number
          sparkline?: number[]
          created_at?: string
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          symbol: string
          side: 'buy' | 'sell'
          quantity: number
          price: number
          timestamp: string
          pnl: number | null
          created_at: string
        }
        Insert: {
          id?: string
          symbol: string
          side: 'buy' | 'sell'
          quantity: number
          price: number
          timestamp: string
          pnl?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          side?: 'buy' | 'sell'
          quantity?: number
          price?: number
          timestamp?: string
          pnl?: number | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          symbol: string
          side: 'buy' | 'sell'
          type: string
          quantity: number
          price: number | null
          status: 'pending' | 'filled' | 'cancelled'
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          symbol: string
          side: 'buy' | 'sell'
          type: string
          quantity: number
          price?: number | null
          status: 'pending' | 'filled' | 'cancelled'
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          side?: 'buy' | 'sell'
          type?: string
          quantity?: number
          price?: number | null
          status?: 'pending' | 'filled' | 'cancelled'
          timestamp?: string
          created_at?: string
        }
      }
      signals: {
        Row: {
          id: string
          symbol: string
          setup: string
          regime: string
          score: number
          sentiment: 'bullish' | 'bearish' | 'neutral'
          trend_score: number
          action: 'buy' | 'sell' | 'hold'
          reason: string
          status: 'accepted' | 'candidate' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          symbol: string
          setup: string
          regime: string
          score: number
          sentiment: 'bullish' | 'bearish' | 'neutral'
          trend_score: number
          action: 'buy' | 'sell' | 'hold'
          reason: string
          status: 'accepted' | 'candidate' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          setup?: string
          regime?: string
          score?: number
          sentiment?: 'bullish' | 'bearish' | 'neutral'
          trend_score?: number
          action?: 'buy' | 'sell' | 'hold'
          reason?: string
          status?: 'accepted' | 'candidate' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      market_events: {
        Row: {
          id: string
          title: string
          description: string
          impact: 'high' | 'medium' | 'low'
          sentiment: 'bullish' | 'bearish' | 'neutral'
          confirmation: 'confirmed' | 'pending' | 'rejected'
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          impact: 'high' | 'medium' | 'low'
          sentiment: 'bullish' | 'bearish' | 'neutral'
          confirmation: 'confirmed' | 'pending' | 'rejected'
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          impact?: 'high' | 'medium' | 'low'
          sentiment?: 'bullish' | 'bearish' | 'neutral'
          confirmation?: 'confirmed' | 'pending' | 'rejected'
          timestamp?: string
          created_at?: string
        }
      }
      catalyst_events: {
        Row: {
          id: string
          title: string
          description: string
          impact: 'high' | 'medium' | 'low'
          sentiment: 'bullish' | 'bearish' | 'neutral'
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          impact: 'high' | 'medium' | 'low'
          sentiment: 'bullish' | 'bearish' | 'neutral'
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          impact?: 'high' | 'medium' | 'low'
          sentiment?: 'bullish' | 'bearish' | 'neutral'
          timestamp?: string
          created_at?: string
        }
      }
      candidate_evaluations: {
        Row: {
          id: string
          signal_id: string
          evaluation: string
          score: number
          created_at: string
        }
        Insert: {
          id?: string
          signal_id: string
          evaluation: string
          score: number
          created_at?: string
        }
        Update: {
          id?: string
          signal_id?: string
          evaluation?: string
          score?: number
          created_at?: string
        }
      }
      rejected_signal_evaluations: {
        Row: {
          id: string
          signal_id: string
          reason: string
          created_at: string
        }
        Insert: {
          id?: string
          signal_id: string
          reason: string
          created_at?: string
        }
        Update: {
          id?: string
          signal_id?: string
          reason?: string
          created_at?: string
        }
      }
      bot_logs: {
        Row: {
          id: string
          level: 'info' | 'warn' | 'error'
          message: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          level: 'info' | 'warn' | 'error'
          message: string
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          level?: 'info' | 'warn' | 'error'
          message?: string
          timestamp?: string
          created_at?: string
        }
      }
      bot_state: {
        Row: {
          id: string
          status: 'running' | 'paused' | 'stopped'
          last_active: string
          uptime: number
          version: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          status: 'running' | 'paused' | 'stopped'
          last_active: string
          uptime: number
          version: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          status?: 'running' | 'paused' | 'stopped'
          last_active?: string
          uptime?: number
          version?: string
          created_at?: string
          updated_at?: string
        }
      }
      research_reports: {
        Row: {
          id: string
          title: string
          summary: string
          content: string
          author: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          content: string
          author: string
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          content?: string
          author?: string
          timestamp?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}