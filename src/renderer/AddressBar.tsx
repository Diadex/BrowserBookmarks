import { useState } from 'react';
import { ReactComponent as GoButton } from '../../assets/icons/go.svg';

interface AddressBarProps {
  onGoClick: (url: string) => void;
}

function AddressBar({ onGoClick }: AddressBarProps) {
  const [inputValue, setInputValue] = useState('');

  const handleGoClick = () => {
    onGoClick(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onGoClick(inputValue);
      setInputValue('')
    }
  };

  return (
    <div className="AddressBar">
      <input
        type="text"
        placeholder="Enter URL"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress} // Add this line to handle key press
      />
      <button onClick={handleGoClick}>
        <GoButton width="20" height="20" />
      </button>
    </div>
  );
}

export default AddressBar;
