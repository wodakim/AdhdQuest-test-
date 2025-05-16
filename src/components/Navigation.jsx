import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import CatMascot from './CatMascot';

const Navigation = () => {
  const { playerName, playerLevel, resetGame } = useGame();
  const [showResetModal, setShowResetModal] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Set time of day greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay('afternoon');
    } else {
      setTimeOfDay('evening');
    }
  }, []);
  
  const handleResetConfirm = () => {
    resetGame();
    setShowResetModal(false);
    window.location.reload();
  };
  
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-8 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            className="mr-3 hidden sm:block"
          >
            <CatMascot size="small" mood="curious" />
          </motion.div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#433e56]">
              ADHD Quests
            </h1>
            <p className="text-xs text-[#6e6a7c]">
              Level up your productivity
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="hidden md:block mr-4 text-right">
            <p className="text-sm text-[#6e6a7c]">Good {timeOfDay}, {playerName || 'Adventurer'}</p>
            <p className="text-xs">Level {playerLevel} Quester</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 rounded-full bg-[#d7dbf8] hover:bg-[#a7afe4] transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
            
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-20"
              >
                <div className="p-3 border-b border-gray-100">
                  <p className="font-medium">Settings</p>
                </div>
                <div className="py-1">
                  <a 
                    href="#" 
                    onClick={() => {
                      setShowResetModal(true);
                      setShowDropdown(false);
                    }} 
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Reset Progress
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    About ADHD Quests
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Reset confirmation modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4"
          >
            <h3 className="text-xl font-bold mb-4">Reset Progress?</h3>
            <p className="mb-6 text-gray-600">
              This will delete all your tasks, experience points, and game progress. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="btn bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="btn bg-red-500 hover:bg-red-600 text-white"
              >
                Reset Everything
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Navigation;