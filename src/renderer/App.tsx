import {
  MemoryRouter as Router,
  Link,
  useLocation,
  Routes,
  Route,
} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
import MenuBar from './MenuBar';

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
            <button onClick={onRemove} type="button" className="tab_close">
              X
            </button>
          </div>
        </div>
      ) : (
        <div className="tab">
          <div className="tab_format">
            <span className="tab_writing">{label}</span>
            <button onClick={onRemove} type="button" className="tab_close">
              X
            </button>
          </div>
        </div>
      )}
    </Link>
  );
}

function Hello({ url, onGoClick }: { url: string; onGoClick: (url: string) => void }) {
  const [iframeWidth, setIframeWidth] = useState(window.innerWidth);
  const [iframeHeight, setIframeHeight] = useState(window.innerHeight - 40);

  const handleResize = () => {
    setIframeWidth(window.innerWidth);
    setIframeHeight(window.innerHeight - 40);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleGoClick = (url: string) => {
    onGoClick(url);
  };

  return (
    <div>
      <div
        style={{
          width: '100%',
          paddingLeft: 0,
          marginLeft: -10,
          paddingTop: 89,
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
      <MenuBar onGoClick={handleGoClick} />
      <div className="Web">
        <iframe
          title="web"
          src={url}
          width={iframeWidth}
          height={iframeHeight}
          allowFullScreen
          ></iframe>
      </div>
      </div>
    </div>
  );
}

function generateRandomId() {
  return Math.random().toString(36).substring(7);
}

function App() {
  const [tabs, setTabs] = useState([
    { id: generateRandomId(), label: 'Tab 1', to: '/' },
  ]);
  const [tabUrls, setTabUrls] = useState<{ [key: string]: string }>({
    [tabs[0].id]: 'https://www.bing.com', // Initial URL for the first tab
  });

  const handleGoClick = (tabId: string, url: string) => {
    // Update the URL for the specific tab
    setTabUrls((prevUrls) => ({ ...prevUrls, [tabId]: url }));
  };

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
        {/* Conditionally render Hello component based on the route's path */}
        <Routes>
          {tabs.map((tab) => (
            <Route
              key={tab.id}
              path={tab.to}
              element={
                <Hello
                  url={tabUrls[tab.id]}
                  onGoClick={(url) => handleGoClick(tab.id, url)}
                />
              }
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
