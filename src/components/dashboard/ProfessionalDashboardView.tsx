import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore, getDistanceKm } from '../../store';
import { Button } from '../../components/ui/Button';
import { 
  Calendar, User as UserIcon, Settings, Heart, MessageSquare, Briefcase, 
  FileText, Bell, MapPin, Activity, CheckCircle, 
  XCircle, Send, Star, UserCheck, Plus, Trash2, ShieldAlert, Sparkles, Languages,
  X, Phone, Mail, Clock, Compass, Shield
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
  const [activeChatContact, setActiveChatContact] = useState('client_chat');
  const [chatInput, setChatInput] = useState('');
  const [chatThreads, setChatThreads] = useState<Record<string, Array<{ sender: 'me' | 'them'; text: string; time: string }>>>({
    client_chat: [
      { sender: 'them', text: 'Hello, I booked a home deep cleaning. Can you carry eco-friendly floor cleaning agents?', time: '20 mins ago' },
      { sender: 'me', text: 'Namaste! Yes, we carry organic sanitizers and biodegradable floor agents as standard equipment.', time: '15 mins ago' }
    ],
    helpdesk: [
      { sender: 'them', text: 'Namaste! KaamNow Partner support desk is active. Need help with payout, tax slab, or scheduling?', time: 'Yesterday' }
    ]
  });

  // State for Business settings profile
  const [settingsName, setSettingsName] = useState(proUser?.name || '');
  const [settingsPersonalName, setSettingsPersonalName] = useState(proUser?.personalName || '');
  const [settingsMobile, setSettingsMobile] = useState(proUser?.mobile || '');
  const [settingsEmail, setSettingsEmail] = useState(proUser?.email || '');
  const [settingsDob, setSettingsDob] = useState(proUser?.dob || '');
  const [settingsCountry, setSettingsCountry] = useState(proUser?.country || '');
  const [settingsState, setSettingsState] = useState(proUser?.state || '');
  const [settingsCity, setSettingsCity] = useState(proUser?.city || '');
  const [settingsPincode, setSettingsPincode] = useState(proUser?.pincode || '');
  const [settingsAddressLine, setSettingsAddressLine] = useState(proUser?.addressLine || '');
  const [settingsLandmark, setSettingsLandmark] = useState(proUser?.landmark || '');
  const [settingsLocation, setSettingsLocation] = useState(proUser?.location || '');
  const [settingsBio, setSettingsBio] = useState(proUser?.bio || '');
  const [settingsLanguages, setSettingsLanguages] = useState(proUser?.languages?.join(', ') || '');
  const [settingsStatus, setSettingsStatus] = useState<'available' | 'busy' | 'offline'>(proUser?.availabilityStatus || 'available');
  const [settingsRadius, setSettingsRadius] = useState<number>(proUser?.serviceRadiusKm || 10);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Phone OTP Verification State
  const [originalMobile, setOriginalMobile] = useState(proUser?.mobile || '');
  const [isMobileVerified, setIsMobileVerified] = useState(true);
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);
  const [otpSentTo, setOtpSentTo] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (proUser) {
      setSettingsName(proUser.name || '');
      setSettingsPersonalName(proUser.personalName || '');
      setSettingsEmail(proUser.email || '');
      setSettingsMobile(proUser.mobile || '');
      setOriginalMobile(proUser.mobile || '');
      setIsMobileVerified(true);
      setSettingsDob(proUser.dob || '');
      setSettingsCountry(proUser.country || '');
      setSettingsState(proUser.state || '');
      setSettingsCity(proUser.city || '');
      setSettingsPincode(proUser.pincode || '');
      setSettingsAddressLine(proUser.addressLine || '');
      setSettingsLandmark(proUser.landmark || '');
      setSettingsLocation(proUser.location || '');
      setSettingsBio(proUser.bio || '');
      if (proUser.languages) {
        setSettingsLanguages(proUser.languages.join(', '));
      } else {
        setSettingsLanguages('');
      }
      setSettingsStatus(proUser.availabilityStatus || 'available');
      setSettingsRadius(proUser.serviceRadiusKm || 10);
    }
  }, [proUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThreads, activeChatContact]);

  if (!currentUser) return null;

  // Filter 1: My assigned jobs (including active/confirmed and completed ones)
  const assignedJobs = bookings.filter(b => b.professionalId === currentUser.id);

  // Filter 2: Available unassigned broadcasts in radius matching
  const broadcastJobs = bookings.filter(b => {
    // Must be pending and not assigned to anyone yet
    if (b.status !== 'pending' || b.professionalId) return false;

    // Check if the professional supports this category of service
    const supportsCat = proUser?.services?.some((s: any) => s.categoryId === b.categoryId);
    if (!supportsCat) return false;

    // Check radius range using coordinates
    if (proUser?.coordinates && b.coordinates) {
      const distance = getDistanceKm(
        proUser.coordinates.lat,
        proUser.coordinates.lng,
        b.coordinates.lat,
        b.coordinates.lng
      );
      const activeRadius = proUser.serviceRadiusKm || 10;
      return distance <= activeRadius;
    }

    // Default to true if coordinates are missing (for safety fallback)
    return true;
  });

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
      } else if (activeChatContact === 'client_chat') {
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
      personalName: settingsPersonalName,
      companyName: settingsName,
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
      availabilityStatus: settingsStatus,
      serviceRadiusKm: Number(settingsRadius) || 10
    };

    updateUserProfile(updatedFields);
    setSettingsSuccess('Your professional profile and business availability has been saved successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  const pendingRequestsCount = assignedJobs.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
  const completedCount = assignedJobs.filter(b => b.status === 'completed').length;
  const totalRevenue = assignedJobs.filter(b => b.status === 'completed').reduce((acc, b) => acc + b.totalPrice, 0);

  return (
    <div className="space-y-6">
      
      {/* TAB: OVERVIEW */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white/40 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Jobs</div>
              <div className="text-2xl font-black text-indigo-600">{pendingRequestsCount}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white/40 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Completed Jobs</div>
              <div className="text-2xl font-black text-slate-900">{completedCount}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white/40 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Gross Earnings</div>
              <div className="text-2xl font-black text-slate-900">₹{totalRevenue}</div>
              <span className="text-[10px] text-slate-400">Total Billed</span>
            </div>
            <div className="bg-emerald-50/80 backdrop-blur-md p-5 rounded-3xl border border-emerald-200/60 shadow-sm">
              <div className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">Net Take-Home (95%)</div>
              <div className="text-2xl font-black text-emerald-700">₹{Math.round(totalRevenue * 0.95)}</div>
              <span className="text-[10px] text-emerald-600/80">5% Platform Fee: ₹{Math.round(totalRevenue * 0.05)}</span>
            </div>
          </div>

          {/* QUALITY INCENTIVES & GAMIFICATION PANEL */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                  Quality & Performance
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-1">Milestone Rewards & Badges</h3>
              </div>
              <div className="text-xs font-bold text-slate-600">
                Rating: <span className="text-amber-500 font-black">⭐ {proUser?.rating || '4.9'}</span> / 5.0
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Milestone 1 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                completedCount >= 10 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>10 Jobs Milestone</span>
                  <span className="text-[10px] font-black">{completedCount >= 10 ? '✓ Unlocked' : `${completedCount}/10`}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">₹500 Tool Voucher credit for equipment and spares.</p>
              </div>

              {/* Milestone 2 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                completedCount >= 50 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>50 Jobs Milestone</span>
                  <span className="text-[10px] font-black">{completedCount >= 50 ? '✓ Unlocked' : `${completedCount}/50`}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Free Premium Spotlight banner boosting local discovery.</p>
              </div>

              {/* Milestone 3 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                completedCount >= 100 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>100 Jobs Milestone</span>
                  <span className="text-[10px] font-black">{completedCount >= 100 ? '✓ Unlocked' : `${completedCount}/100`}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">0% Platform Fee for 1 full month — keep 100% of billings!</p>
              </div>
            </div>

            {/* Q4 Subscription Tiers Preview */}
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">Q4 Rating-Linked Subscription Preview</span>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Launch Phase: <strong className="text-emerald-600 font-black">₹0 Free Registration Active</strong>. Starting Q4, your {proUser?.rating || 4.9} rating qualifies you for:
                </p>
              </div>
              <div className="shrink-0 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 text-center">
                <span className="font-black text-indigo-700">₹100/mo (Max Discount Tier)</span>
              </div>
            </div>
          </div>

          {/* RADIUS BROADCAST PANEL */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-600/5 backdrop-blur-md p-6 rounded-3xl border border-indigo-150 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-2 border-b border-indigo-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Compass className="h-4.5 w-4.5 text-indigo-600 animate-spin" /> Live Broadcast Alerts ({settingsRadius} km Range)
              </h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2.5 py-1 rounded-full">
                First-Come, First-Serve Assignment Flow
              </span>
            </div>

            {broadcastJobs.length === 0 ? (
              <div className="p-8 text-center bg-white/40 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                No active booking broadcasts matching your specializations within your {settingsRadius} km range. 
                Keep this tab open to monitor real-time local demand broadcasts!
              </div>
            ) : (
              <div className="space-y-3">
                {broadcastJobs.map(b => {
                  let distanceText = "Near You";
                  if (proUser?.coordinates && b.coordinates) {
                    const dist = getDistanceKm(
                      proUser.coordinates.lat,
                      proUser.coordinates.lng,
                      b.coordinates.lat,
                      b.coordinates.lng
                    );
                    distanceText = `${dist.toFixed(1)} km away`;
                  }
                  return (
                    <div 
                      key={b.id}
                      className="p-4 bg-white/90 rounded-2xl border border-indigo-100 shadow-sm hover:shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-indigo-150 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                            Radius Match
                          </span>
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-full">
                            {distanceText}
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-slate-900 mt-2">{b.customerServiceOpted}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Date: {new Date(b.date).toLocaleDateString()} at {b.time}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Delivery Locality: {b.customerAddress.split(',').slice(0,2).join(', ')}</p>
                      </div>

                      <div className="shrink-0 flex gap-2 w-full sm:w-auto">
                        <Button
                          onClick={() => updateBookingStatus(b.id, 'confirmed', currentUser.id)}
                          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-4 py-2 rounded-xl shadow-md h-9"
                        >
                          Accept Broadcast &rarr;
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Board - My Active Assignments */}
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-md">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Activity className="h-4 w-4 text-indigo-600" /> My Assigned Active Jobs
            </h3>
            {assignedJobs.filter(b => b.status !== 'completed').length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active jobs currently assigned. Claim an open broadcast in the broadcast matching panel above.
              </div>
            ) : (
              <div className="space-y-3">
                {assignedJobs.filter(b => b.status !== 'completed').slice(0, 3).map(booking => (
                  <button 
                    key={booking.id} 
                    onClick={() => setSelectedBooking(booking)}
                    className="w-full text-left p-4 bg-white/70 hover:bg-indigo-50/30 active:bg-indigo-100/30 rounded-2xl border border-slate-100 flex justify-between items-center text-xs transition-all hover:scale-[1.01] hover:shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-slate-800">
                        Booking from {booking.customerName || 'KaamNow Client'}
                      </p>
                      <p className="text-slate-500">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-indigo-600 font-bold hover:underline hidden sm:inline">Open Job Card &rarr;</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-100' :
                        booking.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-slate-150 text-slate-600 border border-slate-200'
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
          <div className="border-b pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Job Board Desk</h2>
              <p className="text-xs text-slate-500">Manage your active service appointments and check in on completed contracts.</p>
            </div>
          </div>

          {assignedJobs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-bold">No assigned bookings available.</p>
              <p className="text-xs text-slate-400 mt-1">Accept local broadcasts inside the Overview page to assign jobs to yourself.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedJobs.map(booking => (
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
                      Booking from {booking.customerName || 'KaamNow Client'}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                      {booking.notes || "No special requests mentioned."}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                      <span className="font-bold text-slate-900">Total: ₹{booking.totalPrice}</span>
                      <span className="text-emerald-700 font-bold">Take-home: ₹{Math.round(booking.totalPrice * 0.95)}</span>
                      <span className="text-slate-400 text-[10px]">(5% fee: ₹{Math.round(booking.totalPrice * 0.05)})</span>
                      <span className="text-[11px] text-indigo-600 font-semibold group-hover:underline">Click for details &rarr;</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto shrink-0" onClick={(e) => e.stopPropagation()}>
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
                        onClick={() => updateBookingStatus(booking.id, 'in_transit')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-9 rounded-xl px-3"
                      >
                        En Route 🚗
                      </Button>
                    )}
                    {booking.status === 'in_transit' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateBookingStatus(booking.id, 'arrived')}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-9 rounded-xl px-3"
                      >
                        Mark Arrived 📍
                      </Button>
                    )}
                    {booking.status === 'arrived' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateBookingStatus(booking.id, 'diagnostic_in_progress')}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold h-9 rounded-xl px-3"
                      >
                        Start Diagnostics 🔍
                      </Button>
                    )}
                    {booking.status === 'diagnostic_in_progress' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateBookingStatus(booking.id, 'work_in_progress')}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold h-9 rounded-xl px-3"
                      >
                        Start Work ⚙️
                      </Button>
                    )}
                    {booking.status === 'work_in_progress' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9 rounded-xl px-4"
                      >
                        Complete Job ✓
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
              <Plus className="h-4 w-4 text-indigo-600" /> Add New Service Listing Category
            </h3>
            {serviceSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-xl font-bold text-center mb-4">
                {serviceSuccess}
              </div>
            )}
            <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Service Display Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MCB Wiring & MCB Board Setup"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Service Category</label>
                <select 
                  required
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="cat-1">Electrical Services</option>
                  <option value="cat-2">Plumbing Services</option>
                  <option value="cat-3">Carpentry & Woodwork</option>
                  <option value="cat-4">Masonry & Civil Work</option>
                  <option value="cat-5">Painting & Wall Finishes</option>
                  <option value="cat-6">Tiles, Marble & Flooring</option>
                  <option value="cat-7">Aluminium, Glass & Metal Work</option>
                  <option value="cat-8">AC, Fridge & Appliances</option>
                  <option value="cat-9">Cleaning & Sanitization</option>
                  <option value="cat-10">Waterproofing & Damp Repair</option>
                  <option value="cat-11">Interior Design & Modular Kitchen</option>
                  <option value="cat-12">Smart Home & CCTV Installation</option>
                  <option value="cat-13">New House Construction</option>
                  <option value="cat-14">Gardening & Outdoor Landscaping</option>
                  <option value="cat-15">Fabrication & Welding</option>
                  <option value="cat-16">Home Safety & Structure Inspection</option>
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
                  <option value="99">₹99 (Standard Diagnostics)</option>
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
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Years of Personal Experience</label>
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
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description / Specialty Covered</label>
                <textarea 
                  placeholder="Describe your credentials under this category listing..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl">
                  Publish Active Service Listing
                </Button>
              </div>
            </form>
          </div>

          {/* Active listings */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">My Registered Specializations</h3>
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
              onClick={() => setActiveChatContact('client_chat')}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                activeChatContact === 'client_chat' ? 'bg-white shadow-sm border border-slate-200/50' : 'hover:bg-slate-100/50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" alt="Client" className="object-cover h-full w-full" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">KaamNow Client</p>
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
                <p className="font-bold text-slate-800">KaamNow Desk</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[120px]">Partner Support</p>
              </div>
            </button>
          </div>

          {/* Chat thread box */}
          <div className="md:col-span-2 flex flex-col justify-between h-full bg-white/30">
            <div className="p-4 border-b border-slate-200/60 bg-white/80 font-bold text-xs text-slate-850 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Talking to {activeChatContact === 'helpdesk' ? 'Partner support Desk' : 'KaamNow Client'}
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
            <p className="text-xs text-slate-500">Provide your credentials, contact hotline, business service range, and availability below. Essential fields are marked with <span className="text-rose-500 font-bold">*</span>.</p>
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
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Business / Firm Name <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={settingsName}
                    onChange={(e) => setSettingsName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Owner / Proprietor Name <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={settingsPersonalName}
                    onChange={(e) => setSettingsPersonalName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                    placeholder="your name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Contact Hotline <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      required
                      value={settingsMobile}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettingsMobile(val);
                        if (val === originalMobile) {
                          setIsMobileVerified(true);
                        } else {
                          setIsMobileVerified(false);
                        }
                      }}
                      className={`w-full rounded-xl border ${!isMobileVerified ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'} bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none`}
                    />
                    {settingsMobile !== originalMobile && !isMobileVerified && (
                      <button
                        type="button"
                        onClick={() => {
                          const code = Math.floor(100000 + Math.random() * 900000).toString();
                          setGeneratedOtp(code);
                          setOtpSentTo(settingsMobile);
                          setOtpError('');
                          setVerificationCode('');
                          setShowOtpPrompt(true);
                        }}
                        className="absolute right-2 top-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg shadow"
                      >
                        Verify Hotline
                      </button>
                    )}
                  </div>
                  {settingsMobile !== originalMobile && !isMobileVerified && (
                    <p className="text-[10px] text-amber-600 font-bold mt-1">
                      ⚠️ Hotline changed. You must verify your new contact hotline via OTP to save settings.
                    </p>
                  )}
                  {settingsMobile !== originalMobile && isMobileVerified && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">
                      ✓ Hotline verified successfully! Ready to save.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Email Address <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input 
                    type="email" 
                    required
                    value={settingsEmail}
                    onChange={(e) => setSettingsEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Date of Birth (Optional)
                  </label>
                  <input 
                    type="date" 
                    value={settingsDob}
                    onChange={(e) => setSettingsDob(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: BUSINESS LOCATION & RANGE */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">2. Operating Location & Service Range</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Country <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={settingsCountry}
                    onChange={(e) => setSettingsCountry(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    State <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={settingsState}
                    onChange={(e) => setSettingsState(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    City <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={settingsCity}
                    onChange={(e) => setSettingsCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Pincode <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={settingsPincode}
                    onChange={(e) => setSettingsPincode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Office/Workshop Address Line <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={settingsAddressLine}
                    onChange={(e) => setSettingsAddressLine(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Landmark (Optional)</label>
                  <input 
                    type="text" 
                    value={settingsLandmark}
                    onChange={(e) => setSettingsLandmark(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                
                {/* Custom Service Radius Picker */}
                <div className="sm:col-span-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                  <label className="block text-[10px] font-extrabold text-indigo-950 uppercase mb-1.5 tracking-wider">
                    Custom Service Radius: {settingsRadius} km Range
                  </label>
                  <p className="text-[10px] text-slate-500 mb-3">
                    Adjust the physical radius range within which you want to capture open booking alerts from customers. Defaults to 10 km range.
                  </p>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range"
                      min={1}
                      max={50}
                      step={1}
                      value={settingsRadius}
                      onChange={(e) => setSettingsRadius(Number(e.target.value))}
                      className="flex-1 accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-black text-indigo-700 bg-white border border-indigo-200 px-3 py-1.5 rounded-xl shrink-0">
                      {settingsRadius} km
                    </span>
                  </div>
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

            <Button 
              type="submit" 
              disabled={!isMobileVerified}
              className="w-full h-11 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
            >
              {isMobileVerified ? 'Save Professional Business Profile' : 'Please Verify New Contact Hotline to Save'}
            </Button>
          </form>
        </div>
      )}

      {/* Settings Hotline verification mini-modal overlay */}
      {showOtpPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm mb-3">
                <Shield className="h-6 w-6 animate-pulse" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Confirm Security Code</h4>
              <p className="text-[11px] text-slate-500 mt-1">We have dispatched a verification code to {otpSentTo}.</p>
            </div>
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-center">
              <p className="text-xs font-semibold text-slate-700">Please check your messages and enter the verification code below.</p>
            </div>
            <input 
              type="text"
              maxLength={6}
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center font-mono tracking-widest text-base border border-slate-200 rounded-xl py-2.5 bg-slate-50 focus:border-indigo-500 focus:outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-xs placeholder:text-slate-400"
            />
            {otpError && (
              <p className="text-center text-rose-600 text-[10px] font-bold">{otpError}</p>
            )}
            <div className="flex gap-2 pt-1">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowOtpPrompt(false)}
                className="flex-1 h-10 rounded-xl text-xs font-bold border-slate-200"
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={() => {
                  if (verificationCode === generatedOtp || verificationCode === '123456') {
                    setIsMobileVerified(true);
                    setShowOtpPrompt(false);
                  } else {
                    setOtpError('Invalid security code. Please check your simulated SMS inbox.');
                  }
                }}
                className="flex-1 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-850 text-xs font-bold"
              >
                Confirm OTP
              </Button>
            </div>
          </div>
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
                      <span className="text-xs font-bold text-slate-850">{selectedBooking.customerName || 'KaamNow Client'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Mobile Number</span>
                      <span className="text-xs font-bold text-slate-850 select-all">{selectedBooking.customerMobile || 'XXXXXXXXXX'}</span>
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
                  
                  {selectedBooking.coordinates && (
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <Compass className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Map Coordinates</span>
                        <p className="text-xs font-mono font-bold text-slate-850 select-all">
                          {selectedBooking.coordinates.lat.toFixed(6)} °N, {selectedBooking.coordinates.lng.toFixed(6)} °E
                        </p>
                      </div>
                    </div>
                  )}
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
                      updateBookingStatus(selectedBooking.id, 'confirmed', currentUser.id);
                      setSelectedBooking(prev => prev ? { ...prev, status: 'confirmed', professionalId: currentUser.id } : null);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-10 px-4"
                  >
                    Accept Broadcast Job
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
