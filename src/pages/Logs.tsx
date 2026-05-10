import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { LogViewer } from '../components/LogViewer';
import { LogEntry } from '../types/trading';

function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await dashboardService.getLogs();
        setLogs(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load logs');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to realtime log updates
    let unsubscribe: any;
    const subscribe = async () => {
      unsubscribe = await dashboardService.subscribeToLogs(setLogs);
    };
    subscribe();

    return () => {
      if (unsubscribe?.unsubscribe) {
        void unsubscribe.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <section className="page-shell">
        <div className="section-header">
          <h2>Loading Logs...</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          Fetching bot logs from Supabase...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-shell">
        <div className="section-header">
          <h2>Logs Error</h2>
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
          <p className="micro-label">Logs Center</p>
          <h2>Bot telemetry & execution logs</h2>
        </div>
      </div>
      <LogViewer entries={logs} />
    </section>
  );
}

export default Logs;
