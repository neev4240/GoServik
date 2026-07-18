import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { 
  Database, RefreshCw, CheckCircle, XCircle, Lock, 
  ShieldAlert, Sparkles, UserCheck, Calendar, LogOut, 
  AlertCircle, ArrowLeft, Shield, Wrench, Eye, Users,
  Edit2, Trash2, Search, X, Phone, Mail, MapPin, 
  User, Globe, Building2, Activity, Clock, LayoutDashboard
} from 'lucide-react';
import { db } from '../lib/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { Role, ProfessionalProfile, Booking } from '../types';

export function AdminPage() {
  const navigate = useNavigate();
  const { 
    professionals, 
    bookings, 
    categories, 
    reviews, 
    customers, 
    updateBookingStatus, 
    deleteBooking, 
    updateCustomer, 
    deleteCustomer, 
    updateProfessional, 
    deleteProfessional 
  } = useStore();
  
  // Login credentials state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [loginError, setLoginError] = useState('');

  // Navigation page/tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'professionals' | 'customers' | 'bookings'>('overview');

  // Search/Filter states
  const [searchPro, setSearchPro] = useState('');
  const [searchCust, setSearchCust] = useState('');
  const [searchBk, setSearchBk] = useState('');
  const [filterBkStatus, setFilterBkStatus] = useState<string>('all');

  // Editing state
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [customerForm, setCustomerForm] = useState<any>({});

  const [editingPro, setEditingPro] = useState<any>(null);
  const [proForm, setProForm] = useState<any>({});

  // Deletion confirmation state
  const [deletingCustomer, setDeletingCustomer] = useState<any>(null);
  const [deletingPro, setDeletingPro] = useState<any>(null);
  const [deletingBooking, setDeletingBooking] = useState<any>(null);

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
      // Sync customers
      for (const cust of customers) {
        await setDoc(doc(db, "customers", cust.id), cust);
      }

      setSyncMessage('Successfully synced all live data and mocks into Firebase Firestore!');
      setTimeout(() => setSyncMessage(''), 4000);
    } catch (e: any) {
      setSyncMessage(`Error syncing: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  // Edit Handlers
  const openEditCustomer = (cust: any) => {
    setEditingCustomer(cust);
    setCustomerForm({ ...cust });
  };

  const handleSaveCustomer = () => {
    if (!customerForm.name || !customerForm.email) {
      alert("Please provide a name and email address.");
      return;
    }
    updateCustomer(editingCustomer.id, customerForm);
    setEditingCustomer(null);
    alert("Customer details saved successfully!");
  };

  const openEditPro = (pro: any) => {
    setEditingPro(pro);
    setProForm({ ...pro });
  };

  const handleSavePro = () => {
    if (!proForm.name || !proForm.email) {
      alert("Please provide a name and email address.");
      return;
    }
    updateProfessional(editingPro.id, proForm);
    setEditingPro(null);
    alert("Professional details saved successfully!");
  };

  // Delete Handlers
  const confirmDeleteCustomer = () => {
    deleteCustomer(deletingCustomer.id);
    setDeletingCustomer(null);
    alert("Customer account deleted successfully!");
  };

  const confirmDeletePro = () => {
    deleteProfessional(deletingPro.id);
    setDeletingPro(null);
    alert("Professional profile deleted successfully!");
  };

  const confirmDeleteBooking = () => {
    deleteBooking(deletingBooking.id);
    setDeletingBooking(null);
    alert("Booking order deleted successfully!");
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

  // Filter lists based on searches
  const filteredProfessionals = professionals.filter(pro => 
    pro.name.toLowerCase().includes(searchPro.toLowerCase()) ||
    pro.email.toLowerCase().includes(searchPro.toLowerCase()) ||
    pro.location.toLowerCase().includes(searchPro.toLowerCase()) ||
    pro.tagline.toLowerCase().includes(searchPro.toLowerCase())
  );

  const filteredCustomers = customers.filter(cust => 
    cust.name.toLowerCase().includes(searchCust.toLowerCase()) ||
    cust.email.toLowerCase().includes(searchCust.toLowerCase()) ||
    (cust.mobile && cust.mobile.includes(searchCust))
  );

  const filteredBookings = bookings.filter(bk => {
    const matchesSearch = 
      bk.id.toLowerCase().includes(searchBk.toLowerCase()) ||
      bk.customerName.toLowerCase().includes(searchBk.toLowerCase()) ||
      (bk.customerServiceOpted && bk.customerServiceOpted.toLowerCase().includes(searchBk.toLowerCase()));
    
    const matchesStatus = filterBkStatus === 'all' || bk.status === filterBkStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[9px] bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 uppercase tracking-wider">Internal Console</span>
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Platform Admin Console</h1>
            <p className="text-xs text-slate-500 font-medium">Manage technicians, confirm/cancel bookings, edit accounts and synchronize cloud data.</p>
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

        {/* 3 Different Pages / Navigation Tab Bar */}
        <div className="flex flex-wrap bg-white p-1.5 rounded-2xl border border-slate-200/60 gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'overview' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('professionals')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'professionals' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Wrench className="h-4 w-4" />
            Professional Partners ({professionals.length})
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'customers' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            Registered Customers ({customers.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'bookings' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Bookings & Cancellations ({bookings.length})
          </button>
        </div>

        {/* Active Workspace Container */}
        <div className="transition-all duration-300">
          
          {/* ======================================= */}
          {/* OVERVIEW DASHBOARD PAGE                 */}
          {/* ======================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between h-36">
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Active Bookings</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">{bookings.length}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold">Logged service requests</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between h-36">
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Expert Technicians</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">{professionals.length}</p>
                  </div>
                  <p className="text-[10px] text-indigo-600 font-semibold">Professionals with active profiles</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between h-36">
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Normal User Accounts</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">{customers.length}</p>
                  </div>
                  <p className="text-[10px] text-emerald-600 font-semibold">Registered clients on GoServik</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between h-36">
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total reviews</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">{reviews.length}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold">Client experience ratings</p>
                </div>
              </div>

              {/* Firebase Cloud Sync Controls Card */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Database className="h-5 w-5 text-indigo-600" />
                      Firebase Cloud Storage & Synchronization
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      GoServik is integrated with persistent Google Cloud Firestore. Any changes made inside this admin panel (profile updates, verification status toggles, booking status completions, account cancellations) are written instantly to Firebase. Use the controls below to trigger a full manual synchronization of mock entities or to refresh.
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Live Connection Active
                  </span>
                </div>

                {syncMessage && (
                  <div className={`p-4 rounded-2xl text-xs font-bold border ${
                    syncMessage.includes('Error') 
                      ? 'bg-rose-50 border-rose-100 text-rose-700' 
                      : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                  }`}>
                    {syncMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Manual Database Sync</p>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Write all current local state variables, categories, expert technicians, registered clients, and reviews directly to the Firestore collection.
                    </p>
                    <button
                      onClick={handleSyncToFirebase}
                      disabled={syncing}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {syncing ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Syncing with Firestore...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3.5 w-3.5" />
                          Sync All Live Data to Cloud
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Local Cache Refresh</p>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Re-fetch the entire schema (Categories, Bookings, Customers, Technicians) fresh from Firestore, replacing any outdated local states.
                    </p>
                    <button
                      onClick={async () => {
                        setSyncing(true);
                        try {
                          await useStore.getState().initializeFromFirestore();
                          setSyncMessage("Successfully refreshed all local memory from Cloud Firestore!");
                          setTimeout(() => setSyncMessage(''), 3000);
                        } catch (err: any) {
                          setSyncMessage(`Refresh failed: ${err.message}`);
                        } finally {
                          setSyncing(false);
                        }
                      }}
                      disabled={syncing}
                      className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Fetch Latest from Cloud
                    </button>
                  </div>

                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Cloud Data Statistics</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600">
                      <div className="bg-white px-3 py-2 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block">Bookings</span>
                        <span className="text-slate-800 text-xs font-extrabold mt-0.5">{bookings.length} docs</span>
                      </div>
                      <div className="bg-white px-3 py-2 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block">Technicians</span>
                        <span className="text-slate-800 text-xs font-extrabold mt-0.5">{professionals.length} docs</span>
                      </div>
                      <div className="bg-white px-3 py-2 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block">Customers</span>
                        <span className="text-slate-800 text-xs font-extrabold mt-0.5">{customers.length} docs</span>
                      </div>
                      <div className="bg-white px-3 py-2 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block">Categories</span>
                        <span className="text-slate-800 text-xs font-extrabold mt-0.5">{categories.length} docs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================= */}
          {/* PROFESSIONAL USERS PAGE (PAGE 1)        */}
          {/* ======================================= */}
          {activeTab === 'professionals' && (
            <div className="space-y-6 animate-fade-in">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search professionals by name, email, tagline or location..."
                    value={searchPro}
                    onChange={(e) => setSearchPro(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-all text-slate-850 font-medium"
                  />
                </div>
                <div className="text-[11px] text-slate-400 font-bold shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border">
                  Showing {filteredProfessionals.length} of {professionals.length} professionals
                </div>
              </div>

              {/* Grid of Professionals */}
              {filteredProfessionals.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center text-slate-400 text-xs font-semibold">
                  No professionals found matching "{searchPro}".
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfessionals.map((pro) => (
                    <div key={pro.id} className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                      {/* Card Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img src={pro.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200'} alt={pro.name} className="h-12 w-12 rounded-full object-cover border border-slate-100" referrerPolicy="no-referrer" />
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                                {pro.name}
                                {pro.verified && <CheckCircle className="h-4 w-4 text-indigo-600 fill-indigo-100" />}
                              </h4>
                              <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 uppercase tracking-wider font-extrabold">{pro.id}</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              const isVerified = pro.verified;
                              updateProfessional(pro.id, { verified: !isVerified });
                              alert(`Verification state successfully toggled for ${pro.name}!`);
                            }}
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border transition-all ${
                              pro.verified 
                                ? 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100' 
                                : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {pro.verified ? 'Verified' : 'Unverified'}
                          </button>
                        </div>

                        <div className="space-y-1.5 border-t border-slate-100 pt-3.5 text-slate-700">
                          <p className="text-xs font-bold text-slate-850 line-clamp-1">"{pro.tagline || 'No tagline set'}"</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{pro.bio || 'No bio entered.'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border text-[10px] font-semibold text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate">{pro.location || 'Not set'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate">{pro.mobile || 'No mobile'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate">{pro.email || 'No email'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate capitalize">{pro.availabilityStatus || 'available'}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold bg-indigo-50/40 border border-indigo-100/50 p-2 rounded-xl">
                          <span>Services: {pro.services?.length || 0}</span>
                          <span>Rating: ⭐{pro.rating || '5.0'}</span>
                          <span>Jobs: {pro.jobsCompleted || 0}</span>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                        <button
                          onClick={() => openEditPro(pro)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-indigo-600" />
                          Edit details
                        </button>
                        <button
                          onClick={() => setDeletingPro(pro)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================= */}
          {/* REGISTERED CUSTOMERS PAGE (PAGE 2)      */}
          {/* ======================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fade-in">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search customers by name, email, or mobile..."
                    value={searchCust}
                    onChange={(e) => setSearchCust(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-all text-slate-850 font-medium"
                  />
                </div>
                <div className="text-[11px] text-slate-400 font-bold shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border">
                  Showing {filteredCustomers.length} of {customers.length} users
                </div>
              </div>

              {/* Grid of Users */}
              {filteredCustomers.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center text-slate-400 text-xs font-semibold">
                  No registered customers found matching "{searchCust}".
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCustomers.map((cust) => (
                    <div key={cust.id} className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                      
                      {/* Customer Details Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{cust.name}</h4>
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Customer / Client</span>
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600 pl-0.5">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="font-medium select-all truncate">{cust.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="font-semibold select-all">{cust.mobile || 'No phone registered'}</span>
                          </div>
                          {cust.dob && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium">DOB: {cust.dob}</span>
                            </div>
                          )}
                          {cust.companyName && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium truncate">Company: {cust.companyName}</span>
                            </div>
                          )}
                        </div>

                        {/* Customer Registered Address */}
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] space-y-1">
                          <span className="text-slate-400 font-bold uppercase tracking-wider block">Service Address</span>
                          <p className="text-slate-700 leading-relaxed font-semibold">
                            {cust.addressLine ? (
                              <>
                                {cust.addressLine}, {cust.landmark && `${cust.landmark}, `} {cust.city}, {cust.state} {cust.pincode && `- ${cust.pincode}`}, {cust.country || 'India'}
                              </>
                            ) : (
                              'No registered address details listed on file.'
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Customer Actions */}
                      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                        <button
                          onClick={() => openEditCustomer(cust)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-indigo-600" />
                          Edit details
                        </button>
                        <button
                          onClick={() => setDeletingCustomer(cust)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete user
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================= */}
          {/* BOOKINGS & CANCELLATIONS PAGE (PAGE 3)  */}
          {/* ======================================= */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fade-in">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search bookings by ID, client, or service name..."
                    value={searchBk}
                    onChange={(e) => setSearchBk(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-all text-slate-850 font-medium"
                  />
                </div>
                
                {/* Status Tabs inside Bookings page */}
                <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl border gap-0.5 w-full md:w-auto">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterBkStatus(status)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold capitalize transition-all flex-1 md:flex-initial ${
                        filterBkStatus === status
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Lists */}
              {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center text-slate-400 text-xs font-semibold">
                  No booking requests found matching the current search parameters.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((bk) => {
                    const relatedPro = professionals.find(p => p.id === bk.professionalId);
                    
                    return (
                      <div key={bk.id} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:shadow-md transition-all">
                        
                        {/* Booking Context */}
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-[10px] bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-500 font-extrabold uppercase tracking-wider">Order ID: {bk.id}</span>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wide capitalize ${
                              bk.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-200' :
                              bk.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              bk.status === 'completed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                              'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {bk.status}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h3 className="font-extrabold text-slate-900 text-base">
                              {bk.customerServiceOpted || 'Professional Handyman Service'}
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium">
                              Contracted Technician: <span className="text-indigo-600 font-extrabold">{relatedPro?.name || 'Assigned Partner'}</span> ({bk.professionalId})
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            {/* Client Block */}
                            <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 text-[11px] space-y-1.5">
                              <span className="text-slate-400 font-extrabold uppercase tracking-wider text-[9px] block">Client Contact</span>
                              <div className="flex items-center gap-1.5 font-bold text-slate-850">
                                <User className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                                <span>{bk.customerName || 'GoServik Client'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-500">
                                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span>{bk.customerMobile || 'No telephone'}</span>
                              </div>
                              <div className="flex items-start gap-1.5 text-slate-500">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-2 leading-relaxed">{bk.customerAddress || 'No address provided'}</span>
                              </div>
                            </div>

                            {/* Booking Schedule Block */}
                            <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 text-[11px] space-y-1.5 flex flex-col justify-between">
                              <div>
                                <span className="text-slate-400 font-extrabold uppercase tracking-wider text-[9px] block">Arrival Schedule</span>
                                <div className="flex items-center gap-1.5 font-bold text-slate-850 mt-1">
                                  <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                  <span>{new Date(bk.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                  <span>{bk.time}</span>
                                </div>
                              </div>
                              <div className="text-xs font-bold text-indigo-600 mt-1 pl-0.5">
                                Visit Fee: ₹{bk.totalPrice} INR
                              </div>
                            </div>
                          </div>

                          {bk.notes && (
                            <p className="text-[11px] text-slate-500 bg-amber-50/30 border border-amber-100/50 p-2.5 rounded-xl italic leading-relaxed">
                              "<b>Client Notes:</b> {bk.notes}"
                            </p>
                          )}
                        </div>

                        {/* Booking Administrative Action Controls */}
                        <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-48 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 justify-end lg:justify-center">
                          {bk.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => {
                                  updateBookingStatus(bk.id, 'confirmed');
                                  alert(`Booking request # ${bk.id} has been confirmed successfully!`);
                                }}
                                className="flex-1 lg:w-full text-center text-xs py-2.5 font-extrabold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm"
                              >
                                Confirm Order
                              </button>
                              <button 
                                onClick={() => {
                                  updateBookingStatus(bk.id, 'cancelled');
                                  alert(`Booking request # ${bk.id} has been cancelled.`);
                                }}
                                className="flex-1 lg:w-full text-center text-xs py-2.5 font-extrabold rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-all"
                              >
                                Cancel Order
                              </button>
                            </>
                          )}

                          {bk.status === 'confirmed' && (
                            <>
                              <button 
                                onClick={() => {
                                  updateBookingStatus(bk.id, 'completed');
                                  alert(`Booking order # ${bk.id} marked as completed!`);
                                }}
                                className="flex-1 lg:w-full text-center text-xs py-2.5 font-extrabold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
                              >
                                Complete Order
                              </button>
                              <button 
                                onClick={() => {
                                  updateBookingStatus(bk.id, 'cancelled');
                                  alert(`Booking order # ${bk.id} has been cancelled.`);
                                }}
                                className="flex-1 lg:w-full text-center text-xs py-2.5 font-extrabold rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-all"
                              >
                                Cancel Order
                              </button>
                            </>
                          )}

                          {(bk.status === 'cancelled' || bk.status === 'completed') && (
                            <div className="text-[10px] text-slate-400 font-bold text-center w-full py-2 italic bg-slate-50 border rounded-xl">
                              No active lifecycle actions
                            </div>
                          )}

                          <button 
                            onClick={() => setDeletingBooking(bk)}
                            className="px-3.5 py-2.5 rounded-xl border border-rose-100 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Log
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* ======================================= */}
      {/* EDIT MODAL: REGISTERED CUSTOMERS        */}
      {/* ======================================= */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block mb-1">Administrative Action</span>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <Edit2 className="h-4 w-4 text-indigo-600" />
                  Edit Customer Profile
                </h3>
              </div>
              <button 
                onClick={() => setEditingCustomer(null)}
                className="h-8 w-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
              
              <div className="md:col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b pb-1">
                Primary Account Information
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={customerForm.name || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  value={customerForm.email || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={customerForm.mobile || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, mobile: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={customerForm.dob || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, dob: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={customerForm.companyName || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, companyName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="md:col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b pb-1 pt-2">
                Service Address Details
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Address Line</label>
                <input
                  type="text"
                  value={customerForm.addressLine || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, addressLine: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Landmark</label>
                <input
                  type="text"
                  value={customerForm.landmark || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, landmark: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">City</label>
                <input
                  type="text"
                  value={customerForm.city || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">State</label>
                <input
                  type="text"
                  value={customerForm.state || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, state: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Postal Pincode</label>
                <input
                  type="text"
                  value={customerForm.pincode || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, pincode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Country</label>
                <input
                  type="text"
                  value={customerForm.country || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, country: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

            </div>

            <div className="p-6 border-t border-slate-150 bg-slate-50 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setEditingCustomer(null)}
                className="text-xs font-bold rounded-xl h-10 border-slate-200 px-4"
              >
                Discard Changes
              </Button>
              <Button 
                onClick={handleSaveCustomer}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl h-10 px-5 shadow-md shadow-indigo-100"
              >
                Save Profile Details
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* EDIT MODAL: CERTIFIED PROFESSIONAL     */}
      {/* ======================================= */}
      {editingPro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block mb-1">Administrative Action</span>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <Wrench className="h-4 w-4 text-indigo-600" />
                  Edit Professional Profile
                </h3>
              </div>
              <button 
                onClick={() => setEditingPro(null)}
                className="h-8 w-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
              
              <div className="md:col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b pb-1">
                Primary Partner Identity
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={proForm.name || ''}
                  onChange={(e) => setProForm({ ...proForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  value={proForm.email || ''}
                  onChange={(e) => setProForm({ ...proForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={proForm.mobile || ''}
                  onChange={(e) => setProForm({ ...proForm, mobile: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Partner Location (City / Region)</label>
                <input
                  type="text"
                  value={proForm.location || ''}
                  onChange={(e) => setProForm({ ...proForm, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tagline Slogan</label>
                <input
                  type="text"
                  value={proForm.tagline || ''}
                  onChange={(e) => setProForm({ ...proForm, tagline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Corporate / Company Name</label>
                <input
                  type="text"
                  value={proForm.companyName || ''}
                  onChange={(e) => setProForm({ ...proForm, companyName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Availability Status</label>
                <select
                  value={proForm.availabilityStatus || 'available'}
                  onChange={(e) => setProForm({ ...proForm, availabilityStatus: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  <option value="available">🟢 Available for Bookings</option>
                  <option value="busy">🟡 Busy / Working on-site</option>
                  <option value="offline">⚪ Offline / On Vacation</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Service Radius (Kilometers)</label>
                <input
                  type="number"
                  value={proForm.serviceRadiusKm || 25}
                  onChange={(e) => setProForm({ ...proForm, serviceRadiusKm: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Detailed Bio Statement</label>
                <textarea
                  value={proForm.bio || ''}
                  rows={3}
                  onChange={(e) => setProForm({ ...proForm, bio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-medium leading-relaxed"
                />
              </div>

            </div>

            <div className="p-6 border-t border-slate-150 bg-slate-50 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setEditingPro(null)}
                className="text-xs font-bold rounded-xl h-10 border-slate-200 px-4"
              >
                Discard Changes
              </Button>
              <Button 
                onClick={handleSavePro}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl h-10 px-5 shadow-md shadow-indigo-100"
              >
                Save Partner Profile
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* DELETE MODAL: REGISTERED CUSTOMERS      */}
      {/* ======================================= */}
      {deletingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border overflow-hidden p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base">Delete Customer Profile?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to permanently delete customer <b>{deletingCustomer.name}</b> from the GoServik database? This will immediately wipe all session data. This action is irreversible.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button 
                onClick={() => setDeletingCustomer(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 border text-slate-700 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteCustomer}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* DELETE MODAL: CERTIFIED PROFESSIONAL    */}
      {/* ======================================= */}
      {deletingPro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border overflow-hidden p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base">Delete Partner Profile?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to permanently remove technician <b>{deletingPro.name}</b>? They will be wiped from search results, maps listings, and all reviews. This is irreversible.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button 
                onClick={() => setDeletingPro(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 border text-slate-700 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeletePro}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* DELETE MODAL: BOOKING ORDER LOG         */}
      {/* ======================================= */}
      {deletingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border overflow-hidden p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base">Delete Booking Record?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to permanently purge booking request <b># {deletingBooking.id}</b> from the master logs? This will clean up the system record.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button 
                onClick={() => setDeletingBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 border text-slate-700 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteBooking}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-all"
              >
                Purge Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
