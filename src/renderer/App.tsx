import React, { useState } from 'react';
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

interface TabProps {
  to: string;
  label: string;
  onRemove: () => void;
}

function Tab({ to, label, onRemove }: TabProps) {
  return (
    <Link to={to} className="link">
      <div className="tab">
        <text className="tab_writing">{label}</text>
        <button onClick={onRemove} type="button" className="tab_close">
          X
        </button>
      </div>
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
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);
  };

  return (
    <Router>
      <div className="All">
        <div className="tabs">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              to={tab.to}
              label={tab.label}
              onRemove={() => removeTab(tab.id)}
            />
          ))}
          <button onClick={addTab} type="button" className="tab_add">
            +
          </button>
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
