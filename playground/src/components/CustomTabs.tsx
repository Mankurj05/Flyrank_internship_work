import React, { useState, useRef } from 'react';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface CustomTabsProps {
  tabs: TabItem[];
}

export const CustomTabs: React.FC<CustomTabsProps> = ({ tabs }) => {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId);
    if (currentIndex === -1) return;

    let targetIndex = -1;

    switch (e.key) {
      case 'ArrowRight':
        targetIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        targetIndex = 0;
        break;
      case 'End':
        targetIndex = tabs.length - 1;
        break;
      default:
        return; // Exit if other keys
    }

    e.preventDefault();
    const targetTab = tabs[targetIndex];
    if (targetTab) {
      setActiveTabId(targetTab.id);
      // Focus the newly active tab button
      tabRefs.current[targetTab.id]?.focus();
    }
  };

  return (
    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px' }}>
      {/* Tab List */}
      <div
        role="tablist"
        aria-label="Example Tabs"
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '16px',
        }}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[tab.id] = el; }}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTabId(tab.id)}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: isSelected ? '2px solid #6366f1' : '2px solid transparent',
                color: isSelected ? '#6366f1' : '#94a3b8',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {tabs.map((tab) => {
        const isSelected = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            tabIndex={0}
            hidden={!isSelected}
            style={{
              color: '#f8fafc',
              outline: 'none',
            }}
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
};
