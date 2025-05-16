import React, { useState } from 'react';
import { useSkin } from '../context/SkinContext';
import { useLocalization } from '../context/LocalizationContext';
import { motion } from 'framer-motion';

const SkinSelector = () => {
  const { getAllSkins, changeSkin, currentSkin } = useSkin();
  const { t } = useLocalization();
  const [previewSkin, setPreviewSkin] = useState(null);
  
  const skins = getAllSkins();
  
  // Helper function to render the cat with different skins
  const renderCat = (skin, size = 60) => {
    const catStyle = skin.gradient ? 
      { background: skin.gradient } : 
      { backgroundColor: skin.color || 'black' };
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        {/* Cat body */}
        <div 
          className="absolute inset-0 rounded-full"
          style={catStyle}
        >
          {/* Eyes */}
          <div className="absolute top-[30%] left-[25%] w-[25%] h-[25%] bg-green-400 rounded-full"></div>
          <div className="absolute top-[30%] right-[25%] w-[25%] h-[25%] bg-green-400 rounded-full"></div>
          
          {/* Mouth */}
          <div className="absolute bottom-[25%] left-[50%] transform -translate-x-1/2 w-[25%] h-[8%] bg-pink-300 rounded-full"></div>
          
          {/* Ears */}
          <div 
            className="absolute top-[-30%] left-[20%] w-[25%] h-[40%] clip-polygon-ear"
            style={{ backgroundColor: skin.earColor || skin.color || 'black' }}
          ></div>
          <div 
            className="absolute top-[-30%] right-[20%] w-[25%] h-[40%] clip-polygon-ear"
            style={{ backgroundColor: skin.earColor || skin.color || 'black' }}
          ></div>
          
          {/* Add a lock icon for locked skins */}
          {skin.locked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">{t('settings.mascotSkin')}</h3>
      
      {/* Preview area */}
      <div className="bg-gradient-to-br from-[#f8d7db]/30 to-[#d7f8e8]/30 p-4 rounded-xl mb-4 flex items-center justify-center">
        <motion.div 
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, -2, 0, 2, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          {renderCat(previewSkin ? 
            skins.find(skin => skin.id === previewSkin) : 
            skins.find(skin => skin.id === currentSkin), 100)}
          <p className="mt-3 text-center font-medium text-[#433e56]">
            {previewSkin ? 
              skins.find(skin => skin.id === previewSkin)?.name : 
              skins.find(skin => skin.id === currentSkin)?.name}
          </p>
          {previewSkin && (
            <p className="text-sm text-gray-600 mt-1 text-center max-w-xs">
              {skins.find(skin => skin.id === previewSkin)?.description}
            </p>
          )}
        </motion.div>
      </div>
      
      {/* Skin selection */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-2">
        {skins.map((skin) => (
          <motion.div
            key={skin.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setPreviewSkin(skin.id)}
            onMouseLeave={() => setPreviewSkin(null)}
            onClick={() => !skin.locked && changeSkin(skin.id)}
            className={`relative p-2 rounded-lg cursor-pointer border-2 transition-all ${
              currentSkin === skin.id 
                ? 'border-[#a7afe4]' 
                : 'border-transparent hover:bg-gray-50'
            } ${skin.locked ? 'opacity-60' : ''}`}
          >
            <div className="flex flex-col items-center">
              {renderCat(skin, 40)}
              <span className="mt-1 text-xs text-center font-medium truncate w-full">
                {skin.name}
              </span>
              {skin.locked && skin.unlockLevel && (
                <span className="text-2xs text-gray-500 mt-0.5">
                  Lvl {skin.unlockLevel}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <p className="text-xs text-gray-600 mt-1">
        {t('settings.unlockNew')}
      </p>
      
      {/* Add custom styling for ear polygon */}
      <style jsx>{`
        .clip-polygon-ear {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
};

export default SkinSelector;