
import React, { useState, useEffect } from 'react';
import { VocabularyWord, WordCategory } from '../types';
import { LightBulbIcon, Volume2Icon, HeartIcon, BookmarkIcon, AngryIcon, BlessedIcon } from './icons';

interface CategoryButtonsProps {
  word: VocabularyWord;
  isWordInCategory: (word: string, category: WordCategory) => boolean;
  toggleCategory: (word: string, category: WordCategory) => void;
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({ word, isWordInCategory, toggleCategory }) => {
  const categories = [
    { type: WordCategory.FAVOURITE, Icon: HeartIcon, label: 'Favourite', activeClass: 'text-red-500 bg-red-100', hoverClass: 'hover:bg-red-200' },
    { type: WordCategory.IMPORTANT, Icon: BookmarkIcon, label: 'Important', activeClass: 'text-blue-500 bg-blue-100', hoverClass: 'hover:bg-blue-200' },
    { type: WordCategory.HARD, Icon: AngryIcon, label: 'Hard', activeClass: 'text-orange-500 bg-orange-100', hoverClass: 'hover:bg-orange-200' },
    { type: WordCategory.EASY, Icon: BlessedIcon, label: 'Easy', activeClass: 'text-green-500 bg-green-100', hoverClass: 'hover:bg-green-200' },
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
      <span className="text-sm font-semibold text-slate-500 mr-2 hidden sm:inline">Categorize:</span>
      {categories.map(({ type, Icon, label, activeClass, hoverClass }) => {
        const isActive = isWordInCategory(word.word, type);
        return (
          <button
            key={type}
            onClick={() => toggleCategory(word.word, type)}
            aria-label={`Mark as ${label}`}
            title={`Mark as ${label}`}
            className={`p-2 rounded-full transition-colors ${isActive ? activeClass : `text-slate-400 hover:bg-slate-200 ${hoverClass}`}`}
          >
            <Icon className="h-5 w-5" fill={isActive && type === WordCategory.FAVOURITE ? 'currentColor' : 'none'} />
          </button>
        );
      })}
    </div>
  );
};


interface WordCardProps {
  word: VocabularyWord;
  isWordInCategory: (word: string, category: WordCategory) => boolean;
  toggleCategory: (word: string, category: WordCategory) => void;
  isDevMode: boolean;
  onUpdateWord: (word: VocabularyWord) => void;
  isMemorizationMode: boolean;
}

const WordCard: React.FC<WordCardProps> = ({ word, isWordInCategory, toggleCategory, isDevMode, onUpdateWord, isMemorizationMode }) => {
  const [editableWord, setEditableWord] = useState(word);
  const [isRevealed, setIsRevealed] = useState(!isMemorizationMode);

  useEffect(() => {
    setEditableWord(word);
  }, [word]);
  
  useEffect(() => {
    // Reset reveal state when the mode changes or the word itself changes
    setIsRevealed(!isMemorizationMode);
  }, [isMemorizationMode, word]);

  const handleReveal = () => {
    if (isMemorizationMode && !isRevealed) {
      setIsRevealed(true);
    }
  };

  const handleContentChange = (field: keyof VocabularyWord, value: string) => {
    setEditableWord(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdateWord(editableWord);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && e.currentTarget.tagName === 'INPUT') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };
  
  const handlePronounceWord = (wordText: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  const devInputStyle = "w-full bg-transparent focus:bg-blue-50 focus:ring-2 focus:ring-blue-400 rounded-md p-1 -m-1 focus:outline-none transition";

  return (
    <div 
      onClick={handleReveal}
      className={`bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border border-slate-200 hover:shadow-xl hover:border-[#627ECB] transition-all duration-300 hover:-translate-y-1 ${isMemorizationMode && !isRevealed ? 'cursor-pointer' : ''}`}
    >
      <div>
        <div className="flex items-start justify-between mb-1">
          {isDevMode ? (
            <input 
              value={editableWord.word}
              onChange={(e) => handleContentChange('word', e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className={`${devInputStyle} text-2xl font-bold text-[#214C63] mr-2`}
            />
          ) : (
            <h3 className="text-2xl font-bold text-[#214C63] mr-2">{word.word}</h3>
          )}
          <span className="flex-shrink-0 font-mono text-sm font-bold text-[#214C63] bg-slate-100 py-0.5 px-2 rounded-md">
            #{word.originalIndex + 1}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isDevMode ? (
            <input 
              value={editableWord.partOfSpeech}
              onChange={(e) => handleContentChange('partOfSpeech', e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className={`${devInputStyle} text-sm font-semibold text-[#214C63]/90 italic`}
            />
          ) : (
            <p className="text-sm font-semibold text-[#214C63]/90 italic">{word.partOfSpeech}</p>
          )}
          <button
            onClick={(e) => {
                e.stopPropagation(); // Prevent card reveal when clicking pronounce
                handlePronounceWord(editableWord.word);
            }}
            className="p-1 text-slate-400 hover:bg-slate-100 hover:text-[#214C63] rounded-full transition-colors"
            aria-label={`Pronounce ${editableWord.word}`}
          >
            <Volume2Icon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {isRevealed ? (
        <div className="animate-fade-in">
            <div className="mt-3">
                {isDevMode ? (
                <textarea
                    value={editableWord.definition}
                    onChange={(e) => handleContentChange('definition', e.target.value)}
                    onBlur={handleSave}
                    className={`${devInputStyle} text-[#214C63]/90 mb-4 h-auto resize-none`}
                    rows={2}
                />
                ) : (
                <p className="text-[#214C63]/90 mb-4">{word.definition}</p>
                )}
                <div className="bg-[#D0E3AB]/30 p-3 rounded-lg mb-4">
                {isDevMode ? (
                    <textarea
                    value={editableWord.example}
                    onChange={(e) => handleContentChange('example', e.target.value)}
                    onBlur={handleSave}
                    className={`${devInputStyle} text-[#214C63]/90 text-sm italic bg-transparent focus:bg-sky-50`}
                    rows={2}
                    />
                ) : (
                    <p className="text-[#214C63]/90 text-sm italic">"{word.example}"</p>
                )}
                </div>
                {word.memoryTrick && (
                <div className="mt-4 flex items-start gap-2 text-sm text-[#214C63]/80">
                    <LightBulbIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#627ECB]" />
                    {isDevMode ? (
                    <textarea
                        value={editableWord.memoryTrick}
                        onChange={(e) => handleContentChange('memoryTrick', e.target.value)}
                        onBlur={handleSave}
                        className={`${devInputStyle} italic`}
                        rows={2}
                    />
                    ) : (
                    <p className="italic">{word.memoryTrick}</p>
                    )}
                </div>
                )}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row justify-start items-center gap-4 pt-4 border-t border-slate-200">
                <CategoryButtons word={word} isWordInCategory={isWordInCategory} toggleCategory={toggleCategory} />
            </div>
        </div>
      ) : (
        <div className="mt-4 text-center py-8 text-slate-500 font-semibold italic border-t border-dashed">
            Click to reveal details...
        </div>
      )}
    </div>
  );
};

export default WordCard;
