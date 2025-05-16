import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import CatMascot from './CatMascot';

const ProfileCard = () => {
  const { playerName, playerLevel, playerXP, playerTitle, setPlayerName, setPlayerTitle } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(playerName);
  const [streakDays, setStreakDays] = useState(0);
  const [lastActive, setLastActive] = useState(null);
  
  // Calculate XP required for next level (gets harder as you level up)
  const xpForNextLevel = Math.round(100 * Math.pow(playerLevel, 1.5));
  const xpProgress = (playerXP / xpForNextLevel) * 100;
  
  // Get titles based on level
  const availableTitles = [
    "Novice Quester",
    "Task Apprentice",
    "Focus Finder",
    "Attention Adept",
    "Procrastination Preventer",
    "Distraction Destroyer",
    "Quest Champion",
    "Focus Master",
    "Productivity Wizard",
    "Task Titan"
  ];
  
  // Load streak data
  useEffect(() => {
    const today = new Date().toDateString();
    const storedLastActive = localStorage.getItem('adhd-quest-last-active');
    const storedStreak = localStorage.getItem('adhd-quest-streak') || 0;
    
    if (!storedLastActive) {
      // First time user
      localStorage.setItem('adhd-quest-last-active', today);
      localStorage.setItem('adhd-quest-streak', '1');
      setStreakDays(1);
      setLastActive(today);
    } else {
      setLastActive(storedLastActive);
      setStreakDays(parseInt(storedStreak, 10));
      
      // Check if it's a new day
      if (storedLastActive !== today) {
        const lastDate = new Date(storedLastActive);
        const currentDate = new Date(today);
        
        // Calculate days between last active and today
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // User active on consecutive days - increase streak
          const newStreak = parseInt(storedStreak, 10) + 1;
          localStorage.setItem('adhd-quest-streak', newStreak.toString());
          localStorage.setItem('adhd-quest-last-active', today);
          setStreakDays(newStreak);
        } else if (diffDays > 1) {
          // Streak broken
          localStorage.setItem('adhd-quest-streak', '1');
          localStorage.setItem('adhd-quest-last-active', today);
          setStreakDays(1);
        }
      }
    }
  }, []);
  
  const handleSaveProfile = () => {
    if (editedName.trim()) {
      setPlayerName(editedName);
    }
    setIsEditing(false);
  };
  
  return (
    <div className="card bg-gradient-to-br from-[#d7dbf8] to-[#d7f1f8] border border-[#a7afe4]/30">
      {isEditing ? (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-4">Edit Your Profile</h3>
          <div className="mb-4">
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#a7dae4]"
              maxLength={20}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="playerTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <select
              id="playerTitle"
              value={playerTitle}
              onChange={(e) => setPlayerTitle(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#a7dae4]"
            >
              {availableTitles.slice(0, Math.min(playerLevel, availableTitles.length)).map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => setIsEditing(false)}
              className="btn bg-gray-100 hover:bg-gray-200 mr-2"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveProfile}
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Your Character</h3>
            <button 
              onClick={() => setIsEditing(true)}
              className="text-sm bg-white/50 hover:bg-white/80 px-2 py-1 rounded"
            >
              Edit
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 relative">
              <div className="bg-white/70 p-2 rounded-full">
                <CatMascot size="medium" mood={streakDays >= 3 ? "happy" : "normal"} />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#d7f8e8] text-[#433e56] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                {playerLevel}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold">{playerName}</h2>
              <p className="text-sm text-[#6e6a7c]">{playerTitle}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>XP Progress</span>
              <span>{playerXP} / {xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.5 }}
                className="bg-[#a7afe4] h-2.5 rounded-full"
              ></motion.div>
            </div>
          </div>
          
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="bg-white/50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{playerLevel}</div>
              <div className="text-xs text-[#6e6a7c]">Level</div>
            </div>
            
            <div className="bg-white/50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{streakDays}</div>
              <div className="text-xs text-[#6e6a7c]">Day{streakDays !== 1 ? 's' : ''} Streak</div>
            </div>
          </div>
          
          {streakDays >= 3 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 bg-[#d7f8e8]/50 p-2 rounded-lg border border-[#a7e4c8]/30 text-sm"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#433e56]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                <span>Streak Bonus: +10% XP on all completed tasks</span>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;