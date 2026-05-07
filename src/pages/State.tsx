import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { JsonAccordion } from '../components/JsonAccordion';
import { BotState } from '../types/trading';

function State() {
  const [state, setState] = useState<BotState | null>(null);

  useEffect(() => {
    dashboardService.getBotState().then(setState);
  }, []);

  if (!state) return <section className="page-shell">Loading state...</section>;

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
          <h3>Open positions</h3>
          <p>{(state.openPositions as string[]).join(', ')}</p>
        </div>
        <div className="state-panel">
          <h3>Watched symbols</h3>
          <p>{(state.watchedSymbols as string[]).join(', ')}</p>
        </div>
        <div className="state-panel">
          <h3>Risk state</h3>
          <p>{state.riskState as string}</p>
        </div>
      </div>
      <JsonAccordion data={state} label="Raw bot state" />
    </section>
  );
}

export default State;
