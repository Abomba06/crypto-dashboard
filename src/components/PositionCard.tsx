import React from 'react';
import { Position } from '../types/trading';
import { StatusBadge } from './StatusBadge';
import { MiniChart } from './MiniChart';

interface PositionCardProps {
  position: Position;
}

export function PositionCard({ position }: PositionCardProps) {
  const profit = position.pnl >= 0;

  return (
    <article className="position-card">
      <div className="position-top">
        <div>
          <div className="position-symbol">{position.symbol}</div>
          <div className="position-name">{position.name}</div>
        </div>
        <StatusBadge
          type={position.trend}
          variant={position.trend === 'bullish' ? 'success' : position.trend === 'bearish' ? 'danger' : 'purple'}
        />
      </div>

      <div className="position-body">
        <div className="position-metric">
          <span>Price</span>
          <strong>${position.price.toLocaleString()}</strong>
        </div>
        <div className="position-metric">
          <span>Size</span>
          <strong>{position.size}</strong>
        </div>
        <div className="position-metric">
          <span>Entry</span>
          <strong>${position.avgEntry.toFixed(2)}</strong>
        </div>
        <div className="position-metric">
          <span>P/L</span>
          <strong style={{ color: profit ? '#22c55e' : '#ef4444' }}>
            {profit ? '+' : ''}${position.pnl.toFixed(2)} ({position.pnlPct.toFixed(2)}%)
          </strong>
        </div>
      </div>

      <div className="position-row">
        <div>
          <small>Stop</small>
          <div>${position.stopLoss}</div>
        </div>
        <div>
          <small>TP1</small>
          <div>${position.tp1}</div>
        </div>
        <div>
          <small>TP2</small>
          <div>${position.tp2}</div>
        </div>
      </div>

      <MiniChart values={position.sparkline} positive={profit} />
    </article>
  );
}
