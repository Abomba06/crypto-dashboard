import React from 'react';

interface MiniChartProps {
  values: number[];
  positive?: boolean;
}

export function MiniChart({ values, positive = true }: MiniChartProps) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="mini-chart" viewBox="0 0 100 100" aria-hidden="true">
      <polyline points={points} fill="none" stroke={positive ? '#7c3aed' : '#ef4444'} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
