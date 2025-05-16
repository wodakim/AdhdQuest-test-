import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import { GameProvider } from './context/GameContext';
import { TaskProvider } from './context/TaskContext';
import { motion } from 'framer-motion';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate initial loading/setup
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#f8d7db] to-[#d7f8e8]">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
            className="mb-6"
          >
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 0, 5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "loop" 
              }}
              className="w-32 h-32 mx-auto bg-black rounded-full relative"
            >
              {/* Cat face */}
              <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-green-400 rounded-full"></div>
              <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-green-400 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-1/4 h-1/8 bg-pink-300 rounded-lg"></div>
              
              {/* Cat ears */}
              <div className="absolute -top-4 left-1/4 w-1/4 h-1/3 bg-black rotate-45 origin-bottom-left"></div>
              <div className="absolute -top-4 right-1/4 w-1/4 h-1/3 bg-black -rotate-45 origin-bottom-right"></div>
            </motion.div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-4xl font-bold text-[#433e56]"
          >
            ADHD Quests
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-[#6e6a7c] mt-2"
          >
            Loading your adventure...
          </motion.p>
        </div>
      </div>
    );
  }
  
  return (
    <GameProvider>
      <TaskProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <main className="flex-grow py-4 px-4 md:px-8 max-w-7xl mx-auto w-full">
            <Dashboard />
          </main>
          <footer className="py-3 px-4 text-center text-sm text-gray-500">
            <p>ADHD Quests &copy; {new Date().getFullYear()} - Turn tasks into adventures</p>
          </footer>
        </div>
      </TaskProvider>
    </GameProvider>
  );
}

export default App;