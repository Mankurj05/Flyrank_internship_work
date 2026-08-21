import React, { useState } from 'react';

interface CustomDisclosureProps {
  buttonLabel: string;
  children: React.ReactNode;
}

export const CustomDisclosure: React.FC<CustomDisclosureProps> = ({
  buttonLabel,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = 'disclosure-panel-example';

  return (
    <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#f8fafc',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 500,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <span>{buttonLabel}</span>
        <span
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          ▼
        </span>
      </button>
      
      <div
        id={panelId}
        style={{
          display: isExpanded ? 'block' : 'none',
          padding: '16px 8px 8px 8px',
          color: '#e2e8f0',
          fontSize: '0.95rem',
          lineHeight: '1.5',
        }}
      >
        {children}
      </div>
    </div>
  );
};
