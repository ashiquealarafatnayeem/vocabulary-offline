
// Fix: Implement the MoreExamplesModal component. This file was empty.
import React, { useState, useEffect } from 'react';
import { VocabularyWord } from '../types';
import { getMoreExamples } from '../services/geminiService';
import { XCircleIcon } from './icons';

interface MoreExamplesModalProps {
  word: VocabularyWord;
  onClose: () => void;
}

const MoreExamplesModal: React.FC<MoreExamplesModalProps> = ({ word, onClose }) => {
  const [examples, setExamples] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamples = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const newExamples = await getMoreExamples(word.word, word.definition);
        setExamples(newExamples);
      } catch (err) {
        setError('Sorry, we could not fetch more examples right now.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamples();
  }, [word]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full transform transition-all scale-100 animate-in zoom-in-95 duration-300 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
          <XCircleIcon className="h-7 w-7" />
        </button>

        <h2 className="text-3xl font-extrabold text-[#214C63] mb-2">More Examples for <span className="text-[#627ECB]">{word.word}</span></h2>
        <p className="text-slate-500 mb-6">"{word.definition}"</p>

        <div className="space-y-4 min-h-[100px] flex flex-col justify-center">
          {isLoading && (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#627ECB] mx-auto"></div>
              <p className="mt-3 text-[#214C63]/80">Generating examples with Gemini...</p>
            </div>
          )}
          {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
          {!isLoading && !error && (
            <ul className="list-disc list-inside space-y-3 text-[#214C63]/90">
              {examples.map((ex, index) => (
                <li key={index}>"{ex}"</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoreExamplesModal;