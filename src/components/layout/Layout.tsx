import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FirstVisitLanguageModal } from '../LanguageSelector';
import { CompleteProfileModal } from '../CompleteProfileModal';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FirstVisitLanguageModal />
      <CompleteProfileModal />
      <ScrollRestoration />
    </div>
  );
}
