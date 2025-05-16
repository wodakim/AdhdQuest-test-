import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getFromStorage, saveToStorage } from '../utils/storageUtils';

// Create the Task context
const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [xpGainMessages, setXpGainMessages] = useState([]);
  
  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = getFromStorage('adhd-quest-tasks');
    if (savedTasks) {
      setTasks(savedTasks);
    }
    
    // Check for recurring tasks that need to be recreated
    const today = new Date();
    const lastCheckDate = getFromStorage('adhd-quest-recurring-check');
    const lastCheckDay = lastCheckDate ? new Date(lastCheckDate).toDateString() : null;
    
    if (lastCheckDay !== today.toDateString()) {
      recreateRecurringTasks(today, savedTasks || []);
      saveToStorage('adhd-quest-recurring-check', today.toISOString());
    }
  }, []);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveToStorage('adhd-quest-tasks', tasks);
  }, [tasks]);
  
  // Add a new task
  const addTask = (task) => {
    const newTask = {
      id: uuidv4(),
      completed: false,
      createdAt: new Date().toISOString(),
      lastCompletedAt: null,
      ...task
    };
    
    setTasks((prevTasks) => [...prevTasks, newTask]);
    return newTask;
  };
  
  // Delete a task
  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };
  
  // Toggle task completion
  const completeTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            completed: true,
            lastCompletedAt: new Date().toISOString()
          };
        }
        return task;
      })
    );
  };
  
  // Edit a task
  const editTask = (taskId, updates) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, ...updates };
        }
        return task;
      })
    );
  };
  
  // Add XP gain message for animation
  const addXpGainMessage = (xp, x, y) => {
    const id = uuidv4();
    setXpGainMessages((prev) => [
      ...prev,
      { id, xp, x, y }
    ]);
    
    // Remove message after animation completes
    setTimeout(() => {
      setXpGainMessages((prev) => 
        prev.filter((msg) => msg.id !== id)
      );
    }, 1500);
  };
  
  // Handle recurring tasks
  const recreateRecurringTasks = (today, existingTasks) => {
    const todayStr = today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    const firstDayOfMonth = today.getDate() === 1;
    const dayOfWeek = today.getDay(); // 0 is Sunday
    
    const newTasks = [];
    
    existingTasks.forEach(task => {
      if (!task.recurring || task.recurring === 'none') return;
      
      // Skip if not completed yet
      if (!task.completed) return;
      
      const lastCompletedAt = task.lastCompletedAt ? new Date(task.lastCompletedAt) : null;
      const lastCompletedDay = lastCompletedAt ? lastCompletedAt.toDateString() : null;
      
      // Create new instance of recurring task if needed
      let shouldCreateNew = false;
      
      if (task.recurring === 'daily') {
        // Create new daily task if last completed yesterday or before
        shouldCreateNew = !lastCompletedDay || lastCompletedDay !== todayStr;
      }
      else if (task.recurring === 'weekly' && dayOfWeek === 1) {
        // Create new weekly task on Monday
        shouldCreateNew = !lastCompletedDay || new Date(lastCompletedDay).getDay() !== 1;
      }
      else if (task.recurring === 'monthly' && firstDayOfMonth) {
        // Create new monthly task on the first day of the month
        shouldCreateNew = !lastCompletedDay || new Date(lastCompletedDay).getDate() !== 1;
      }
      
      if (shouldCreateNew) {
        const newTask = {
          id: uuidv4(),
          title: task.title,
          description: task.description || '',
          difficulty: task.difficulty,
          recurring: task.recurring,
          completed: false,
          createdAt: new Date().toISOString(),
          lastCompletedAt: null,
          dueDate: task.dueDate ? getNextDueDate(task.dueDate, task.recurring) : null
        };
        
        newTasks.push(newTask);
      }
    });
    
    if (newTasks.length > 0) {
      setTasks(prev => [...prev, ...newTasks]);
    }
  };
  
  // Calculate next due date for recurring tasks
  const getNextDueDate = (oldDueDate, recurring) => {
    if (!oldDueDate) return null;
    
    const date = new Date(oldDueDate);
    const today = new Date();
    
    if (recurring === 'daily') {
      // Next day
      date.setDate(date.getDate() + 1);
    }
    else if (recurring === 'weekly') {
      // Next week
      date.setDate(date.getDate() + 7);
    }
    else if (recurring === 'monthly') {
      // Next month
      date.setMonth(date.getMonth() + 1);
    }
    
    // Ensure the new due date is not in the past
    if (date < today) {
      if (recurring === 'daily') {
        date.setDate(today.getDate());
      }
      else if (recurring === 'weekly') {
        date.setDate(today.getDate() + (7 - today.getDay()));
      }
      else if (recurring === 'monthly') {
        date.setMonth(today.getMonth());
        date.setDate(Math.min(date.getDate(), 28)); // Avoid invalid dates in short months
      }
    }
    
    return date.toISOString().split('T')[0];
  };
  
  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        completeTask,
        editTask,
        addXpGainMessage
      }}
    >
      {children}
      
      {/* XP Gain Animations */}
      {xpGainMessages.map((msg) => (
        <div
          key={msg.id}
          className="xp-gain"
          style={{ left: msg.x, top: msg.y }}
        >
          +{msg.xp} XP
        </div>
      ))}
    </TaskContext.Provider>
  );
};

// Custom hook to use the Task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};