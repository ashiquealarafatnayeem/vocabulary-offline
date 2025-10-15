import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { SearchIcon } from './icons';

interface TextSelectionPopperProps {
  rect: DOMRect;
  text: string;
  onDefine: (text: string) => void;
  onClose: () => void;
}

const TextSelectionPopper: React.FC<TextSelectionPopperProps> = ({ rect, text, onDefine, onClose }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (rect && popperRef.current) {
        const popperElement = popperRef.current;
        const popperRect = popperElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // --- Vertical Positioning ---
        let newTop = rect.bottom + window.scrollY + 8; // Default: 8px below selection

        // If it overflows the bottom of the viewport, place it above the selection
        if (rect.bottom + popperRect.height + 8 > viewportHeight) {
            newTop = rect.top + window.scrollY - popperRect.height - 8; // 8px above selection
        }

        // Failsafe: If placing it above makes it go off the top of the screen, revert to below
        if (newTop < window.scrollY) {
            newTop = rect.bottom + window.scrollY + 8;
        }
        
        // --- Horizontal Positioning ---
        let newLeft = rect.left + window.scrollX + rect.width / 2; // Center on selection

        const halfPopperWidth = popperRect.width / 2;
        const padding = 8; // 8px padding from screen edges

        // Check for left overflow and adjust
        if (newLeft - halfPopperWidth < padding) {
            newLeft = halfPopperWidth + padding;
        }

        // Check for right overflow and adjust
        if (newLeft + halfPopperWidth > viewportWidth - padding) {
            newLeft = viewportWidth - halfPopperWidth - padding;
        }

        setPosition({
            top: newTop,
            left: newLeft,
        });
    }
  }, [rect]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popperRef.current && !popperRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 0);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleDefineClick = () => {
    onDefine(text);
  };
  
  return (
    <div
      ref={popperRef}
      id="text-selection-popper"
      className="absolute z-50 transform -translate-x-1/2"
      style={{ top: position.top, left: position.left }}
    >
      <div className="bg-slate-800 text-white rounded-lg shadow-xl flex items-center animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleDefineClick}
          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <SearchIcon className="h-4 w-4" />
          <span className="text-sm font-semibold">Define</span>
        </button>
      </div>
    </div>
  );
};

export default TextSelectionPopper;