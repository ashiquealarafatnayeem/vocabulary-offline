
import React from 'react';
import { SparklesIcon } from './icons';

interface LevelUpModalProps {
  newLevel: number;
  onContinue: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto bg-[#627ECB] rounded-full h-16 w-16 flex items-center justify-center animate-bounce">
          <SparklesIcon className="text-white"/>
        </div>
        <h2 className="text-3xl font-extrabold text-[#214C63] mt-6">Level Up!</h2>
        <p className="text-[#214C63]/80 mt-2 text-lg">Congratulations!</p>
        <p className="text-[#214C63]/80">You've reached <span className="font-bold text-[#627ECB]">Level {newLevel}</span>.</p>
        <button
          onClick={onContinue}
          className="mt-8 w-full bg-[#627ECB] hover:bg-[#536ab3] text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
          Keep Learning
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;