import React from 'react';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header glass-shell">
        <div>
          <p className="micro-label">Crypto Bot Control Center</p>
          <h1>Operational Dashboard</h1>
        </div>
        <div className="header-pill">Live</div>
      </header>

      <main className="app-main">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
