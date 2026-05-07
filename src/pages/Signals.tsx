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

  useEffect(() => {
    dashboardService.getSignals().then(setSignals);
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === 'All') return signals;
    if (activeTab === 'Candidates') return signals.filter((signal) => signal.status === 'candidate');
    return signals.filter((signal) => signal.status === activeTab.toLowerCase());
  }, [activeTab, signals]);

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
        {filtered.map((signal) => (
          <SignalCard key={signal.id} signal={signal} onSelect={setSelected} />
        ))}
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
