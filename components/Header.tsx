import React from 'react';
import { HomeIcon, ArrowLeftIcon } from './icons';

interface HeaderProps {
  onHome?: () => void;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome, onBack }) => {
  if (!onHome && !onBack) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40 flex flex-col-reverse gap-3">
      {onHome && (
        <button onClick={onHome} className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-transform transform hover:scale-110" aria-label="Go to home">
          <HomeIcon className="h-6 w-6" />
        </button>
      )}
      {onBack && (
        <button onClick={onBack} className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-transform transform hover:scale-110" aria-label="Go back">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Header;