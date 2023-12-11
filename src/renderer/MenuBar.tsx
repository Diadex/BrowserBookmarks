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
  onGoClick: (url: string) => void;
}

function MenuBar({ onGoClick }: MenuBarProps) {
  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false);
  const [refreshIconSrc, setRefreshIconSrc] = useState(refreshIcon);
  const [centeredText, setCenteredText] = useState('');
  const [isBookmarkerOpen, setIsBookmarkerOpen] = useState(false);

  const handleHomeClick = () => {
    const allTextContent = document.body.innerText; // Get all text content inside the body
    setCenteredText(allTextContent);
  };
  const handleBookmarkClick = () => {
    setIsBookmarkOpen((prev) => !prev);
    setIsBookmarkerOpen((prev) => !prev);
  };
  const handleRefreshClick = () => {
    console.log('Refreshing...');

    window.location.reload();
    setRefreshIconSrc(cancel);
  };

  const [additionalDivs, setAdditionalDivs] = useState<JSX.Element[]>([]);

  const handleAddButtonClick = () => {
    setAdditionalDivs((prevDivs) => [
      ...prevDivs,
      <div key={prevDivs.length}>TAB </div>,
    ]);
  };
  const handleCancelClick = (index: any) => {
    setAdditionalDivs((prevDivs) => prevDivs.filter((_, i) => i !== index));
  };

  return (
    <div className="MenuBar">
      <div style={{ display: 'flex', alignItems: 'left' }}>
        <button
          style={{
            width: 25,
            height: 25,
            padding: 0,
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          <img src={arrowBack} style={{ width: '100%', height: '100%' }} />
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

        <button
          style={{
            width: 25,
            height: 25,
            padding: 0,
            fontSize: 18,
            marginLeft: 10,
          }}
          onClick={handleHomeClick}
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
          <Bookmarker />
        </div>
      )}

      <AddressBar onGoClick={onGoClick} />
    </div>
  );
}

export default MenuBar;
