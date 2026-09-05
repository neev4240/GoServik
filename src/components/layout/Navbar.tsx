import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { useLanguage } from '../../lib/i18n';
import { LanguageSwitcher } from '../LanguageSelector';
import { Menu, User, Briefcase, Search, LogOut, LayoutDashboard, Shield, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { currentUser, logout } = useStore();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Kaam<span className="text-indigo-600">Now</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Marketplace
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-wide hidden sm:block -mt-1">
                {t('tagline')}
              </p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/explore" 
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
            >
              <Search className="h-4 w-4 text-slate-400" />
              {t('exploreServices')}
            </Link>
            
            <Link 
              to="/explore?protection=true" 
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-colors"
            >
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              {t('workProtection')}
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />

          {currentUser ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                {t('dashboard')}
              </Link>
              
              <div className="h-4 w-px bg-slate-200" />

              <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 leading-tight max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-600 capitalize leading-none">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                title={t('signOut')}
                className="p-1.5 text-slate-500 hover:text-rose-600 transition-colors rounded-lg hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-sm font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                {t('signIn')}
              </Link>
              <Link 
                to="/professionals" 
                className="inline-flex h-9 items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-lg"
              >
                {t('joinAsProBtn')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <button 
            className="p-2 text-slate-700 rounded-lg hover:bg-slate-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 shadow-xl">
          <Link 
            to="/explore" 
            className="flex items-center justify-between text-sm font-semibold text-slate-800 p-2 rounded-xl hover:bg-slate-50" 
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-indigo-600" />
              {t('exploreServices')}
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link 
            to="/explore?protection=true" 
            className="flex items-center justify-between text-sm font-semibold text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100" 
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              {t('workProtection')}
            </span>
            <ChevronRight className="h-4 w-4 text-emerald-500" />
          </Link>

          {currentUser ? (
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-xs text-indigo-600 font-medium capitalize">{currentUser.role}</p>
                </div>
              </div>

              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 p-2 rounded-xl hover:bg-slate-50" 
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4 text-indigo-600" />
                {t('dashboard')}
              </Link>

              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-sm font-semibold text-rose-600 p-2 rounded-xl hover:bg-rose-50 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                {t('signOut')}
              </button>
            </div>
          ) : (
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <Link 
                to="/login" 
                className="block text-center py-2.5 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50" 
                onClick={() => setIsMenuOpen(false)}
              >
                {t('signIn')}
              </Link>
              <Link 
                to="/professionals" 
                className="block text-center py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-md" 
                onClick={() => setIsMenuOpen(false)}
              >
                {t('joinAsProBtn')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
