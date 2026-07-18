import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { Button } from '../../components/ui/Button';
import { 
  Calendar, User as UserIcon, Settings, Heart, MessageSquare, Briefcase, 
  FileText, Bell, MapPin, Activity, CheckCircle, 
  XCircle, Send, Star, UserCheck, Plus, Trash2, ShieldAlert, Sparkles, Languages,
  X, Phone, Mail, Clock
} from 'lucide-react';

interface ProfessionalDashboardViewProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export function ProfessionalDashboardView({ currentTab, setTab }: ProfessionalDashboardViewProps) {
  const { 
    currentUser, bookings, professionals,
    updateBookingStatus, addProfessionalService, updateUserProfile 
  } = useStore();

  const proUser = currentUser as any;

  // State for adding a new service (professional)
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('cat-1');
  const [newServicePrice, setNewServicePrice] = useState('99');
  const [newServiceUnit, setNewServiceUnit] = useState<'hourly' | 'fixed'>('fixed');
  const [newServiceExperience, setNewServiceExperience] = useState('3');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [serviceSuccess, setServiceSuccess] = useState('');

  // State for simulated chat messages
  const [activeChatContact, setActiveChatContact] = useState('cust_neev');
  const [chatInput, setChatInput] = useState('');
  const [chatThreads, setChatThreads] = useState<Record<string, Array<{ sender: 'me' | 'them'; text: string; time: string }>>>({
    cust_neev: [
      { sender: 'them', text: 'Hello, I booked a home deep cleaning. Can you carry eco-friendly floor cleaning agents?', time: '20 mins ago' },
      { sender: 'me', text: 'Namaste! Yes, we carry organic sanitizers and biodegradable floor agents as standard equipment.', time: '15 mins ago' }
    ],
    helpdesk: [
      { sender: 'them', text: 'Namaste! GoServik Partner support desk is active. Need help with payout, tax slab, or scheduling?', time: 'Yesterday' }
    ]
  });

