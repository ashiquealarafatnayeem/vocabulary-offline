// FIX: Implement the useCategorizedWords custom hook.
import { useState, useEffect, useCallback } from 'react';
import { WordCategory, CategorizedWords } from '../types';

// Function to safely get initial state from localStorage
const getInitialState = (): CategorizedWords => {
  try {
    const item = window.localStorage.getItem('categorizedWords');
    const parsed = item ? JSON.parse(item) : {};
    // Ensure all categories exist
    const initialState: CategorizedWords = {
      [WordCategory.FAVOURITE]: parsed[WordCategory.FAVOURITE] || [],
      [WordCategory.IMPORTANT]: parsed[WordCategory.IMPORTANT] || [],
      [WordCategory.HARD]: parsed[WordCategory.HARD] || [],
      [WordCategory.EASY]: parsed[WordCategory.EASY] || [],
      [WordCategory.SAVED]: parsed[WordCategory.SAVED] || [],
    };
    return initialState;
  } catch (error) {
    console.error('Error reading categorized words from localStorage:', error);
    return {
      [WordCategory.FAVOURITE]: [],
      [WordCategory.IMPORTANT]: [],
      [WordCategory.HARD]: [],
      [WordCategory.EASY]: [],
      [WordCategory.SAVED]: [],
    };
  }
};

export const useCategorizedWords = () => {
  const [categorizedWords, setCategorizedWords] = useState<CategorizedWords>(getInitialState);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem('categorizedWords', JSON.stringify(categorizedWords));
    } catch (error) {
      console.error('Error saving categorized words to localStorage:', error);
    }
  }, [categorizedWords]);

  const toggleCategory = useCallback((word: string, category: WordCategory) => {
    setCategorizedWords(prev => {
      const newCategorizedWords = JSON.parse(JSON.stringify(prev)); // Deep copy
      const list = newCategorizedWords[category] || [];
      const wordIndex = list.indexOf(word);

      if (wordIndex > -1) { // Word exists, so remove it
        list.splice(wordIndex, 1);
      } else { // Word doesn't exist, so add it
        list.push(word);
      }
      newCategorizedWords[category] = list;

      // Update the "SAVED" category based on other categories
      const otherCategories: WordCategory[] = [WordCategory.FAVOURITE, WordCategory.IMPORTANT, WordCategory.HARD, WordCategory.EASY];
      const isCategorized = otherCategories.some(cat => newCategorizedWords[cat]?.includes(word));
      
      const savedList = newCategorizedWords[WordCategory.SAVED] || [];
      const isSaved = savedList.includes(word);

      if (isCategorized && !isSaved) {
        // If it's in any main category but not saved, save it.
        savedList.push(word);
        newCategorizedWords[WordCategory.SAVED] = savedList;
      } else if (!isCategorized && isSaved) {
        // If it's in no main category but is saved, remove it from saved.
        const savedIndex = savedList.indexOf(word);
        if (savedIndex > -1) {
          savedList.splice(savedIndex, 1);
          newCategorizedWords[WordCategory.SAVED] = savedList;
        }
      }
      
      return newCategorizedWords;
    });
  }, []);
  
  const addSavedWord = useCallback((word: string) => {
    setCategorizedWords(prev => {
        const savedList = prev[WordCategory.SAVED] || [];
        if (!savedList.includes(word)) {
            const newSavedList = [...savedList, word];
            const newCategorizedWords = { ...prev, [WordCategory.SAVED]: newSavedList };
            return newCategorizedWords;
        }
        return prev;
    });
  }, []);

  const isWordInCategory = useCallback((word: string, category: WordCategory): boolean => {
    return categorizedWords[category]?.includes(word) ?? false;
  }, [categorizedWords]);

  return { categorizedWords, toggleCategory, isWordInCategory, addSavedWord };
};
