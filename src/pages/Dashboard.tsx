import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { 
  Calendar, User as UserIcon, Settings, Heart, MessageSquare, Briefcase, 
  FileText, Bell, UserCheck, Sparkles
} from 'lucide-react';
import { CustomerDashboardView } from '../components/dashboard/CustomerDashboardView';
import { ProfessionalDashboardView } from '../components/dashboard/ProfessionalDashboardView';
import { AdminDashboardView } from '../components/dashboard/AdminDashboardView';
import { auth } from '../lib/firebase';
import { sendEmailVerification } from 'firebase/auth';

export function Dashboard() {
  const { currentUser } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const currentTab = searchParams.get('tab') || 'overview';

  const [verificationSent, setVerificationSent] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);

  const handleResendVerification = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setResendLoading(true);
    try {
      await sendEmailVerification(user);
      setVerificationSent(true);
    } catch (err: any) {
      console.error("Failed to resend email verification", err);
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // Dedicated Nav items for each role
  const navItemsByRole = {
    customer: [
      { id: 'overview', label: 'Overview', icon: UserIcon },
      { id: 'bookings', label: 'My Bookings', icon: Calendar },
      { id: 'favorites', label: 'Saved Experts', icon: Heart },
      { id: 'messages', label: 'Helpline & Chat', icon: MessageSquare },
      { id: 'settings', label: 'Profile Settings', icon: Settings },
    ],
    professional: [
      { id: 'overview', label: 'Overview', icon: Briefcase },
      { id: 'bookings', label: 'Booking Requests', icon: Calendar },
      { id: 'services', label: 'Manage Services', icon: FileText },
      { id: 'messages', label: 'Customer Chat', icon: MessageSquare },
      { id: 'settings', label: 'Business Profile', icon: Settings },
    ],
    admin: [
      { id: 'overview', label: 'Platform Summary', icon: Briefcase },
      { id: 'users', label: 'Verify Professionals', icon: UserCheck },
      { id: 'messages', label: 'Support Chat', icon: MessageSquare },
      { id: 'settings', label: 'Admin Preferences', icon: Settings },
    ]
  };

  const currentRole = currentUser.role === 'admin' ? 'admin' : (currentUser.role === 'professional' ? 'professional' : 'customer');
  const roleNav = navItemsByRole[currentRole];

  return (
    <div className="bg-transparent min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg p-5 sticky top-24">
            <div className="flex items-center gap-3 mb-6 p-2">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover animate-fade-in" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="h-6 w-6 text-slate-500" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                  {currentUser.name}
                  {currentUser.role === 'professional' && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
                </h3>
                <p className="text-xs text-slate-500 capitalize">{currentUser.role} Account</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              {roleNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      currentTab === item.id 
                        ? 'bg-slate-900 text-white shadow-lg' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Dashboard Content Container */}
        <main className="flex-1 space-y-6">
          <div className="flex items-center justify-between bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
            <h1 className="text-xl font-bold text-slate-900 capitalize flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block animate-pulse"></span>
              {currentTab.replace('-', ' ')}
            </h1>
            <div className="flex items-center gap-2">
              {currentUser.role === 'professional' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1.5 border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active Provider
                </span>
              )}
              <Button variant="outline" size="sm" className="gap-2 text-xs font-bold border-slate-200/80 bg-white/40">
                <Bell className="h-3.5 w-3.5" /> Updates
              </Button>
            </div>
          </div>

          {/* Email Verification Alert Banner to Maintain Legitimacy */}
          {auth.currentUser && auth.currentUser.email && !auth.currentUser.email.endsWith('@goservik.com') && !auth.currentUser.emailVerified && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in backdrop-blur-sm">
              <div className="flex gap-3">
                <span className="text-2xl mt-0.5">✉️</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Please verify your email address</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    A legitimacy confirmation link was sent to <strong className="font-bold">{auth.currentUser.email}</strong>. 
                    Please verify your email to maintain full account authenticity.
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                {verificationSent ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 rounded-xl px-3.5 py-2">
                    ✓ Verification Link Sent!
                  </span>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleResendVerification} 
                    disabled={resendLoading}
                    className="text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                  >
                    {resendLoading ? 'Sending...' : 'Resend Verification link'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Conditional Sub-View Rendering depending on user Role */}
          {currentUser.role === 'customer' && (
            <CustomerDashboardView currentTab={currentTab} setTab={setTab} />
          )}

          {currentUser.role === 'professional' && (
            <ProfessionalDashboardView currentTab={currentTab} setTab={setTab} />
          )}

          {currentUser.role === 'admin' && (
            <AdminDashboardView currentTab={currentTab} setTab={setTab} />
          )}

        </main>
      </div>
    </div>
  );
}
