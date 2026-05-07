import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { NewsCatalystCard } from '../components/NewsCatalystCard';
import { MarketEvent } from '../types/trading';

function News() {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [symbolFilter, setSymbolFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    dashboardService.getMarketEvents().then(setEvents);
  }, []);

  const filtered = events.filter((item) => {
    return (
      (symbolFilter === 'All' || item.symbol === symbolFilter) &&
      (sourceFilter === 'All' || item.source === sourceFilter) &&
      (typeFilter === 'All' || item.eventType === typeFilter)
    );
  });

  const symbols = Array.from(new Set(events.map((item) => item.symbol)));
  const sources = Array.from(new Set(events.map((item) => item.source)));
  const types = Array.from(new Set(events.map((item) => item.eventType)));

  return (
    <section className="page-shell">
      <div className="section-header">
        <div>
          <p className="micro-label">News / Events</p>
          <h2>Market catalysts</h2>
        </div>
      </div>

      <div className="filters-row">
        <select value={symbolFilter} onChange={(e) => setSymbolFilter(e.target.value)}>
          <option>All</option>
          {symbols.map((symbol) => (
            <option key={symbol}>{symbol}</option>
          ))}
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
          <option>All</option>
          {sources.map((source) => (
            <option key={source}>{source}</option>
          ))}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option>All</option>
          {types.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="news-grid">
        {filtered.map((event) => (
          <NewsCatalystCard event={event} key={event.id} />
        ))}
      </div>
    </section>
  );
}

export default News;
