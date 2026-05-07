import React from 'react';

interface StatusBadgeProps {
  type: string;
  variant?: 'success' | 'danger' | 'warning' | 'neutral' | 'purple';
}

const colors: Record<string, string> = {
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  neutral: '#818cf8',
  purple: '#a855f7',
};

export function StatusBadge({ type, variant = 'neutral' }: StatusBadgeProps) {
  return (
    <span className="status-badge" style={{ background: `${colors[variant]}22`, color: colors[variant] }}>
      {type}
    </span>
  );
}
