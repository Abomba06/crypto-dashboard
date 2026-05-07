import React from 'react';
import { Trade } from '../types/trading';
import { StatusBadge } from './StatusBadge';

interface TradeCardProps {
  trade: Trade;
}

function getActionVariant(action: string) {
  return action === 'buy' ? 'success' : 'danger';
}

export function TradeCard({ trade }: TradeCardProps) {
  return (
    <article className="trade-card">
      <div className="trade-header">
        <div>
          <div className="trade-symbol">{trade.symbol}</div>
          <div className="trade-meta">{trade.timestamp}</div>
        </div>
        <StatusBadge type={trade.action.toUpperCase()} variant={getActionVariant(trade.action)} />
      </div>
      <div className="trade-grid">
        <div>
          <small>Price</small>
          <div>${trade.price.toLocaleString()}</div>
        </div>
        <div>
          <small>Entry</small>
          <div>${trade.avgEntry.toFixed(2)}</div>
        </div>
        <div>
          <small>Qty</small>
          <div>{trade.quantity}</div>
        </div>
      </div>
      <div className="trade-grid">
        <div>
          <small>Score</small>
          <div>{trade.score}</div>
        </div>
        <div>
          <small>Conf.</small>
          <div>{Math.round(trade.confidence * 100)}%</div>
        </div>
        <div>
          <small>Sentiment</small>
          <div>{trade.sentiment}</div>
        </div>
      </div>
      <div className="trade-note">{trade.reason}</div>
    </article>
  );
}
