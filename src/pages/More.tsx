import React from 'react';

interface MoreProps {
  onNavigate: (page: string) => void;
}

const moreItems = [
  { id: 'trades', label: 'Trades' },
  { id: 'evaluations', label: 'Evaluations' },
  { id: 'reports', label: 'Reports' },
  { id: 'state', label: 'State' },
  { id: 'settings', label: 'Settings' },
];

function More({ onNavigate }: MoreProps) {
  return (
    <div className="more-items">
      {moreItems.map((item) => (
        <button key={item.id} onClick={() => onNavigate(item.id)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default More;
