// src/components/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const switchLanguage = (lang) => {
    setLanguage(lang);
  };

  const currentTranslations = translations[language];

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
