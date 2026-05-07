import React from 'react';

interface BottomNavProps {
  active: string;
  onChange: (page: string) => void;
  onMore: () => void;
}

const items = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'positions', label: 'Positions' },
  { id: 'signals', label: 'Signals' },
  { id: 'news', label: 'News' },
  { id: 'logs', label: 'Logs' },
  { id: 'settings', label: 'Settings' },
];

export function BottomNav({ active, onChange, onMore }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {items.slice(0, 5).map((item) => (
        <button
          key={item.id}
          className={active === item.id ? 'nav-item active' : 'nav-item'}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
      <button className="nav-item" onClick={onMore}>
        More
      </button>
    </nav>
  );
}
