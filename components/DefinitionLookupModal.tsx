import React, { useState, useEffect } from 'react';
import { SimpleDefinition } from '../types';
import { getWordDefinition, generateImageForWord } from '../services/geminiService';
import { XCircleIcon } from './icons';

interface DefinitionLookupModalProps {
  word: string;
  onClose: () => void;
}

const DefinitionLookupModal: React.FC<DefinitionLookupModalProps> = ({ word, onClose }) => {
  const [definitionResult, setDefinitionResult] = useState<SimpleDefinition | null>(null);
  const [isDefinitionLoading, setIsDefinitionLoading] = useState(true);
  const [definitionError, setDefinitionError] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsDefinitionLoading(true);
      setIsImageLoading(true);
      setDefinitionError(null);
      setImageUrl(null);

      try {
        const definition = await getWordDefinition(word);
        setDefinitionResult(definition);
        setIsDefinitionLoading(false);

        try {
          const imageBytes = await generateImageForWord(definition.word, definition.definition);
          setImageUrl(`data:image/jpeg;base64,${imageBytes}`);
        } catch (imgError) {
          console.error('Image generation failed:', imgError);
        } finally {
          setIsImageLoading(false);
        }
      } catch (defError) {
        setDefinitionError(`Sorry, we could not find a definition for "${word}".`);
        setIsDefinitionLoading(false);
        setIsImageLoading(false);
      }
    };

    fetchAllData();
  }, [word]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full transform transition-all relative animate-slide-in-from-bottom">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10">
          <XCircleIcon className="h-7 w-7" />
        </button>
        
        <h2 className="text-3xl font-extrabold text-[#214C63] mb-4">Definition</h2>

        <div className="min-h-[250px] flex flex-col justify-center">
          {isImageLoading && (
            <div className="w-full aspect-square bg-slate-200 rounded-lg animate-pulse mb-4"></div>
          )}
          {!isImageLoading && imageUrl && (
            <img src={imageUrl} alt={`Illustration for ${word}`} className="w-full aspect-square object-cover rounded-lg mb-4 shadow-md animate-in fade-in" />
          )}

          {isDefinitionLoading && !definitionResult && (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#627ECB] mx-auto"></div>
              <p className="mt-3 text-[#214C63]/80">Looking up "{word}"...</p>
            </div>
          )}
          {definitionError && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{definitionError}</p>}
          {definitionResult && (
            <div className="space-y-3">
                <div className="flex items-baseline gap-3">
                    <h3 className="text-2xl font-bold text-[#627ECB]">{definitionResult.word}</h3>
                    <p className="text-md font-semibold text-[#214C63]/80 italic">{definitionResult.partOfSpeech}</p>
                </div>
                <p className="text-lg text-[#214C63]/90">{definitionResult.definition}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefinitionLookupModal;