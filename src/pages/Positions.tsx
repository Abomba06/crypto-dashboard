import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { PositionCard } from '../components/PositionCard';

function Positions() {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await dashboardService.getPositions();
        setPositions(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load positions');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to realtime updates
    const unsubscribe = dashboardService.subscribeToPositions(setPositions);

    return () => unsubscribe.unsubscribe();
  }, []);

  if (loading) {
    return (
      <section className="page-shell">
        <div className="section-header">
          <h2>Loading Positions...</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          Fetching position data from Supabase...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-shell">
        <div className="section-header">
          <h2>Positions Error</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#f87171' }}>
          {error}
          <br />
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem' }}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="section-header">
        <div>
          <p className="micro-label">Positions</p>
          <h2>Active portfolio exposure</h2>
        </div>
        <div className="panel-pill">{positions.length} open</div>
      </div>
      <div className="list-grid">
        {positions.length > 0 ? (
          positions.map((position) => (
            <PositionCard position={position} key={position.symbol} />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
            No active positions found.
          </div>
        )}
      </div>
    </section>
  );
}

export default Positions;
