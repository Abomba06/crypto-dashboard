import React, { useState } from 'react';

interface JsonAccordionProps {
  data: object;
  label?: string;
}

function renderValue(value: unknown) {
  if (typeof value === 'object' && value !== null) {
    return <JsonAccordion data={value as object} />;
  }
  return <span className="json-value">{String(value)}</span>;
}

export function JsonAccordion({ data, label }: JsonAccordionProps) {
  const [open, setOpen] = useState(true);
  return (
    <details open={open} className="json-accordion" onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}>
      <summary>{label ?? 'State object'}</summary>
      <div className="json-content">
        {Object.entries(data).map(([key, value]) => (
          <div className="json-row" key={key}>
            <div className="json-key">{key}</div>
            <div>{renderValue(value)}</div>
          </div>
        ))}
      </div>
    </details>
  );
}
