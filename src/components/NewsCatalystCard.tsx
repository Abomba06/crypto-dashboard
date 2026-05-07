import React from 'react';
import { MarketEvent } from '../types/trading';
import { StatusBadge } from './StatusBadge';

interface NewsCatalystCardProps {
  event: MarketEvent;
}

export function NewsCatalystCard({ event }: NewsCatalystCardProps) {
  return (
    <article className="news-card">
      <div className="news-tag-row">
        <StatusBadge type={event.tag} variant={event.tag === 'Bearish' ? 'danger' : event.tag === 'Bullish' ? 'success' : 'purple'} />
        <span className="news-source">{event.source}</span>
      </div>
      <h3>{event.headline}</h3>
      <div className="news-meta">
        <span>{event.symbol}</span>
        <span>{event.eventType}</span>
        <span>{event.predictedType}</span>
      </div>
      <div className="news-stats">
        <span>Prob {Math.round(event.probability * 100)}%</span>
        <span>Sent {event.sentimentScore.toFixed(2)}</span>
        <span>Rel {event.relevance.toFixed(2)}</span>
      </div>
      <div className="news-action">{event.action}</div>
    </article>
  );
}
