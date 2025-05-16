/**
 * Utility functions for the game mechanics
 */

// Calculate the player's level based on XP
export const calculateLevelFromXP = (xp) => {
  // XP required increases with each level
  // Level 1: 0 XP
  // Level 2: 100 XP
  // Level 3: 300 XP (100 + 200)
  // Level 4: 600 XP (100 + 200 + 300)
  // And so on...
  
  if (xp < 100) return 1;
  
  let level = 1;
  let xpRequired = 0;
  let increment = 100;
  
  while (xp >= xpRequired + increment) {
    xpRequired += increment;
    increment += 100;
    level++;
  }
  
  return level;
};

// Calculate XP required for the next level
export const calculateXPForNextLevel = (level) => {
  return Math.round(100 * Math.pow(level, 1.5));
};

// Get appropriate title for player's level
export const getTitleForLevel = (level) => {
  const titles = [
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
  
  // Cap at highest title
  const index = Math.min(level - 1, titles.length - 1);
  return titles[Math.max(0, index)];
};

// Get motivational message for completing task
export const getRandomMotivationMessage = () => {
  const messages = [
    "Excellent work! Your brain just got a nice dopamine boost!",
    "Task conquered! You're building momentum!",
    "Fantastic job! One step closer to leveling up!",
    "Achievement unlocked! Keep the streak going!",
    "Victory! Your future self thanks you!",
    "Amazing progress! You're on fire today!",
    "Task vanquished! The adventure continues!",
    "Great job focusing! That's a win!",
    "Quest complete! You're becoming more powerful!",
    "Success! Your productivity stats are increasing!"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

// Get encouraging message when adding a new task
export const getRandomEncouragementMessage = () => {
  const messages = [
    "New quest added! You've got this!",
    "Challenge accepted! Break it down and conquer it!",
    "Quest logged! Remember to take it one step at a time.",
    "New adventure begins! Focus on the journey, not just the destination.",
    "Task added! Remember: progress over perfection!",
    "New mission acquired! Your future self will thank you!",
    "Quest registered! Every completed task builds your focus muscles!",
    "New challenge on the board! You're already on your way!",
    "Adventure awaits! Remember to celebrate when you complete this!",
    "Task created! Remember why this matters to you!"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};