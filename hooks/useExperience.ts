// FIX: Implement the useExperience custom hook.
import { useState, useEffect, useCallback } from 'react';

const XP_PER_LEVEL = 1000; // Example: 1000 XP to level up

const getInitialXP = (): number => {
  try {
    const item = window.localStorage.getItem('userXP');
    return item ? parseInt(item, 10) : 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const useExperience = () => {
  const [xp, setXp] = useState<number>(getInitialXP);
  const [level, setLevel] = useState<number>(() => Math.floor(getInitialXP() / XP_PER_LEVEL) + 1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [justLeveledUpTo, setJustLeveledUpTo] = useState<number | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('userXP', xp.toString());
    } catch (error) {
      console.error(error);
    }
  }, [xp]);

  const addXp = useCallback((amount: number) => {
    setXp(prevXp => {
      const newXp = prevXp + amount;
      const oldLevel = Math.floor(prevXp / XP_PER_LEVEL) + 1;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      
      if (newLevel > oldLevel) {
        setLevel(newLevel);
        setJustLeveledUpTo(newLevel);
        setShowLevelUp(true);
      }
      
      return newXp;
    });
  }, []);
  
  const closeLevelUpModal = () => {
      setShowLevelUp(false);
      setJustLeveledUpTo(null);
  };

  const progressToNextLevel = xp % XP_PER_LEVEL;

  return { 
    xp, 
    level, 
    addXp, 
    progressToNextLevel, 
    xpPerLevel: XP_PER_LEVEL, 
    showLevelUp,
    justLeveledUpTo,
    closeLevelUpModal,
  };
};
