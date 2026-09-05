import { Link } from 'react-router-dom';
import { Briefcase, Shield, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { KAAMNOW_CATEGORIES } from '../../lib/categories';
import { LanguageSwitcher } from '../LanguageSelector';

export function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 pt-14 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Kaam<span className="text-indigo-400">Now</span>
                </span>
              </Link>
              <div className="md:hidden">
                <LanguageSwitcher />
              </div>
            </div>
            
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              {t('tagline')}
            </p>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('brandPromise')}
            </p>

            {/* Marketplace Disclaimer */}
            <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{lang === 'hi' ? 'मार्केटप्लेस सूचना' : 'Marketplace Notice'}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {t('disclaimer')}
              </p>
            </div>
          </div>
          
          {/* 16 Popular Categories */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-white text-sm mb-4 tracking-wider uppercase">
              {t('popularTrades')}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {KAAMNOW_CATEGORIES.slice(0, 7).map(cat => (
                <li key={cat.id}>
                  <Link 
                    to={`/book?category=${cat.id}`} 
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {lang === 'hi' ? cat.hindiName || cat.name : cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/explore" className="text-indigo-400 hover:underline font-semibold">
                  {lang === 'hi' ? '+ सभी 16 श्रेणियां देखें →' : '+ View All 16 Categories →'}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customers & Trust */}
          <div>
            <h3 className="font-bold text-white text-sm mb-4 tracking-wider uppercase">
              {t('customer')}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/explore" className="hover:text-white">{t('findPro')}</Link></li>
              <li>
                <Link to="/trust" className="hover:text-emerald-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  {t('workProtection')}
                </Link>
              </li>
              <li><Link to="/how-it-works" className="hover:text-white">{t('howItWorksTitle')}</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">{t('dashboard')}</Link></li>
              <li><Link to="/contact" className="hover:text-white">{t('navContact')}</Link></li>
              <li><Link to="/stories" className="hover:text-white">{t('storiesMainTitle')}</Link></li>
            </ul>
          </div>
          
          {/* Professionals & Platform */}
          <div>
            <h3 className="font-bold text-white text-sm mb-4 tracking-wider uppercase">
              {t('professional')}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/professionals" className="hover:text-indigo-400 font-semibold">{t('proHeroJoinBtn')}</Link></li>
              <li><Link to="/about" className="hover:text-white">{t('navAbout')}</Link></li>
              <li><Link to="/guidelines" className="hover:text-white">{t('guidelinesMainTitle')}</Link></li>
              <li><Link to="/privacy" className="hover:text-white">{t('privacyTitle')}</Link></li>
              <li><Link to="/terms" className="hover:text-white">{t('termsTitle')}</Link></li>
              <li className="pt-2 border-t border-slate-800">
                <Link to="/admin" className="text-[11px] text-slate-500 hover:text-indigo-400 transition-colors font-mono">
                  {lang === 'hi' ? 'एडमिन पोर्टल' : 'Admin Management'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} KaamNow. All rights reserved. Connect. Book. Sorted.</p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="hidden sm:flex gap-2 text-slate-500 font-medium">
              <span>English & हिन्दी (Hinglish)</span>
              <span>•</span>
              <span>Indian Rupee (₹ INR)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

