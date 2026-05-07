import React, { useEffect, useMemo, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { EvaluationRecord } from '../types/trading';

function Evaluations() {
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'accepted' | 'rejected'>('accepted');

  useEffect(() => {
    dashboardService.getEvaluations().then(setEvaluations);
  }, []);

  const filtered = useMemo(
    () => evaluations.filter((entry) => entry.status === activeTab),
    [activeTab, evaluations]
  );

  return (
    <section className="page-shell">
      <div className="section-header">
        <div>
          <p className="micro-label">Evaluations</p>
          <h2>Candidate performance</h2>
        </div>
      </div>
      <div className="tabs-row">
        {(['accepted', 'rejected'] as const).map((tab) => (
          <button key={tab} className={activeTab === tab ? 'tab active' : 'tab'} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="eval-grid">
        {filtered.map((record) => (
          <article className="eval-card" key={record.id}>
            <div className="eval-title">{record.symbol}</div>
            <div className="eval-row">
              <span>Forward</span>
              <strong>{record.forwardReturn}%</strong>
            </div>
            <div className="eval-row">
              <span>MFE</span>
              <strong>{record.mfe}%</strong>
            </div>
            <div className="eval-row">
              <span>MAE</span>
              <strong>{record.mae}%</strong>
            </div>
            <div className="eval-row">
              <span>TP1 hit</span>
              <strong>{record.tp1Hit ? 'Yes' : 'No'}</strong>
            </div>
            <div className="eval-row">
              <span>Stop hit</span>
              <strong>{record.stopHit ? 'Yes' : 'No'}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Evaluations;
