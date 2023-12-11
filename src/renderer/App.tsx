import React, { useState } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

interface TabProps {
  to: string;
  label: string;
  onRemove: () => void;
}

function Tab({ to, label, onRemove }: TabProps) {
  const location = useLocation();
  const isOpen = location.pathname === to;
  return (
    <Link to={to} className="link">
      {isOpen ? (
        <div className="tab_open">
          <div className="tab_format">
            <span className="tab_writing">{label}</span>
            <div style={{ width: 50 }}>
              <button onClick={onRemove} type="button" className="tab_close">
                X
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="tab">
          <div className="tab_format">
            <span className="tab_writing">{label}</span>
            <div style={{ width: 50 }}>
              <button onClick={onRemove} type="button" className="tab_close">
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}

function Hello({ label }: { label: string }) {
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <div className="Hello">
        <h1>Label is = {label}</h1>
      </div>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
}

function generateRandomId() {
  return Math.random().toString(36).substring(7);
}

export default function App() {
  const [tabs, setTabs] = useState([
    { id: generateRandomId(), label: 'Tab 1', to: '/' },
  ]);
  const addTab = () => {
    const newTab = {
      id: generateRandomId(),
      label: `Tab ${tabs.length + 1}`,
      to: `/${generateRandomId()}`,
    };
    setTabs([...tabs, newTab]);
  };
  const removeTab = (id: string) => {
    const indexToRemove = tabs.findIndex((tab) => tab.id === id);
    let nextTabIndex;
    if (indexToRemove > 0) {
      // If the tab to be removed is not the first one,
      // select the tab before it.
      nextTabIndex = indexToRemove - 1;
    } else if (indexToRemove === 0 && tabs.length > 1) {
      // If the first tab is being closed and there are more tabs,
      // select the tab after it.
      nextTabIndex = 1;
    } else {
      // If the closing tab is the only one, or the last one is being closed,
      // there won't be any tabs left to display.
      nextTabIndex = null;
    }
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);
    if (nextTabIndex !== null) {
      // Use the selected tab index to update the URL.
      const nextTab = tabs[nextTabIndex];
      // How do I switch to this path?
      window.location.hash = `#${nextTab.to}`;
    }
  };

  return (
    <Router>
      <div className="All">
        <div className="tabs">
          <button onClick={addTab} type="button" className="tab_add">
            +
          </button>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              to={tab.to}
              label={tab.label}
              onRemove={() => removeTab(tab.id)}
            />
          ))}
        </div>
        <Routes>
          {tabs.map((tab) => (
            <Route
              key={tab.id}
              path={tab.to}
              element={<Hello label={tab.id} />}
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}
