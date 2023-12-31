import { on } from 'events';
import React, { useState } from 'react';

interface BookmarkerProps {
  handleSaveAsArticleClick: () => void;
  onToggleEncryptionClick: () => void;
  onSaveURLClick: () => void;
  onOpenBookmarksClick: () => void;
  addTab: (value: number) => void;
}

const Bookmarker = ({
  handleSaveAsArticleClick,
  onToggleEncryptionClick,
  onSaveURLClick,
  onOpenBookmarksClick,
  addTab,
}: BookmarkerProps) => {
  const [colorA, setColorA] = useState('white');
  const [colorC, setColorC] = useState('white');
  const [colorE, setColorE] = useState('white');
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [isBookmarkerOpen, setIsBookmarkerOpen] = useState('Open Bookmarks');
  const [isDisabled, setIsDisabled] = useState(false);

  const toggleText = () => {
    setIsBookmarkerOpen(isBookmarkerOpen === 'Open Bookmarks' ? 'Close Bookmarks' : 'Open Bookmarks');
  }

  const handleOpenBokmarksClick = () => {
    toggleText();
    onOpenBookmarksClick();
    setIsDisabled(!isDisabled);

  }

  const handleClickC = () => {
    setColorC(colorC === 'white' ? 'blue' : 'white');
  };

  const handleClickE = () => {
    setColorE(colorE === 'white' ? 'blue' : 'white');
    // add tab'dan ekle
    addTab(1)
  };

  return (
    <div
      style={{
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid black',
        padding: '10px',
        borderRadius: '5px',
      }}
    >
      <h1 style={{ color: 'black' }}>Bookmarker 4.0</h1>
      <button
        style={{ backgroundColor: colorA }}
        onClick={handleSaveAsArticleClick}
        disabled={isDisabled}
      >
        Save as an Article
      </button>
      <button style={{ backgroundColor: colorC }} onClick={onSaveURLClick}
        disabled={isDisabled}
      >
        Save Link
      </button>
      <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <span style={{ marginRight: '10px' }}>Encryption</span>
        <label className="switch">
          <input type="checkbox" onChange={onToggleEncryptionClick} />
          <span
            className="slider round"
            style={{ width: isEncryptionEnabled ? 'blue' : 'gray' }}
          ></span>
        </label>
        <span style={{ marginLeft: '10px', color: 'black' }}>
          Toggle Encryption
        </span>
      </div>
      <hr />
      <button
        style={{ backgroundColor: colorE }}
        onClick={handleOpenBokmarksClick}
      >
        {isBookmarkerOpen}
      </button>
    </div>
  );
};

export default Bookmarker;
