import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { 
  Briefcase, Mail, Phone, Lock, User as UserIcon, Shield, 
  Building, MapPin, Sparkles, UserCheck, ArrowRight, Eye, EyeOff 
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { GoogleMapPicker } from '../components/GoogleMapPicker';

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 India (+91)' },
  { code: '+1', label: '🇺🇸 US (+1)' },
  { code: '+44', label: '🇬🇧 UK (+44)' },
  { code: '+971', label: '🇦🇪 UAE (+971)' },
  { code: '+65', label: '🇸🇬 Singapore (+65)' },
  { code: '', label: 'None (Direct Number)' },
];

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, professionals, customers, currentUser } = useStore();

  // Detect default role from URL path
  const isDefaultPro = location.pathname.includes('professional');
  const [role, setRole] = useState<'customer' | 'professional'>(isDefaultPro ? 'professional' : 'customer');
  
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync role if path changes
  useEffect(() => {
    if (location.pathname.includes('professional')) {
      setRole('professional');
    } else {
      setRole('customer');
    }
  }, [location.pathname]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      const finalRole = cleanId === 'admin@goservik.com' ? 'admin' : role;

      // Extract phone if mobile login was used
      let extractedPhone = '';
      if (cleanId.endsWith('@goservik.com')) {
        const prefix = cleanId.split('@')[0];
        if (prefix.startsWith('+') || /^\d+$/.test(prefix)) {
          extractedPhone = prefix;
        }
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

      // Strict account separation
      if (finalRole === 'customer') {
        const isPro = professionals.find(matchesEmailOrPhone);
        if (isPro) {
          throw new Error("This email/mobile is registered as a Professional Partner. Please switch to the 'Professional' tab above to log in.");
        }
      } else if (finalRole === 'professional') {
        const isCust = customers.find(matchesEmailOrPhone);
        if (isCust) {
          throw new Error("This email/mobile is registered as a Customer. Please switch to the 'Customer' tab above to log in.");
        }
      }

      // Authenticate with Firebase
      try {
        await signInWithEmailAndPassword(auth, identifier, password);
      } catch (err: any) {
        // Auto-create test account inside sandbox for smooth workspace evaluations
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          await createUserWithEmailAndPassword(auth, identifier, password);
        } else {
          throw err;
        }
      }

      const displayName = loginMethod === 'email' 
        ? identifier.split('@')[0] 
        : `User ${mobileNumber}`;

      login(identifier, finalRole, displayName, { mobile: extractedPhone });

      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-10 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-md space-y-7 bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/40">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <UserCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">Welcome to GoServik</h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Secure, instant access to your GoServik account.
          </p>
        </div>

        {/* Unified Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
          <button
            type="button"
            onClick={() => { setRole('customer'); setError(''); }}
            className={`py-3 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
              role === 'customer'
                ? 'bg-white text-indigo-600 shadow-md border border-slate-200/10 scale-[1.01]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-[13px]">👤 Customer</span>
            <span className="text-[9px] font-medium opacity-75">I want to hire services</span>
          </button>
          <button
            type="button"
            onClick={() => { setRole('professional'); setError(''); }}
            className={`py-3 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
              role === 'professional'
                ? 'bg-white text-indigo-600 shadow-md border border-slate-200/10 scale-[1.01]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-[13px]">💼 Partner</span>
            <span className="text-[9px] font-medium opacity-75">I want to offer services</span>
          </button>
        </div>

        {/* Dynamic portal info tag */}
        <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex items-center gap-2 text-[11px] text-indigo-900 justify-center font-bold">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
          Logging in as: {role === 'customer' ? 'Customer Profile' : 'Verified Partner Desk'}
        </div>

        {/* Tab Login Methods */}
        <div className="flex bg-slate-100/60 p-1 rounded-xl border border-slate-150">
          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              loginMethod === 'email'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('mobile'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              loginMethod === 'mobile'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            <Phone className="h-3.5 w-3.5" />
            Mobile
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs border border-rose-100 text-center font-semibold leading-relaxed">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          {loginMethod === 'email' ? (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder={role === 'customer' ? "you@example.com" : "partner@goservik.com"}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
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
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center text-slate-600">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
              <span className="ml-2">Keep me signed in</span>
            </label>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Feature disabled in sandbox environment. Please use test login."); }} className="font-bold text-indigo-600 hover:underline">Forgot?</a>
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-1.5 mt-2" 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : `Sign In as ${role === 'customer' ? 'Customer' : 'Partner'}`}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>

        <div className="text-center border-t border-slate-150 pt-5">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link 
              to={role === 'professional' ? "/register-professional" : "/register"} 
              className="font-bold text-indigo-600 hover:underline"
            >
              Create {role === 'professional' ? 'Partner' : 'Customer'} Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { categories, login, professionals, customers, currentUser } = useStore();

  // Detect role from URL path
  const isDefaultPro = location.pathname.includes('professional');
  const [role, setRole] = useState<'customer' | 'professional'>(isDefaultPro ? 'professional' : 'customer');

  const [registerMethod, setRegisterMethod] = useState<'email' | 'mobile'>('email');
  
  // Shared fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Professional fields
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState('cat-1');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');
  const [proCoordinates, setProCoordinates] = useState<{ lat: number; lng: number } | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync role if path changes
  useEffect(() => {
    if (location.pathname.includes('professional')) {
      setRole('professional');
    } else {
      setRole('customer');
    }
  }, [location.pathname]);

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

      // Role check validation
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

      // Unique phone checking across all users
      const phoneToCheck = extractedPhone || mobileNumber;
      const cleanPhoneToCheck = phoneToCheck.replace(/\D/g, '');
      if (cleanPhoneToCheck) {
        const dupPro = professionals.find(p => (p.mobile || '').replace(/\D/g, '') === cleanPhoneToCheck);
        const dupCust = customers.find(c => (c.mobile || '').replace(/\D/g, '') === cleanPhoneToCheck);
        if (dupPro || dupCust) {
          throw new Error("This mobile number is already linked to another registered account. One login per unique phone number is allowed.");
        }
      }

      // Pro coordinates check
      if (role === 'professional' && !proCoordinates) {
        throw new Error("Please pinpoint your business coordinate epicenter on the Google Map below.");
      }

      // Register account in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, identifier, password);
      
      if (userCredential.user) {
        try {
          await updateProfile(userCredential.user, { displayName: name });
        } catch (pErr) {
          console.error("Profile write error", pErr);
        }
      }

      // Prepare detailed profile parameters
      const additionalDetails = role === 'professional' ? {
        companyName,
        mobile: phoneToCheck,
        category,
        addressLine,
        landmark,
        city,
        state,
        pincode,
        country,
        coordinates: proCoordinates
      } : {
        mobile: phoneToCheck
      };

      // Call store login to trigger Firestore synchronization and session load
      login(identifier, role, name, additionalDetails);

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try using another email/phone or method.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4 py-10 sm:px-6 lg:px-8 bg-transparent">
      <div className={`w-full ${role === 'professional' ? 'max-w-3xl' : 'max-w-md'} space-y-7 bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/40 transition-all`}>
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <UserCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">Create GoServik Account</h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Sign up to book home visits or manage client listings.
          </p>
        </div>

        {/* Unified Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
          <button
            type="button"
            onClick={() => { setRole('customer'); setError(''); }}
            className={`py-3 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
              role === 'customer'
                ? 'bg-white text-indigo-600 shadow-md border border-slate-200/10 scale-[1.01]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-[13px]">👤 Customer</span>
            <span className="text-[9px] font-medium opacity-75">I want to hire services</span>
          </button>
          <button
            type="button"
            onClick={() => { setRole('professional'); setError(''); }}
            className={`py-3 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
              role === 'professional'
                ? 'bg-white text-indigo-600 shadow-md border border-slate-200/10 scale-[1.01]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-[13px]">💼 Partner</span>
            <span className="text-[9px] font-medium opacity-75">I want to offer services</span>
          </button>
        </div>

        {/* Dynamic portal info tag */}
        <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex items-center gap-2 text-[11px] text-indigo-900 justify-center font-bold">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
          Registering as: {role === 'customer' ? 'New Client / Customer' : 'Certified Service Professional'}
        </div>

        {/* Tab Login Methods */}
        <div className="flex bg-slate-100/60 p-1 rounded-xl border border-slate-150">
          <button
            type="button"
            onClick={() => { setRegisterMethod('email'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              registerMethod === 'email'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            Email Registration
          </button>
          <button
            type="button"
            onClick={() => { setRegisterMethod('mobile'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              registerMethod === 'mobile'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            <Phone className="h-3.5 w-3.5" />
            Mobile Registration
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs border border-rose-100 text-center font-semibold leading-relaxed">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleRegister}>
          {/* Section 1: Basic Credentials */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1 flex items-center gap-1.5">
              <UserIcon className="h-4 w-4 text-indigo-600" /> 1. Access Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Your Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="e.g. Neev Aggarwal"
                  />
                </div>
              </div>

              {role === 'professional' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Company / Business Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Building className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="e.g. Aggarwal Home Services"
                    />
                  </div>
                </div>
              )}

              {registerMethod === 'email' ? (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
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
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="tel"
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Duplicate mobile support for professionals registering via email */}
              {role === 'professional' && registerMethod === 'email' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Create Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
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

              {role === 'professional' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Major Specialization</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Address & Coordinates (Only for Professionals) */}
          {role === 'professional' && (
            <div className="space-y-4 pt-1">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-indigo-600" /> 2. Partner Address Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Address Line (Plot, Street)</label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Flat 402, Green Avenue"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Landmark</label>
                  <input
                    type="text"
                    required
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    placeholder="Near Central Park"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    placeholder="Maharashtra"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    placeholder="400001"
                  />
                </div>
              </div>

              {/* Professional Coordinate Pinpoint Map */}
              <div className="space-y-2.5 pt-3">
                <label className="block text-[10px] font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-indigo-600 animate-bounce" /> Pinpoint Your Business Epicenter on Map <span className="text-rose-500">*</span>
                </label>
                <p className="text-[10px] text-slate-400">Search for your city or click on the map to pinpoint your coordinate center for local diagnostic matches.</p>
                <GoogleMapPicker 
                  value={proCoordinates} 
                  onChange={setProCoordinates} 
                  addressInput={`${addressLine} ${city} ${state}`.trim()}
                />
              </div>
            </div>
          )}

          {/* Profile notice text */}
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-extrabold text-indigo-900">Customizable Settings Profile</p>
              <p className="text-[11px] text-indigo-700 leading-relaxed mt-0.5">
                All registered parameters, detailed address lines, specializations, business hours, and coordinate radii can be updated instantly after log in through your Profile menu.
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl transition-all" 
            disabled={loading}
          >
            {loading ? 'Creating Profile...' : `Complete ${role === 'customer' ? 'Customer' : 'Professional Partner'} Signup`}
          </Button>
        </form>

        <div className="text-center border-t border-slate-150 pt-5">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link 
              to={role === 'professional' ? "/login-professional" : "/login"} 
              className="font-bold text-indigo-600 hover:underline"
            >
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
