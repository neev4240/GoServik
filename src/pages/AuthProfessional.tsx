import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { Briefcase, Mail, Phone, Lock, User as UserIcon, Shield, Building, MapPin, Sparkles, Edit2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 India (+91)' },
  { code: '+1', label: '🇺🇸 US (+1)' },
  { code: '+44', label: '🇬🇧 UK (+44)' },
  { code: '+971', label: '🇦🇪 UAE (+971)' },
  { code: '+65', label: '🇸🇬 Singapore (+65)' },
  { code: '', label: 'None (Direct)' },
];

export function LoginProfessional() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

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
      try {
        await signInWithEmailAndPassword(auth, identifier, password);
      } catch (err: any) {
        // If testing user doesn't exist, we auto-create/login for testing flow or check store
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          await createUserWithEmailAndPassword(auth, identifier, password);
        } else {
          throw err;
        }
      }
      
      login(identifier, 'professional', identifier.split('@')[0]);
      
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-md space-y-8 bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/40">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">Professional Portal</h2>
          <p className="mt-2 text-sm text-slate-600">
            Or <Link to="/register-professional" className="font-semibold text-indigo-600 hover:underline">Register as a Partner</Link>
          </p>
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
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                  placeholder="sample.pro@goservik.com"
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
                  className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
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
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="9876543210"
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
                className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 transition-all" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In to Portal'}
          </Button>

          <div className="mt-4 p-4 bg-white/50 border border-white/60 rounded-2xl text-xs text-slate-600">
            <p className="font-bold mb-2 flex items-center gap-1.5 text-indigo-600"><Shield className="h-3.5 w-3.5" /> Testing Accounts (Auto-creates):</p>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li><b>Sample Partner:</b> sample.pro@goservik.com (password: anything)</li>
              <li>Or sign in with any mobile number / email for a quick demo!</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}

export function RegisterProfessional() {
  const { categories, login } = useStore();
  const navigate = useNavigate();

  // Registration states
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('cat-1');

  // Address states
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const identifier = email.trim();

    try {
      // Create Firebase Auth Account
      const userCredential = await createUserWithEmailAndPassword(auth, identifier, password);
      
      if (userCredential.user) {
        try {
          await updateProfile(userCredential.user, { displayName: name });
        } catch (err) {
          console.error("Display name write error", err);
        }
      }

      // Collect detailed parameters
      const additionalDetails = {
        companyName,
        mobile,
        category,
        addressLine,
        landmark,
        city,
        state,
        pincode,
        country
      };

      // Call store login with professional role & details
      login(identifier, 'professional', name, additionalDetails);

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try using another email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-2xl space-y-8 bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/40">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">Professional Registration</h2>
          <p className="mt-2 text-sm text-slate-600">
            Already registered? <Link to="/login-professional" className="font-semibold text-indigo-600 hover:underline">Login to Portal</Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm border border-red-100 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* SECTION 1: CREDENTIALS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center gap-1.5">
              <UserIcon className="h-4 w-4 text-indigo-600" /> 1. Professional Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Personal Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Neev Aggarwal"
                  />
                </div>
              </div>

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
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Aggarwal Home Services"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. 9876543210"
                  />
                </div>
              </div>

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
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. neev@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-none"
                    placeholder="Min. 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Major Category of Works</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: PHYSICAL ADDRESS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-indigo-600" /> 2. Address Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Address Line (House/Plot, Street)</label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-none"
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
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Near Central Park"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Mumbai"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Maharashtra"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. 400001"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-none"
                  placeholder="India"
                />
              </div>
            </div>
          </div>

          {/* EDITABILITY NOTICE TEXT */}
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-indigo-900">Customizable Profile Settings</p>
              <p className="text-[11px] text-indigo-700 leading-relaxed mt-0.5">
                Note: You can easily edit all these registered parameters, detailed address lines, landmark pointers, and add additional services or customize visit charges afterwards in your Profile settings on the dashboard.
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-850 text-white shadow-xl transition-all" disabled={loading}>
            {loading ? 'Creating Professional Account...' : 'Complete Professional Registration'}
          </Button>
        </form>
      </div>
    </div>
  );
}
