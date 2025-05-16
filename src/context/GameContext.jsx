import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storageUtils';
import { calculateLevelFromXP } from '../utils/gameUtils';

// Create the Game context
const GameContext = createContext();

// Initial game state
const initialGameState = {
  playerName: 'Adventurer',
  playerXP: 0,
  playerLevel: 1,
  playerTitle: 'Novice Quester',
  achievements: [],
  lastLevelUp: null,
};

export const GameProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState('Adventurer');
  const [playerXP, setPlayerXP] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerTitle, setPlayerTitle] = useState('Novice Quester');
  const [achievements, setAchievements] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [lastLevelUp, setLastLevelUp] = useState(null);
  
  // Load game state from localStorage on mount
  useEffect(() => {
    const savedGameState = getFromStorage('adhd-quest-game-state');
    
    if (savedGameState) {
      setPlayerName(savedGameState.playerName);
      setPlayerXP(savedGameState.playerXP || 0);
      setPlayerLevel(savedGameState.playerLevel || 1);
      setPlayerTitle(savedGameState.playerTitle || 'Novice Quester');
      setAchievements(savedGameState.achievements || []);
      setLastLevelUp(savedGameState.lastLevelUp || null);
    }
  }, []);
  
  // Save game state to localStorage whenever it changes
  useEffect(() => {
    const gameState = {
      playerName,
      playerXP,
      playerLevel,
      playerTitle,
      achievements,
      lastLevelUp,
    };
    
    saveToStorage('adhd-quest-game-state', gameState);
  }, [playerName, playerXP, playerLevel, playerTitle, achievements, lastLevelUp]);
  
  // Award XP and check for level up
  const awardXP = (difficulty) => {
    let xpAmount;
    switch (difficulty) {
      case 'easy':
        xpAmount = 10;
        break;
      case 'medium':
        xpAmount = 25;
        break;
      case 'hard':
        xpAmount = 50;
        break;
      default:
        xpAmount = 10;
    }
    
    // Check for streak bonus (10% extra XP)
    const streakDays = parseInt(localStorage.getItem('adhd-quest-streak') || '0', 10);
    if (streakDays >= 3) {
      xpAmount = Math.round(xpAmount * 1.1);
    }
    
    const newXP = playerXP + xpAmount;
    const newLevel = calculateLevelFromXP(newXP);
    
    setPlayerXP(newXP);
    
    // Check for level up
    if (newLevel > playerLevel) {
      setPlayerLevel(newLevel);
      setShowLevelUp(true);
      setLastLevelUp(new Date().toISOString());
      
      // Hide level up notification after 5 seconds
      setTimeout(() => {
        setShowLevelUp(false);
      }, 5000);
    }
    
    return {
      xpGained: xpAmount,
      newLevel: newLevel > playerLevel,
    };
  };
  
  // Reset all game progress
  const resetGame = () => {
    setPlayerName('Adventurer');
    setPlayerXP(0);
    setPlayerLevel(1);
    setPlayerTitle('Novice Quester');
    setAchievements([]);
    setLastLevelUp(null);
    localStorage.removeItem('adhd-quest-game-state');
    localStorage.removeItem('adhd-quest-tasks');
    localStorage.removeItem('adhd-quest-streak');
    localStorage.removeItem('adhd-quest-last-active');
  };
  
  return (
    <GameContext.Provider
      value={{
        playerName,
        setPlayerName,
        playerXP,
        setPlayerXP,
        playerLevel,
        setPlayerLevel,
        playerTitle,
        setPlayerTitle,
        achievements,
        setAchievements,
        showLevelUp,
        setShowLevelUp,
        lastLevelUp,
        awardXP,
        resetGame,
      }}
    >
      {children}
      
      {/* Level Up Modal */}
      {showLevelUp && (
        <div className="level-up">
          <div className="level-up-content">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-2">Level Up!</h2>
            <p className="text-lg mb-4">You are now level {playerLevel}!</p>
            <div className="mb-4">
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#d7dbf8] to-[#d7f8e8] rounded-full text-sm font-medium">
                +New abilities unlocked
              </div>
            </div>
            <button
              onClick={() => setShowLevelUp(false)}
              className="btn btn-primary"
            >
              Continue Quest
            </button>
          </div>
        </div>
      )}
    </GameContext.Provider>
  );
};

// Custom hook to use the Game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};