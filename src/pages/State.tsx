import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { JsonAccordion } from '../components/JsonAccordion';
import { BotState } from '../types/trading';

function State() {
  const [state, setState] = useState<BotState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await dashboardService.getBotState();
        setState(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load bot state');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to realtime bot state updates
    let unsubscribe: any;
    const subscribe = async () => {
      unsubscribe = await dashboardService.subscribeToBotState(setState);
    };
    subscribe();

    return () => {
      if (unsubscribe?.unsubscribe) {
        void unsubscribe.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <section className="page-shell">
        <div className="section-header">
          <h2>Loading Bot State...</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          Fetching bot state from Supabase...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-shell">
        <div className="section-header">
          <h2>Bot State Error</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#f87171' }}>
          {error}
          <br />
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem' }}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!state) {
    return (
      <section className="page-shell">
        <div className="section-header">
          <h2>No Bot State Available</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          No bot state data found. Using mock data as fallback.
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="section-header">
        <div>
          <p className="micro-label">Bot State</p>
          <h2>Current bot memory & runtime status</h2>
        </div>
      </div>
      <div className="state-grid">
        <div className="state-panel">
          <h3>Status</h3>
          <p>{state.status}</p>
        </div>
        <div className="state-panel">
          <h3>Last Active</h3>
          <p>{state.lastActive}</p>
        </div>
        <div className="state-panel">
          <h3>Uptime</h3>
          <p>{state.uptime} seconds</p>
        </div>
        <div className="state-panel">
          <h3>Version</h3>
          <p>{state.version}</p>
        </div>
      </div>
      <JsonAccordion data={state} label="Raw bot state" />
    </section>
  );
}

export default State;
