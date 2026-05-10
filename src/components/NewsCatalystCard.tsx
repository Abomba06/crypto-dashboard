import React from 'react';
import { MarketEvent } from '../types/trading';
import { StatusBadge } from './StatusBadge';

interface NewsCatalystCardProps {
  event: MarketEvent;
  compact?: boolean;
}

export function NewsCatalystCard({ event, compact = false }: NewsCatalystCardProps) {
  return (
    <article className="news-card">
      <div className="news-tag-row">
        <StatusBadge
          type={event.sentiment}
          variant={event.sentiment === 'bearish' ? 'danger' : event.sentiment === 'bullish' ? 'success' : 'purple'}
        />
        <span className="news-source">{event.impact}</span>
      </div>
      <h3>{event.title}</h3>
      <div className="news-meta">
        <span>{event.confirmation}</span>
        {!compact ? <span>{event.timestamp}</span> : null}
      </div>
      <div className="news-description">{event.description}</div>
    </article>
  );
}
