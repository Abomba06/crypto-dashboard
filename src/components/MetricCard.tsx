import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  subText?: string;
  variant?: 'neutral' | 'positive' | 'negative';
}

const variantColors: Record<string, string> = {
  neutral: 'rgba(124, 58, 237, 0.18)',
  positive: 'rgba(34, 197, 94, 0.18)',
  negative: 'rgba(239, 68, 68, 0.18)',
};

export function MetricCard({ label, value, subText, variant = 'neutral' }: MetricCardProps) {
  return (
    <div className="metric-card" style={{ background: variantColors[variant] }}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {subText ? <div className="metric-subtext">{subText}</div> : null}
    </div>
  );
}
