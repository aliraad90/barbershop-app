import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n/i18n';

// Create context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  const [isRTL, setIsRTL] = useState(language === 'ar');

  // Update i18n language when language changes
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    
    // Update RTL state
    setIsRTL(language === 'ar');
    
    // Update document direction and lang attribute
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Update document class for RTL styles
    if (language === 'ar') {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const value = {
    language,
    isRTL,
    changeLanguage,
    toggleLanguage,
    t: i18n.t // Translation function
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
