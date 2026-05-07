import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { LogViewer } from '../components/LogViewer';
import { LogEntry } from '../types/trading';

function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    dashboardService.getLogs().then(setLogs);
  }, []);

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
