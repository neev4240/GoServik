import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { Briefcase, Mail, Phone, Lock, User as UserIcon, Shield, ArrowLeft, Key } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 India (+91)' },
  { code: '+1', label: '🇺🇸 US (+1)' },
  { code: '+44', label: '🇬🇧 UK (+44)' },
  { code: '+971', label: '🇦🇪 UAE (+971)' },
  { code: '+65', label: '🇸🇬 Singapore (+65)' },
  { code: '', label: 'None (Direct Number)' },
];

export function Login() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const role = 'customer';
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, professionals, customers } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setError('');
    setForgotSuccess('');

    if (!forgotEmail.trim()) {
      setError('Please enter your email address');
      setForgotLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setForgotSuccess('A secure password reset link has been sent to your email address. Please check your inbox (and spam folder).');
      setForgotEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email. Please verify the address.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Construct identifier
    let identifier = '';
    if (loginMethod === 'email') {
      identifier = email.trim();
    } else {
      const cleanPhone = mobileNumber.replace(/\D/g, '');
      if (!cleanPhone) {
        setError('Please enter a valid mobile number');
        setLoading(false);
        return;
      }
      identifier = `${countryCode}${cleanPhone}@goservik.com`;
    }
    
    try {
      const cleanId = identifier.toLowerCase();
      
      // Determine if they are trying to log in as admin
      const finalRole = cleanId === 'admin@goservik.com' ? 'admin' : role;

      // Extract phone if login was via mobile identifier
      let extractedPhone = '';
      if (cleanId.endsWith('@goservik.com')) {
        const prefix = cleanId.split('@')[0];
        if (prefix.startsWith('+') || /^\d+$/.test(prefix)) {
          extractedPhone = prefix;
        }
      } else if (/^\+?\d+$/.test(cleanId)) {
        extractedPhone = cleanId;
      }

      const matchesEmailOrPhone = (user: any) => {
        const uEmail = (user.email || '').toLowerCase();
        const uPhone = (user.mobile || '').replace(/\D/g, '');
        const searchId = cleanId;
        const searchPhone = extractedPhone.replace(/\D/g, '');
        
        if (uEmail === searchId) return true;
        if (searchPhone && uPhone === searchPhone) return true;
        return false;
      };

      // 1. Cross-role login separation: don't allow customer to login as professional and vice versa
      if (finalRole === 'customer') {
        const isPro = professionals.find(matchesEmailOrPhone);
        if (isPro) {
          throw new Error("This account is registered as a Professional Partner. Please use the Professional Portal to log in.");
        }
      }

      // Check if user already exists
      const userExists = professionals.some(matchesEmailOrPhone) || customers.some(matchesEmailOrPhone);

      try {
        await signInWithEmailAndPassword(auth, identifier, password);
      } catch (err: any) {
        // If testing user doesn't exist, auto-create them for seamless workspace testing
        if (!userExists && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')) {
          await createUserWithEmailAndPassword(auth, identifier, password);
        } else {
          if (userExists) {
            throw new Error("Incorrect password. Please verify your password or use the 'Forgot password?' link to reset it.");
          }
          throw err;
        }
      }
      
      // Extract clean name from email
      const displayName = loginMethod === 'email' 
        ? identifier.split('@')[0] 
        : `User ${mobileNumber}`;

      login(identifier, finalRole, displayName, { mobile: extractedPhone });
      
      // Redirect
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (isForgotMode) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-transparent">
        <div className="w-full max-w-md space-y-8 bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/40">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <Key className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">Reset Password</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Enter your registered email address and we'll send you a secure link to reset your password.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm border border-red-100 text-center font-medium">
              {error}
            </div>
          )}

          {forgotSuccess && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-100 text-center font-medium leading-relaxed">
              {forgotSuccess}
            </div>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleForgotPassword}>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 transition-all" 
              disabled={forgotLoading}
            >
              {forgotLoading ? 'Sending link...' : 'Send Reset Link'}
            </Button>

            <button
              type="button"
              onClick={() => {
                setIsForgotMode(false);
                setError('');
                setForgotSuccess('');
              }}
              className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all py-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-md space-y-8 bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/40">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">Sign in to GoServik</h2>
          <p className="mt-2 text-sm text-slate-600">
            Or <Link to="/register" className="font-medium text-indigo-600 hover:underline">create a new account</Link>
          </p>
        </div>

        {/* Static customer sign in notice */}
        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center text-xs font-semibold text-slate-600">
          Sign In Portal: Customer Account Only
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50">
          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              loginMethod === 'email'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/20'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail className="h-4 w-4" />
            Email Address
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('mobile'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              loginMethod === 'mobile'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/20'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Phone className="h-4 w-4" />
            Mobile Number
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm border border-red-100 text-center font-medium">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleLogin}>
          {loginMethod === 'email' ? (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                  placeholder="name@example.com or your registered email"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white/50 px-3 py-3 text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code || 'Direct'}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="9876543210 (No country code)"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">Remember me</label>
            </div>
            <div className="text-sm">
              <button 
                type="button"
                onClick={() => {
                  setIsForgotMode(true);
                  setError('');
                  setForgotSuccess('');
                }}
                className="font-semibold text-indigo-600 hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 transition-all" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function Register() {
  const role = 'customer';
  const [registerMethod, setRegisterMethod] = useState<'email' | 'mobile'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, professionals, customers } = useStore();
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let identifier = '';
    if (registerMethod === 'email') {
      identifier = email.trim();
    } else {
      const cleanPhone = mobileNumber.replace(/\D/g, '');
      if (!cleanPhone) {
        setError('Please enter a valid mobile number');
        setLoading(false);
        return;
      }
      identifier = `${countryCode}${cleanPhone}@goservik.com`;
    }

    try {
      const cleanId = identifier.toLowerCase();
      let extractedPhone = '';
      if (cleanId.endsWith('@goservik.com')) {
        const prefix = cleanId.split('@')[0];
        if (prefix.startsWith('+') || /^\d+$/.test(prefix)) {
          extractedPhone = prefix;
        }
      } else if (/^\+?\d+$/.test(cleanId)) {
        extractedPhone = cleanId;
      }

      const matchesEmailOrPhone = (user: any) => {
        const uEmail = (user.email || '').toLowerCase();
        const uPhone = (user.mobile || '').replace(/\D/g, '');
        const searchId = cleanId;
        const searchPhone = extractedPhone.replace(/\D/g, '');
        
        if (uEmail === searchId) return true;
        if (searchPhone && uPhone === searchPhone) return true;
        return false;
      };

      // 1. Cross-role validation during registration
      if (role === 'customer') {
        const isPro = professionals.find(matchesEmailOrPhone);
        if (isPro) {
          throw new Error("This email/mobile is already registered as a Professional. A Professional cannot register as a Customer.");
        }
      } else if (role === 'professional') {
        const isCust = customers.find(matchesEmailOrPhone);
        if (isCust) {
          throw new Error("This email/mobile is already registered as a Customer. A Customer cannot register as a Professional.");
        }
      }

      // 2. Phone number uniqueness check across ALL accounts (no duplicate phone logins)
      const phoneToCheck = extractedPhone || mobileNumber;
      const cleanPhoneToCheck = phoneToCheck.replace(/\D/g, '');
      if (cleanPhoneToCheck) {
        const dupPro = professionals.find(p => (p.mobile || '').replace(/\D/g, '') === cleanPhoneToCheck);
        const dupCust = customers.find(c => (c.mobile || '').replace(/\D/g, '') === cleanPhoneToCheck);
        if (dupPro || dupCust) {
          throw new Error("This mobile number is already linked to another registered account. One login per unique phone number is allowed.");
        }
      }

      // Firebase auth register
      const userCredential = await createUserWithEmailAndPassword(auth, identifier, password);
      
      // Update Firebase display name if possible
      if (userCredential.user) {
        try {
          await updateProfile(userCredential.user, { displayName: name });
        } catch (pErr) {
          console.error("Profile update error: ", pErr);
        }
      }

      // Log in dynamically inside local state
      login(identifier, role, name, { mobile: phoneToCheck });

      // Go to Dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try another email/phone or method.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-md space-y-8 bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/40">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">Join GoServik</h2>
          <p className="mt-2 text-sm text-slate-600">
            Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Sign In</Link>
          </p>
        </div>

        {/* Static customer registration notice */}
        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center text-xs font-semibold text-slate-600">
          Registration Portal: New Customer Account Only
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50">
          <button
            type="button"
            onClick={() => { setRegisterMethod('email'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              registerMethod === 'email'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </button>
          <button
            type="button"
            onClick={() => { setRegisterMethod('mobile'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              registerMethod === 'mobile'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Phone className="h-3.5 w-3.5" />
            Mobile
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm border border-red-100 text-center font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <UserIcon className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                placeholder="Neev Aggarwal"
              />
            </div>
          </div>

          {registerMethod === 'email' ? (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white/50 px-3 py-3 text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code || 'Direct'}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="9876543210 (No country code)"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Create Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                placeholder="Min. 6 characters"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 transition-all mt-2" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register via Firebase'}
          </Button>
        </form>
      </div>
    </div>
  );
}
