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
import BookmarksComponent from './BookmarksComponent';

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

function Hello({ id, url, onGoClick, addTab, handleGoClick }: {id: string, url: string; onGoClick: (url: string) => void;
  handleGoClick: (tabId: string, url: string) => void;
  addTab: (value: number) => void;}) {
  const [iframeWidth, setIframeWidth] = useState(window.innerWidth);
  const [iframeHeight, setIframeHeight] = useState(window.innerHeight - 40);

  const [webviewWidth, setWebviewWidth] = useState(window.innerWidth);
  const [webviewHeight, setWebviewHeight] = useState(window.innerHeight);
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  const webview = document.querySelector('webview') as Electron.WebviewTag;
  if (webview && webview.id == (id) ) {
    webview.addEventListener('did-navigate', (event) => {
      // This event fires when the webview has successfully navigated.
      console.log('Did navigate to:', event.url);
      handleGoClick( id, event.url)
    });
  }

  const getBookmarks = async () => {
    const bookmarks = await window.electron.ipcRenderer.invoke('get-bookmarks');
    setBookmarks(bookmarks);
  };

  const handleRefreshClick = () => {
    const webview = document.querySelector('webview') as Electron.WebviewTag;
    webview.reload();
  }

  const handleHomeClick = () => {
    const webview = document.querySelector('webview') as Electron.WebviewTag;
    webview.loadURL('https://www.google.com/');
  }

  const handleOpenBookmarksClick = () => {
    getBookmarks();
    toggleBookmarks();
  };

  const toggleBookmarks = () => {
    setShowBookmarks(!showBookmarks);
  };
  const handleResize = () => {
    setWebviewWidth(window.innerWidth);
    setWebviewHeight(window.innerHeight - 40);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleGoClick2 = (url: string) => {
    const webview = document.querySelector('webview') as Electron.WebviewTag;
    webview.loadURL(url);
  };

  const handleSaveAsArticleClick = async () => {
    await getSaveAsArticleClick();
  };

  const handleGoBackClick = () => {
    const webview = document.querySelector('webview') as Electron.WebviewTag;
    webview.goBack();
  }

  const handleGoForwardClick = () => {
    const webview = document.querySelector('webview') as Electron.WebviewTag;
    webview.goForward();
  }

  const toggleEncryption = () => {
    setIsEncryptionEnabled(!isEncryptionEnabled);
  };

  const handleSaveURLClick = async () => {
    const webview = document.querySelector('webview') as Electron.WebviewTag;
    const args = {
      encryption: isEncryptionEnabled,
      url: webview.getURL(),
    };
    window.electron.ipcRenderer.invoke('save-url', args).then((result) => {
      console.log(result);
    });
  };


  async function getSaveAsArticleClick(): Promise<void> {
    const webview = document.querySelector('webview') as Electron.WebviewTag;
    const args = {
      encryption: isEncryptionEnabled,
      url: webview.getURL(),
    };
    window.electron.ipcRenderer.invoke('save-readable', args).then((result) => {
      console.log(result);
    });
  }

  return (
    <div>
      { url != "bookmarks" ? (
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
        <MenuBar
            id={id+url}
            onGoClick={onGoClick}
            onSaveAsArticleClick={handleSaveAsArticleClick}
            onToggleEncryptionClick={toggleEncryption}
            onSaveURLClick={handleSaveURLClick}
            onOpenBookmarksClick={handleOpenBookmarksClick}
            addTab={addTab}
            tabId={id}
            onRefreshClick={handleRefreshClick}
            onHomeClick={handleHomeClick}
            onGoBackClick={handleGoBackClick}
            onGoForwardClick={handleGoForwardClick}
          />
        {!showBookmarks && <div className="Web">
          <webview
            id={id + url}
            src={url}
            style={{
              display: 'inline-flex',
              width: webviewWidth,
              height: webviewHeight,
              margin: 0,
            }}
          ></webview>
        </div>}
      </div>
      <div
        className="BookmarksContainer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'center',
          // alignItems: 'center',
          // position: 'absolute',
          // top: 50,
          left: 0,
          // height: '50%',
          width: '100%',
          maxWidth: '100%',
          zIndex: 9999,
        }}
      >
        {showBookmarks && <BookmarksComponent bookmarks={bookmarks} />}
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
    [tabs[0].id]: 'https://www.google.com', // Initial URL for the first tab
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
              label={tabUrls[tab.id] || 'https://www.google.com'}
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
                  <Hello
                    id={tab.id}
                    url={ tabUrls && tabUrls[tab.id]? tabUrls[tab.id] :'https://www.google.com'}
                    onGoClick={(url) => handleGoClick(tab.id, url)}
                    addTab={addTab}
                    handleGoClick={handleGoClick}
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
/*                <MenuBar
                    id= {tab.id}
                    onGoClick={(url) => handleGoClick(tab.id, url)}
                    tabId={tab.id} // Pass tabId to MenuBar
                    addTab={addTab}
                  /> */
export default App;
