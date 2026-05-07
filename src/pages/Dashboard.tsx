import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { loadStitchScreen } from '../services/stitchService';
import { MetricCard } from '../components/MetricCard';
import { PositionCard } from '../components/PositionCard';
import { NewsCatalystCard } from '../components/NewsCatalystCard';
import { SignalCard } from '../components/SignalCard';
import { StatusBadge } from '../components/StatusBadge';

const useStitch = import.meta.env.VITE_USE_STITCH === 'true';

function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [stitchLayout, setStitchLayout] = useState<any>(null);
  const [stitchError, setStitchError] = useState<string>('');

  useEffect(() => {
    dashboardService.getPortfolioSummary().then(setSummary);
    dashboardService.getPositions().then(setPositions);
    dashboardService.getSignals().then(setSignals);
    dashboardService.getMarketEvents().then(setEvents);
    dashboardService.getTrades().then(setTrades);

    if (useStitch) {
      loadStitchScreen('dashboard')
        .then(setStitchLayout)
        .catch((error) => setStitchError(error.message));
    }
  }, []);

  if (useStitch && stitchLayout) {
    return (
      <section className="page-shell">
        <div className="dashboard-panel card-slim">
          <div className="panel-heading">
            <h2>Stitch Remote UI</h2>
          </div>
          <pre style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>{JSON.stringify(stitchLayout, null, 2)}</pre>
        </div>
      </section>
    );
  }

  if (!summary) return <div className="page-shell">Loading dashboard...</div>;

  return (
    <section className="page-shell">
      <div className="dashboard-grid">
        <div className="dashboard-panel dashboard-summary">
          <div className="panel-heading">
            <h2>Portfolio Summary</h2>
            <StatusBadge type={summary.health.toUpperCase()} variant={summary.health === 'nominal' ? 'success' : summary.health === 'watch' ? 'warning' : 'danger'} />
          </div>
          <div className="metric-row">
            <MetricCard label="Total Value" value={`$${summary.totalValue.toLocaleString()}`} />
            <MetricCard label="Today P/L" value={`${summary.todayPnL >= 0 ? '+' : '-'}$${Math.abs(summary.todayPnL).toFixed(2)}`} variant={summary.todayPnL >= 0 ? 'positive' : 'negative'} />
          </div>
          <div className="metric-row">
            <MetricCard label="Open P/L" value={`${summary.openPnL >= 0 ? '+' : '-'}$${Math.abs(summary.openPnL).toFixed(2)}`} variant={summary.openPnL >= 0 ? 'positive' : 'negative'} />
            <MetricCard label="Buying Power" value={`$${summary.buyingPower.toLocaleString()}`} />
          </div>
          <div className="summary-footer">
            <span>Market regime: {summary.regime}</span>
            <span>Top mover: {summary.topMover}</span>
            <span>Recent error: {summary.recentError}</span>
          </div>
        </div>

        <div className="dashboard-panel card-slim">
          <h3>Latest Signal</h3>
          <SignalCard signal={signals[0]} />
        </div>

        <div className="dashboard-panel card-slim">
          <h3>Latest Catalyst</h3>
          <NewsCatalystCard event={events[0]} />
        </div>

        <div className="dashboard-panel chart-card">
          <div className="panel-heading">
            <h3>Accepted vs Rejected Signals</h3>
          </div>
          <div className="mini-report">
            <div className="report-bar positive" style={{ width: '68%' }}>Accepted</div>
            <div className="report-bar negative" style={{ width: '32%' }}>Rejected</div>
          </div>
          <div className="panel-note">Signal quality remains strong in the current regime.</div>
        </div>

        <div className="dashboard-panel positions-preview">
          <div className="panel-heading"><h3>Active Positions</h3></div>
          {positions.slice(0, 2).map((position) => (
            <PositionCard position={position} key={position.symbol} />
          ))}
        </div>

        <div className="dashboard-panel trades-preview">
          <div className="panel-heading"><h3>Recent Trades</h3></div>
          {trades.slice(0, 2).map((trade) => (
            <div className="trade-preview-row" key={trade.id}>
              <div>{trade.symbol}</div>
              <div>{trade.action.toUpperCase()}</div>
              <div>{trade.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
