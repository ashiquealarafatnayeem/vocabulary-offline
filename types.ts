// FIX: Provide type definitions used across the application.
export interface VocabularyWord {
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  memoryTrick: string;
  originalIndex: number;
}

export interface AlternateMeaning {
  partOfSpeech: string;
  definition: string;
}

export interface ExploredWordInfo {
  alternateMeanings: AlternateMeaning[];
  relatableSentences: string[];
  engineeringSentence: string;
}

export interface SimpleDefinition {
  word: string;
  partOfSpeech: string;
  definition: string;
}

export enum GameState {
  LOADING,
  READY,
  LEARNING,
  PRACTICE_SELECTION,
  PRACTICING,
  PRACTICE_COMPLETE,
  REVIEWING,
}

export enum PracticeMode {
  FLASHCARD = 'FLASHCARD',
  MCQ = 'MCQ',
  SHORT_ANSWER_WORD_TO_DEF = 'SHORT_ANSWER_WORD_TO_DEF',
  SHORT_ANSWER_DEF_TO_WORD = 'SHORT_ANSWER_DEF_TO_WORD',
}

export enum WordCategory {
  FAVOURITE = 'FAVOURITE',
  IMPORTANT = 'IMPORTANT',
  HARD = 'HARD',
  EASY = 'EASY',
  SAVED = 'SAVED',
}

export type CategorizedWords = {
  [key in WordCategory]: string[];
};