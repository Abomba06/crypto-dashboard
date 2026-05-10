import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';

function Settings() {
  const [state, setState] = useState<any>(null);
  const [mode, setMode] = useState<'paper' | 'live'>('paper');
  const [masterOn, setMasterOn] = useState(true);

  useEffect(() => {
    dashboardService.getBotState().then(setState);
  }, []);

  return (
    <section className="page-shell">
      <div className="section-header">
        <div>
          <p className="micro-label">Settings</p>
          <h2>Bot controls & risk management</h2>
        </div>
      </div>
      <div className="settings-grid">
        <div className="settings-card">
          <h3>Bot Master Switch</h3>
          <button className={masterOn ? 'pill active' : 'pill'} onClick={() => setMasterOn(!masterOn)}>
            {masterOn ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        <div className="settings-card">
          <h3>Trading Mode</h3>
          <button className={mode === 'paper' ? 'pill active' : 'pill'} onClick={() => setMode('paper')}>
            Paper
          </button>
          <button className={mode === 'live' ? 'pill active' : 'pill'} onClick={() => setMode('live')}>
            Live
          </button>
        </div>
        <div className="settings-card">
          <h3>Connection Status</h3>
          <p>Alpaca API connection: <strong>Disconnected</strong></p>
          <p>Future DB status: <strong>Not linked</strong></p>
        </div>
        <div className="settings-card">
          <h3>Risk Controls</h3>
          <p>Daily loss cap: $1,500</p>
          <p>Per-coin cap: 10%</p>
          <p>Portfolio cap: $250,000</p>
        </div>
        <div className="settings-card">
          <h3>Watchlist</h3>
          <p>BTCUSD / ETHUSD / SOLUSD / LINKUSD</p>
        </div>
        <div className="settings-card">
          <h3>Alerts</h3>
          <p>Price breakouts, stop hits, signal rejections</p>
        </div>
      </div>
      <div className="settings-note">
        <p>Note: This app is mock-only for now. All Alpaca / DB connections are planned for later architecture integration.</p>
      </div>
    </section>
  );
}

export default Settings;
