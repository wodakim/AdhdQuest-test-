import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { jokes } from '../utils/jokes';

const JokeButton = () => {
  const [joke, setJoke] = useState('');
  const [showJoke, setShowJoke] = useState(false);
  
  const getRandomJoke = () => {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    setJoke(jokes[randomIndex]);
    setShowJoke(true);
    
    // Hide joke after 7 seconds
    setTimeout(() => {
      setShowJoke(false);
    }, 7000);
  };
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={getRandomJoke}
        className="flex items-center bg-black/10 hover:bg-black/15 text-[#433e56] px-3 py-1.5 rounded-lg transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM3.536 7.536a.75.75 0 001.06 0L7.828 4.303l3.232 3.233a.75.75 0 001.06-1.06L8.89 3.243a.75.75 0 00-1.061 0L4.596 6.476a.75.75 0 000 1.06zM3.657 9.657a.75.75 0 00-1.06 0L.364 11.89a.75.75 0 000 1.061l3.233 3.232a.75.75 0 001.06-1.06L2.424 12.89l2.233-2.233a.75.75 0 000-1.06zm12.728 0a.75.75 0 00-1.06 0l-2.233 2.233-2.233-2.233a.75.75 0 00-1.06 1.06L12.136 13l-2.404 2.404a.75.75 0 001.06 1.06l3.233-3.232a.75.75 0 000-1.061l-2.232-2.233 2.232-2.233a.75.75 0 000-1.06z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">Need a laugh?</span>
      </motion.button>
      
      {showJoke && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full right-0 mt-2 p-3 bg-black text-gray-100 rounded-lg shadow-lg z-10 w-64 text-sm"
        >
          {joke}
          <div className="absolute -top-2 right-4 w-0 h-0 border-8 border-transparent border-b-black"></div>
        </motion.div>
      )}
    </div>
  );
};

export default JokeButton;