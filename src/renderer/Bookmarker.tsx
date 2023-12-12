import React, { useState } from 'react';

interface BookmarkerProps {
  handleSaveAsArticleClick: () => void;
}

const Bookmarker = ({handleSaveAsArticleClick}: BookmarkerProps) => {
  const [colorA, setColorA] = useState('white');
  const [colorB, setColorB] = useState('white');
  const [colorC, setColorC] = useState('white');
  const [colorD, setColorD] = useState('white');
  const [colorE, setColorE] = useState('white');

  const handleClickA = () => {
    setColorA(colorA === 'white' ? 'blue' : 'white');
  };

  const handleClickB = () => {
    setColorB(colorB === 'white' ? 'blue' : 'white');
  };

  const handleClickC = () => {
    setColorC(colorC === 'white' ? 'blue' : 'white');
  };

  const handleClickD = () => {
    setColorD(colorD === 'white' ? 'blue' : 'white');
  }

  const handleClickE = () => {
    setColorE(colorE === 'white' ? 'blue' : 'white');
  }

  return (
    <div style={{ background: 'white', display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '10px', borderRadius: '5px' }}>
      <h1 style={{color:'black'}}>Bookmarker 4.0</h1>
      <button style={{ backgroundColor: colorA }} onClick={handleSaveAsArticleClick}>
        Save as an Article
      </button>
      <button style={{ backgroundColor: colorB }} onClick={handleClickB}>
        Screenshot
      </button>
      <button style={{ backgroundColor: colorC }} onClick={handleClickC}>
        Save Link
      </button>
      <button style={{ backgroundColor: colorD }} onClick={handleClickD}>
        Save as PDF
      </button>
      <hr />
      <button style={{ backgroundColor: colorE }} onClick={handleClickE}>
        Open Bookmarks
      </button>
    </div>
  );
};

export default Bookmarker;
