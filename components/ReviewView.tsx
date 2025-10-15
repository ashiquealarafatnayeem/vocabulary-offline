
import React, { useState, useMemo, useEffect } from 'react';
import { VocabularyWord, WordCategory, CategorizedWords } from '../types';
import WordCard from './WordCard';
import { HeartIcon, BookmarkIcon, AngryIcon, BlessedIcon, StarIcon, BookOpenIcon } from './icons';

interface ReviewViewProps {
  vocabulary: VocabularyWord[];
  categorizedWords: CategorizedWords;
  toggleCategory: (word: string, category: WordCategory) => void;
  isWordInCategory: (word: string, category: WordCategory) => boolean;
  isDevMode: boolean;
  onUpdateWord: (word: VocabularyWord) => void;
  onNavigateToLearn: () => void;
  isMemorizationMode: boolean;
}

const TABS = [
  { id: WordCategory.FAVOURITE, label: 'Favourite', Icon: HeartIcon, colors: { bg: 'bg-red-100', text: 'text-red-600', ring: 'ring-red-500', badgeBg: 'bg-red-500' } },
  { id: WordCategory.IMPORTANT, label: 'Important', Icon: BookmarkIcon, colors: { bg: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-500', badgeBg: 'bg-blue-500' } },
  { id: WordCategory.HARD, label: 'Hard', Icon: AngryIcon, colors: { bg: 'bg-orange-100', text: 'text-orange-600', ring: 'ring-orange-500', badgeBg: 'bg-orange-500' } },
  { id: WordCategory.EASY, label: 'Easy', Icon: BlessedIcon, colors: { bg: 'bg-green-100', text: 'text-green-600', ring: 'ring-green-500', badgeBg: 'bg-green-500' } },
  { id: WordCategory.SAVED, label: 'Saved', Icon: StarIcon, colors: { bg: 'bg-indigo-100', text: 'text-indigo-600', ring: 'ring-indigo-500', badgeBg: 'bg-indigo-500' } },
];

const ReviewView: React.FC<ReviewViewProps> = ({ vocabulary, categorizedWords, toggleCategory, isWordInCategory, isDevMode, onUpdateWord, onNavigateToLearn, isMemorizationMode }) => {
  const [activeTab, setActiveTab] = useState<WordCategory>(() => {
    // Set initial tab to the first category that has words, or default to FAVOURITE
    return TABS.find(tab => categorizedWords[tab.id]?.length > 0)?.id || WordCategory.FAVOURITE;
  });

  const wordsForCurrentTab = useMemo(() => {
    const wordStrings = categorizedWords[activeTab] || [];
    return vocabulary
        .filter(v => wordStrings.includes(v.word))
        .sort((a, b) => a.originalIndex - b.originalIndex); // Keep original order
  }, [activeTab, categorizedWords, vocabulary]);
  
  const ActiveTabIcon = TABS.find(t => t.id === activeTab)?.Icon || StarIcon;
  const activeTabInfo = TABS.find(t => t.id === activeTab);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-[#214C63]">Review Your Lists</h2>
        <p className="mt-2 text-lg text-[#214C63]/80">Select a category to review the words you've saved.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* --- Left Column: Category selectors --- */}
        <aside className="md:col-span-1">
          <h3 className="text-lg font-semibold text-[#214C63] mb-4 px-2">Categories</h3>
          <div className="flex flex-col gap-2">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const wordCount = categorizedWords[tab.id]?.length || 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg text-left w-full transition-all duration-200 transform ${
                    isActive
                      ? `${tab.colors.bg} ${tab.colors.text} font-bold shadow-md ring-2 ${tab.colors.ring}`
                      : 'text-slate-600 hover:bg-slate-100 hover:shadow-sm'
                  }`}
                >
                  <tab.Icon className="h-6 w-6 flex-shrink-0" />
                  <span className="flex-grow">{tab.label}</span>
                  <span
                    className={`ml-auto text-sm font-bold px-2 py-0.5 rounded-full ${
                      isActive ? `${tab.colors.badgeBg} text-white` : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {wordCount}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
        
        {/* --- Right Column: Word Cards --- */}
        <main className="md:col-span-3">
            <div key={activeTab} className="animate-fade-in">
              {wordsForCurrentTab.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {wordsForCurrentTab.map((word, index) => (
                    <div key={word.originalIndex} className="animate-stagger-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <WordCard
                          word={word}
                          isWordInCategory={isWordInCategory}
                          toggleCategory={toggleCategory}
                          isDevMode={isDevMode}
                          onUpdateWord={onUpdateWord}
                          isMemorizationMode={isMemorizationMode}
                        />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200 min-h-[400px]">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${activeTabInfo?.colors.bg || 'bg-slate-100'}`}>
                     <ActiveTabIcon className={`h-10 w-10 ${activeTabInfo?.colors.text || 'text-slate-400'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#214C63] mb-2">No "{activeTabInfo?.label}" Words Yet</h3>
                  <p className="text-slate-500 mb-6 max-w-sm">Words you mark as "{activeTabInfo?.label.toLowerCase()}" in the main list will appear here for you to review.</p>
                  <button 
                    onClick={onNavigateToLearn}
                    className="flex items-center justify-center gap-2 py-3 px-6 bg-[#627ECB] text-white font-bold rounded-lg hover:bg-[#536ab3] transition-transform transform hover:scale-105"
                  >
                    <BookOpenIcon className="h-5 w-5"/>
                    Start Learning
                  </button>
                </div>
              )}
            </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewView;
