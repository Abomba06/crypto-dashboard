import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { NewsCatalystCard } from '../components/NewsCatalystCard';
import { MarketEvent } from '../types/trading';

function News() {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [impactFilter, setImpactFilter] = useState('All');
  const [confirmationFilter, setConfirmationFilter] = useState('All');

  useEffect(() => {
    dashboardService.getMarketEvents().then(setEvents);
  }, []);

  const filtered = events.filter((item) => {
    return (
      (impactFilter === 'All' || item.impact === impactFilter) &&
      (confirmationFilter === 'All' || item.confirmation === confirmationFilter)
    );
  });

  const impacts = Array.from(new Set(events.map((item) => item.impact)));
  const confirmations = Array.from(new Set(events.map((item) => item.confirmation)));

  return (
    <section className="page-shell">
      <div className="section-header">
        <div>
          <p className="micro-label">News / Events</p>
          <h2>Market catalysts</h2>
        </div>
      </div>

      <div className="filters-row">
        <select value={impactFilter} onChange={(e) => setImpactFilter(e.target.value)}>
          <option>All</option>
          {impacts.map((impact) => (
            <option key={impact}>{impact}</option>
          ))}
        </select>
        <select value={confirmationFilter} onChange={(e) => setConfirmationFilter(e.target.value)}>
          <option>All</option>
          {confirmations.map((confirmation) => (
            <option key={confirmation}>{confirmation}</option>
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
