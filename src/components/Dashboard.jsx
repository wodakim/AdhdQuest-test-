import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import ProfileCard from './ProfileCard';
import JokeButton from './JokeButton';
import CatMascot from './CatMascot';
import { useTask } from '../context/TaskContext';
import { useGame } from '../context/GameContext';

const Dashboard = () => {
  const { tasks } = useTask();
  const { playerLevel, playerXP } = useGame();
  const [showWelcome, setShowWelcome] = useState(true);
  const [dailyQuote, setDailyQuote] = useState('');
  const [dailyTip, setDailyTip] = useState('');
  
  // Motivational quotes for ADHD individuals
  const quotes = [
    "Your brain isn't broken, it's just uniquely wired.",
    "ADHD is a different ability, not a disability.",
    "Small steps still move you forward.",
    "You don't have to be perfect to make progress.",
    "Today's focus: progress, not perfection.",
    "Your hyperfocus is your superpower.",
    "Break tasks down, level up in real life.",
    "Remember to celebrate your victories, no matter how small.",
    "Embrace your unique brain wiring.",
    "One task at a time builds a mountain of achievement."
  ];
  
  // ADHD Tips
  const tips = [
    "Use the 2-minute rule: If it takes less than 2 minutes, do it now.",
    "Set timers for tasks to create urgency and focus.",
    "Create external reminders - sticky notes, alarms, or visual cues.",
    "Break large tasks into smaller, manageable chunks.",
    "Try body doubling - work alongside someone else to stay focused.",
    "Use noise-cancelling headphones or background music to reduce distractions.",
    "Keep a dedicated notebook for random thoughts that pop up during focused time.",
    "Set up your environment to minimize distractions before starting tasks.",
    "Try the Pomodoro technique: 25 minutes of focus followed by a 5-minute break.",
    "Gamify your tasks by setting up rewards for completion."
  ];
  
  useEffect(() => {
    // Select a random quote and tip daily
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('adhd-quest-date');
    
    if (storedDate !== today) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      
      setDailyQuote(randomQuote);
      setDailyTip(randomTip);
      localStorage.setItem('adhd-quest-date', today);
      localStorage.setItem('adhd-quest-quote', randomQuote);
      localStorage.setItem('adhd-quest-tip', randomTip);
    } else {
      setDailyQuote(localStorage.getItem('adhd-quest-quote') || quotes[0]);
      setDailyTip(localStorage.getItem('adhd-quest-tip') || tips[0]);
    }
    
    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const pendingTasksCount = tasks.filter(task => !task.completed).length;
  
  return (
    <div>
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-[#d7dbf8] rounded-lg p-4 mb-6 shadow-md relative overflow-hidden"
          >
            <button 
              onClick={() => setShowWelcome(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex items-center">
              <div className="mr-4">
                <CatMascot size="small" mood="happy" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#433e56]">Welcome back, adventurer!</h3>
                <p className="text-[#6e6a7c]">Ready to tackle some quests and earn XP today?</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-br from-[#d7f1f8] to-[#d7f8e8] border border-[#a7dae4]/30"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Daily Quest Board</h2>
              <JokeButton />
            </div>
            
            <div className="p-4 bg-white/50 rounded-lg mb-4">
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="mb-2 sm:mb-0">
                  <span className="text-sm text-[#6e6a7c]">Today's Motivation:</span>
                  <p className="font-medium italic">"{dailyQuote}"</p>
                </div>
                <div className="flex items-center">
                  <CatMascot size="small" mood={pendingTasksCount > 0 ? "curious" : "sleeping"} />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/50 rounded-lg mb-4">
              <span className="text-sm text-[#6e6a7c]">ADHD Tip:</span>
              <p className="font-medium">{dailyTip}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-white/70 p-3 rounded-lg shadow-sm">
                <h3 className="text-sm text-[#6e6a7c]">Level</h3>
                <p className="text-2xl font-bold">{playerLevel}</p>
              </div>
              <div className="bg-white/70 p-3 rounded-lg shadow-sm">
                <h3 className="text-sm text-[#6e6a7c]">Completed Quests</h3>
                <p className="text-2xl font-bold">{completedTasksCount}</p>
              </div>
              <div className="bg-white/70 p-3 rounded-lg shadow-sm">
                <h3 className="text-sm text-[#6e6a7c]">Pending Quests</h3>
                <p className="text-2xl font-bold">{pendingTasksCount}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-4">Active Quests</h2>
            <TaskForm />
            <div className="mt-6">
              <TaskList />
            </div>
          </motion.div>
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ProfileCard />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-br from-[#f8d7db] to-[#d7dbf8] border border-[#e4a7af]/30"
          >
            <h2 className="text-xl font-bold mb-3">Quick Tips</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="p-1 bg-white/50 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#a7afe4]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                </div>
                <p className="text-sm">Use the microphone button to add tasks with your voice</p>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-white/50 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#a7afe4]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">Set due dates to organize your quests by deadline</p>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-white/50 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#a7afe4]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">Create recurring quests for daily/weekly habits</p>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-white/50 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#a7afe4]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">Click the skull button for a dose of dark humor when needed</p>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="hidden md:block"
          >
            <CatMascot size="large" mood="playful" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;