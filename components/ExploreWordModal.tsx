import React, { useState, useEffect } from 'react';
import { VocabularyWord, ExploredWordInfo } from '../types';
import { exploreWord } from '../services/geminiService';
import { XCircleIcon, CogIcon } from './icons';

interface ExploreWordModalProps {
  word: VocabularyWord;
  onClose: () => void;
}

const ExploreWordModal: React.FC<ExploreWordModalProps> = ({ word, onClose }) => {
  const [exploredInfo, setExploredInfo] = useState<ExploredWordInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const newInfo = await exploreWord(word);
        setExploredInfo(newInfo);
      } catch (err) {
        setError('Sorry, we could not get more details for this word right now.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfo();
  }, [word]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#627ECB] mx-auto"></div>
          <p className="mt-3 text-[#214C63]/80">Exploring "{word.word}" with Gemini...</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>;
    }
    if (exploredInfo) {
      return (
        <div className="space-y-6">
          {/* Alternate Meanings */}
          {exploredInfo.alternateMeanings.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-[#214C63] mb-2">Alternate Meanings</h3>
              <div className="space-y-3">
                {exploredInfo.alternateMeanings.map((meaning, index) => (
                  <div key={index} className="border-b border-slate-200 pb-2 last:border-b-0">
                    <p className="text-[#214C63] font-semibold italic">{meaning.partOfSpeech}</p>
                    <p className="text-[#214C63]/90">{meaning.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Relatable Sentences */}
          {exploredInfo.relatableSentences.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-[#214C63] mb-2">Relatable Sentences</h3>
              <ul className="list-disc list-inside space-y-2 text-[#214C63]/90">
                {exploredInfo.relatableSentences.map((ex, index) => (
                  <li key={index}>"{ex}"</li>
                ))}
              </ul>
            </div>
          )}

          {/* Engineering Sentence */}
          {exploredInfo.engineeringSentence && (
            <div>
              <h3 className="text-lg font-bold text-[#214C63] mb-2">Engineering Context</h3>
              <div className="flex items-start gap-3 bg-[#D0E3AB]/30 p-3 rounded-lg">
                 <CogIcon className="h-6 w-6 flex-shrink-0 mt-0.5 text-[#627ECB]" />
                 <p className="text-[#214C63]/90 italic">"{exploredInfo.engineeringSentence}"</p>
              </div>
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

        <h2 className="text-3xl font-extrabold text-[#214C63] mb-2">Explore: <span className="text-[#627ECB]">{word.word}</span></h2>
        <p className="text-slate-500 mb-6">"{word.definition}"</p>

        <div className="min-h-[200px] max-h-[60vh] overflow-y-auto pr-2">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};
export default ExploreWordModal;