import React from 'react';
import { Signal } from '../types/trading';
import { StatusBadge } from './StatusBadge';

interface SignalCardProps {
  signal: Signal;
  onSelect?: (signal: Signal) => void;
}

const sentimentColor: Record<Signal['sentiment'], 'success' | 'danger' | 'neutral'> = {
  bullish: 'success',
  bearish: 'danger',
  neutral: 'neutral',
};

export function SignalCard({ signal, onSelect }: SignalCardProps) {
  return (
    <article className="signal-card" onClick={() => onSelect?.(signal)}>
      <div className="signal-row">
        <div>
          <div className="signal-symbol">{signal.symbol}</div>
          <div className="signal-setup">{signal.setup}</div>
        </div>
        <StatusBadge type={signal.status} variant={signal.status === 'accepted' ? 'success' : signal.status === 'rejected' ? 'danger' : 'warning'} />
      </div>
      <div className="signal-grid">
        <div>
          <small>Regime</small>
          <div>{signal.regime}</div>
        </div>
        <div>
          <small>Score</small>
          <div>{signal.score}</div>
        </div>
        <div>
          <small>Trend</small>
          <div>{signal.trendScore}</div>
        </div>
      </div>
      <div className="signal-row">
        <StatusBadge type={signal.sentiment} variant={sentimentColor[signal.sentiment]} />
        <div className="signal-action">{signal.action.toUpperCase()}</div>
      </div>
      <p className="signal-reason">{signal.reason}</p>
    </article>
  );
}
