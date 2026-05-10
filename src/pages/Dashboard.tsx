import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { MetricCard } from '../components/MetricCard';
import { PositionCard } from '../components/PositionCard';
import { NewsCatalystCard } from '../components/NewsCatalystCard';
import { SignalCard } from '../components/SignalCard';
import { StatusBadge } from '../components/StatusBadge';
import { MarketEvent, PortfolioSummary, Position, Signal, Trade } from '../types/trading';

function Dashboard() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [summaryData, positionsData, signalsData, eventsData, tradesData] = await Promise.all([
          dashboardService.getPortfolioSummary(),
          dashboardService.getPositions(),
          dashboardService.getSignals(),
          dashboardService.getMarketEvents(),
          dashboardService.getTrades(),
        ]);

        setSummary(summaryData);
        setPositions(positionsData);
        setSignals(signalsData);
        setEvents(eventsData);
        setTrades(tradesData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <section className="page-shell">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          Loading dashboard...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-shell">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
          Error: {error}
        </div>
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="page-shell">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          No portfolio data available
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="dashboard-grid">
        <div className="dashboard-panel card-slim summary-panel">
          <div className="panel-heading">
            <div>
              <p className="micro-label">Portfolio value</p>
              <h3>${summary.totalValue.toLocaleString()}</h3>
            </div>
            <StatusBadge type={summary.regime} variant="neutral" />
          </div>
          <div className="metric-grid">
            <MetricCard
              label="Open P&L"
              value={`${summary.openPnL >= 0 ? '+' : ''}$${summary.openPnL.toLocaleString()}`}
              variant={summary.openPnL >= 0 ? 'positive' : 'negative'}
            />
            <MetricCard
              label="Today PnL"
              value={`${summary.todayPnL >= 0 ? '+' : ''}${summary.todayPnL.toFixed(2)}%`}
              variant={summary.todayPnL >= 0 ? 'positive' : 'negative'}
            />
            <MetricCard label="Buying Power" value={`$${summary.buyingPower.toLocaleString()}`} />
            <MetricCard label="Daily Loss Limit" value={`$${summary.dailyLossLimit.toLocaleString()}`} />
          </div>
        </div>

        <div className="dashboard-panel positions-panel">
          <div className="panel-heading">
            <div>
              <p className="micro-label">Open positions</p>
              <h3>{positions.length} Active</h3>
            </div>
          </div>
          <div className="positions-list">
            {positions.slice(0, 3).map((position) => (
              <PositionCard key={position.id} position={position} />
            ))}
            {positions.length === 0 && <div className="empty-state">No open positions</div>}
          </div>
        </div>

        <div className="dashboard-panel signals-panel">
          <div className="panel-heading">
            <div>
              <p className="micro-label">Trading signals</p>
              <h3>{signals.length} Active</h3>
            </div>
          </div>
          <div className="signals-list">
            {signals.slice(0, 2).map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
            {signals.length === 0 && <div className="empty-state">No active signals</div>}
          </div>
        </div>

        <div className="dashboard-panel card-slim catalyst-panel">
          <div className="panel-heading">
            <div>
              <p className="micro-label">Market catalyst</p>
              <h3>Latest Catalyst</h3>
            </div>
            <StatusBadge type={events[0]?.sentiment || 'neutral'} variant="neutral" />
          </div>
          {events.length > 0 ? (
            <NewsCatalystCard event={events[0]} compact />
          ) : (
            <div className="empty-state">No market events available</div>
          )}
        </div>

        <div className="dashboard-panel trades-panel">
          <div className="panel-heading">
            <div>
              <p className="micro-label">Recent trades</p>
              <h3>Last 24h</h3>
            </div>
          </div>
          <div className="trades-list">
            {trades.slice(0, 5).map((trade) => (
              <div key={trade.id} className="trade-item">
                <div className="trade-row">
                  <strong>{trade.symbol}</strong>
                  <span className={`trade-side ${trade.action}`}>{trade.action.toUpperCase()}</span>
                </div>
                <div className="trade-details">
                  <span>${trade.price.toLocaleString()}</span>
                  <span>{trade.quantity}</span>
                </div>
              </div>
            ))}
            {trades.length === 0 && <div className="empty-state">No recent trades</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
