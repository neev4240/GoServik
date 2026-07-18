import { Link } from 'react-router-dom';
import { 
  Briefcase, ShieldCheck, CreditCard, Sparkles, AlertTriangle, 
  MessageSquare, Settings, ArrowRight, UserX, BookOpen, Clock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useStore } from '../store';

export function ProfessionalPortal() {
  const { currentUser } = useStore();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 z-0"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="px-3.5 py-1 text-[10px] uppercase tracking-widest font-bold text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20 inline-block mb-6">
              GoServik Partner Network
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl mb-6 tracking-tight">
              Grow Your Service Business <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">with GoServik.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Join India's most transparent local services marketplace. Earn 100% of your service charges, chat directly with clients in your area, and take complete control of your bookings.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {currentUser?.role === 'professional' ? (
                <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs h-12 shadow-lg shadow-indigo-500/20">
                  <Link to="/dashboard">Go to Your Partner Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs h-12 shadow-lg shadow-indigo-500/20">
                    <Link to="/register-professional">Apply as a Professional Partner</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-slate-700 hover:bg-slate-850 text-white rounded-xl font-bold text-xs h-12">
                    <Link to="/login-professional">Login to Partner Desk</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Strict Policy Section - Addresses User Requirement directly */}
      <section className="py-12 bg-amber-50/50 border-b border-amber-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-md flex flex-col md:flex-row gap-6 items-start">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 text-amber-600">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Important Partner Account Policy Guidelines</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                GoServik maintains strict architectural separation between our Customer base and our Professional Partners to ensure security, prevent double-booking, and eliminate pricing abuse:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <li className="flex gap-3 text-xs text-slate-700 font-medium">
                  <UserX className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-900">No Customer Registration:</span> Registered professional accounts are blocked from converting to or signing up for secondary customer profiles.
                  </div>
                </li>
                <li className="flex gap-3 text-xs text-slate-700 font-medium">
                  <UserX className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-900">No Booking Services:</span> Professional partner credentials cannot be used to book plumbing, cleaning, electrical, or any local service.
                  </div>
                </li>
                <li className="flex gap-3 text-xs text-slate-700 font-medium">
                  <ShieldCheck className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-900">One Phone Number Constraint:</span> A single phone number can only be linked to one profile. Professionals cannot reuse their partner phone number for custom client bookings.
                  </div>
                </li>
                <li className="flex gap-3 text-xs text-slate-700 font-medium">
                  <BookOpen className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-900">Standardized Verification:</span> Every business must satisfy physical background verification to receive service booking requests.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why GoServik Partner Benefits */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Unmatched Benefits for Verified Partners
            </h2>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed">
              We empower local technicians with direct booking tools, full transparency, and commission-free operation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">0% Commission</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Keep 100% of the money you make. GoServik does not deduct any percentage or fee on booking assignments.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Standardized Diagnostics</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No complex price lists to maintain. Clients book based on a flat ₹99 visiting fee, and you bill additional work on site directly.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Direct Client Chat</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect with customers inside our dashboard chat workspace to schedule arrivals, share details, and ask directions.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Settings className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Flexible Listing Desk</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add new specializations, configure availability statuses, set business hours, and update geographic service radius instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="bg-transparent py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/30 via-indigo-600 to-indigo-600 z-0"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="max-w-xl text-center md:text-left">
                <h3 className="text-2xl font-extrabold sm:text-3xl leading-tight">Ready to Take Your Business Online?</h3>
                <p className="text-sm text-indigo-100 mt-2 leading-relaxed">
                  Join hundreds of verified electricians, plumbers, painters, and carpenters in Mumbai who are earning more with GoServik.
                </p>
              </div>
              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                {currentUser?.role === 'professional' ? (
                  <Button asChild className="bg-white hover:bg-indigo-50 text-indigo-600 font-extrabold text-xs h-11 px-6 rounded-xl shadow-md">
                    <Link to="/dashboard">Go to Your Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild className="bg-white hover:bg-indigo-50 text-indigo-600 font-extrabold text-xs h-11 px-6 rounded-xl shadow-md">
                      <Link to="/register-professional">Get Started Now</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-indigo-400 hover:bg-indigo-700/50 text-white font-bold text-xs h-11 px-6 rounded-xl">
                      <Link to="/login-professional">Partner Login</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
