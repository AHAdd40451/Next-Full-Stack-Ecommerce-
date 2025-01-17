'use client';

import { createContext, useContext, useState } from 'react';
import { translations } from '../translation';
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ar'); // Default language

  const value = {
    language,
    setLanguage,
    t: (key) => {
      const keys = key.split('.');
      let result = translations[language];
      for (const k of keys) {
        result = result?.[k];
      }
      return result || key;
    },
    dir: language === 'ar' ? 'rtl' : 'ltr'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);