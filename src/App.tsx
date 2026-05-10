import React, { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Positions from './pages/Positions';
import Signals from './pages/Signals';
import News from './pages/News';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Trades from './pages/Trades';
import Evaluations from './pages/Evaluations';
import Reports from './pages/Reports';
import State from './pages/State';
import More from './pages/More';
import './App.css';

const pageMap: Record<string, React.ReactNode> = {
  dashboard: <Dashboard />,
  positions: <Positions />,
  signals: <Signals />,
  news: <News />,
  logs: <Logs />,
  settings: <Settings />,
  trades: <Trades />,
  evaluations: <Evaluations />,
  reports: <Reports />,
  state: <State />,
};

const pageTitles: Record<string, string> = {
  dashboard: 'Operational Dashboard',
  positions: 'Positions',
  signals: 'Signals',
  news: 'Market Catalysts',
  logs: 'Telemetry',
  settings: 'Settings',
  trades: 'Trades',
  evaluations: 'Evaluations',
  reports: 'Reports',
  state: 'Bot State',
};

function App() {
  const [active, setActive] = useState('dashboard');
  const [showMore, setShowMore] = useState(false);

  const navigate = (target: string) => {
    setActive(target);
    setShowMore(false);
  };

  return (
    <div className="app-shell">
      <header className="app-header glass-shell">
        <div>
          <p className="micro-label">Crypto Bot Control Center</p>
          <h1>{pageTitles[active]}</h1>
        </div>
        <div className="header-pill">Live</div>
      </header>

      <main className="app-main">{pageMap[active]}</main>

      <BottomNav active={active} onChange={navigate} onMore={() => setShowMore(true)} />

      {showMore ? (
        <div className="modal-backdrop" onClick={() => setShowMore(false)}>
          <div className="more-panel" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <h3>More</h3>
              <button onClick={() => setShowMore(false)}>Close</button>
            </div>
            <More onNavigate={navigate} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
