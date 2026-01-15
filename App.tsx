
import React, { useState, useEffect } from 'react';
import { Language } from './types';
import UserView from './components/UserView';
import { Box, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const isAr = lang === 'ar';

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang) setLang(savedLang as Language);
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100`}>
      <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Box className="w-6 h-6" />
           </div>
           <div>
             <span className="text-xl font-black text-slate-900 block leading-none">LogiTrack</span>
             <span className="text-[10px] text-blue-600 font-bold uppercase">{isAr ? 'بوابة الزبائن' : 'Customer Portal'}</span>
           </div>
        </div>
        
        <button 
          onClick={toggleLang} 
          className="flex items-center gap-2 text-blue-600 font-bold text-sm px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Globe className="w-4 h-4" />
          {isAr ? 'English' : 'العربية'}
        </button>
      </header>

      <main className="flex-1">
        <UserView lang={lang} />
      </main>

      <footer className="p-6 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} LogiTrack Pro. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
