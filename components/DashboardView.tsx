
// FIX: Implement the DashboardView component.
import React from 'react';
import { BookOpenIcon, StarIcon, ClipboardListIcon, MedalIcon } from './icons';
import ProgressBar from './ProgressBar';
import { CategorizedWords } from '../types';

interface DashboardViewProps {
  level: number;
  xp: number;
  progressToNextLevel: number;
  xpPerLevel: number;
  totalWords: number;
  categorizedWords: CategorizedWords;
  onNavigateToLearn: () => void;
  onNavigateToPractice: () => void;
  onNavigateToReview: () => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string }> = ({ icon, title, value, color }) => (
  <div className={`p-4 rounded-xl shadow-md flex items-center gap-4 transition-transform transform hover:scale-105 ${color}`}>
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-[#214C63]">{value}</p>
    </div>
  </div>
);

const DashboardView: React.FC<DashboardViewProps> = (props) => {
  const {
    level,
    xp,
    progressToNextLevel,
    xpPerLevel,
    totalWords,
    categorizedWords,
    onNavigateToLearn,
    onNavigateToPractice,
    onNavigateToReview,
  } = props;

  const totalCategorized = categorizedWords.SAVED?.length || 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-[#214C63] text-center mb-8">Welcome Back!</h2>
      
      {/* --- User Stats --- */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8 border border-slate-200">
        <h3 className="text-xl font-bold text-[#214C63] mb-4">Your Progress</h3>
        <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
                <span className="font-bold text-[#627ECB] text-lg">Level {level}</span>
                <span className="text-sm font-medium text-slate-500">{progressToNextLevel.toLocaleString()} / {xpPerLevel.toLocaleString()} XP</span>
            </div>
            <ProgressBar value={progressToNextLevel} max={xpPerLevel} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <StatCard icon={<BookOpenIcon className="h-8 w-8 text-green-600"/>} title="Total Words" value={totalWords} color="bg-green-100" />
            <StatCard icon={<StarIcon className="h-8 w-8 text-indigo-600"/>} title="Words Saved" value={totalCategorized} color="bg-indigo-100" />
            <StatCard icon={<MedalIcon className="h-8 w-8 text-blue-600"/>} title="Total XP" value={xp.toLocaleString()} color="bg-blue-100" />
        </div>
      </div>

      {/* --- Main Actions --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={onNavigateToLearn} className="group p-6 bg-blue-500 rounded-2xl shadow-lg text-center hover:bg-blue-600 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center transform hover:scale-105">
            <BookOpenIcon className="h-10 w-10 text-white transition-colors"/>
            <h3 className="text-xl font-bold text-white mt-4 transition-colors">Learn Words</h3>
        </button>
        <button onClick={onNavigateToPractice} className="group p-6 bg-teal-500 rounded-2xl shadow-lg text-center hover:bg-teal-600 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center transform hover:scale-105">
            <ClipboardListIcon className="h-10 w-10 text-white transition-colors"/>
            <h3 className="text-xl font-bold text-white mt-4 transition-colors">Practice</h3>
        </button>
        <button onClick={onNavigateToReview} className="group p-6 bg-indigo-500 rounded-2xl shadow-lg text-center hover:bg-indigo-600 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center transform hover:scale-105">
            <StarIcon className="h-10 w-10 text-white transition-colors"/>
            <h3 className="text-xl font-bold text-white mt-4 transition-colors">Review Saved</h3>
        </button>
      </div>
    </div>
  );
};

export default DashboardView;
