import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const TopGovStrip: React.FC = () => {
  const { language, setLanguage, fontSize, setFontSize, isHighContrast, toggleHighContrast, t } = useLanguage();

  return (
    <div className="bg-[#081726] text-slate-300 text-xs py-1 px-4 border-b border-slate-700">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        {/* Left: Official Gov India declaration */}
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-200 tracking-wide">
            {language === 'hi' ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 hidden sm:inline">
            {language === 'hi' ? 'शिक्षा मंत्रालय' : 'MINISTRY OF EDUCATION'}
          </span>
        </div>

        {/* Right: Accessibility toolbar */}
        <div className="flex items-center space-x-4">
          <a
            href="#main-content"
            className="text-slate-300 hover:text-white underline underline-offset-2 focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            {t('skip_to_main')}
          </a>

          <span className="text-slate-600 hidden md:inline">|</span>

          {/* Text Size Adjustment */}
          <div className="hidden sm:flex items-center space-x-1 border border-slate-600 rounded px-1.5 py-0.5 bg-slate-900">
            <button
              onClick={() => setFontSize(-1)}
              className={`px-1 font-bold hover:text-white ${fontSize === -1 ? 'text-amber-400 font-extrabold' : 'text-slate-400'}`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize(0)}
              className={`px-1 font-bold hover:text-white ${fontSize === 0 ? 'text-amber-400 font-extrabold' : 'text-slate-400'}`}
              title="Default Font Size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize(1)}
              className={`px-1 font-bold hover:text-white ${fontSize === 1 ? 'text-amber-400 font-extrabold' : 'text-slate-400'}`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className="border border-slate-600 rounded px-2 py-0.5 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-400"
          >
            {isHighContrast ? t('normal_contrast') : t('high_contrast')}
          </button>

          <span className="text-slate-600">|</span>

          {/* Bilingual Switcher */}
          <div className="flex items-center space-x-1 font-medium">
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded ${language === 'en' ? 'bg-[#134074] text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              English
            </button>
            <span>/</span>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-1.5 py-0.5 rounded ${language === 'hi' ? 'bg-[#134074] text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
