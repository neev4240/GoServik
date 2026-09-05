import { useState, useEffect } from 'react';
import { useLanguage } from '../lib/i18n';
import { Languages, Check, Sparkles } from 'lucide-react';

export function FirstVisitLanguageModal() {
  const { lang, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has explicitly made a language choice previously
    const hasChosen = localStorage.getItem('kaamnow_lang_chosen');
    if (!hasChosen) {
      setIsOpen(true);
    }
  }, []);

  const handleSelect = (selectedLang: 'en' | 'hi') => {
    setLanguage(selectedLang);
    localStorage.setItem('kaamnow_lang_chosen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 text-center space-y-6">
        <div className="mx-auto w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
          <Languages className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Choose Language / भाषा चुनें
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Select your preferred language to experience KaamNow
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* English Option */}
          <button
            onClick={() => handleSelect('en')}
            className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between h-32 hover:border-indigo-500 hover:shadow-md ${
              lang === 'en' ? 'border-indigo-600 bg-indigo-50/40' : 'border-slate-200 bg-white'
            }`}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                English
              </span>
              <span className="font-bold text-slate-900 text-lg block">English</span>
              <span className="text-xs text-slate-500 mt-1 block">Connect. Book. Sorted.</span>
            </div>
            {lang === 'en' && (
              <span className="self-end p-1 bg-indigo-600 text-white rounded-full">
                <Check className="w-3 h-3" />
              </span>
            )}
          </button>

          {/* Hindi / Hinglish Option */}
          <button
            onClick={() => handleSelect('hi')}
            className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between h-32 hover:border-indigo-500 hover:shadow-md ${
              lang === 'hi' ? 'border-indigo-600 bg-indigo-50/40' : 'border-slate-200 bg-white'
            }`}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                हिंग्लिश / हिन्दी
              </span>
              <span className="font-bold text-slate-900 text-lg block">Hinglish</span>
              <span className="text-xs text-slate-500 mt-1 block">कनेक्ट. बुक. सॉर्टेड.</span>
            </div>
            {lang === 'hi' && (
              <span className="self-end p-1 bg-indigo-600 text-white rounded-full">
                <Check className="w-3 h-3" />
              </span>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          You can change your language anytime from the top navigation bar.
        </p>
      </div>
    </div>
  );
}

export function LanguageSwitcher() {
  const { lang, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
          lang === 'en'
            ? 'bg-white text-indigo-700 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
          lang === 'hi'
            ? 'bg-white text-indigo-700 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
}
