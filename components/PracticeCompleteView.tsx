
import React from 'react';
import { HomeIcon, SparklesIcon, StarIcon } from './icons';

interface PracticeCompleteViewProps {
  score: { correct: number; incorrect: number };
  totalQuestions: number;
  onRestart: () => void;
  onHome: () => void;
}

const PracticeCompleteView: React.FC<PracticeCompleteViewProps> = ({ score, totalQuestions, onRestart, onHome }) => {
    const percentage = totalQuestions > 0 ? Math.round((score.correct / totalQuestions) * 100) : 0;
    
    let message = "Good effort! Keep practicing.";
    if (percentage > 90) {
        message = "Excellent work! You're a vocabulary master!";
    } else if (percentage > 70) {
        message = "Great job! You're making fantastic progress.";
    }

    return (
        <div className="w-full max-w-lg mx-auto text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all animate-in fade-in zoom-in-95 duration-300">
                <div className="mx-auto bg-[#627ECB] rounded-full h-16 w-16 flex items-center justify-center">
                  <StarIcon className="h-8 w-8 text-white"/>
                </div>
                <h2 className="text-3xl font-extrabold text-[#214C63] mt-6">Session Complete!</h2>
                <p className="text-[#214C63]/80 mt-2 text-lg">{message}</p>
                
                <div className="mt-8 bg-slate-100 p-6 rounded-xl">
                    <p className="text-[#214C63] text-sm font-semibold">YOUR SCORE</p>
                    <p className="text-6xl font-bold text-[#214C63] my-2">
                        {score.correct} <span className="text-3xl font-medium text-slate-500">/ {totalQuestions}</span>
                    </p>
                    <p className="text-2xl font-semibold text-[#627ECB]">{percentage}%</p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button onClick={onRestart} className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#627ECB] text-white font-bold rounded-lg hover:bg-[#536ab3] transition-transform transform hover:scale-105">
                        <SparklesIcon/> Practice Again
                    </button>
                    <button onClick={onHome} className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#71D0C5] text-white font-bold rounded-lg hover:bg-[#61b9af] transition-transform transform hover:scale-105">
                        <HomeIcon/> Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PracticeCompleteView;