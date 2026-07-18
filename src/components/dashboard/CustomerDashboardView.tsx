import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store';
import { Button } from '../../components/ui/Button';
import { 
  Calendar, User as UserIcon, Settings, Heart, MessageSquare, Briefcase, 
  FileText, Bell, MapPin, Activity, CheckCircle, 
  XCircle, Send, Star, UserCheck, Plus, Trash2, ShieldAlert, Sparkles, Languages,
  X, Phone, Mail, Clock, Shield
} from 'lucide-react';

interface CustomerDashboardViewProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export function CustomerDashboardView({ currentTab, setTab }: CustomerDashboardViewProps) {
  const { 
    currentUser, bookings, professionals, savedProfessionals,
    updateBookingStatus, updateUserProfile 
  } = useStore();
  
  const navigate = useNavigate();

  // State for simulated chat messages
  const [activeChatContact, setActiveChatContact] = useState('helpdesk');
  const [chatInput, setChatInput] = useState('');
  const [chatThreads, setChatThreads] = useState<Record<string, Array<{ sender: 'me' | 'them'; text: string; time: string }>>>({
    helpdesk: [
      { sender: 'them', text: 'Namaste! Welcome to GoServik Premium Support. How can we help you today?', time: 'Just now' },
    ],
    pro_rajesh: [
      { sender: 'them', text: 'Hello, I am your assigned technician. I am bringing the required spares and tools for your visit.', time: '10 mins ago' }
    ]
  });

