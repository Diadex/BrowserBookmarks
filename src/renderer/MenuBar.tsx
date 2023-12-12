// MenuBar.tsx
import AddressBar from './AddressBar';
import refreshIcon from '../../assets/icons/refresh.svg'; // Path to your SVG file
import arrowBack from '../../assets/icons/arrow-back.svg'; // Path to your SVG file
import arrowForward from '../../assets/icons/arrow-forward.svg'; // Path to your SVG file
import bookmark from '../../assets/icons/bookmark.svg'; // Path to your SVG file
import home from '../../assets/icons/home.svg'; // Path to your SVG file
import cancel from '../../assets/icons/cancel.svg'; // Path to your SVG file
import { useState } from 'react';
import addIcon from '../../assets/icons/add-icon.svg'; // Path to your SVG file
import Bookmarker from './Bookmarker';

interface MenuBarProps {
  id: string
  onGoClick: (url: string) => void;
  addTab: (value: number) => void;
  tabId: string;
}

function MenuBar({id, onGoClick, addTab, tabId }: MenuBarProps) {
  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false);
  const [refreshIconSrc, setRefreshIconSrc] = useState(refreshIcon);
  const [centeredText, setCenteredText] = useState('');
  const [isBookmarkerOpen, setIsBookmarkerOpen] = useState(false);
  const [additionalDivs, setAdditionalDivs] = useState([]);

  const handleBookmarkClick = () => {
    // Customize behavior based on the tabId
    console.log(`Bookmark clicked for tab with ID: ${tabId}`);
    setIsBookmarkOpen((prev) => !prev);
    setIsBookmarkerOpen((prev) => !prev);
  };

  const handleAddButtonClick = () => {
    // Customize behavior based on the tabId
    console.log(`Add button clicked for tab with ID: ${tabId}`);
    setAdditionalDivs((prevDivs) => [
      ...prevDivs,
      <div key={prevDivs.length}>TAB </div>,
    ]);
  };

  const handleCancelClick = (index: number) => {
    // Customize behavior based on the tabId
    console.log(`Cancel button clicked for tab with ID: ${tabId}`);
    setAdditionalDivs((prevDivs) => prevDivs.filter((_, i) => i !== index));
  };

  const goHome = () => {
    window.location.reload();
  };

  const handleGoBackClick = () => {
    window.history.back();
  };

  const handleGoForwardClick = () => {
    window.history.forward();
  };

  const handleRefreshClick = () => {
    const iframe = document.getElementById(id) as HTMLIFrameElement | null; // Replace with your actual iframe ID
    if (iframe) {
      console.log('Refreshing...');
      iframe.src = iframe.src; // This will reload the iframe content
    }
    else console.log('cant refresh');
    console.log("iframe ", iframe);
  };

  return (
    <div className="MenuBar">
      <div style={{ display: 'flex', alignItems: 'left' }}>
        <button style={{ width: 25, height: 25, padding: 0, fontSize: 18, fontWeight: "bold" }}
          onClick={handleGoBackClick}
        >
          <img src={arrowBack} style={{ width: '100%', height: '100%' }} />
        </button>

        <button style={{ width: 25, height: 25, padding: 0, fontSize: 18, fontWeight: "bold", marginLeft: 10 }}
          onClick={handleGoForwardClick}
        >
          <img src={arrowForward} style={{ width: '100%', height: '100%' }} />
        </button>

        <button
          style={{
            width: 25,
            height: 25,
            padding: 0,
            fontSize: 18,
            marginLeft: 10,
          }}
          onClick={handleRefreshClick}
        >
          <img
            src={refreshIconSrc}
            alt="Refresh Icon"
            style={{ width: '100%', height: '100%' }}
          />
        </button>

        <button style={{ width: 25, height: 25, padding: 0, fontSize: 18, marginLeft: 10, }}
          onClick={goHome}
        >
          <img src={home} style={{ width: '100%', height: '100%' }} />
        </button>

        <button
          style={{
            width: 25,
            height: 25,
            padding: 0,
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft: 10,
          }}
          onClick={handleBookmarkClick}
        >
          <img src={bookmark} style={{ width: '100%', height: '100%' }} />
        </button>
      </div>

      {/* {isBookmarkOpen && (
        <div
          style={{
            position: 'fixed',
            top: '0%',
            left: '80%',
            width: '20%',
            height: '200vh',
            background: 'white',
            zIndex: 1,
          }}
        >
          <button
            style={{
              width: 25,
              height: 25,
              padding: 0,
              fontSize: 18,
              marginLeft: 10,
            }}
            onClick={handleAddButtonClick}
          >
            <img src={addIcon} style={{ width: '100%', height: '100%' }} />
          </button>

          {additionalDivs.map((div, index) => (
            <div
              style={{
                backgroundColor: 'grey',
                marginBottom: 5,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              key={index}
            >
              {div}
              <button
                style={{
                  width: 25,
                  height: 25,
                  padding: 0,
                  fontSize: 18,
                  marginLeft: 10,
                }}
                onClick={() => handleCancelClick(index)}
              >
                <img src={cancel} style={{ width: '100%', height: '100%' }} />
              </button>
            </div>
          ))}
        </div>
      )} */}

      {isBookmarkerOpen && (
        <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 9999 }}>
          <Bookmarker addTab={addTab} />
        </div>
      )}

      <AddressBar onGoClick={onGoClick} />
    </div>
  );
}

export default MenuBar;
