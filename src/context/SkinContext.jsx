import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storageUtils';
import { useGame } from './GameContext';

// Create the skin context
const SkinContext = createContext();

// Define available skins and their unlock requirements
const SKINS = {
  classic: {
    id: 'classic',
    name: 'Classic Black',
    color: 'black',
    locked: false, // Default skin is always unlocked
    description: 'The classic black cat that started your journey.'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Blue',
    color: '#1e3a8a',
    locked: true,
    unlockLevel: 3,
    description: 'A mysterious midnight blue cat for the night owls.'
  },
  ember: {
    id: 'ember',
    name: 'Ember',
    color: '#b91c1c',
    locked: true,
    unlockLevel: 5,
    description: 'A fiery red cat to ignite your motivation.'
  },
  shadow: {
    id: 'shadow',
    name: 'Shadow',
    color: '#4b5563',
    locked: true,
    unlockLevel: 8,
    description: 'A sleek gray cat that blends into the shadows.'
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic',
    color: '#7e22ce',
    locked: true,
    unlockLevel: 12,
    description: 'A mystical purple cat with cosmic energy.'
  },
  golden: {
    id: 'golden',
    name: 'Golden',
    color: '#b45309',
    locked: true,
    unlockLevel: 15,
    description: 'A golden cat for those who achieve greatness.'
  },
  rainbow: {
    id: 'rainbow',
    name: 'Rainbow',
    gradient: 'linear-gradient(135deg, #f87171, #fbbf24, #34d399, #38bdf8, #a78bfa)',
    locked: true,
    unlockTaskCount: 50, // Unlock after completing 50 tasks
    description: 'A magical rainbow cat for the most dedicated questers.'
  }
};

export const SkinProvider = ({ children }) => {
  const [currentSkin, setCurrentSkin] = useState('classic');
  const [unlockedSkins, setUnlockedSkins] = useState(['classic']);
  const { playerLevel } = useGame();
  
  // Load skin preference from localStorage on mount
  useEffect(() => {
    const savedSkin = getFromStorage('adhd-quest-skin') || 'classic';
    const savedUnlockedSkins = getFromStorage('adhd-quest-unlocked-skins') || ['classic'];
    
    setCurrentSkin(savedSkin);
    setUnlockedSkins(savedUnlockedSkins);
  }, []);

  // Check for newly unlocked skins when player level changes
  useEffect(() => {
    const completedTasksCount = localStorage.getItem('adhd-quest-completed-tasks-count') 
      ? parseInt(localStorage.getItem('adhd-quest-completed-tasks-count'), 10) 
      : 0;
    
    const newUnlockedSkins = [...unlockedSkins];
    let changed = false;
    
    // Check each skin's unlock condition
    Object.entries(SKINS).forEach(([skinId, skin]) => {
      if (!unlockedSkins.includes(skinId)) {
        if (
          (skin.unlockLevel && playerLevel >= skin.unlockLevel) ||
          (skin.unlockTaskCount && completedTasksCount >= skin.unlockTaskCount)
        ) {
          newUnlockedSkins.push(skinId);
          changed = true;
        }
      }
    });
    
    if (changed) {
      setUnlockedSkins(newUnlockedSkins);
      saveToStorage('adhd-quest-unlocked-skins', newUnlockedSkins);
      
      // Show notification about new skin (could be implemented later)
    }
  }, [playerLevel, unlockedSkins]);
  
  // Save skin preference to localStorage whenever it changes
  useEffect(() => {
    saveToStorage('adhd-quest-skin', currentSkin);
  }, [currentSkin]);

  // Change the current skin
  const changeSkin = (skinId) => {
    if (unlockedSkins.includes(skinId) && SKINS[skinId]) {
      setCurrentSkin(skinId);
    } else {
      console.error(`Skin ${skinId} is not available or not unlocked`);
    }
  };

  // Get the current skin object
  const getSkin = (skinId = currentSkin) => {
    return SKINS[skinId] || SKINS.classic; // Fall back to classic if not found
  };

  // Get all skins with their lock status
  const getAllSkins = () => {
    return Object.entries(SKINS).map(([id, skin]) => ({
      ...skin,
      locked: !unlockedSkins.includes(id)
    }));
  };

  const contextValue = {
    currentSkin,
    changeSkin,
    getSkin,
    getAllSkins,
    unlockedSkins
  };

  return (
    <SkinContext.Provider value={contextValue}>
      {children}
    </SkinContext.Provider>
  );
};

// Custom hook to use the skin context
export const useSkin = () => {
  const context = useContext(SkinContext);
  
  if (!context) {
    throw new Error('useSkin must be used within a SkinProvider');
  }
  
  return context;
};