import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
      className="fixed bottom-4 right-4 z-[100] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-sm border border-gray-200"
      style={{ color: '#0F414A' }}
      aria-label="Switch language"
    >
      {language === 'th' ? '🇺🇸 EN' : '🇹🇭 ไทย'}
    </button>
  );
};
