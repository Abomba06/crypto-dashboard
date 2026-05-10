import React, { useEffect, useMemo, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { SignalCard } from '../components/SignalCard';
import { Signal } from '../types/trading';
import { StatusBadge } from '../components/StatusBadge';

const tabs = ['All', 'Candidates', 'Accepted', 'Rejected'] as const;

function Signals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('All');
  const [selected, setSelected] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await dashboardService.getSignals();
        setSignals(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load signals');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to realtime updates
    let unsubscribe: any;
    const subscribe = async () => {
      unsubscribe = await dashboardService.subscribeToSignals(setSignals);
    };
    subscribe();

    return () => {
      if (unsubscribe?.unsubscribe) {
        void unsubscribe.unsubscribe();
      }
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === 'All') return signals;
    if (activeTab === 'Candidates') return signals.filter((signal) => signal.status === 'candidate');
    return signals.filter((signal) => signal.status === activeTab.toLowerCase());
  }, [activeTab, signals]);

  if (loading) {
    return (
      <section className="page-shell">
        <div className="section-header">
          <h2>Loading Signals...</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          Fetching signal data from Supabase...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-shell">
        <div className="section-header">
          <h2>Signals Error</h2>
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

  return (
    <section className="page-shell">
      <div className="section-header">
        <div>
          <p className="micro-label">Signals</p>
          <h2>Live signal pipeline</h2>
        </div>
        <div className="panel-pill">{filtered.length} visible</div>
      </div>
      <div className="tabs-row">
        {tabs.map((tab) => (
          <button key={tab} className={activeTab === tab ? 'tab active' : 'tab'} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>
      <div className="signal-list">
        {filtered.length > 0 ? (
          filtered.map((signal) => (
            <SignalCard key={signal.id} signal={signal} onSelect={setSelected} />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
            No signals found for the selected filter.
          </div>
        )}
      </div>
      {selected ? (
        <div className="detail-drawer">
          <div className="drawer-header">
            <h3>{selected.symbol} signal details</h3>
            <button onClick={() => setSelected(null)}>Close</button>
          </div>
          <div className="drawer-grid">
            <div>
              <small>Setup</small>
              <div>{selected.setup}</div>
            </div>
            <div>
              <small>Regime</small>
              <div>{selected.regime}</div>
            </div>
            <div>
              <small>Score</small>
              <div>{selected.score}</div>
            </div>
            <div>
              <small>Action</small>
              <div>{selected.action}</div>
            </div>
            <div>
              <small>Reason</small>
              <div>{selected.reason}</div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default Signals;