  // State for Business settings profile
  const [settingsName, setSettingsName] = useState(proUser?.name || '');
  const [settingsMobile, setSettingsMobile] = useState(proUser?.mobile || '');
  const [settingsEmail, setSettingsEmail] = useState(proUser?.email || '');
  const [settingsDob, setSettingsDob] = useState(proUser?.dob || '');
  const [settingsCountry, setSettingsCountry] = useState(proUser?.country || 'India');
  const [settingsState, setSettingsState] = useState(proUser?.state || '');
  const [settingsCity, setSettingsCity] = useState(proUser?.city || '');
  const [settingsPincode, setSettingsPincode] = useState(proUser?.pincode || '');
  const [settingsAddressLine, setSettingsAddressLine] = useState(proUser?.addressLine || '');
  const [settingsLandmark, setSettingsLandmark] = useState(proUser?.landmark || '');
  const [settingsLocation, setSettingsLocation] = useState(proUser?.location || 'Mumbai, India');
  const [settingsBio, setSettingsBio] = useState(proUser?.bio || 'Certified premium partner of GoServik.');
  const [settingsLanguages, setSettingsLanguages] = useState(proUser?.languages?.join(', ') || 'English, Hindi');
  const [settingsStatus, setSettingsStatus] = useState<'available' | 'busy' | 'offline'>(proUser?.availabilityStatus || 'available');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (proUser) {
      setSettingsName(proUser.name || '');
      setSettingsEmail(proUser.email || '');
      setSettingsMobile(proUser.mobile || '');
      setSettingsDob(proUser.dob || '');
      setSettingsCountry(proUser.country || 'India');
      setSettingsState(proUser.state || '');
      setSettingsCity(proUser.city || '');
      setSettingsPincode(proUser.pincode || '');
      setSettingsAddressLine(proUser.addressLine || '');
      setSettingsLandmark(proUser.landmark || '');
      setSettingsLocation(proUser.location || '');
      setSettingsBio(proUser.bio || '');
      if (proUser.languages) {
        setSettingsLanguages(proUser.languages.join(', '));
      }
      setSettingsStatus(proUser.availabilityStatus || 'available');
    }
  }, [proUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThreads, activeChatContact]);

  if (!currentUser) return null;

  // Filter bookings for professional
  const userBookings = bookings.filter(b => b.professionalId === currentUser.id);

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

    // Simulated customer reply after 1.5 seconds
    setTimeout(() => {
      let replyText = "Understood. I will be ready at the scheduled time.";
      if (activeChatContact === 'helpdesk') {
        replyText = "Thank you. Your request is registered under Ticket ID #GS-9921. Our service manager will reach you.";
      } else if (activeChatContact === 'cust_neev') {
        replyText = "Thank you, that would be wonderful! We have some old stains on the floor so organic cleaners help.";
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

    let calculatedPrice = Number(newServicePrice) || 99;

    const serviceObj = {
      categoryId: newServiceCategory,
      name: newServiceName,
      description: newServiceDesc || 'No custom details provided.',
      basePrice: calculatedPrice,
      priceUnit: newServiceUnit,
      experienceYears: Number(newServiceExperience) || 3
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
    const updatedFields = {
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
      bio: settingsBio,
      languages: settingsLanguages.split(',').map(s => s.trim()),
      availabilityStatus: settingsStatus
    };

    updateUserProfile(updatedFields);
    setSettingsSuccess('Your professional profile and business availability has been saved successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  const pendingRequestsCount = userBookings.filter(b => b.status === 'pending').length;
  const completedCount = userBookings.filter(b => b.status === 'completed').length;
  const totalRevenue = userBookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + b.totalPrice, 0);

  return (
    <div className="space-y-6">
      
      {/* TAB: OVERVIEW */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Requests</div>
              <div className="text-3xl font-extrabold text-indigo-600">{pendingRequestsCount}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Completed Jobs</div>
              <div className="text-3xl font-extrabold text-slate-900">{completedCount}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Business Revenue</div>
              <div className="text-3xl font-extrabold text-emerald-600">₹{totalRevenue}</div>
            </div>
          </div>

          {/* Action Board */}
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-md">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Activity className="h-4 w-4 text-indigo-600" /> Recent Job Requests
            </h3>
            {userBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active booking orders or customer requests assigned. Make sure your availability status is set to "Available".
              </div>
            ) : (
              <div className="space-y-3">
                {userBookings.slice(0, 3).map(booking => (
                  <button 
                    key={booking.id} 
                    onClick={() => setSelectedBooking(booking)}
                    className="w-full text-left p-4 bg-white/70 hover:bg-indigo-50/30 active:bg-indigo-100/30 rounded-2xl border border-slate-100 flex justify-between items-center text-xs transition-all hover:scale-[1.01] hover:shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-slate-800">
                        Booking from {booking.customerName || 'GoServik Client'}
                      </p>
                      <p className="text-slate-500">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-indigo-600 font-bold hover:underline hidden sm:inline">Review Request &rarr;</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-100' :
                        booking.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        booking.status === 'completed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: BOOKINGS (JOB REQUESTS) */}
      {currentTab === 'bookings' && (
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm overflow-hidden p-6 space-y-6">
          {userBookings.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-bold">No booking requests available.</p>
              <p className="text-xs text-slate-400 mt-1">When customers book your services, requests will appear here instantly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userBookings.map(booking => (
                <div 
                  key={booking.id} 
                  onClick={() => setSelectedBooking(booking)}
                  className="cursor-pointer hover:border-indigo-300 hover:shadow-md active:scale-[0.99] p-5 bg-white/80 hover:bg-white rounded-2xl border border-slate-150 shadow-sm flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center transition-all group"
                >
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
                    <h3 className="text-slate-900 font-extrabold text-base group-hover:text-indigo-600 transition-colors">
                      Booking from {booking.customerName || 'GoServik Client'}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                      {booking.notes || "No special requests mentioned."}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-sm font-bold text-indigo-600">Earnings: ₹{booking.totalPrice} INR</p>
                      <span className="text-[11px] text-indigo-600 font-semibold group-hover:underline">Click to view location & address &rarr;</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                    {booking.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9 rounded-xl px-3"
                        >
                          Accept Job
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="text-red-600 hover:bg-red-50 border-red-200 text-xs font-bold h-9 rounded-xl px-3"
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-9 rounded-xl"
                      >
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: MANAGE SERVICES */}
      {currentTab === 'services' && (
        <div className="space-y-6">
          {/* Add Service Form */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm p-6">
            <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-indigo-600" /> Add New Service Listing
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
                  placeholder="e.g. AC Filter Wash & Installation"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Service Category</label>
                <select 
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="cat-1">Home Cleaning Services</option>
                  <option value="cat-2">Plumbing & Pipe Repair</option>
                  <option value="cat-3">Electrical Services</option>
                  <option value="cat-4">Air Conditioner Servicing</option>
                  <option value="cat-5">Appliance Repair & Diagnostics</option>
                  <option value="cat-6">House Painting Consult</option>
                  <option value="cat-7">Pest Control Herbal Treatment</option>
                  <option value="cat-8">Garden & Turf Setup</option>
                  <option value="cat-9">Tile & Masonry Work</option>
                  <option value="cat-10">CCTV & Smart Lock Integration</option>
                  <option value="cat-11">WiFi Setup & Smart Home Integration</option>
                  <option value="cat-12">Packers & Movers Shifting Assistance</option>
                  <option value="cat-13">Kitchen Chimney & Appliances Cleaning</option>
                  <option value="cat-14">Men & Women Haircut Salon Home Visit</option>
                  <option value="cat-15">Physiotherapy & Companion Nursing Visit</option>
                  <option value="cat-16">Disinfection Sanitization Fogging</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Charges Per Visit</label>
                <select 
                  required
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Years of Experience Required</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 5"
                  value={newServiceExperience}
                  onChange={(e) => setNewServiceExperience(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description / Deliverables</label>
                <textarea 
                  placeholder="Describe what tasks are covered under this service pricing package"
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl">
                  Publish Active Service
                </Button>
              </div>
            </form>
          </div>

          {/* Active listings */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">My Active Public Listings</h3>
            <div className="space-y-3">
              {proUser?.services && (proUser.services as any[]).map((srv: any) => (
                <div key={srv.id || srv.name} className="p-4 bg-white/75 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
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

      {/* TAB: CUSTOMER CHAT */}
      {currentTab === 'messages' && (
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[500px]">
          
          {/* Thread List */}
          <div className="border-r border-slate-200/60 p-4 space-y-2 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">Chats</h3>
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

            <button 
              onClick={() => setActiveChatContact('helpdesk')}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                activeChatContact === 'helpdesk' ? 'bg-white shadow-sm border border-slate-200/50' : 'hover:bg-slate-100/50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">🛎️</div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">GoServik Desk</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[120px]">Partner Support</p>
              </div>
            </button>
          </div>

          {/* Chat thread box */}
          <div className="md:col-span-2 flex flex-col justify-between h-full bg-white/30">
            <div className="p-4 border-b border-slate-200/60 bg-white/80 font-bold text-xs text-slate-850 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Talking to {activeChatContact === 'helpdesk' ? 'Partner support Desk' : 'Neev Aggarwal (Customer)'}
            </div>

            {/* Messages body */}
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

      {/* TAB: PROFESSIONAL BUSINESS PROFILE */}
      {currentTab === 'settings' && (
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-indigo-600" /> Professional Business Settings Profile
            </h3>
            <p className="text-xs text-slate-500">Provide your expert credentials, contact hotline, business address parameters and availability below.</p>
          </div>

          {settingsSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-xl font-bold text-center">
              {settingsSuccess}
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* SECTION 1: BUSINESS REGISTRATION INFO */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">1. Business Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full / Display Name</label>
                  <input 
                    type="text" 
                    required
                    value={settingsName}
                    onChange={(e) => setSettingsName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Contact Hotline</label>
                  <input 
                    type="tel" 
                    required
                    value={settingsMobile}
                    onChange={(e) => setSettingsMobile(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
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
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date of Birth</label>
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

            {/* SECTION 2: BUSINESS LOCATION */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">2. Operating Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Country</label>
                  <input 
                    type="text" 
                    required
                    value={settingsCountry}
                    onChange={(e) => setSettingsCountry(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
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
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Office/Workshop Address Line</label>
                  <input 
                    type="text" 
                    required
                    value={settingsAddressLine}
                    onChange={(e) => setSettingsAddressLine(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
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
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: BUSINESS METADATA */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">3. Business Metadata</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Languages Spoken (Comma separated)</label>
                  <input 
                    type="text" 
                    value={settingsLanguages}
                    onChange={(e) => setSettingsLanguages(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Business Bio / Tagline</label>
                  <textarea 
                    rows={2}
                    value={settingsBio}
                    onChange={(e) => setSettingsBio(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
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

            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl">
              Save Professional Business Profile
            </Button>
          </form>
        </div>
      )}

      {/* Sleek Order Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Order # {selectedBooking.id}</span>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  Booking Order Details
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold capitalize border ${
                    selectedBooking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                    selectedBooking.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    selectedBooking.status === 'completed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </h3>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="h-8 w-8 rounded-full hover:bg-slate-200/60 active:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
              
              <div className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Ordered</h4>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5">{selectedBooking.customerServiceOpted || 'Home Visit Service'}</p>
                </div>
              </div>

              {/* Time & Price Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Arrival Schedule</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mt-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>{new Date(selectedBooking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-0.5 pl-5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{selectedBooking.time}</span>
                  </div>
                </div>

                <div className="space-y-0.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payout Amount</span>
                  <div className="text-xl font-extrabold text-slate-900 mt-0.5">₹{selectedBooking.totalPrice}</div>
                  <div className="text-[9px] mt-1 font-semibold">
                    {selectedBooking.paymentMethod === 'razorpay' ? (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded font-bold">
                        Razorpay • PAID IN FULL
                      </span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded font-bold">
                        Cash • COLLECT FROM CLIENT
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
                  <UserIcon className="h-4 w-4 text-indigo-600" /> Customer Information
                </h4>
                
                <div className="space-y-3 pl-1">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Full Name</span>
                      <span className="text-xs font-bold text-slate-850">{selectedBooking.customerName || 'GoServik Client'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Mobile Number</span>
                      <span className="text-xs font-bold text-slate-850 select-all">{selectedBooking.customerMobile || '+91 9876543210'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Service Address</span>
                      <p className="text-xs font-bold text-slate-850 leading-relaxed select-all">{selectedBooking.customerAddress || 'No address provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special instructions */}
              <div className="space-y-1 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Special Instructions & Landmark</span>
                <p className="text-xs text-slate-600 italic leading-relaxed mt-1">
                  "{selectedBooking.notes || 'No instructions listed.'}"
                </p>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-2.5">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedBooking(null)}
                className="text-xs font-bold rounded-xl h-10 border-slate-200"
              >
                Close Window
              </Button>

              {selectedBooking.status === 'pending' && (
                <>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'confirmed');
                      setSelectedBooking(prev => prev ? { ...prev, status: 'confirmed' } : null);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-10 px-4"
                  >
                    Accept Job
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm" 
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'cancelled');
                      setSelectedBooking(prev => prev ? { ...prev, status: 'cancelled' } : null);
                    }}
                    className="text-red-600 hover:bg-red-50 border-red-200 text-xs font-bold rounded-xl h-10 px-4"
                  >
                    Decline
                  </Button>
                </>
              )}

              {selectedBooking.status === 'confirmed' && (
                <Button 
                  size="sm" 
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, 'completed');
                    setSelectedBooking(prev => prev ? { ...prev, status: 'completed' } : null);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl h-10 px-4"
                >
                  Mark as Completed
                </Button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
