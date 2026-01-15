
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
    
    // ØªØ£ÙƒÙŠØ¯ Ù†ÙˆØ¹ Ø§Ù„Ù†Ø³Ø®Ø© ÙÙŠ Ø§Ù„ÙƒÙˆÙ†Ø³ÙˆÙ„ Ù„Ù„ØªØµØ­ÙŠØ­
    console.log("LogiTrack: Client-Side Version Loaded Successfully.");
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  return (
    <div className={`min-h-screen bg-white flex flex-col ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Ù‡ÙŠØ¯Ø± Ù†Ø³Ø®Ø© Ø§Ù„Ø²Ø¨ÙˆÙ† */}
      <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
           <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <Box className="w-5 h-5" />
           </div>
           <span className="text-xl font-black text-slate-900 tracking-tighter">LogiTrack</span>
        </div>
        
        <button 
          onClick={toggleLang} 
          className="flex items-center gap-2 text-blue-600 font-bold text-sm px-4 py-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all active:scale-95"
        >
          <Globe className="w-4 h-4" />
          {isAr ? 'English' : 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©'}
        </button>
      </header>

      {/* Ø¹Ø±Ø¶ ÙˆØ§Ø¬Ù‡Ø© Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ù…Ø¨Ø§Ø´Ø±Ø© Ø¨Ø¯ÙˆÙ† Ø´Ø±ÙˆØ· */}
      <main className="flex-1 animate-in fade-in duration-700">
        <UserView lang={lang} />
      </main>

      {/* Ø¹Ù„Ø§Ù…Ø© Ù…Ø§Ø¦ÙŠØ© Ø¨Ø³ÙŠØ·Ø© Ù„Ù„ØªØ£ÙƒÙŠØ¯ Ø¹Ù„Ù‰ Ø§Ù„Ù†Ø³Ø®Ø© */}
      <div className="fixed bottom-2 left-2 z-[999] opacity-10 pointer-events-none">
        <span className="text-[9px] font-mono bg-slate-200 px-2 py-0.5 rounded uppercase">Verified_Client_Build</span>
      </div>
    </div>
  );
};

export default App;
