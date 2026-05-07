import React, { useMemo, useState } from 'react';
import { LogEntry } from '../types/trading';

interface LogViewerProps {
  entries: LogEntry[];
}

export function LogViewer({ entries }: LogViewerProps) {
  const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const filtered = useMemo(
    () => entries.filter((entry) => filter === 'all' || entry.severity === filter),
    [entries, filter]
  );

  return (
    <section className="log-viewer">
      <div className="log-controls">
        <div>Severity</div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="all">All</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
        </select>
      </div>
      <div className="log-list">
        {filtered.map((entry) => (
          <div className={`log-entry log-${entry.severity}`} key={entry.id}>
            <div className="log-time">{entry.timestamp}</div>
            <div>
              <strong>{entry.severity.toUpperCase()}</strong>
              <p>{entry.message}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
