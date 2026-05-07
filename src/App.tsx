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

function App() {
  const [active, setActive] = useState('dashboard');
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="micro-label">Crypto Bot Control Center</p>
          <h1>Operational Dashboard</h1>
        </div>
        <div className="header-pill">Live</div>
      </header>

      <main className="app-main">{pageMap[active]}</main>

      <BottomNav active={active} onChange={(page) => setActive(page)} onMore={() => setShowMore(true)} />

      {showMore ? (
        <div className="modal-backdrop" onClick={() => setShowMore(false)}>
          <div className="more-panel" onClick={(e) => e.stopPropagation()}>
            <h2>More Screens</h2>
            <More onNavigate={(target) => {
              setActive(target);
              setShowMore(false);
            }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
