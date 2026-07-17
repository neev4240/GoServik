import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { 
  Database, RefreshCw, CheckCircle, XCircle, Lock, 
  ShieldAlert, Sparkles, UserCheck, Calendar, LogOut, 
  AlertCircle, ArrowLeft, Shield, Wrench, Eye
} from 'lucide-react';
import { db } from '../lib/firebase';
import { setDoc, doc } from 'firebase/firestore';

export function AdminPage() {
  const navigate = useNavigate();
  const { professionals, bookings, categories, reviews, updateBookingStatus, updateUserProfile } = useStore();
  
  // Login credentials state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [loginError, setLoginError] = useState('');

  // Firebase manual sync state
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (username.trim() === 'goservik' && password === 'goservik@%*134679') {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsLoggedIn(true);
    } else {
      setLoginError('Invalid Administrator credentials. Access denied.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsLoggedIn(false);
  };

  const handleSyncToFirebase = async () => {
    setSyncing(true);
    setSyncMessage('');
    try {
      // Sync categories collection
      for (const cat of categories) {
        await setDoc(doc(db, "categories", cat.id), cat);
      }
      // Sync professionals collection
      for (const pro of professionals) {
        await setDoc(doc(db, "professionals", pro.id), pro);
      }
      // Sync bookings
      for (const bk of bookings) {
        await setDoc(doc(db, "bookings", bk.id), bk);
      }
      // Sync reviews
      for (const rev of reviews) {
        await setDoc(doc(db, "reviews", rev.id), rev);
      }

      setSyncMessage('Successfully synced all live data and mocks into Firebase Firestore!');
      setTimeout(() => setSyncMessage(''), 4000);
    } catch (e: any) {
      setSyncMessage(`Error syncing: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50/50">
        <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-200/60">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-indigo-400 shadow-xl shadow-slate-200">
              <Shield className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-900">Admin Portal</h2>
            <p className="mt-2 text-xs text-slate-500 font-medium">
              Access restricted to GoServik platform coordinators.
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3.5 rounded-xl font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  placeholder="Enter administrator username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl shadow-lg shadow-slate-100 transition-all">
              Authenticate
            </Button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => navigate('/')} 
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[9px] bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 uppercase tracking-wider">Internal Console</span>
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Platform Admin Console</h1>
            <p className="text-xs text-slate-500 font-medium">Manage technicians, confirm bookings, and synchronize with cloud database.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Bookings</p>
            <p className="text-3xl font-extrabold text-slate-900">{bookings.length}</p>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">From all registers</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Partners</p>
            <p className="text-3xl font-extrabold text-slate-900">{professionals.length}</p>
            <p className="text-[10px] text-indigo-600 mt-1.5 font-semibold">Listed Experts</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Services Offered</p>
            <p className="text-3xl font-extrabold text-slate-900">
              {professionals.reduce((acc, p) => acc + p.services.length, 0)}
            </p>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Across {categories.length} categories</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Database Gateway</p>
              <p className="text-sm font-extrabold text-emerald-600 flex items-center gap-1.5 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Active Auto-Sync
              </p>
            </div>
            {syncMessage && (
              <p className="text-[9px] text-indigo-600 font-bold mt-1 bg-indigo-50 p-1.5 rounded-lg border border-indigo-100">{syncMessage}</p>
            )}
            <Button 
              className="w-full mt-2.5 bg-indigo-600 hover:bg-indigo-700 text-[10px] h-8 font-bold rounded-xl"
              disabled={syncing}
              onClick={handleSyncToFirebase}
            >
              <RefreshCw className={`h-3 w-3 mr-1.5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync All to Firestore'}
            </Button>
          </div>
        </div>

        {/* Administration Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Verify Professionals Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">Verify Professionals & Partners</h3>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {professionals.map((pro) => (
                <div key={pro.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <img src={pro.avatar} alt={pro.name} className="h-10 w-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        {pro.name}
                        {pro.verified && <CheckCircle className="h-3.5 w-3.5 text-indigo-600 fill-indigo-100" />}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">{pro.tagline}</p>
                      <p className="text-[9px] text-indigo-600 font-bold">{pro.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    <button 
                      onClick={() => {
                        const isVerified = pro.verified;
                        updateUserProfile({ id: pro.id, verified: !isVerified } as any);
                        alert(`Verification state successfully toggled for ${pro.name}!`);
                      }}
                      className={`text-[10px] h-8 px-3 font-extrabold rounded-xl border transition-all w-full sm:w-auto ${
                        pro.verified 
                          ? 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100' 
                          : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {pro.verified ? 'Revoke Verification' : 'Verify Expert'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manage Booking requests Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">Booking Orders & Lifecycles</h3>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {bookings.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs font-semibold">
                  No bookings requests currently logged on the platform.
                </div>
              ) : (
                bookings.map((bk) => {
                  const pro = professionals.find(p => p.id === bk.professionalId);
                  const proName = pro ? pro.name : "Unknown Technician";
                  const srv = pro?.services.find(s => s.id === bk.serviceId);
                  const srvName = srv ? srv.name : "General Expert Service";

                  return (
                    <div key={bk.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            bk.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            bk.status === 'completed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                            bk.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                            'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {bk.status}
                          </span>
                          <h4 className="font-bold text-slate-800 text-xs mt-1.5">{srvName}</h4>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Customer ID: {bk.customerId}</p>
                          <p className="text-[10px] text-indigo-600 font-bold mt-0.5">Technician: {proName}</p>
                        </div>
                        <span className="text-xs font-black text-slate-900">₹{bk.totalPrice}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-semibold bg-white p-2 rounded-xl border border-slate-150">
                        <span>📅 {bk.date}</span>
                        <span>⏰ {bk.time}</span>
                        {bk.notes && <span className="truncate max-w-full">📝 {bk.notes}</span>}
                      </div>

                      <div className="flex gap-1.5 pt-1">
                        {bk.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateBookingStatus(bk.id, 'confirmed')}
                              className="flex-1 text-[9px] h-7 font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
                            >
                              Confirm Booking
                            </button>
                            <button 
                              onClick={() => updateBookingStatus(bk.id, 'cancelled')}
                              className="flex-1 text-[9px] h-7 font-bold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {bk.status === 'confirmed' && (
                          <button 
                            onClick={() => updateBookingStatus(bk.id, 'completed')}
                            className="w-full text-[9px] h-7 font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                          >
                            Complete Order
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
