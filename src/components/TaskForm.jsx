import React, { useState, useEffect, useRef } from 'react';
import { useTask } from '../context/TaskContext';
import { motion } from 'framer-motion';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [recurring, setRecurring] = useState('none');
  const [formExpanded, setFormExpanded] = useState(false);
  const [showVoiceHint, setShowVoiceHint] = useState(false);
  const formRef = useRef(null);
  
  const { addTask } = useTask();
  const { 
    text, 
    isListening, 
    startListening, 
    stopListening, 
    hasRecognitionSupport 
  } = useVoiceRecognition();
  
  // Handle outside click to collapse form
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target) && formExpanded) {
        // Don't collapse if text is being entered
        if (title || description) return;
        setFormExpanded(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [formExpanded, title, description]);
  
  // Update title when voice recognition detects speech
  useEffect(() => {
    if (text) {
      setTitle(text);
      setFormExpanded(true);
    }
  }, [text]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newTask = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      recurring,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    if (dueDate) {
      newTask.dueDate = dueDate;
    }
    
    addTask(newTask);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setDifficulty('medium');
    setRecurring('none');
    
    // Keep form expanded if it was already expanded before submission
    if (!formExpanded) {
      setFormExpanded(false);
    }
  };
  
  return (
    <div 
      ref={formRef}
      className={`card transition-all duration-300 ${formExpanded ? 'border-[#d7dbf8]' : 'border-transparent'}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Add a new quest..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setFormExpanded(true)}
              className="w-full p-2 rounded-lg border-none bg-gray-50 focus:outline-none focus:ring-0 focus:bg-white transition-colors"
            />
          </div>
          
          {hasRecognitionSupport && (
            <div className="relative ml-2">
              <motion.button
                type="button"
                onClick={isListening ? stopListening : startListening}
                onMouseEnter={() => setShowVoiceHint(true)}
                onMouseLeave={() => setShowVoiceHint(false)}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full ${
                  isListening 
                    ? 'bg-[#f8d7db] animate-pulse' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </motion.button>
              
              {showVoiceHint && (
                <div className="absolute -top-10 right-0 text-xs bg-gray-800 text-white p-2 rounded shadow-lg whitespace-nowrap">
                  {isListening ? 'Stop recording' : 'Add quest by voice'}
                </div>
              )}
            </div>
          )}
          
          <div className="ml-2">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
            >
              {formExpanded ? 'Save' : 'Add'}
            </motion.button>
          </div>
        </div>
        
        {formExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4"
          >
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows="2"
                placeholder="Add more details about your quest..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d7dbf8] transition-colors resize-none"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d7dbf8]"
                >
                  <option value="easy">Easy (10 XP)</option>
                  <option value="medium">Medium (25 XP)</option>
                  <option value="hard">Hard (50 XP)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="recurring" className="block text-sm font-medium text-gray-700 mb-1">
                  Recurring
                </label>
                <select
                  id="recurring"
                  value={recurring}
                  onChange={(e) => setRecurring(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d7dbf8]"
                >
                  <option value="none">Not recurring</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d7dbf8]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default TaskForm;