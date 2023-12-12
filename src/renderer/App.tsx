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

function Hello({ id, url, onGoClick }: {id: string, url: string; onGoClick: (url: string) => void }) {
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

  return (
    <div>
      { url != "bookmarks" ? (
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
          <div className="Web">
            <iframe
              id={id+url}
              title="web"
              src={url}
              width={iframeWidth}
              height={iframeHeight}
              allowFullScreen
              ></iframe>
          </div>
        </div>
      ): (
        <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: "100%", height: "100vh", backgroundColor: "rgb(98, 168, 98)" }}>
          <h3>This is a bookmark</h3>
        </div>
      )
      }
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

  const addTab = (value:number) => {
    if (value == 0) {
      const newTab = {
        id: generateRandomId(),
        label: `Tab ${tabs.length + 1}`,
        to: `/${generateRandomId()}`,
      };
      setTabs([...tabs, newTab]);
    }
    else if (value == 1) {
      const newTab = {
        id: generateRandomId(),
        label: `Bookmarks`,
        to: `/${generateRandomId()}`,
      };
      setTabUrls((prevUrls) => ({ ...prevUrls, [newTab.id]: 'bookmarks' }));
      setTabs([...tabs, newTab]);
    }
  };

  const removeTab = (id: string) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);
  };

  return (
    <Router>
      <div className="All">
        <div className="tabs">
          <button onClick={() => addTab(0)} type="button" className="tab_add">
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
        {/* Conditionally render Hello component and pass tabId to MenuBar */}
        <Routes>
          {tabs.map((tab) => (
            <Route
              key={tab.id}
              path={tab.to}
              element={
                <>
                  <MenuBar
                    id= {tab.id}
                    onGoClick={(url) => handleGoClick(tab.id, url)}
                    tabId={tab.id} // Pass tabId to MenuBar
                    addTab={addTab}
                  />
                  <Hello
                    id={tab.id}
                    url={ tabUrls && tabUrls[tab.id]? tabUrls[tab.id] :'https://www.bing.com'}
                    onGoClick={(url) => handleGoClick(tab.id, url)}
                  />
                </>
              }
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
