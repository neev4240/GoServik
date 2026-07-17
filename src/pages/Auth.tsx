import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { Briefcase } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    login(email);
    // Redirect to intended page or dashboard
    const from = location.state?.from?.pathname || "/dashboard";
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Sign in to GoServik</h2>
          <p className="mt-2 text-sm text-slate-600">
            Or <Link to="/register" className="font-medium text-slate-900 hover:underline">create a new account</Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm"
                placeholder="sample.pro@goservik.com or any email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-slate-900 hover:underline">Forgot password?</a>
            </div>
          </div>

          <Button type="submit" className="w-full h-11 text-base">Sign In</Button>
          
          <div className="mt-4 p-4 bg-slate-50 border rounded-lg text-xs text-slate-600">
            <p className="font-semibold mb-1">Testing Accounts:</p>
            <ul className="list-disc list-inside">
              <li><b>Professional:</b> sample.pro@goservik.com</li>
              <li><b>Admin:</b> admin@goservik.com</li>
              <li><b>Customer:</b> Any other email</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}

// Simple register placeholder
export function Register() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
        <p className="text-slate-600">Registration flow is mocked. Please use the Sign In page to access the test accounts.</p>
        <Button asChild className="w-full"><Link to="/login">Go to Sign In</Link></Button>
      </div>
    </div>
  );
}
