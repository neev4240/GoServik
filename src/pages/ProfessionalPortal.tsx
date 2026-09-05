import { Link } from 'react-router-dom';
import { 
  Briefcase, ShieldCheck, CreditCard, Sparkles, AlertTriangle, 
  MessageSquare, Settings, ArrowRight, UserX, BookOpen, Clock,
  Award, Zap, CheckCircle2, Gift, HeartHandshake, TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useStore } from '../store';

export function ProfessionalPortal() {
  const { currentUser } = useStore();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 z-0"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="px-3.5 py-1 text-[10px] uppercase tracking-widest font-bold text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20 inline-block mb-6">
              KaamNow Partner Network
            </span>
            <h1 className="text-4xl font-black leading-[1.1] sm:text-5xl lg:text-6xl mb-6 tracking-tight">
              Grow Your Trade Business <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">with KaamNow.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
              Connect directly with customers near you. Free registration, zero monthly subscriptions for the first 3 quarters, and milestone rewards for top performers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {currentUser?.role === 'professional' ? (
                <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs h-12 shadow-lg shadow-indigo-500/20">
                  <Link to="/dashboard">Go to Your Professional Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs h-12 shadow-lg shadow-indigo-500/20">
                    <Link to="/register-professional">Apply as an Independent Professional</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold text-xs h-12">
                    <Link to="/login-professional">Professional Login</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Strict Policy Section - Architectural Separation */}
      <section className="py-10 bg-amber-50/70 border-b border-amber-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 tracking-tight">Account Separation & Security Policy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                KaamNow enforces strict separation between Customers and Independent Professionals to protect marketplace integrity, avoid booking conflicts, and ensure transparent verification:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <li className="flex gap-2.5 text-xs text-slate-700 font-medium">
                  <UserX className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Separate Accounts:</span> Customer and Professional accounts cannot share the same mobile number or email.
                  </div>
                </li>
                <li className="flex gap-2.5 text-xs text-slate-700 font-medium">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Direct Contractor:</span> Professionals are independent contractors, not employees of KaamNow.
                  </div>
                </li>
                <li className="flex gap-2.5 text-xs text-slate-700 font-medium">
                  <Clock className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Real-Time Job Workflow:</span> Update status live from 'En Route' to 'Arrived' and 'Completed'.
                  </div>
                </li>
                <li className="flex gap-2.5 text-xs text-slate-700 font-medium">
                  <BookOpen className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">ID Verification:</span> Aadhaar / Gov ID and safety badge compliance for enhanced trust.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Model & Transparency */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
              Fair & Transparent Economics
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
              Simple, Predictable Revenue Model
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              No hidden listing fees or predatory charges. Designed to maximize earnings for independent technicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Launch Phase */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Phase 1 (Q1 - Q3)</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">₹0 Free Registration</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Zero monthly subscription fees for all verified professionals during our launch phase. Keep your business running with full independence.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free Onboarding Active
                </span>
              </div>
            </div>

            {/* Platform Fee */}
            <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-200 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Platform Commission</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">5% Service Fee</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Only a modest 5% convenience fee is deducted on completed customer bookings. This funds payment processing, safety verification, and KaamNow Work Protection.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-indigo-200">
                <span className="text-xs font-bold text-indigo-700">
                  You keep 95% of every job billed
                </span>
              </div>
            </div>

            {/* Rating-Linked Subscriptions */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Starting Q4</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Rating-Linked Tiers</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  The better your customer reviews, the lower your subscription cost:
                </p>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>⭐ 4.8 – 5.0 stars:</span>
                    <span className="text-emerald-600">₹100/mo (Max Discount)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>⭐ 4.5 – 4.79 stars:</span>
                    <span>₹250/mo (Standard)</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>⭐ Below 4.5 stars:</span>
                    <span>₹500/mo (Review Tier)</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-500">
                  High quality directly saves you money
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Incentives & Gamification */}
      <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-indigo-700 bg-indigo-100/60 rounded-full">
              Recognition & Rewards
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
              Milestone Bonuses & Quality Badges
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Earn tool credits, premium profile spotlights, and zero-fee perks as you complete more jobs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm">
                10
              </div>
              <h3 className="font-bold text-slate-900 text-sm">10 Completed Jobs</h3>
              <p className="text-xs text-slate-500">
                Unlock a <strong className="text-slate-800">₹500 Tool Voucher</strong> credit for trade supplies and gear.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                50
              </div>
              <h3 className="font-bold text-slate-900 text-sm">50 Completed Jobs</h3>
              <p className="text-xs text-slate-500">
                Receive a <strong className="text-slate-800">Free Premium Spotlight</strong> banner boosting your search ranking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm">
                100
              </div>
              <h3 className="font-bold text-slate-900 text-sm">100 Completed Jobs</h3>
              <p className="text-xs text-slate-500">
                Earn <strong className="text-slate-800">0% Platform Fees</strong> for an entire month — keep 100% of your earnings!
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Safety Badges</h3>
              <p className="text-xs text-slate-500">
                Qualify for <strong className="text-slate-800">Elder-Safe</strong> and <strong className="text-slate-800">Women-Safe</strong> certified badges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-14 sm:py-20 bg-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Build Your Trade Business with KaamNow?
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
            Sign up in 3 minutes, choose your categories, set your standard rates, and start receiving job requests today.
          </p>
          <div className="pt-2">
            <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 font-black text-xs px-8 h-12 rounded-xl shadow-xl">
              <Link to="/register-professional">Apply as a Professional Partner</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
