import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { motion } from 'framer-motion';

const LanguageSwitcher = () => {
  const { lang, changeLanguage, availableLanguages, t } = useLocalization();
  
  // Language display names
  const languageNames = {
    en: 'English',
    es: 'Español',
    fr: 'Français'
  };
  
  // Language flag icons (using emoji flags)
  const languageFlags = {
    en: '🇬🇧',
    es: '🇪🇸',
    fr: '🇫🇷'
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">{t('settings.language')}</h3>
      <div className="flex flex-wrap gap-2">
        {availableLanguages.map((langCode) => (
          <motion.button
            key={langCode}
            onClick={() => changeLanguage(langCode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
              lang === langCode 
                ? 'bg-[#d7dbf8] text-[#433e56] font-medium' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <span className="mr-2 text-xl" role="img" aria-label={languageNames[langCode]}>
              {languageFlags[langCode]}
            </span>
            <span>{languageNames[langCode]}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;