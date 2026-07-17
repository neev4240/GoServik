import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { 
  Calendar, User as UserIcon, Settings, Heart, MessageSquare, Briefcase, 
  FileText, Bell, MapPin, Activity, CheckCircle, 
  XCircle, Send, Star, UserCheck, Plus, Trash2, ShieldAlert, Sparkles, Languages
} from 'lucide-react';

export function Dashboard() {
  const { 
    currentUser, bookings, professionals, savedProfessionals,
    updateBookingStatus, addProfessionalService, updateUserProfile 
  } = useStore();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'overview';

  // State for adding a new service (professional)
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('cat-1');
  const [newServicePrice, setNewServicePrice] = useState('99');
  const [newServiceUnit, setNewServiceUnit] = useState<'hourly' | 'fixed'>('fixed');
  const [newServiceExperience, setNewServiceExperience] = useState('3');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [serviceSuccess, setServiceSuccess] = useState('');

  // State for simulated chat messages
  const [activeChatContact, setActiveChatContact] = useState('helpdesk');
  const [chatInput, setChatInput] = useState('');
  const [chatThreads, setChatThreads] = useState<Record<string, Array<{ sender: 'me' | 'them'; text: string; time: string }>>>({
    helpdesk: [
      { sender: 'them', text: 'Namaste! Welcome to GoServik Premium Support. How can we help you today?', time: '10:00 AM' },
    ],
    pro_rajesh: [
      { sender: 'them', text: 'Hello, I have packed the sanitization kit and am on my way for the cleaning service.', time: '09:15 AM' },
    ],
    cust_neev: [
      { sender: 'them', text: 'Hi, can we reschedule the appliance repair to 4 PM instead of 2 PM?', time: 'Yesterday' }
    ]
  });

  // State for Profile settings form
  const [settingsName, setSettingsName] = useState(currentUser?.name || '');
  const [settingsMobile, setSettingsMobile] = useState('');
  const [settingsEmail, setSettingsEmail] = useState(currentUser?.email || '');
  const [settingsDob, setSettingsDob] = useState('');
  const [settingsCountry, setSettingsCountry] = useState('India');
  const [settingsState, setSettingsState] = useState('');
  const [settingsCity, setSettingsCity] = useState('');
  const [settingsPincode, setSettingsPincode] = useState('');
  const [settingsAddressLine, setSettingsAddressLine] = useState('');
  const [settingsLandmark, setSettingsLandmark] = useState('');

  const [settingsLocation, setSettingsLocation] = useState('Mumbai, India');
  const [settingsBio, setSettingsBio] = useState('Certified premium partner of GoServik.');
  const [settingsLanguages, setSettingsLanguages] = useState('English, Hindi');
  const [settingsStatus, setSettingsStatus] = useState<'available' | 'busy' | 'offline'>('available');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setSettingsName(currentUser.name || '');
      setSettingsEmail(currentUser.email || '');
      setSettingsMobile(currentUser.mobile || '');
      setSettingsDob(currentUser.dob || '');
      setSettingsCountry(currentUser.country || 'India');
      setSettingsState(currentUser.state || '');
      setSettingsCity(currentUser.city || '');
      setSettingsPincode(currentUser.pincode || '');
      setSettingsAddressLine(currentUser.addressLine || '');
      setSettingsLandmark(currentUser.landmark || '');

      if ('location' in currentUser) setSettingsLocation(currentUser.location || '');
      if ('bio' in currentUser) setSettingsBio(currentUser.bio || '');
      if ('languages' in currentUser && currentUser.languages) {
        setSettingsLanguages(currentUser.languages.join(', '));
      }
      if ('availabilityStatus' in currentUser) setSettingsStatus(currentUser.availabilityStatus || 'available');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThreads, activeChatContact]);

  if (!currentUser) {
    return null;
  }

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const navItems = {
    customer: [
      { id: 'overview', label: 'Overview', icon: UserIcon },
      { id: 'bookings', label: 'My Bookings', icon: Calendar },
      { id: 'favorites', label: 'Saved Professionals', icon: Heart },
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
      { id: 'messages', label: 'Admin Support Chat', icon: MessageSquare },
      { id: 'settings', label: 'Admin Preferences', icon: Settings },
    ]
  };

  const roleNav = navItems[currentUser.role] || navItems.customer;

  // Filter bookings based on role
  const userBookings = bookings.filter(b => 
    currentUser.role === 'customer' ? b.customerId === currentUser.id : b.professionalId === currentUser.id
  );

  // Send a simulated chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'me' as const, text: chatInput, time: timestamp };

    setChatThreads(prev => ({
      ...prev,
      [activeChatContact]: [...(prev[activeChatContact] || []), userMsg]
    }));
    setChatInput('');

    // Trigger auto-reply for high interactive index after 1.5 seconds
    setTimeout(() => {
      let replyText = "Thank you for writing. Our dedicated specialist will check and reply shortly.";
      if (activeChatContact === 'helpdesk') {
        replyText = "We have received your ticket request. An Urban Company certified expert is reviewing your account parameters.";
      } else if (activeChatContact === 'pro_rajesh') {
        replyText = "Sure, I am carrying the spare parts. Looking forward to completing your service perfectly!";
      } else if (activeChatContact === 'cust_neev') {
        replyText = "Thank you! Rescheduling makes it much easier for me to be home.";
      }

      const replyMsg = { sender: 'them' as const, text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChatThreads(prev => ({
        ...prev,
        [activeChatContact]: [...(prev[activeChatContact] || []), replyMsg]
      }));
    }, 1500);
  };

  // Add Professional Service handler
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    // Check if AC Installation or Tiling to set default prices
    let calculatedPrice = Number(newServicePrice) || 99;
    const isACInstallation = newServiceName.toLowerCase().includes('ac installation');
    const isTiling = newServiceName.toLowerCase().includes('tiling');
    
    if (isACInstallation) {
      calculatedPrice = 99;
    } else if (isTiling) {
      // Tiling price default base is 99 (assuming typical <= 500 sq ft)
      calculatedPrice = 99;
    }

    const serviceObj = {
      categoryId: newServiceCategory,
      name: newServiceName,
      description: newServiceDesc || 'No custom details provided.',
      basePrice: calculatedPrice,
      priceUnit: newServiceUnit,
      experienceYears: Number(newServiceExperience) || 2
    };

    addProfessionalService(currentUser.id, serviceObj);
    setNewServiceName('');
    setNewServiceDesc('');
    setServiceSuccess('Service added successfully in Indian Rupees (₹)! It is now active on your public profile.');
    setTimeout(() => setServiceSuccess(''), 4000);
  };

  // Update Profile Settings handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFields: any = {
      name: settingsName,
      email: settingsEmail,
      mobile: settingsMobile,
      dob: settingsDob,
      country: settingsCountry,
      state: settingsState,
      city: settingsCity,
      pincode: settingsPincode,
      addressLine: settingsAddressLine,
      landmark: settingsLandmark,
      location: settingsCity ? `${settingsCity}, ${settingsState || settingsCountry}` : settingsLocation,
      languages: settingsLanguages.split(',').map(s => s.trim())
    };

    if (currentUser.role === 'professional') {
      updatedFields.bio = settingsBio;
      updatedFields.availabilityStatus = settingsStatus;
    }

    updateUserProfile(updatedFields);
    setSettingsSuccess('Your profile has been saved and synced locally successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  return (
    <div className="bg-transparent min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
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

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          <div className="flex items-center justify-between bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
            <h1 className="text-xl font-bold text-slate-900 capitalize flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block animate-pulse"></span>
              {currentTab.replace('-', ' ')}
            </h1>
            <div className="flex items-center gap-2">
              {currentUser.role === 'professional' && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  settingsStatus === 'available' ? 'bg-emerald-50 text-emerald-700' :
                  settingsStatus === 'busy' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    settingsStatus === 'available' ? 'bg-emerald-500' :
                    settingsStatus === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
                  }`}></span>
                  {settingsStatus}
                </span>
              )}
              <Button variant="outline" size="sm" className="gap-2 text-xs font-bold border-slate-200/80 bg-white/40">
                <Bell className="h-3.5 w-3.5" /> Updates
              </Button>
            </div>
          </div>

          {/* TAB: OVERVIEW */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentUser.role === 'customer' && (
                  <>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Bookings</div>
                      <div className="text-3xl font-extrabold text-slate-900">{userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Saved Experts</div>
                      <div className="text-3xl font-extrabold text-slate-900">{savedProfessionals.length}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Spent</div>
                      <div className="text-3xl font-extrabold text-slate-900">₹{userBookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + b.totalPrice, 0)}</div>
                    </div>
                  </>
                )}
                {currentUser.role === 'professional' && (
                  <>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Requests</div>
                      <div className="text-3xl font-extrabold text-indigo-600">{userBookings.filter(b => b.status === 'pending').length}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Completed Jobs</div>
                      <div className="text-3xl font-extrabold text-slate-900">
                        {('jobsCompleted' in currentUser) ? currentUser.jobsCompleted : 0}
                      </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Business Revenue</div>
                      <div className="text-3xl font-extrabold text-emerald-600">
                        ₹{userBookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + b.totalPrice, 0)}
                      </div>
                    </div>
                  </>
                )}
                {currentUser.role === 'admin' && (
                  <>
                    <div className="bg-indigo-550/10 backdrop-blur-md p-6 rounded-3xl border border-indigo-200/30 shadow-sm bg-slate-900 text-white">
                      <div className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">Total Platform Bookings</div>
                      <div className="text-3xl font-extrabold">{bookings.length}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Registered Experts</div>
                      <div className="text-3xl font-extrabold text-slate-900">{professionals.length}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Services Active</div>
                      <div className="text-3xl font-extrabold text-slate-900">
                        {professionals.reduce((acc, p) => acc + p.services.length, 0)}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Board */}
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-md">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Activity className="h-4 w-4 text-indigo-600" /> Recent Service Activity
                </h3>
                {userBookings.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No active job requests. Browse our catalog in <a href="/explore" className="text-indigo-600 hover:underline">Explore Services</a> to start booking.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userBookings.slice(0, 3).map(booking => {
                      const pro = professionals.find(p => p.id === booking.professionalId);
                      return (
                        <div key={booking.id} className="p-4 bg-white/70 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{pro?.name || 'Service Specialist'}</p>
                            <p className="text-slate-500">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-100' :
                            booking.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: BOOKINGS (Interactive Lists & Cancellations) */}
          {currentTab === 'bookings' && (
            <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm overflow-hidden p-6 space-y-6">
              {userBookings.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="font-bold">No bookings recorded.</p>
                  <p className="text-xs text-slate-400 mt-1">Book services with India's best verified partners on our homepage catalog.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBookings.map(booking => {
                    const relatedPro = professionals.find(p => p.id === booking.professionalId);
                    return (
                      <div key={booking.id} className="p-5 bg-white/80 rounded-2xl border border-slate-150 shadow-sm flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">
                              {new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} • {booking.time}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize border ${
                              booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                              booking.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              booking.status === 'completed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <h3 className="text-slate-900 font-extrabold text-base">
                            {currentUser.role === 'customer' ? `Service with ${relatedPro?.name || 'Certified Partner'}` : `Task Request`}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                            {booking.notes || "No special requests mentioned. All standard tools will be supplied by GoServik."}
                          </p>
                          <p className="text-sm font-bold text-indigo-600 mt-2">Price: ₹{booking.totalPrice} INR</p>
                        </div>
                        
                        <div className="flex gap-2 w-full sm:w-auto shrink-0">
                          {booking.status === 'pending' && currentUser.role === 'customer' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              className="text-red-600 hover:bg-red-50 border-red-200 text-xs font-bold"
                            >
                              Cancel Booking
                            </Button>
                          )}
                          {booking.status === 'pending' && currentUser.role === 'professional' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9"
                              >
                                Accept Job
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm" 
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                className="text-red-600 hover:bg-red-50 border-red-200 text-xs font-bold h-9"
                              >
                                Decline
                              </Button>
                            </>
                          )}
                          {booking.status === 'confirmed' && currentUser.role === 'professional' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateBookingStatus(booking.id, 'completed')}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-9"
                            >
                              Mark as Completed
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: FAVORITES (Customer-Only) */}
          {currentTab === 'favorites' && currentUser.role === 'customer' && (
             <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm p-6">
               {savedProfessionals.length === 0 ? (
                 <div className="p-12 text-center text-slate-500">
                   <Heart className="h-12 w-12 mx-auto mb-4 opacity-20 text-indigo-600 animate-pulse" />
                   <p className="font-bold">No saved professionals.</p>
                   <p className="text-xs text-slate-400 mt-1">Bookmark top rating partners on our exploration screen to call them instantly.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {savedProfessionals.map(proId => {
                     const pro = professionals.find(p => p.id === proId);
                     if (!pro) return null;
                     return (
                       <div key={pro.id} className="p-4 bg-white/80 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <img src={pro.avatar} alt={pro.name} className="h-11 w-11 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                           <div>
                             <h3 className="font-bold text-slate-900 text-sm leading-snug">{pro.name}</h3>
                             <p className="text-xs text-slate-500 flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {pro.rating.toFixed(1)} rating</p>
                           </div>
                         </div>
                         <Button asChild variant="outline" size="sm" className="text-xs font-bold">
                           <a href={`/pro/${pro.id}`}>View</a>
                         </Button>
                       </div>
                     )
                   })}
                 </div>
               )}
             </div>
          )}

          {/* TAB: MANAGE SERVICES (Professional-Only) */}
          {currentTab === 'services' && currentUser.role === 'professional' && (
            <div className="space-y-6">
              {/* Form to Add Service */}
              <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm p-6">
                <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-indigo-600" /> Add New Service Offer
                </h3>
                {serviceSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-xl font-bold text-center mb-4">
                    {serviceSuccess}
                  </div>
                )}
                <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Service Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Sofa Sanitization & Deep Clean"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Service Category</label>
                    <select 
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="cat-1">Home Cleaning Services</option>
                      <option value="cat-2">Plumbing & Pipe Repair</option>
                      <option value="cat-3">Electrical Services</option>
                      <option value="cat-4">Air Conditioner Servicing</option>
                      <option value="cat-5">Appliance Repair & Diagnostics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Charges Per Visit</label>
                    <select 
                      required
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none bg-white"
                    >
                      <option value="49">₹49 (Standard Visit)</option>
                      <option value="99">₹99 (Premium Visit)</option>
                      <option value="149">₹149 (Specialist Visit)</option>
                      <option value="199">₹199 (Elite Visit)</option>
                      <option value="249">₹249 (Express Visit)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Billing Interval</label>
                    <select 
                      value={newServiceUnit}
                      onChange={(e) => setNewServiceUnit(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="hourly">Hourly Rate</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Experience required (Years)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 5"
                      value={newServiceExperience}
                      onChange={(e) => setNewServiceExperience(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description / Deliverables</label>
                    <textarea 
                      placeholder="Describe what is included in this service (e.g. machinery, chemicals, warranty period)"
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl">
                      Publish Active Service
                    </Button>
                  </div>
                </form>
              </div>

              {/* Active list */}
              <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">My Active Public Listings</h3>
                <div className="space-y-3">
                  {'services' in currentUser && currentUser.services.map((srv: any) => (
                    <div key={srv.id} className="p-4 bg-white/70 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-slate-800">{srv.name}</h4>
                        <p className="text-slate-500">{srv.description}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Exp: {srv.experienceYears} Years • Billing: {srv.priceUnit}</p>
                      </div>
                      <span className="text-sm font-extrabold text-indigo-600">₹{srv.basePrice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MESSAGES & LIVE SUPPORT CHAT */}
          {currentTab === 'messages' && (
            <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[500px]">
              
              {/* Chat thread list */}
              <div className="border-r border-slate-200/60 p-4 space-y-2 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">Chats</h3>
                <button 
                  onClick={() => setActiveChatContact('helpdesk')}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                    activeChatContact === 'helpdesk' ? 'bg-white shadow-sm border border-slate-200/50' : 'hover:bg-slate-100/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">🛎️</div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">Support Helpline</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[120px]">Live Desk Coordinator</p>
                  </div>
                </button>

                {currentUser.role === 'customer' ? (
                  <button 
                    onClick={() => setActiveChatContact('pro_rajesh')}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                      activeChatContact === 'pro_rajesh' ? 'bg-white shadow-sm border border-slate-200/50' : 'hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=100&h=100" alt="Rajesh" className="object-cover h-full w-full" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-slate-800">Rajesh Prasad</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[120px]">Expert Plumbing Partner</p>
                    </div>
                  </button>
                ) : (
                  <button 
                    onClick={() => setActiveChatContact('cust_neev')}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                      activeChatContact === 'cust_neev' ? 'bg-white shadow-sm border border-slate-200/50' : 'hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" alt="Neev" className="object-cover h-full w-full" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-slate-800">Customer Neev</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[120px]">Active Booking Client</p>
                    </div>
                  </button>
                )}
              </div>

              {/* Chat Thread Area */}
              <div className="md:col-span-2 flex flex-col justify-between h-full bg-white/30">
                {/* Header */}
                <div className="p-4 border-b border-slate-200/60 bg-white/80 font-bold text-xs text-slate-850 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Talking to {activeChatContact === 'helpdesk' ? 'Support Helpline' : activeChatContact === 'pro_rajesh' ? 'Rajesh Prasad (Plumber)' : 'Neev Aggarwal (Customer)'}
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {(chatThreads[activeChatContact] || []).map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`max-w-[75%] p-3 rounded-2xl text-xs shadow-sm ${
                        msg.sender === 'me' 
                          ? 'bg-slate-900 text-white rounded-br-none ml-auto' 
                          : 'bg-white text-slate-850 border border-slate-200/50 rounded-bl-none mr-auto'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className="text-[9px] text-slate-400 mt-1.5 text-right font-semibold">{msg.time}</p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Footer Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200/60 bg-white/80 flex gap-2">
                  <input 
                    type="text" 
                    required
                    placeholder="Type your reply here..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                  <button type="submit" className="h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shrink-0">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: BUSINESS/PROFILE SETTINGS */}
          {currentTab === 'settings' && (
            <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Settings className="h-4 w-4 text-indigo-600" /> Account Parameters & Personal Profile
                </h3>
                <p className="text-xs text-slate-500">Provide your personal credentials, contact info, and home address parameters below.</p>
              </div>

              {settingsSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-xl font-bold text-center">
                  {settingsSuccess}
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* SECTION 1: PERSONAL INFORMATION */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">1. Personal Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full / Display Name</label>
                      <input 
                        type="text" 
                        required
                        value={settingsName}
                        onChange={(e) => setSettingsName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                        placeholder="Neev Aggarwal"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
                      <input 
                        type="tel" 
                        required
                        value={settingsMobile}
                        onChange={(e) => setSettingsMobile(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={settingsEmail}
                        onChange={(e) => setSettingsEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                        placeholder="name@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date of Birth (DoB)</label>
                      <input 
                        type="date" 
                        required
                        value={settingsDob}
                        onChange={(e) => setSettingsDob(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: DETAILED ADDRESS */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">2. Detailed Home Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Country</label>
                      <input 
                        type="text" 
                        required
                        value={settingsCountry}
                        onChange={(e) => setSettingsCountry(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                        placeholder="India"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">State</label>
                      <input 
                        type="text" 
                        required
                        value={settingsState}
                        onChange={(e) => setSettingsState(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City</label>
                      <input 
                        type="text" 
                        required
                        value={settingsCity}
                        onChange={(e) => setSettingsCity(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pincode</label>
                      <input 
                        type="text" 
                        required
                        value={settingsPincode}
                        onChange={(e) => setSettingsPincode(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                        placeholder="400001"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Address Line (House/Plot, Street)</label>
                      <input 
                        type="text" 
                        required
                        value={settingsAddressLine}
                        onChange={(e) => setSettingsAddressLine(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                        placeholder="Flat 402, Greenfield Apartments"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Landmark</label>
                      <input 
                        type="text" 
                        required
                        value={settingsLandmark}
                        onChange={(e) => setSettingsLandmark(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                        placeholder="Near City Central Mall"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: PROFESSIONAL SERVICE PREFERENCES */}
                {currentUser.role === 'professional' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">3. Business Parameters</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Languages (Comma separated)</label>
                        <input 
                          type="text" 
                          value={settingsLanguages}
                          onChange={(e) => setSettingsLanguages(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                          placeholder="English, Hindi, Marathi"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tagline / Bio</label>
                        <textarea 
                          rows={2}
                          value={settingsBio}
                          onChange={(e) => setSettingsBio(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                          placeholder="Experienced independent home services expert"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Business Availability Status</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['available', 'busy', 'offline'] as const).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setSettingsStatus(status)}
                              className={`py-2 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                                settingsStatus === status 
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                  : 'bg-white text-slate-650 border-slate-200/80 hover:bg-slate-50'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${
                                status === 'available' ? 'bg-emerald-400' :
                                status === 'busy' ? 'bg-amber-400' : 'bg-slate-400'
                              }`}></span>
                              <span className="capitalize">{status}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl">
                  Save Changes
                </Button>
              </form>
            </div>
          )}

          {/* TAB: VERIFY PROFESSIONALS (Admin-Only) */}
          {currentTab === 'users' && currentUser.role === 'admin' && (
            <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Registered GoServik Technicians & Partners</h3>
              <div className="space-y-3">
                {professionals.map((pro) => (
                  <div key={pro.id} className="p-4 bg-white/80 rounded-2xl border border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <img src={pro.avatar} alt={pro.name} className="h-10 w-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          {pro.name}
                          {pro.verified && <CheckCircle className="h-3.5 w-3.5 text-indigo-600 fill-indigo-100" />}
                        </h4>
                        <p className="text-[10px] text-slate-500">{pro.tagline}</p>
                        <p className="text-[9px] text-indigo-600 font-bold">{pro.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-[10px] h-8 font-bold"
                        onClick={() => {
                          const isVerified = pro.verified;
                          updateUserProfile({ id: pro.id, verified: !isVerified } as any);
                          alert(`Verification state updated for ${pro.name}!`);
                        }}
                      >
                        {pro.verified ? 'Revoke Verification' : 'Verify Expert'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
