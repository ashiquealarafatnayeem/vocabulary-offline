

import React, { useState, useMemo, useEffect } from 'react';
import { VocabularyWord, PracticeMode, CategorizedWords, WordCategory } from '../types';
import { ClipboardListIcon, BookOpenIcon, StarIcon } from './icons';

interface PracticeSelectionViewProps {
  vocabulary: VocabularyWord[];
  categorizedWords: CategorizedWords;
  onStart: (mode: PracticeMode, words: VocabularyWord[], totalQuestions: number) => void;
}

const PracticeSelectionView: React.FC<PracticeSelectionViewProps> = ({ vocabulary, categorizedWords, onStart }) => {
  const [selectionType, setSelectionType] = useState<'letter' | 'range' | 'all' | 'saved'>('letter');
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [range, setRange] = useState({ start: '', end: '' });
  const [selectedWords, setSelectedWords] = useState<VocabularyWord[]>([]);
  const [numQuestions, setNumQuestions] = useState('');

  const { alphabet, hasPhrasalVerbs } = useMemo(() => {
    const letters = new Set<string>();
    let hasPhrasal = false;
    vocabulary.forEach(word => {
        if (word.partOfSpeech === 'phrasal verb') {
            hasPhrasal = true;
        } else {
            letters.add(word.word.charAt(0).toUpperCase());
        }
    });
    return {
        alphabet: Array.from(letters).sort(),
        hasPhrasalVerbs: hasPhrasal,
    };
  }, [vocabulary]);

  // Effect to update selected words based on filters
  useEffect(() => {
    let words: VocabularyWord[] = [];
    if (selectionType === 'all') {
      words = vocabulary;
    } else if (selectionType === 'saved') {
      const savedWordStrings = categorizedWords[WordCategory.SAVED] || [];
      words = vocabulary.filter(v => savedWordStrings.includes(v.word));
    } else if (selectionType === 'letter' && selectedLetters.length > 0) {
      const regularLetters = selectedLetters.filter(l => l !== 'PV');
      const selectPV = selectedLetters.includes('PV');
      
      words = vocabulary.filter(v => {
          if (selectPV && v.partOfSpeech === 'phrasal verb') {
              return true;
          }
          if (regularLetters.includes(v.word.charAt(0).toUpperCase()) && v.partOfSpeech !== 'phrasal verb') {
              return true;
          }
          return false;
      });
    } else if (selectionType === 'range') {
      const start = parseInt(range.start, 10);
      const end = parseInt(range.end, 10);
      if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= vocabulary.length && start <= end) {
        words = vocabulary.slice(start - 1, end);
      }
    }
    setSelectedWords(words);
  }, [selectedLetters, range, selectionType, vocabulary, categorizedWords]);

  // Effect to update question count when selected words change
  useEffect(() => {
    if (selectedWords.length > 0) {
      // Default to 10 or max available if less than 10
      setNumQuestions(Math.min(10, selectedWords.length).toString());
    } else {
      setNumQuestions('');
    }
  }, [selectedWords]);

  const handleLetterToggle = (letter: string) => {
    setSelectionType('letter');
    setRange({ start: '', end: '' }); // Clear range selection
    setSelectedLetters(prev => 
      prev.includes(letter) 
        ? prev.filter(l => l !== letter) 
        : [...prev, letter]
    );
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectionType('range');
    setSelectedLetters([]); // Clear letter selection
    setRange({ ...range, [e.target.name]: e.target.value });
  };

  const handleSelectAll = () => {
    setSelectionType('all');
    setSelectedLetters([]);
    setRange({ start: '', end: '' });
  };

  const handleSelectSaved = () => {
    setSelectionType('saved');
    setSelectedLetters([]);
    setRange({ start: '', end: '' });
  };
  
  const handleClearSelection = () => {
    setSelectionType('letter');
    setSelectedLetters([]);
    setRange({ start: '', end: '' });
  };
  
  const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (e.target.value === '') {
        setNumQuestions('');
    } else if (value >= 1 && value <= selectedWords.length) {
        setNumQuestions(e.target.value);
    }
  };

  const handleStartPractice = (mode: PracticeMode) => {
    const total = parseInt(numQuestions, 10);
    if (!total || total <= 0 || total > selectedWords.length) {
      alert(`Please enter a valid number of questions (1-${selectedWords.length}).`);
      return;
    }
    onStart(mode, selectedWords, total);
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-[#214C63]">Choose Your Words</h2>
        <p className="mt-2 text-[#214C63]/80 mb-6">Select words by letter, range, or choose a saved list.</p>

        {/* --- Step 1: Word Selection --- */}
        <div className="p-4 border-2 border-slate-200 rounded-xl">
          <h3 className="text-xl font-bold text-[#214C63] mb-4">Step 1: Select Words</h3>
          <div className="p-1 bg-slate-200 rounded-lg flex mb-4">
            <button onClick={() => setSelectionType('letter')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${selectionType === 'letter' ? 'bg-[#214C63] text-white' : 'text-[#214C63]'}`}>By Letter</button>
            <button onClick={() => setSelectionType('range')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${selectionType === 'range' ? 'bg-[#214C63] text-white' : 'text-[#214C63]'}`}>By Range</button>
          </div>

          {selectionType === 'letter' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-wrap gap-2 justify-center">
                {alphabet.map(letter => (
                  <button
                    key={letter}
                    onClick={() => handleLetterToggle(letter)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                      selectedLetters.includes(letter) ? 'bg-[#627ECB] text-white ring-2 ring-offset-1 ring-[#536ab3]' : 'bg-slate-200 hover:bg-slate-300 text-[#214C63]'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
                {hasPhrasalVerbs && (
                  <button
                    key="PV"
                    onClick={() => handleLetterToggle('PV')}
                    className={`h-10 px-3 rounded-lg text-sm font-bold transition-all ${
                      selectedLetters.includes('PV') ? 'bg-[#627ECB] text-white ring-2 ring-offset-1 ring-[#536ab3]' : 'bg-slate-200 hover:bg-slate-300 text-[#214C63]'
                    }`}
                  >
                    Phrasal Verbs
                  </button>
                )}
              </div>
            </div>
          )}

          {selectionType === 'range' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <input
                  type="number"
                  name="start"
                  placeholder="Start"
                  value={range.start}
                  onChange={handleRangeChange}
                  className="w-24 p-2 border-2 border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-[#627ECB]"
                  min="1"
                  max={vocabulary.length}
                />
                <span className="font-semibold text-slate-500">to</span>
                <input
                  type="number"
                  name="end"
                  placeholder="End"
                  value={range.end}
                  onChange={handleRangeChange}
                  className="w-24 p-2 border-2 border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-[#627ECB]"
                  min="1"
                  max={vocabulary.length}
                />
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
             <button onClick={handleSelectSaved} className="py-2 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                <StarIcon className="h-5 w-5"/>
                Practice Saved ({categorizedWords.SAVED?.length || 0})
            </button>
             <button onClick={handleSelectAll} className="py-2 px-4 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition">Select All ({vocabulary.length})</button>
             <button onClick={handleClearSelection} className="py-2 px-4 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600 transition">Clear Selection</button>
          </div>
        </div>

        {/* --- Step 2 & 3: Practice Options --- */}
        <div className={`mt-6 transition-opacity duration-500 ${selectedWords.length > 0 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <div className="p-4 border-2 border-slate-200 rounded-xl">
            <h3 className="text-xl font-bold text-[#214C63] mb-4">Step 2: How many questions?</h3>
            <div className="flex justify-center items-center gap-2">
                <input
                    type="number"
                    value={numQuestions}
                    onChange={handleNumQuestionsChange}
                    placeholder={`e.g., 10`}
                    min="1"
                    max={selectedWords.length}
                    aria-label="Number of questions"
                    disabled={selectedWords.length === 0}
                    className="w-32 p-2 border-2 border-slate-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-[#627ECB]"
                />
                <span className="text-slate-500 font-medium">out of {selectedWords.length} selected</span>
            </div>
          </div>

          <div className="mt-6 p-4 border-2 border-slate-200 rounded-xl">
            <h3 className="text-xl font-bold text-[#214C63] mb-1">Step 3: Choose Practice Mode</h3>
            <p className="text-slate-500 mb-4">{selectedWords.length > 0 ? `Ready to practice ${numQuestions} question(s)?` : "Select words to begin."}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => handleStartPractice(PracticeMode.FLASHCARD)} className="flex items-center justify-center gap-2 py-4 px-6 bg-[#627ECB] text-white font-bold rounded-lg hover:bg-[#536ab3] transition-transform transform hover:scale-105">
                <BookOpenIcon className="h-5 w-5"/> Flashcards
              </button>
              <button onClick={() => handleStartPractice(PracticeMode.MCQ)} className="flex items-center justify-center gap-2 py-4 px-6 bg-[#627ECB] text-white font-bold rounded-lg hover:bg-[#536ab3] transition-transform transform hover:scale-105">
                <ClipboardListIcon className="h-5 w-5"/> Multiple Choice
              </button>
              <button onClick={() => handleStartPractice(PracticeMode.SHORT_ANSWER_WORD_TO_DEF)} className="py-4 px-6 bg-[#214C63] text-white font-bold rounded-lg hover:bg-[#1a3c4f] transition-transform transform hover:scale-105">
                Word ➔ Definition
              </button>
              <button onClick={() => handleStartPractice(PracticeMode.SHORT_ANSWER_DEF_TO_WORD)} className="py-4 px-6 bg-[#214C63] text-white font-bold rounded-lg hover:bg-[#1a3c4f] transition-transform transform hover:scale-105">
                Definition ➔ Word
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeSelectionView;