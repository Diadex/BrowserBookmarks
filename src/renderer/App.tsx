
import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import MenuBar from './MenuBar';
import icon from '../../assets/icon.svg';
import { BrowserWindow } from 'electron';
import refreshIcon from './refresh.svg'; // Path to your SVG file
import arrowBack from './arrow-back.svg'; // Path to your SVG file
import arrowForward from './arrow-forward.svg'; // Path to your SVG file
import bookmark from './bookmark.svg'; // Path to your SVG file
import home from './home.svg'; // Path to your SVG file
import cancel from './cancel.svg'; // Path to your SVG file
import addIcon from './add-icon.svg'; // Path to your SVG file

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

  let mainWindow: BrowserWindow | null = null;
  const navigate = useNavigate();
  // const [isBookmarkOpen, setIsBookmarkOpen] = useState(false);
 

  // const handleBookmarkClick = () => {
  //   setIsBookmarkOpen((prev) => !prev);
  // };


  // const [additionalDivs, setAdditionalDivs] = useState([]);

  // const handleAddButtonClick = () => {
  //   setAdditionalDivs((prevDivs) => [...prevDivs, <div key={prevDivs.length}>TAB </div>]);
  // };
  // const handleCancelClick = (index: any) => {
  //   setAdditionalDivs((prevDivs) => prevDivs.filter((div, i) => i !== index));
  // };
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>   


      <MenuBar onGoClick={handleGoClick} />
      <div className="Web">
        <iframe
          title="web"
          src={urlText}
          width={iframeWidth}
          height={iframeHeight}
          allowFullScreen
        ></iframe>
      </div>


        {/* <div >
          <button style={{ width: 25, height: 25, padding: 0, fontSize: 18, fontWeight: "bold", marginLeft: 10 }}
            onClick={handleBookmarkClick}>

            <img src={bookmark} style={{ width: '100%', height: '100%' }} />
          </button>


        </div> */}


      </div>
      {/* {isBookmarkOpen && (
        <div style={{
          position: 'fixed',
          top: '0%',
          left: '80%',
          width: '20%',
          height: '200vh',
          background: 'white',
          zIndex: 1,
        }}>
          <button style={{ width: 25, height: 25, padding: 0, fontSize: 18, marginLeft: 10, }}
            onClick={handleAddButtonClick}>

            <img src={addIcon} style={{ width: '100%', height: '100%' }} />

          </button>

          {additionalDivs.map((div, index) => (
            <div style={{ backgroundColor: 'grey', marginBottom: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} key={index}>

              {div}
              <button style={{ width: 25, height: 25, padding: 0, fontSize: 18, marginLeft: 10, }}
                onClick={() => handleCancelClick(index)}>
                <img src={cancel} style={{ width: '100%', height: '100%' }} />

              </button>
            </div>
          ))}

        </div>
      )} */}
     
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
