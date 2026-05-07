import React from 'react';

interface BottomNavProps {
  active: string;
  onChange: (page: string) => void;
  onMore: () => void;
}

const items: Array<{ id: string; label: string; icon: React.ReactNode }> = [
  {
    id: 'dashboard',
    label: 'Dash',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16V4H4v16z" />
        <path d="M10 4v8H4" />
        <path d="M20 20V10H10" />
      </svg>
    ),
  },
  {
    id: 'positions',
    label: 'Pos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8h12" />
        <path d="M4 8v12h16V8" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    ),
  },
  {
    id: 'signals',
    label: 'Sig',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
  },
  {
    id: 'news',
    label: 'News',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4h12v16H6z" />
        <path d="M8 8h8" />
        <path d="M8 12h6" />
      </svg>
    ),
  },
  {
    id: 'logs',
    label: 'Logs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 6h14" />
        <path d="M5 12h14" />
        <path d="M5 18h14" />
      </svg>
    ),
  },
];

export function BottomNav({ active, onChange, onMore }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map((item) => (
        <button
          key={item.id}
          className={active === item.id ? 'nav-item active' : 'nav-item'}
          onClick={() => onChange(item.id)}
          aria-label={item.label}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
      <button className="nav-item" onClick={onMore} aria-label="More">
        <span className="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 12h.01M12 12h.01M18 12h.01" />
          </svg>
        </span>
        <span className="nav-label">More</span>
      </button>
    </nav>
  );
}
