import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { Menu, User, Briefcase, Search, LogOut, LayoutDashboard, Heart } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/40 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Go<span className="text-indigo-600">Servik</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/explore" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2">
              <Search className="h-4 w-4" />
              Explore Services
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              {currentUser.role === 'customer' && (
                <Link to="/dashboard?tab=favorites" className="text-slate-600 hover:text-slate-900 transition-colors">
                  <Heart className="h-5 w-5" />
                </Link>
              )}
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="h-4 w-px bg-slate-200"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
              <div className="flex items-center gap-2 px-1 py-0.5 rounded-full bg-indigo-50 border border-indigo-100/50">
                <span className="text-xs font-semibold text-indigo-700 pl-2">{currentUser.name}</span>
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-indigo-700" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Sign In
              </Link>
              <Link to="/professionals" className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-700">
                Join as Professional
              </Link>
            </>
          )}
        </div>

        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-4">
          <Link to="/explore" className="block text-sm font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
            Explore Services
          </Link>
          {currentUser ? (
            <>
              <div className="flex items-center gap-2 py-2 border-b border-slate-100">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-indigo-700" />
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-800">{currentUser.name}</span>
              </div>
              <Link to="/dashboard" className="block text-sm font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block text-sm font-medium text-slate-600 w-full text-left">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-sm font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/professionals" className="block text-sm font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
                Join as Professional
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
