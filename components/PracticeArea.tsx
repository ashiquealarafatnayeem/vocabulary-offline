import React, { useState, useMemo, useEffect } from 'react';
import { VocabularyWord, PracticeMode } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';
import ProgressBar from './ProgressBar';

// --- Helper to shuffle array ---
// FIX: Corrected generic type parameter syntax from <T> to <T,> to fix JSX parsing ambiguity.
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// --- Flashcard Component ---
interface FlashcardProps {
  word: VocabularyWord;
  onAnswer: (correct: boolean) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, onAnswer }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => setIsFlipped(!isFlipped);
  const handleChoice = (correct: boolean) => {
    onAnswer(correct);
    setIsFlipped(false); // Reset for next card
  };

  return (
    <div className="w-full max-w-lg mx-auto">
        <div className="perspective" onClick={handleFlip}>
            <div className={`relative preserve-3d w-full h-64 rounded-xl shadow-lg transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div className="absolute backface-hidden w-full h-full bg-white p-6 flex flex-col items-center justify-center rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500">Word</p>
                    <h3 className="text-4xl font-bold text-center text-[#214C63]">{word.word}</h3>
                    <p className="mt-4 text-slate-500">Click to flip</p>
                </div>
                <div className="absolute rotate-y-180 backface-hidden w-full h-full bg-slate-50 p-6 flex flex-col justify-center rounded-xl">
                    <p className="font-semibold text-[#214C63]">{word.partOfSpeech}</p>
                    <p className="text-lg text-[#214C63]/90 mb-2">{word.definition}</p>
                    <p className="text-slate-500 italic">e.g. "{word.example}"</p>
                </div>
            </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
            <button onClick={() => handleChoice(false)} className="py-3 px-4 bg-slate-500 text-white font-bold rounded-lg hover:bg-slate-600 transition-transform transform hover:scale-105">Need to Review</button>
            <button onClick={() => handleChoice(true)} className="py-3 px-4 bg-[#627ECB] text-white font-bold rounded-lg hover:bg-[#536ab3] transition-transform transform hover:scale-105">I Knew It!</button>
        </div>
    </div>
  );
};

// --- MultipleChoice Component ---
interface MCQProps {
  question: string;
  options: string[];
  correctAnswer: string;
  onNext: (correct: boolean) => void;
}

const MultipleChoice: React.FC<MCQProps> = ({ question, options, correctAnswer, onNext }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [shuffledOptions] = useState(() => shuffleArray(options));

    const handleAnswer = (option: string) => {
        if (selected) return;
        setSelected(option);
        const correct = option === correctAnswer;
        setIsCorrect(correct);
        setTimeout(() => {
            onNext(correct);
            setSelected(null);
            setIsCorrect(null);
        }, 1200);
    }
    
    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <p className="text-sm text-slate-500 mb-2">Question</p>
                <h3 className="text-2xl font-semibold text-[#214C63] text-center">{question}</h3>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3">
                {shuffledOptions.map((opt, i) => {
                    const isSelected = selected === opt;
                    const isTheCorrectAnswer = opt === correctAnswer;
                    let buttonClass = 'bg-white hover:bg-slate-100 border-slate-200';
                    if(selected) {
                        if (isTheCorrectAnswer) {
                            buttonClass = 'bg-green-100 border-green-400 animate-pulse';
                        } else if (isSelected) {
                            buttonClass = 'bg-red-100 border-red-400';
                        }
                    }
                    return (
                        <button key={i} onClick={() => handleAnswer(opt)} disabled={!!selected} className={`w-full p-4 rounded-lg text-left transition-all duration-200 border-2 ${buttonClass}`}>
                            {opt}
                        </button>
                    );
                })}
            </div>
            {selected && (<div className="mt-6 text-center h-8 flex items-center justify-center">{isCorrect ? <CheckCircleIcon className="text-green-500 h-8 w-8" /> : <XCircleIcon className="text-red-500 h-8 w-8" />}</div>)}
        </div>
    );
}

// --- ShortAnswer Component ---
interface ShortAnswerProps {
  question: string;
  correctAnswer: string;
  prompt: string;
  onNext: (correct: boolean) => void;
}

const ShortAnswer: React.FC<ShortAnswerProps> = ({ question, correctAnswer, prompt, onNext }) => {
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback) return; // Don't submit twice
        const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        setFeedback(isCorrect ? 'correct' : 'incorrect');
    };

    const handleNext = () => {
        onNext(feedback === 'correct');
        setAnswer('');
        setFeedback(null);
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <p className="text-sm text-slate-500 mb-2">{prompt}</p>
                <h3 className="text-2xl font-semibold text-[#214C63] text-center">{question}</h3>
            </div>
            <form onSubmit={handleSubmit} className="mt-6">
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    disabled={!!feedback}
                    className="w-full p-4 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#627ECB] transition"
                    aria-label="Your answer"
                />
                {!feedback && <button type="submit" className="mt-3 w-full py-3 px-4 bg-[#627ECB] text-white font-bold rounded-lg hover:bg-[#536ab3]">Check Answer</button>}
            </form>
            {feedback && (
                <div className={`mt-4 p-4 rounded-lg text-center animate-in fade-in duration-300 ${feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback === 'correct' ? (
                        <p className="font-bold text-lg">Correct!</p>
                    ) : (
                        <div>
                            <p className="font-bold">Not quite. The correct answer is:</p>
                            <p className="font-semibold text-lg mt-1">{correctAnswer}</p>
                        </div>
                    )}
                    <button onClick={handleNext} className="mt-3 py-2 px-6 bg-[#214C63] text-white font-bold rounded-lg hover:bg-[#1a3c4f]">Next</button>
                </div>
            )}
        </div>
    )
}


