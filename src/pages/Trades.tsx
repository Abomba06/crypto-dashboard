import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { TradeCard } from '../components/TradeCard';
import { Trade } from '../types/trading';

function Trades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selected, setSelected] = useState<Trade | null>(null);

  useEffect(() => {
    dashboardService.getTrades().then(setTrades);
  }, []);

  return (
    <section className="page-shell">
      <div className="section-header">
        <div>
          <p className="micro-label">Trades</p>
          <h2>Execution timeline</h2>
        </div>
        <div className="panel-pill">{trades.length} entries</div>
      </div>
      <div className="trade-list">
        {trades.map((trade) => (
          <div key={trade.id} className="trade-selectable" onClick={() => setSelected(trade)}>
            <TradeCard trade={trade} />
          </div>
        ))}
      </div>
      {selected ? (
        <div className="detail-drawer">
          <div className="drawer-header">
            <h3>Trade metadata</h3>
            <button onClick={() => setSelected(null)}>Close</button>
          </div>
          <div className="drawer-grid">
            <div>
              <small>Order ID</small>
              <div>{selected.note.match(/order_id=([^;]+)/)?.[1] ?? 'N/A'}</div>
            </div>
            <div>
              <small>RSI</small>
              <div>{selected.note.match(/rsi=([^;]+)/)?.[1] ?? 'N/A'}</div>
            </div>
            <div>
              <small>ATR</small>
              <div>{selected.note.match(/atr=([^;]+)/)?.[1] ?? 'N/A'}</div>
            </div>
            <div>
              <small>Vol ratio</small>
              <div>{selected.note.match(/vol_ratio=([^;]+)/)?.[1] ?? 'N/A'}</div>
            </div>
            <div>
              <small>Regime</small>
              <div>{selected.note.match(/regime=([^;]+)/)?.[1] ?? 'N/A'}</div>
            </div>
            <div>
              <small>Execution quality</small>
              <div>{selected.note.match(/quality=([^;]+)/)?.[1] ?? 'N/A'}</div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default Trades;
