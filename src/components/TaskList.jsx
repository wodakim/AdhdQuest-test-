import React from 'react';
import { motion } from 'framer-motion';
import { useTask } from '../context/TaskContext';
import { useGame } from '../context/GameContext';

const TaskList = () => {
  const { tasks, completeTask, deleteTask, editTask } = useTask();
  const { awardXP } = useGame();
  const [editingTask, setEditingTask] = React.useState(null);
  const [editedTitle, setEditedTitle] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const handleCompleteTask = (task) => {
    completeTask(task.id);
    awardXP(task.difficulty);
  };

  const handleEditClick = (task) => {
    setEditingTask(task.id);
    setEditedTitle(task.title);
  };

  const handleSaveEdit = (taskId) => {
    if (editedTitle.trim()) {
      editTask(taskId, { title: editedTitle });
      setEditingTask(null);
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Easy';
      case 'medium': return 'Medium';
      case 'hard': return 'Hard';
      default: return 'Medium';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-[#d7f8e8]';
      case 'medium': return 'bg-[#d7f1f8]';
      case 'hard': return 'bg-[#f8d7db]';
      default: return 'bg-[#d7f1f8]';
    }
  };

  const getDifficultyXP = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '10 XP';
      case 'medium': return '25 XP';
      case 'hard': return '50 XP';
      default: return '25 XP';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First by completion status
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    
    // Then by due date if available
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    
    // Then by creation date
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <button 
            className={`px-2 py-1 text-sm rounded-lg transition-all ${filter === 'all' ? 'bg-[#d7dbf8] text-[#433e56]' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-2 py-1 text-sm rounded-lg transition-all ${filter === 'pending' ? 'bg-[#d7f1f8] text-[#433e56]' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`px-2 py-1 text-sm rounded-lg transition-all ${filter === 'completed' ? 'bg-[#d7f8e8] text-[#433e56]' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        
        {filteredTasks.length > 0 && (
          <div className="text-sm text-[#6e6a7c]">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'quest' : 'quests'} {filter !== 'all' ? `(${filter})` : ''}
          </div>
        )}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-medium mb-2">No quests {filter !== 'all' ? `${filter}` : ''} yet!</h3>
          <p className="text-[#6e6a7c]">
            {filter === 'completed' 
              ? "Complete some quests to see them here." 
              : filter === 'pending' 
                ? "All your quests are completed! Add more to continue your adventure."
                : "Add your first quest to begin your adventure."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sortedTasks.map(task => (
            <motion.li 
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`task-card ${task.completed ? 'opacity-60' : ''} task-card--${task.difficulty}`}
            >
              <div className="flex items-center flex-1 min-w-0">
                <button 
                  onClick={() => handleCompleteTask(task)} 
                  className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                    task.completed 
                      ? 'bg-[#d7f8e8] border-[#a7e4c8]' 
                      : 'border-gray-300 hover:border-[#a7e4c8]'
                  }`}
                  disabled={task.completed}
                >
                  {task.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#433e56]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  {editingTask === task.id ? (
                    <div className="flex w-full">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="input flex-1 py-1 text-sm"
                        autoFocus
                      />
                      <button 
                        onClick={() => handleSaveEdit(task.id)}
                        className="ml-2 px-2 py-1 bg-[#d7dbf8] hover:bg-[#a7afe4] rounded text-sm"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <span className={`${task.completed ? 'line-through text-gray-500' : ''} truncate`}>
                          {task.title}
                        </span>
                      </div>
                      
                      {task.dueDate && (
                        <div className="text-xs text-[#6e6a7c] mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center ml-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(task.difficulty)} mr-2`}>
                  {getDifficultyLabel(task.difficulty)} · {getDifficultyXP(task.difficulty)}
                </span>
                
                {!task.completed && !editingTask && (
                  <button 
                    onClick={() => handleEditClick(task)} 
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                
                <button 
                  onClick={() => deleteTask(task.id)} 
                  className="p-1 text-gray-400 hover:text-[#e4a7af]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;