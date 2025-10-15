import React, { useState, useEffect, useCallback } from 'react';
import { VocabularyWord, WordCategory } from '../types';
import { getDictionaryEntry } from '../services/geminiService';
import { XCircleIcon, StarIcon, LightBulbIcon, Volume2Icon, ArrowLeftIcon } from './icons';

interface DictionarySearchModalProps {
  wordToSearch: string;
  vocabulary: VocabularyWord[];
  isWordInCategory: (word: string, category: WordCategory) => boolean;
  onClose: () => void;
  onSave: (word: Omit<VocabularyWord, 'originalIndex'>) => void;
}

const ClickableText: React.FC<{ text: string; onWordClick: (word: string) => void }> = ({ text, onWordClick }) => {
    // Splits by spaces and newlines, keeping them in the array
    const segments = text.split(/(\s+)/);

    return (
        <>
            {segments.map((segment, index) => {
                if (/\s+/.test(segment) || segment === '') {
                    return <React.Fragment key={index}>{segment}</React.Fragment>;
                }
                
                const cleanWord = segment.replace(/[.,!?;:()"']/g, '');
                
                // Don't make very short words (e.g. 'a', 'is') or numbers clickable
                if (cleanWord.length <= 2 || !isNaN(Number(cleanWord))) {
                     return <React.Fragment key={index}>{segment}</React.Fragment>;
                }

                return (
                    <span
                        key={index}
                        onClick={() => onWordClick(cleanWord)}
                        className="cursor-pointer hover:bg-sky-100 p-0.5 -m-0.5 rounded transition-colors"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onWordClick(cleanWord); }}
                    >
                        {segment}
                    </span>
                );
            })}
        </>
    );
};

const DictionarySearchModal: React.FC<DictionarySearchModalProps> = ({
  wordToSearch,
  vocabulary,
  isWordInCategory,
  onClose,
  onSave,
}) => {
  const [wordData, setWordData] = useState<Omit<VocabularyWord, 'originalIndex'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchHistory, setSearchHistory] = useState<string[]>([wordToSearch]);
  const currentWord = searchHistory[searchHistory.length - 1];
  
  const isSaved = wordData ? isWordInCategory(wordData.word, WordCategory.SAVED) : false;

  const fetchWordData = useCallback(async (wordToFetch: string) => {
    setIsLoading(true);
    setError(null);
    setWordData(null);

    const foundInList = vocabulary.find(v => v.word.toLowerCase() === wordToFetch.toLowerCase());

    if (foundInList) {
      setWordData(foundInList);
      setIsLoading(false);
    } else {
      try {
        const newWord = await getDictionaryEntry(wordToFetch);
        setWordData(newWord);
      } catch (err) {
        setError(`Sorry, we could not find a dictionary entry for "${wordToFetch}".`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [vocabulary]);

  useEffect(() => {
    if (currentWord) {
      fetchWordData(currentWord);
    }
  }, [currentWord, fetchWordData]);

  const handlePronounceWord = (wordText: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };
  
  const handleSaveClick = () => {
      if(wordData && !isSaved) {
          onSave(wordData);
      }
  };

  const handleWordClick = (newWord: string) => {
    if (newWord.toLowerCase() !== currentWord.toLowerCase()) {
      setSearchHistory(prev => [...prev, newWord]);
    }
  };

  const handleGoBack = () => {
    if (searchHistory.length > 1) {
      setSearchHistory(prev => prev.slice(0, -1));
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-4 min-h-[250px] flex flex-col justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#627ECB] mx-auto"></div>
          <p className="mt-3 text-[#214C63]/80">Looking up "{currentWord}"...</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg min-h-[250px] flex items-center justify-center">{error}</p>;
    }
    if (wordData) {
      return (
        <div className="p-1">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-3xl font-bold text-[#214C63]">{wordData.word}</h3>
            <button
              onClick={() => handlePronounceWord(wordData.word)}
              className="p-1 text-slate-400 hover:bg-slate-100 hover:text-[#214C63] rounded-full transition-colors"
              aria-label={`Pronounce ${wordData.word}`}
            >
              <Volume2Icon className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm font-semibold text-[#214C63]/90 italic mb-3">{wordData.partOfSpeech}</p>
          <p className="text-[#214C63]/90 mb-4 leading-relaxed">
            <ClickableText text={wordData.definition} onWordClick={handleWordClick} />
          </p>
          <div className="bg-[#D0E3AB]/30 p-3 rounded-lg mb-4">
              <p className="text-[#214C63]/90 text-sm italic">
                "<ClickableText text={wordData.example} onWordClick={handleWordClick} />"
              </p>
          </div>
          {wordData.memoryTrick && (
            <div className="mt-4 flex items-start gap-2 text-sm text-[#214C63]/80">
              <LightBulbIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#627ECB]" />
              <p className="italic">
                <ClickableText text={wordData.memoryTrick} onWordClick={handleWordClick} />
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full transform transition-all relative animate-slide-in-from-bottom">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
          <XCircleIcon className="h-7 w-7" />
        </button>

        <div className="flex items-center gap-3 mb-4">
            {searchHistory.length > 1 && (
                <button 
                    onClick={handleGoBack} 
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    aria-label="Go back to previous word"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
            )}
            <h2 className="text-2xl font-extrabold text-[#214C63]">Dictionary Result</h2>
        </div>
        
        <div className="min-h-[250px] border-t border-b border-slate-200 py-4 my-4 max-h-[60vh] overflow-y-auto pr-2">
          {renderContent()}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSaveClick}
            disabled={isLoading || !wordData || isSaved}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#627ECB] text-white font-bold rounded-lg hover:bg-[#536ab3] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <StarIcon className="h-5 w-5" /> {isSaved ? 'Saved' : 'Save Word'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DictionarySearchModal;