
import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
      <div
        className="bg-[#71D0C5] h-4 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;