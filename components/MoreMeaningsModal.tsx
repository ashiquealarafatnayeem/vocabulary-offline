
import React, { useState, useEffect } from 'react';
import { VocabularyWord, AlternateMeaning } from '../types';
import { getMoreMeanings } from '../services/geminiService';
import { XCircleIcon } from './icons';

interface MoreMeaningsModalProps {
  word: VocabularyWord;
  onClose: () => void;
}

const MoreMeaningsModal: React.FC<MoreMeaningsModalProps> = ({ word, onClose }) => {
  const [meanings, setMeanings] = useState<AlternateMeaning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeanings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const newMeanings = await getMoreMeanings(word.word);
        setMeanings(newMeanings);
      } catch (err) {
        setError('Sorry, we could not fetch more meanings right now.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeanings();
  }, [word]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full transform transition-all scale-100 animate-in zoom-in-95 duration-300 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
          <XCircleIcon className="h-7 w-7" />
        </button>

        <h2 className="text-3xl font-extrabold text-[#214C63] mb-2">More Meanings for <span className="text-[#627ECB]">{word.word}</span></h2>
        <p className="text-slate-500 mb-6">Original: "{word.definition}"</p>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading && (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#627ECB] mx-auto"></div>
              <p className="mt-3 text-[#214C63]/80">Generating meanings with Gemini...</p>
            </div>
          )}
          {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
          {!isLoading && !error && (
            meanings.length > 0 ? (
                meanings.map((meaning, index) => (
                    <div key={index} className="border-b border-slate-200 pb-3 last:border-b-0">
                        <p className="text-[#214C63] font-semibold italic">{meaning.partOfSpeech}</p>
                        <p className="text-[#214C63]/90">{meaning.definition}</p>
                    </div>
                ))
            ) : (
                <p className="text-center text-slate-600 bg-slate-100 p-3 rounded-lg">No alternative meanings were found.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MoreMeaningsModal;