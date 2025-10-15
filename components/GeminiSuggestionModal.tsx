import React, { useState, useEffect, useCallback } from 'react';
import { VocabularyWord } from '../types';
import { getWordSuggestion } from '../services/geminiService';
import { XCircleIcon, SparklesIcon, LightBulbIcon, Volume2Icon, StarIcon } from './icons';

interface GeminiSuggestionModalProps {
  onClose: () => void;
  onSave: (word: Omit<VocabularyWord, 'originalIndex'>) => void;
}

const GeminiSuggestionModal: React.FC<GeminiSuggestionModalProps> = ({ onClose, onSave }) => {
  const [suggestedWord, setSuggestedWord] = useState<Omit<VocabularyWord, 'originalIndex'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWord = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuggestedWord(null);
    try {
      const newWord = await getWordSuggestion();
      setSuggestedWord(newWord);
    } catch (err) {
      setError('Sorry, we could not get a suggestion right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWord();
  }, [fetchWord]);

  const handlePronounceWord = (wordText: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-4 min-h-[250px] flex flex-col justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#627ECB] mx-auto"></div>
          <p className="mt-3 text-[#214C63]/80">Getting a fresh word from Gemini...</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg min-h-[250px] flex items-center justify-center">{error}</p>;
    }
    if (suggestedWord) {
      return (
        <div className="p-1">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-3xl font-bold text-[#214C63]">{suggestedWord.word}</h3>
            <button
              onClick={() => handlePronounceWord(suggestedWord.word)}
              className="p-1 text-slate-400 hover:bg-slate-100 hover:text-[#214C63] rounded-full transition-colors"
              aria-label={`Pronounce ${suggestedWord.word}`}
            >
              <Volume2Icon className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm font-semibold text-[#214C63]/90 italic mb-3">{suggestedWord.partOfSpeech}</p>
          <p className="text-[#214C63]/90 mb-4">{suggestedWord.definition}</p>
          <div className="bg-[#D0E3AB]/30 p-3 rounded-lg mb-4">
              <p className="text-[#214C63]/90 text-sm italic">"{suggestedWord.example}"</p>
          </div>
          {suggestedWord.memoryTrick && (
            <div className="mt-4 flex items-start gap-2 text-sm text-[#214C63]/80">
              <LightBulbIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#627ECB]" />
              <p className="italic">{suggestedWord.memoryTrick}</p>
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

        <h2 className="text-2xl font-extrabold text-[#214C63] mb-4">Gemini Word Suggestion</h2>
        
        <div className="min-h-[250px] border-t border-b border-slate-200 py-4 my-4">
          {renderContent()}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => suggestedWord && onSave(suggestedWord)}
            disabled={isLoading || !suggestedWord}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#627ECB] text-white font-bold rounded-lg hover:bg-[#536ab3] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <StarIcon className="h-5 w-5" /> Save Word
          </button>
          <button
            onClick={fetchWord}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#71D0C5] text-white font-bold rounded-lg hover:bg-[#61b9af] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SparklesIcon className="h-5 w-5" /> Get Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiSuggestionModal;