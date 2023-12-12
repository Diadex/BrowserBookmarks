import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import MenuBar from './MenuBar';
import * as fs from 'fs';
import { Readability } from '@mozilla/readability';

function Hello() {
  const [urlText, setUrlText] = useState('https://www.bing.com');
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
    setUrlText(url);
  };

  const handleSaveAsArticleClick = async () => {
    await fetchHTML();
  };

  async function fetchHTML(): Promise<void> {
    const iframe = document.getElementById(
      'web-loader',
    ) as HTMLIFrameElement | null;
    if (iframe) {
      const address = iframe.src;
      console.log(address);
      window.electron.ipcRenderer
        .invoke('process-readable', address)
        .then((result) => {
          console.log(result);
        });
    }
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
        <MenuBar onGoClick={handleGoClick} onSaveAsArticleClick={handleSaveAsArticleClick} />
        <div className="Web">
          <iframe
            id="web-loader"
            src={urlText}
            width={iframeWidth}
            height={iframeHeight}
            allowFullScreen
          ></iframe>
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