// --- Main PracticeArea Component ---
interface PracticeAreaProps {
  mode: PracticeMode;
  vocabulary: VocabularyWord[];
  practiceWords: VocabularyWord[];
  totalQuestions: number;
  onComplete: (score: { correct: number, incorrect: number }) => void;
}

const PracticeArea: React.FC<PracticeAreaProps> = (props) => {
  const { mode, vocabulary, practiceWords, totalQuestions, onComplete } = props;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  const practiceSet = useMemo(() => {
    return shuffleArray(practiceWords).slice(0, totalQuestions);
  }, [practiceWords, totalQuestions]);

  useEffect(() => {
      setCurrentIndex(0);
      setScore({ correct: 0, incorrect: 0 });
  }, [practiceWords, mode, totalQuestions]);
  
  const handleAnswer = (correct: boolean) => {
      const newScore = {
          correct: score.correct + (correct ? 1 : 0),
          incorrect: score.incorrect + (!correct ? 1 : 0),
      };

      if (currentIndex + 1 >= practiceSet.length) {
          onComplete(newScore);
      } else {
          setScore(newScore);
          setCurrentIndex(prev => prev + 1);
      }
  };

  const currentWord = practiceSet[currentIndex];

  if (practiceSet.length === 0) {
      return (
        <div>
            <p className="text-center text-red-500 mt-8">No words available for this practice session.</p>
        </div>
      );
  }
  if (!currentWord) return <div>Loading...</div>;

  // FIX: Added type annotation to the 'word' parameter to resolve TypeScript errors.
  const generateMcqOptions = (word: VocabularyWord) => {
    const otherWords = shuffleArray(vocabulary.filter(w => w.word !== word.word)).slice(0, 3);
    const isDefinitionQuiz = Math.random() < 0.5;

    if (isDefinitionQuiz) {
        return {
            question: `What is the definition of "${word.word}"?`,
            // FIX: Add explicit type to `w` to fix `unknown` type error.
            options: [word.definition, ...otherWords.map((w: VocabularyWord) => w.definition)],
            correctAnswer: word.definition
        };
    } else {
        return {
            question: `Which word means: "${word.definition}"`,
            // FIX: Add explicit type to `w` to fix `unknown` type error.
            options: [word.word, ...otherWords.map((w: VocabularyWord) => w.word)],
            correctAnswer: word.word
        };
    }
  };

  let content;
  if (mode === PracticeMode.FLASHCARD) {
    content = <Flashcard word={currentWord} onAnswer={handleAnswer} />;
  } else if (mode === PracticeMode.MCQ) {
    const mcqProps = generateMcqOptions(currentWord);
    content = <MultipleChoice {...mcqProps} onNext={handleAnswer} />;
  } else if (mode === PracticeMode.SHORT_ANSWER_WORD_TO_DEF) {
    content = <ShortAnswer question={currentWord.word} correctAnswer={currentWord.definition} prompt="What is the definition of this word?" onNext={handleAnswer} />
  } else if (mode === PracticeMode.SHORT_ANSWER_DEF_TO_WORD) {
    content = <ShortAnswer question={currentWord.definition} correctAnswer={currentWord.word} prompt="Which word means this?" onNext={handleAnswer} />
  }

  return (
    <>
      <div className="w-full max-w-lg mx-auto mb-6 bg-white p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-[#214C63]">Progress: {currentIndex + 1} / {practiceSet.length}</span>
            <span className="font-semibold text-[#214C63]">
                Score: <span className="text-green-600">{score.correct}</span> / <span className="text-red-600">{score.incorrect}</span>
            </span>
        </div>
        <ProgressBar value={currentIndex + 1} max={practiceSet.length} />
      </div>
      <div key={currentIndex} className="animate-fade-in">
        {content}
      </div>
    </>
  );
};

export default PracticeArea;
