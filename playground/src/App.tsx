import { useState } from 'react';
import { CustomModal } from './components/CustomModal';
import { CustomTabs } from './components/CustomTabs';
import { CustomDisclosure } from './components/CustomDisclosure';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabsData = [
    {
      id: 'tab-1',
      label: 'Introduction',
      content: (
        <div>
          <h3>Overview of a11y Components</h3>
          <p style={{ marginTop: '8px', color: '#94a3b8' }}>
            Accessibility (a11y) ensures that interactive user interfaces are operable by everyone,
            including users relying on screen readers, keyboards, or other assistive tech.
          </p>
        </div>
      ),
    },
    {
      id: 'tab-2',
      label: 'Modal Details',
      content: (
        <div>
          <h3>Custom Modal Specs</h3>
          <p style={{ marginTop: '8px', color: '#94a3b8' }}>
            Our custom modal manages focus properly by capturing/trapping the Tab key and returning focus
            to the triggering button upon close. It also listens for the Escape key to close the overlay.
          </p>
        </div>
      ),
    },
    {
      id: 'tab-3',
      label: 'Keyboard Shortcuts',
      content: (
        <div>
          <h3>List of Shortcuts</h3>
          <ul style={{ marginTop: '8px', color: '#94a3b8', paddingLeft: '20px' }}>
            <li><strong>Tab:</strong> Cycles focus through interactive elements.</li>
            <li><strong>Left/Right Arrows:</strong> Switches active tab panel.</li>
            <li><strong>Escape:</strong> Dismisses active modals.</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Accessible Component Playground</h1>
        <p style={{ color: '#94a3b8' }}>Handcrafted components adhering to W3C ARIA standards in React & TypeScript</p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* Modal Section */}
        <section style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '24px', borderRadius: '12px' }}>
          <h2>1. Accessible Modal Dialog</h2>
          <p style={{ color: '#94a3b8', margin: '8px 0 16px 0' }}>
            Triggers a dialog overlay. Traps tab focus inside and returns focus to this button when closed.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6366f1',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Open Modal Dialog
          </button>

          <CustomModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Custom Modal Dialog"
          >
            <p style={{ marginBottom: '16px', color: '#cbd5e1' }}>
              This dialog window is keyboard-accessible! Pressing <kbd>Tab</kbd> cycles focus solely
              between the input and the buttons. Pressing <kbd>Escape</kbd> closes this dialog.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Type here..."
                aria-label="Modal input text field"
                style={{
                  padding: '8px 12px',
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: '#fff',
                }}
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Confirmed!');
                    setIsModalOpen(false);
                  }}
                  style={{
                    padding: '8px 16px',
                    background: '#6366f1',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Confirm Action
                </button>
              </div>
            </div>
          </CustomModal>
        </section>

        {/* Tabs Section */}
        <section style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '24px', borderRadius: '12px' }}>
          <h2 style={{ marginBottom: '8px' }}>2. Accessible Tabs</h2>
          <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
            Operable via keyboard arrows (<kbd>←</kbd> and <kbd>→</kbd>), <kbd>Home</kbd>, and <kbd>End</kbd> keys.
          </p>
          <CustomTabs tabs={tabsData} />
        </section>

        {/* Disclosure Section */}
        <section style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '24px', borderRadius: '12px' }}>
          <h2 style={{ marginBottom: '8px' }}>3. Accessible Disclosure Accordion</h2>
          <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
            Simple toggle pattern setting appropriate expanded states.
          </p>
          <CustomDisclosure buttonLabel="Click to read FAQ details">
            <p>
              This disclosure component maps to the W3C Disclosure layout. The header element acts as a button
              associated via <code>aria-controls</code> with this panel and exposes the status dynamically via <code>aria-expanded</code>.
            </p>
          </CustomDisclosure>
        </section>
      </main>
    </div>
  );
}

export default App;