  // State for Profile settings form
  const [settingsName, setSettingsName] = useState(currentUser?.name || '');
  const [settingsMobile, setSettingsMobile] = useState(currentUser?.mobile || '');
  const [settingsEmail, setSettingsEmail] = useState(currentUser?.email || '');
  const [settingsDob, setSettingsDob] = useState(currentUser?.dob || '');
  const [settingsCountry, setSettingsCountry] = useState(currentUser?.country || 'India');
  const [settingsState, setSettingsState] = useState(currentUser?.state || '');
  const [settingsCity, setSettingsCity] = useState(currentUser?.city || '');
  const [settingsPincode, setSettingsPincode] = useState(currentUser?.pincode || '');
  const [settingsAddressLine, setSettingsAddressLine] = useState(currentUser?.addressLine || '');
  const [settingsLandmark, setSettingsLandmark] = useState(currentUser?.landmark || '');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
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
    }
  }, [currentUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThreads, activeChatContact]);

  if (!currentUser) return null;

  // Filter bookings for customer
  const userBookings = bookings.filter(b => b.customerId === currentUser.id);

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

    // Trigger auto-reply
    setTimeout(() => {
      let replyText = "Thank you for writing. Our customer executive will check and reply shortly.";
      if (activeChatContact === 'helpdesk') {
        replyText = "We have received your request. A GoServik support coordinator is reviewing your order parameters.";
      } else if (activeChatContact === 'pro_rajesh') {
        replyText = "Sure, I have noted down the landmark. I am carrying standard service tools. See you soon!";
      }

      const replyMsg = { sender: 'them' as const, text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChatThreads(prev => ({
        ...prev,
        [activeChatContact]: [...(prev[activeChatContact] || []), replyMsg]
      }));
    }, 1500);
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
    };

    updateUserProfile(updatedFields);
    setSettingsSuccess('Your customer profile details have been saved successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  const activeBookingsCount = userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
  const totalSpent = userBookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + b.totalPrice, 0);

  return (
    <div className="space-y-6">
      
      {/* TAB: OVERVIEW */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Bookings</div>
              <div className="text-3xl font-extrabold text-slate-900">{activeBookingsCount}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Saved Experts</div>
              <div className="text-3xl font-extrabold text-slate-900">{savedProfessionals.length}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Spent</div>
              <div className="text-3xl font-extrabold text-slate-900">₹{totalSpent}</div>
            </div>
          </div>

          {/* Action Board */}
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-md">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Activity className="h-4 w-4 text-indigo-600" /> Recent Service Activity
            </h3>
            {userBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active job requests. Browse our catalog in <Link to="/explore" className="text-indigo-600 hover:underline">Explore Services</Link> to start booking.
              </div>
            ) : (
              <div className="space-y-3">
                {userBookings.slice(0, 3).map(booking => {
                  const pro = professionals.find(p => p.id === booking.professionalId);
                  return (
                    <button 
                      key={booking.id} 
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full text-left p-4 bg-white/70 hover:bg-indigo-50/30 active:bg-indigo-100/30 rounded-2xl border border-slate-100 flex justify-between items-center text-xs transition-all hover:scale-[1.01] hover:shadow-sm"
                    >
                      <div>
                        <p className="font-bold text-slate-800">
                          Service with {pro?.name || 'Service Specialist'}
                        </p>
                        <p className="text-slate-500">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-indigo-600 font-bold hover:underline hidden sm:inline">View Order Details</span>
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
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: BOOKINGS */}
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
                        Service with {relatedPro?.name || 'Certified Partner'}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                        {booking.notes || "No special requests mentioned. All standard tools will be supplied by GoServik."}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm font-bold text-indigo-600">Price: ₹{booking.totalPrice} INR</p>
                        <span className="text-[11px] text-indigo-600 font-semibold group-hover:underline">Click to view booking parameters &rarr;</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                      {booking.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="text-red-600 hover:bg-red-50 border-red-200 text-xs font-bold"
                        >
                          Cancel Booking
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

      {/* TAB: FAVORITES */}
      {currentTab === 'favorites' && (
         <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm p-6">
           {savedProfessionals.length === 0 ? (
             <div className="p-12 text-center text-slate-500">
               <Heart className="h-12 w-12 mx-auto mb-4 opacity-20 text-indigo-600" />
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
                       <Link to={`/pro/${pro.id}`}>View</Link>
                     </Button>
                   </div>
                 )
               })}
             </div>
           )}
         </div>
      )}

      {/* TAB: HELPLINE & CHAT */}
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

            <button 
              onClick={() => setActiveChatContact('pro_rajesh')}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                activeChatContact === 'pro_rajesh' ? 'bg-white shadow-sm border border-slate-200/50' : 'hover:bg-slate-100/50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=100&h=100" alt="Partner" className="object-cover h-full w-full" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">Service Partner</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[120px]">Expert technician</p>
              </div>
            </button>
          </div>

          {/* Chat Thread Area */}
          <div className="md:col-span-2 flex flex-col justify-between h-full bg-white/30">
            {/* Header */}
            <div className="p-4 border-b border-slate-200/60 bg-white/80 font-bold text-xs text-slate-850 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Talking to {activeChatContact === 'helpdesk' ? 'Support Helpline' : 'Assigned Service Partner'}
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

      {/* TAB: PROFILE SETTINGS */}
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

            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl">
              Save Customer Profile Settings
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
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Opted</h4>
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Visit Fee & Payment</span>
                  <div className="text-xl font-extrabold text-slate-900 mt-0.5">₹{selectedBooking.totalPrice}</div>
                  <div className="text-[9px] mt-1 font-semibold">
                    {selectedBooking.paymentMethod === 'razorpay' ? (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded font-bold">
                        Razorpay • PAID
                      </span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded font-bold">
                        Cash • PAY ON VISIT
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Specialist info */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
                  <Briefcase className="h-4 w-4 text-indigo-600" /> Specialist Information
                </h4>
                
                {(() => {
                  const pro = professionals.find(p => p.id === selectedBooking.professionalId);
                  return (
                    <div className="space-y-3 pl-1">
                      <div className="flex items-start gap-3">
                        <img src={pro?.avatar} alt={pro?.name} className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0" referrerPolicy="no-referrer" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Name</span>
                          <span className="text-xs font-bold text-slate-850">{pro?.name || 'Service Partner'}</span>
                          <span className="text-[10px] text-indigo-600 font-bold ml-2">({pro?.tagline})</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Contact Hotline</span>
                          <span className="text-xs font-bold text-slate-850">{pro?.mobile || '+91 9999999999'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Notes */}
              <div className="space-y-1 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Special Instructions & Landmark</span>
                <p className="text-xs text-slate-600 italic leading-relaxed mt-1">
                  "{selectedBooking.notes || 'No special instructions listed by client.'}"
                </p>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedBooking(null)}
                className="text-xs font-bold rounded-xl h-10 border-slate-200"
              >
                Close Window
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
