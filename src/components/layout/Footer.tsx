import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">GoServik</span>
            </Link>
            <p className="text-sm text-slate-500">
              The trusted marketplace connecting customers with verified independent professionals.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Customers</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/explore" className="hover:text-slate-900">How to Hire</Link></li>
              <li><Link to="/explore" className="hover:text-slate-900">Explore Services</Link></li>
              <li><Link to="/explore" className="hover:text-slate-900">Trust & Safety</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Professionals</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/register" className="hover:text-slate-900">Become a Professional</Link></li>
              <li><Link to="/register" className="hover:text-slate-900">Success Stories</Link></li>
              <li><Link to="/register" className="hover:text-slate-900">Community Guidelines</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/about" className="hover:text-slate-900">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-slate-900">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-slate-900">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-slate-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>© {new Date().getFullYear()} GoServik. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>English (UK)</span>
            <span>£ GBP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
