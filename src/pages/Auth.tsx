import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { 
  Mail, Phone, Lock, User as UserIcon, Shield, 
  Sparkles, UserCheck, ArrowRight, Eye, EyeOff, 
  CheckCircle2, RefreshCw, ArrowLeft, AlertCircle 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 India (+91)' },
  { code: '+1', label: '🇺🇸 US (+1)' },
  { code: '+44', label: '🇬🇧 UK (+44)' },
  { code: '+971', label: '🇦🇪 UAE (+971)' },
  { code: '+65', label: '🇸🇬 Singapore (+65)' },
  { code: '', label: 'None (Direct Number)' },
];

function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

interface AuthFormProps {
  initialMode?: 'signup' | 'signin';
}

export function AuthForm({ initialMode = 'signup' }: AuthFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, professionals, customers } = useStore();

  // Mode: Sign Up (default) or Sign In
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>(initialMode);

  // Role: Customer or Professional Partner
  const isDefaultPro = location.pathname.includes('professional');
  const [role, setRole] = useState<'customer' | 'professional'>(isDefaultPro ? 'professional' : 'customer');

  // Form Fields for Simple Sign Up: Name, Email, Mobile, Password
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // For Sign In: login method (email or mobile)
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');

  // Loading and feedback states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Email Code Verification Modal state (via Supabase Auth)
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendSuccess, setResendSuccess] = useState('');
  const [pendingSignupUser, setPendingSignupUser] = useState<{
    name: string;
    email: string;
    mobile: string;
    role: 'customer' | 'professional';
    uid?: string;
  } | null>(null);

  // Resend cooldown timer
  useEffect(() => {
    let timer: any;
    if (showVerifyModal && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showVerifyModal, resendCooldown]);

  // Sync role if path changes
  useEffect(() => {
    if (location.pathname.includes('professional')) {
      setRole('professional');
    } else {
      setRole('customer');
    }
  }, [location.pathname]);

  // Handle Google OAuth Login via Supabase
  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const isIframe = typeof window !== 'undefined' && window.self !== window.top;
      
      const { data, error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          skipBrowserRedirect: isIframe,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (oauthErr) {
        if (oauthErr.message.toLowerCase().includes('provider is not enabled')) {
          throw new Error('Google Sign-In is enabled in the code. To activate Google Auth, toggle Google ON under Authentication → Providers in your Supabase Dashboard.');
        }
        throw oauthErr;
      }

      if (isIframe && data?.url) {
        // Open OAuth in new tab if in preview iframe to avoid X-Frame-Options blocking
        const newWindow = window.open(data.url, '_blank', 'width=520,height=620');
        if (!newWindow) {
          window.location.href = data.url;
        } else {
          setSuccessMsg('Google login window opened. Complete sign in to proceed.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication failed. Please try again or use email.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Simple Sign Up: Name, Email, Mobile, Password
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhoneDigits = mobileNumber.replace(/\D/g, '');

    // Validation
    if (!cleanName) {
      setError('Please enter your full name.');
      setLoading(false);
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (cleanPhoneDigits.length !== 10) {
      setError('Please enter a valid 10-digit mobile number (e.g. 9876543210).');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    const fullPhone = `${countryCode}${cleanPhoneDigits}`;

    // Cross-role validation check: prevent conflicts between customer & professional
    if (role === 'customer') {
      const conflictPro = professionals.find((p) => {
        const pEmail = (p.email || '').toLowerCase();
        const pPhone = (p.mobile || '').replace(/\D/g, '');
        return pEmail === cleanEmail || (pPhone && pPhone.slice(-10) === cleanPhoneDigits.slice(-10));
      });
      if (conflictPro) {
        setError("This email or mobile is registered as a Partner. Please switch role to 'Partner' to sign in.");
        setLoading(false);
        return;
      }
    } else {
      const conflictCust = customers.find((c) => {
        const cEmail = (c.email || '').toLowerCase();
        const cPhone = (c.mobile || '').replace(/\D/g, '');
        return cEmail === cleanEmail || (cPhone && cPhone.slice(-10) === cleanPhoneDigits.slice(-10));
      });
      if (conflictCust) {
        setError("This email or mobile is registered as a Customer. Customers cannot register as Partners with identical credentials.");
        setLoading(false);
        return;
      }
    }

    try {
      // 1. Trigger Supabase Auth SignUp
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            display_name: cleanName,
            mobile: fullPhone,
            role: role,
          },
        },
      });

      if (signUpErr) {
        const msg = signUpErr.message.toLowerCase();
        if (msg.includes('user already registered') || msg.includes('already exists')) {
          throw new Error('An account with this email already exists. Please switch to Sign In.');
        }
        throw new Error(signUpErr.message);
      }

      // Check if user already exists (Supabase returns empty identities array when email confirmation is active)
      if (signUpData.user?.identities && signUpData.user.identities.length === 0) {
        throw new Error('An account with this email already exists. Please switch to Sign In.');
      }

      // If user was auto-confirmed (e.g. email confirmations turned off in project)
      if (signUpData.session) {
        login(cleanEmail, role, cleanName, {
          mobile: fullPhone,
          uid: signUpData.user?.id,
        });
        navigate('/dashboard');
        return;
      }

      // Store pending signup details and open verification modal
      setPendingSignupUser({
        name: cleanName,
        email: cleanEmail,
        mobile: fullPhone,
        role: role,
        uid: signUpData.user?.id,
      });

      setOtpCode('');
      setOtpError('');
      setResendCooldown(60);
      setShowVerifyModal(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP Code sent to email via Supabase Auth
  const handleVerifyOtp = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!pendingSignupUser) return;

    const trimmedCode = otpCode.trim();
    if (trimmedCode.length < 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const { data: verifyData, error: verifyErr } = await supabase.auth.verifyOtp({
        email: pendingSignupUser.email,
        token: trimmedCode,
        type: 'signup',
      });

      if (verifyErr) {
        throw new Error(verifyErr.message || 'Invalid or expired verification code.');
      }

      // Success! Log the user in
      const finalUid = verifyData.user?.id || pendingSignupUser.uid;
      login(pendingSignupUser.email, pendingSignupUser.role, pendingSignupUser.name, {
        mobile: pendingSignupUser.mobile,
        uid: finalUid,
      });

      setShowVerifyModal(false);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setOtpError(err.message || 'Verification failed. Please check your code and try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Resending the verification code via Supabase Auth
  const handleResendCode = async () => {
    if (!pendingSignupUser || resendCooldown > 0) return;
    setOtpLoading(true);
    setOtpError('');
    setResendSuccess('');

    try {
      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email: pendingSignupUser.email,
      });

      if (resendErr) {
        throw new Error(resendErr.message);
      }

      setResendSuccess('A new verification code has been dispatched to your email.');
      setResendCooldown(60);
    } catch (err: any) {
      setOtpError(err.message || 'Could not resend code. Please try again shortly.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Sign In (for existing accounts)
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    let identifier = '';
    if (loginMethod === 'email') {
      identifier = email.trim();
    } else {
      const cleanPhone = mobileNumber.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setError('Please enter a valid 10-digit mobile number (e.g. 9876543210).');
        setLoading(false);
        return;
      }
      identifier = `${countryCode}${cleanPhone}@kaamnow.com`;
    }

    const cleanId = identifier.toLowerCase();

    // Admin bypass credentials
    if (
      (cleanId === 'admin@kaamnow.com' || cleanId === 'admin' || cleanId === 'kaamnow') &&
      (password === 'admin123' || password === 'kaamnow@%*134679' || password === 'goservik@%*134679')
    ) {
      login('admin@kaamnow.com', 'admin', 'KaamNow Admin', {});
      sessionStorage.setItem('admin_authenticated', 'true');
      navigate('/admin');
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: password,
      });

      if (authErr) {
        const msg = authErr.message.toLowerCase();
        if (msg.includes('email not confirmed')) {
          // Trigger OTP verification modal for unverified email
          setPendingSignupUser({
            name: email.split('@')[0],
            email: email.trim().toLowerCase(),
            mobile: mobileNumber,
            role: role,
          });
          setShowVerifyModal(true);
          setResendCooldown(60);
          setError('Your email is not verified yet. Please enter the verification code sent to your email.');
          setLoading(false);
          return;
        }

        if (msg.includes('invalid login credentials') || msg.includes('user not found')) {
          throw new Error('Incorrect credentials. This account does not exist or the password is wrong. Please Sign Up first.');
        } else {
          throw new Error(authErr.message);
        }
      }

      const uid = authData.user?.id;
      const displayName = loginMethod === 'email' ? identifier.split('@')[0] : `User ${mobileNumber}`;

      login(identifier, role, displayName, {
        mobile: mobileNumber,
        uid: uid,
      });

      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-md space-y-6 bg-white/80 backdrop-blur-md p-7 sm:p-8 rounded-3xl shadow-2xl border border-white/60">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <UserCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-3.5 text-2xl font-black tracking-tight text-slate-900">
            {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {authMode === 'signup'
              ? 'Join KaamNow in seconds with name, email, mobile & password.'
              : 'Sign in to access your bookings, quotes, and profile.'}
          </p>
        </div>

        {/* Unified Mode Toggle: Sign Up vs Sign In */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'signup'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up (New User)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'signin'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In (Existing)
          </button>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200/50">
          <button
            type="button"
            onClick={() => {
              setRole('customer');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'customer'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/40'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>👤 Customer</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('professional');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'professional'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/40'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>💼 Partner</span>
          </button>
        </div>

        {/* Google OAuth Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all disabled:opacity-50"
          >
            {googleLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-slate-500" />
            ) : (
              <GoogleIcon className="h-4 w-4" />
            )}
            <span>{googleLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 absolute uppercase tracking-wider">
            or with {authMode === 'signup' ? 'simple signup' : 'credentials'}
          </span>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs border border-rose-100 flex items-start gap-2 font-medium">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs border border-emerald-100 flex items-start gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIMPLE SIGN UP FORM: Name, Email, Mobile, Password */}
        {authMode === 'signup' ? (
          <form className="space-y-4" onSubmit={handleSignUp}>
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">A 6-digit confirmation code will be sent to this email via Supabase Auth.</p>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code || 'Direct'}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="10-digit number"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-1.5 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Sign Up as {role === 'customer' ? 'Customer' : 'Partner'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        ) : (
          /* SIGN IN FORM (For existing users) */
          <form className="space-y-4" onSubmit={handleSignIn}>
            <div className="flex bg-slate-100/70 p-1 rounded-xl border border-slate-200/50 mb-3">
              <button
                type="button"
                onClick={() => { setLoginMethod('email'); setError(''); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  loginMethod === 'email' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('mobile'); setError(''); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  loginMethod === 'mobile' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Phone className="h-3.5 w-3.5" />
                Mobile
              </button>
            </div>

            {loginMethod === 'email' ? (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code || 'Direct'}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="10-digit number"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all flex items-center justify-center gap-1.5 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {role === 'customer' ? 'Customer' : 'Partner'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* Footer info & toggle prompt */}
        <div className="text-center border-t border-slate-150 pt-4">
          <p className="text-xs text-slate-500">
            {authMode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setError('');
                  }}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Sign In Here
                </button>
              </>
            ) : (
              <>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setError('');
                  }}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Create Simple Account
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* EMAIL OTP VERIFICATION MODAL VIA SUPABASE AUTH */}
      {showVerifyModal && pendingSignupUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 space-y-5">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-md">
                <Shield className="h-7 w-7 animate-pulse" />
              </div>
              <h3 className="mt-3.5 text-xl font-black text-slate-900">Verify Your Email</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                A 6-digit confirmation code has been sent to{' '}
                <span className="font-bold text-slate-800">{pendingSignupUser.email}</span> via Supabase Auth.
              </p>
            </div>

            {/* Supabase security pill */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-center gap-2 text-[11px] text-indigo-900 font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Check your inbox or spam folder for the code</span>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 text-center mb-2 uppercase tracking-wider">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="••••••"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="block w-full text-center text-2xl font-mono tracking-[0.5em] rounded-xl border border-slate-200 bg-slate-50 py-3 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-300"
                />
              </div>

              {otpError && (
                <div className="text-center text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
                  {otpError}
                </div>
              )}

              {resendSuccess && (
                <div className="text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                  {resendSuccess}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowVerifyModal(false)}
                  className="flex-1 h-11 text-xs font-bold rounded-xl border-slate-200 text-slate-600"
                  disabled={otpLoading}
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
                  disabled={otpLoading || otpCode.length < 6}
                >
                  {otpLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </div>

              {/* Resend Option */}
              <div className="text-center pt-2">
                {resendCooldown > 0 ? (
                  <p className="text-[11px] text-slate-400 font-medium">
                    Resend code in <span className="font-bold text-slate-600">{resendCooldown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={otpLoading}
                    className="text-[11px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Resend Verification Code
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function Login() {
  return <AuthForm initialMode="signup" />;
}

export function Register() {
  return <AuthForm initialMode="signup" />;
}
