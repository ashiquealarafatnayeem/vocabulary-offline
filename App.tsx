

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { GameState, VocabularyWord, PracticeMode } from './types';
import { parseVocabulary } from './services/geminiService';

import Loader from './components/Loader';
import Header from './components/Header';
import { useCategorizedWords } from './hooks/useCategorizedWords';
import { useExperience } from './hooks/useExperience';
import { BookOpenIcon, CogIcon, EyeOffIcon } from './components/icons';

// Lazy load views to split them into separate chunks
const DashboardView = lazy(() => import('./components/DashboardView'));
const LearnView = lazy(() => import('./components/LearnView'));
const PracticeSelectionView = lazy(() => import('./components/PracticeSelectionView'));
const PracticeArea = lazy(() => import('./components/PracticeArea'));
const PracticeCompleteView = lazy(() => import('./components/PracticeCompleteView'));
const ReviewView = lazy(() => import('./components/ReviewView'));
const LevelUpModal = lazy(() => import('./LevelUpModal'));


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [practiceSettings, setPracticeSettings] = useState<{
    mode: PracticeMode;
    words: VocabularyWord[];
    totalQuestions: number;
  } | null>(null);
  const [lastScore, setLastScore] = useState<{ correct: number, incorrect: number }>({ correct: 0, incorrect: 0 });
  const [isDevMode, setIsDevMode] = useState(false);
  const [isMemorizationMode, setIsMemorizationMode] = useState(false);
  

  const { categorizedWords, toggleCategory, isWordInCategory } = useCategorizedWords();
  const { xp, level, addXp, progressToNextLevel, xpPerLevel, showLevelUp, justLeveledUpTo, closeLevelUpModal } = useExperience();

  useEffect(() => {
    const loadVocabulary = async () => {
      try {
        const words = await parseVocabulary();
        setVocabulary(words);
        setGameState(GameState.READY);
      } catch (error) {
        console.error("Failed to load vocabulary:", error);
      }
    };
    loadVocabulary();
  }, []);

  const handleStartPractice = (mode: PracticeMode, words: VocabularyWord[], totalQuestions: number) => {
    setPracticeSettings({ mode, words, totalQuestions });
    setGameState(GameState.PRACTICING);
  };
  
  const handlePracticeComplete = (score: { correct: number, incorrect: number }) => {
      const xpGained = score.correct * 10;
      addXp(xpGained);
      setLastScore(score);
      setGameState(GameState.PRACTICE_COMPLETE);
  };
  
  const handleUpdateWord = (updatedWord: VocabularyWord) => {
    setVocabulary(prev =>
      prev.map(word =>
        word.originalIndex === updatedWord.originalIndex ? updatedWord : word
      )
    );
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.LOADING:
        return <Loader message="Preparing your vocabulary list..." />;
      case GameState.READY:
        return (
          <>
            <header className="w-full max-w-4xl mx-auto p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-md mb-8">
              <div className="flex items-center gap-3">
                <BookOpenIcon className="text-[#627ECB] h-7 w-7"/>
                <h1 className="text-xl md:text-2xl font-bold text-[#214C63]">My Vocabulary</h1>
              </div>
            </header>
            <DashboardView 
              level={level}
              xp={xp}
              progressToNextLevel={progressToNextLevel}
              xpPerLevel={xpPerLevel}
              totalWords={vocabulary.length}
              categorizedWords={categorizedWords}
              onNavigateToLearn={() => setGameState(GameState.LEARNING)}
              onNavigateToPractice={() => setGameState(GameState.PRACTICE_SELECTION)}
              onNavigateToReview={() => setGameState(GameState.REVIEWING)}
            />
          </>
        );
      case GameState.LEARNING:
        return (
          <LearnView 
            vocabulary={vocabulary}
            toggleCategory={toggleCategory}
            isWordInCategory={isWordInCategory}
            isDevMode={isDevMode}
            onUpdateWord={handleUpdateWord}
            isMemorizationMode={isMemorizationMode}
          />
        );
      case GameState.PRACTICE_SELECTION:
        return (
          <PracticeSelectionView 
            vocabulary={vocabulary} 
            categorizedWords={categorizedWords}
            onStart={handleStartPractice} 
          />
        );
      case GameState.PRACTICING:
        if (!practiceSettings) return null;
        return (
            <PracticeArea
                mode={practiceSettings.mode}
                vocabulary={vocabulary}
                practiceWords={practiceSettings.words}
                totalQuestions={practiceSettings.totalQuestions}
                onComplete={handlePracticeComplete}
            />
        );
      case GameState.PRACTICE_COMPLETE:
        return (
          <PracticeCompleteView 
              score={lastScore}
              totalQuestions={practiceSettings?.totalQuestions ?? 0}
              onRestart={() => setGameState(GameState.PRACTICE_SELECTION)}
              onHome={() => setGameState(GameState.READY)}
          />
        );
      case GameState.REVIEWING:
          return (
            <ReviewView 
              vocabulary={vocabulary}
              categorizedWords={categorizedWords}
              toggleCategory={toggleCategory}
              isWordInCategory={isWordInCategory}
              isDevMode={isDevMode}
              onUpdateWord={handleUpdateWord}
              onNavigateToLearn={() => setGameState(GameState.LEARNING)}
              isMemorizationMode={isMemorizationMode}
            />
          );
      default:
        return <div>Unknown game state</div>;
    }
  };
  
  const isDashboard = gameState === GameState.READY || gameState === GameState.LOADING;
  
  const getNavActions = () => {
    switch(gameState) {
      case GameState.LEARNING:
      case GameState.REVIEWING:
      case GameState.PRACTICE_COMPLETE:
        return { onHome: () => setGameState(GameState.READY) };
      case GameState.PRACTICE_SELECTION:
        return { onHome: () => setGameState(GameState.READY), onBack: () => setGameState(GameState.READY) };
      case GameState.PRACTICING:
        return { onHome: () => setGameState(GameState.READY), onBack: () => setGameState(GameState.PRACTICE_SELECTION) };
      default:
        return { onHome: undefined, onBack: undefined };
    }
  }

  return (
    <div className="relative bg-gradient-to-br from-sky-100 to-teal-100 min-h-screen">
      <div
        className={`absolute inset-0 bg-sky-50 transition-opacity duration-500 ease-in-out ${
          isDashboard ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-hidden="true"
      />
      
      <Header {...getNavActions()} />

      <main className="relative text-slate-800 font-sans p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<Loader message="Loading..." />}>
            <div key={gameState} className="animate-fade-in">
              {renderContent()}
            </div>
            {showLevelUp && justLeveledUpTo && (
              <LevelUpModal newLevel={justLeveledUpTo} onContinue={closeLevelUpModal} />
            )}
          </Suspense>
        </div>
      </main>
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center gap-3">
        {(gameState === GameState.LEARNING || gameState === GameState.REVIEWING) && (
            <button
                onClick={() => setIsMemorizationMode(!isMemorizationMode)}
                className={`group p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                    isMemorizationMode
                    ? 'bg-[#627ECB] text-white'
                    : 'text-slate-600 hover:bg-white'
                }`}
                title="Toggle Memorization Mode"
                aria-label="Toggle Memorization Mode"
                aria-pressed={isMemorizationMode}
            >
                <EyeOffIcon className="h-6 w-6" />
            </button>
        )}
        <button
            onClick={() => setIsDevMode(!isDevMode)}
            className={`group p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg transition-colors duration-300 transform hover:scale-110 ${
            isDevMode 
                ? 'bg-blue-600 text-white animate-pulse' 
                : 'text-slate-600 hover:bg-white'
            }`}
            title="Toggle Developer Mode"
            aria-label="Toggle Developer Mode"
        >
            <CogIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
        </button>
      </div>
    </div>
  );
};

export default App;