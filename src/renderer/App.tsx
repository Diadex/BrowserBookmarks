import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import MenuBar from './MenuBar';

function Hello() {
  const [webviewWidth, setWebviewWidth] = useState(window.innerWidth);
  const [webviewHeight, setWebviewHeight] = useState(window.innerHeight);
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);

  const handleResize = () => {
    setWebviewWidth(window.innerWidth);
    setWebviewHeight(window.innerHeight - 40);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGoClick = (url: string) => {
    const webview = document.querySelector('webview') as Electron.WebviewTag;
    webview.loadURL(url);
  };

  const handleSaveAsArticleClick = async () => {
    await getSaveAsArticleClick();
  };

  const toggleEncryption = () => {
    setIsEncryptionEnabled(!isEncryptionEnabled);
  }

  const handleSaveURLClick = async () =>{
    const webview = document.querySelector('webview') as Electron.WebviewTag;
    const args = {
      encryption: isEncryptionEnabled,
      url: webview.getURL(),
    }
    window.electron.ipcRenderer
      .invoke('save-url', args)
      .then((result) => {
        console.log(result);
      });
  }

  async function getSaveAsArticleClick(): Promise<void> {
    const webview = document.querySelector('webview') as Electron.WebviewTag;
    const args = {
      encryption: isEncryptionEnabled,
      url: webview.getURL(),
    }
    window.electron.ipcRenderer
      .invoke('save-readable', args)
      .then((result) => {
        console.log(result);
      });
  }

  return (
    <div>
      <div
        style={{
          width: '100%',
          paddingLeft: 0,
          marginLeft: -10,
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <MenuBar
          onGoClick={handleGoClick}
          onSaveAsArticleClick={handleSaveAsArticleClick}
          onToggleEncryptionClick={toggleEncryption}
          onSaveURLClick={handleSaveURLClick}
        />
        <div className="Web">
          <webview
            id="foo"
            src="https://www.google.com/"
            style={{
              display: 'inline-flex',
              width: webviewWidth,
              height: webviewHeight,
              margin: 0
            }}
          ></webview>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
