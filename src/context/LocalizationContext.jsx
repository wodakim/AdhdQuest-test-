import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storageUtils';

// Create the localization context
const LocalizationContext = createContext();

// Define available languages
const AVAILABLE_LANGUAGES = ['en', 'es', 'fr'];
const DEFAULT_LANGUAGE = 'en';

export const LocalizationProvider = ({ children }) => {
  const [lang, setLang] = useState(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLang = getFromStorage('adhd-quest-language') || DEFAULT_LANGUAGE;
    
    if (AVAILABLE_LANGUAGES.includes(savedLang)) {
      setLang(savedLang);
    } else {
      setLang(DEFAULT_LANGUAGE);
    }
    
    loadTranslations(savedLang);
  }, []);
  
  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    saveToStorage('adhd-quest-language', lang);
  }, [lang]);

  // Function to load translations for the selected language
  const loadTranslations = async (langCode) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/locales/${langCode}.json`);
      if (!response.ok) throw new Error(`Failed to load ${langCode} translations`);
      
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fall back to English if there's an error
      if (langCode !== 'en') {
        loadTranslations('en');
      } else {
        // If even English fails, use an empty object to prevent crashes
        setTranslations({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Change the current language
  const changeLanguage = (langCode) => {
    if (AVAILABLE_LANGUAGES.includes(langCode)) {
      setLang(langCode);
      loadTranslations(langCode);
    } else {
      console.error(`Language ${langCode} is not supported`);
    }
  };

  // Helper function to get a translation by key (supports nested keys like "nav.home")
  const t = (key, defaultValue = '') => {
    if (!key) return defaultValue;
    
    // Handle nested keys (e.g., "navigation.greeting.morning")
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return defaultValue || key;
    }
    
    return value || defaultValue || key;
  };

  const contextValue = {
    lang,
    translations,
    isLoading,
    t,
    changeLanguage,
    availableLanguages: AVAILABLE_LANGUAGES
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};

// Custom hook to use the localization context
export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  
  return context;
};