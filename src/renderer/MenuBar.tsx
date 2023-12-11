// MenuBar.tsx
import AddressBar from './AddressBar';

interface MenuBarProps {
  onGoClick: (url: string) => void;
}

function MenuBar({ onGoClick }: MenuBarProps) {
  return (
    <div className="MenuBar">
      <div className="NavigationButtons">
        <button>Home</button>
        <button>Back</button>
      </div>
      <AddressBar onGoClick={onGoClick} />
    </div>
  );
}

export default MenuBar;
