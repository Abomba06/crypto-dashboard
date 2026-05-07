import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { PositionCard } from '../components/PositionCard';

function Positions() {
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    dashboardService.getPositions().then(setPositions);
  }, []);

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
        {positions.map((position) => (
          <PositionCard position={position} key={position.symbol} />
        ))}
      </div>
    </section>
  );
}

export default Positions;
