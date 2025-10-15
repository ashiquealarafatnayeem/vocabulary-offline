
import React, { useState, useMemo, useEffect } from 'react';
import { VocabularyWord, WordCategory } from '../types';
import WordCard from './WordCard';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from './icons';

interface LearnViewProps {
  vocabulary: VocabularyWord[];
  toggleCategory: (word: string, category: WordCategory) => void;
  isWordInCategory: (word: string, category: WordCategory) => boolean;
  isDevMode: boolean;
  onUpdateWord: (word: VocabularyWord) => void;
  isMemorizationMode: boolean;
}

const LearnView: React.FC<LearnViewProps> = ({ vocabulary, toggleCategory, isWordInCategory, isDevMode, onUpdateWord, isMemorizationMode }) => {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [range, setRange] = useState({ start: '', end: '' });
  const [currentPageLetter, setCurrentPageLetter] = useState('');

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

  useEffect(() => {
    if (alphabet.length > 0 && !currentPageLetter) {
      setCurrentPageLetter(alphabet[0]);
    } else if (alphabet.length === 0 && hasPhrasalVerbs && !currentPageLetter) {
      setCurrentPageLetter('PV'); // Special identifier for Phrasal Verbs
    }
  }, [alphabet, hasPhrasalVerbs, currentPageLetter]);

  const filteredVocabulary = useMemo(() => {
    let words = vocabulary;
    
    const isSearchActive = searchTerm.trim() !== '';
    if (isSearchActive) {
      const term = searchTerm.toLowerCase();
      return words.filter(v =>
        v.word.toLowerCase().includes(term) ||
        v.definition.toLowerCase().includes(term) ||
        v.example.toLowerCase().includes(term) ||
        (v.memoryTrick && v.memoryTrick.toLowerCase().includes(term))
      );
    }
    
    const isRangeActive = range.start.trim() !== '' || range.end.trim() !== '';
    if (isRangeActive) {
      const start = parseInt(range.start, 10);
      const end = parseInt(range.end, 10);
      return words.filter(v => {
        const wordNum = v.originalIndex + 1;
        const startOk = isNaN(start) || !range.start || wordNum >= start;
        const endOk = isNaN(end) || !range.end || wordNum <= end;
        return startOk && endOk;
      });
    }

    if (currentPageLetter) {
      if (currentPageLetter === 'PV') {
        return words.filter(v => v.partOfSpeech === 'phrasal verb');
      }
      return words.filter(v => v.word.charAt(0).toUpperCase() === currentPageLetter && v.partOfSpeech !== 'phrasal verb');
    }

    return words;
  }, [vocabulary, searchTerm, range, currentPageLetter]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRange(prev => ({ ...prev, [name]: value }));
    setCurrentPageLetter('');
    setSearchTerm('');
  };

  const handleLetterClick = (letter: string) => {
    setCurrentPageLetter(letter);
    setRange({ start: '', end: '' });
    setSearchTerm('');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRange({ start: '', end: '' });
    setCurrentPageLetter(alphabet.length > 0 ? alphabet[0] : (hasPhrasalVerbs ? 'PV' : ''));
  };
  
  const isRangeActive = range.start.trim() !== '' || range.end.trim() !== '';
  const isSearchActive = searchTerm.trim() !== '';
  let filterDescription;
  if(isSearchActive) {
      filterDescription = 'Showing Search Results';
  } else if (isRangeActive) {
      filterDescription = `Showing Words by Number`;
  } else if (currentPageLetter === 'PV') {
      filterDescription = `Showing Phrasal Verbs`;
  } else {
      filterDescription = `Showing Words for Letter: ${currentPageLetter}`;
  }


  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-[#214C63] text-center mb-8">Your Vocabulary List</h2>
      
      <div className="bg-white p-4 rounded-2xl shadow-lg mb-8 border border-slate-200">
        <button onClick={() => setFiltersVisible(!filtersVisible)} className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-slate-100">
          <h3 className="text-lg font-semibold text-[#214C63]">Search & View Options</h3>
          {filtersVisible ? <ChevronUpIcon className="h-6 w-6 text-slate-500" /> : <ChevronDownIcon className="h-6 w-6 text-slate-500" />}
        </button>

        {filtersVisible && (
          <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search entire list..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#627ECB] focus:border-[#627ECB] transition"
                  aria-label="Search vocabulary"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              </div>
              <div className="flex items-center justify-start md:justify-end">
                <button onClick={clearFilters} className="w-full md:w-auto py-3 px-4 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600 transition-transform transform hover:scale-105">
                  Reset View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold text-[#214C63] mb-4 text-center">
            {filterDescription}
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  aria-label={`Show words for letter ${letter}`}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                    currentPageLetter === letter && !isRangeActive && !isSearchActive ? 'bg-[#627ECB] text-white ring-2 ring-offset-1 ring-[#536ab3]' : 'bg-slate-200 hover:bg-slate-300 text-[#214C63]'
                  }`}
                >
                  {letter}
                </button>
              ))}
              {hasPhrasalVerbs && (
                <button
                  key="PV"
                  onClick={() => handleLetterClick('PV')}
                  aria-label="Show phrasal verbs"
                  className={`h-10 px-3 rounded-lg text-sm font-bold transition-all ${
                    currentPageLetter === 'PV' && !isRangeActive && !isSearchActive ? 'bg-[#627ECB] text-white ring-2 ring-offset-1 ring-[#536ab3]' : 'bg-slate-200 hover:bg-slate-300 text-[#214C63]'
                  }`}
                >
                  Phrasal Verbs
                </button>
              )}
           </div>
           
           <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-center text-slate-500 font-medium mb-2">Or Filter by Word Number (1 - {vocabulary.length})</h4>
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <input
                  type="number"
                  name="start"
                  placeholder="Start"
                  aria-label="Start range"
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
                  aria-label="End range"
                  value={range.end}
                  onChange={handleRangeChange}
                  className="w-24 p-2 border-2 border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-[#627ECB]"
                  min="1"
                  max={vocabulary.length}
                />
              </div>
            </div>
      </div>
      
      {filteredVocabulary.length === 0 ? (
        <p className="text-center text-slate-500 mt-10 font-semibold bg-white p-6 rounded-xl shadow">No vocabulary words match your selection.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredVocabulary.map((word, index) => (
            <div key={word.originalIndex} className="animate-stagger-in" style={{ animationDelay: `${index * 50}ms` }}>
                <WordCard 
                    word={word}
                    toggleCategory={toggleCategory}
                    isWordInCategory={isWordInCategory}
                    isDevMode={isDevMode}
                    onUpdateWord={onUpdateWord}
                    isMemorizationMode={isMemorizationMode}
                />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearnView;
