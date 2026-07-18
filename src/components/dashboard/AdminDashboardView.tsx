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

interface AdminDashboardViewProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export function AdminDashboardView({ currentTab, setTab }: AdminDashboardViewProps) {
  const { 
    currentUser, bookings, professionals,
    updateUserProfile 
  } = useStore();

  // State for simulated chat messages
  const [activeChatContact, setActiveChatContact] = useState('helpdesk');
  const [chatInput, setChatInput] = useState('');
  const [chatThreads, setChatThreads] = useState<Record<string, Array<{ sender: 'me' | 'them'; text: string; time: string }>>>({
    helpdesk: [
      { sender: 'them', text: 'Namaste Admin, client Neev is requesting an expedited geyser service verification.', time: '1 hr ago' },
      { sender: 'me', text: 'I am reviewing technician profiles to assign a specialist.', time: '50 mins ago' }
    ]
  });

  // State for Admin Settings
  const [settingsName, setSettingsName] = useState(currentUser?.name || '');
  const [settingsMobile, setSettingsMobile] = useState(currentUser?.mobile || '');
  const [settingsEmail, setSettingsEmail] = useState(currentUser?.email || '');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  
  // Custom toast notification state for professional verification updates (avoids window.alert)
  const [adminToast, setAdminToast] = useState('');

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      setSettingsName(currentUser.name || '');
      setSettingsEmail(currentUser.email || '');
      setSettingsMobile(currentUser.mobile || '');
    }
  }, [currentUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThreads, activeChatContact]);

  if (!currentUser) return null;

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
  };

  // Update Settings handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFields = {
      name: settingsName,
      email: settingsEmail,
      mobile: settingsMobile
    };

    updateUserProfile(updatedFields);
    setSettingsSuccess('Admin preferences and administrative log parameters saved successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  // Helper to handle verification click with a clean inline toast message
  const handleVerifyToggle = (proId: string, proName: string, currentlyVerified: boolean) => {
    updateUserProfile({ id: proId, verified: !currentlyVerified } as any);
    setAdminToast(`Verification status successfully updated for ${proName}!`);
    setTimeout(() => setAdminToast(''), 4000);
  };

  const totalServicesCount = professionals.reduce((acc, p) => acc + p.services.length, 0);

  return (
    <div className="space-y-6">
      
      {/* Toast Alert Banner */}
      {adminToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-slate-700 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold animate-fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* TAB: OVERVIEW */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-sm">
              <div className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">Total Platform Bookings</div>
              <div className="text-3xl font-extrabold">{bookings.length}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Registered Experts</div>
              <div className="text-3xl font-extrabold text-slate-900">{professionals.length}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Services Active</div>
              <div className="text-3xl font-extrabold text-slate-900">{totalServicesCount}</div>
            </div>
          </div>

          {/* Action Board */}
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-md">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Activity className="h-4 w-4 text-indigo-600" /> Recent Booking Orders
            </h3>
            {bookings.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active bookings on the GoServik platform yet.
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map(booking => (
                  <button 
                    key={booking.id} 
                    onClick={() => setSelectedBooking(booking)}
                    className="w-full text-left p-4 bg-white/70 hover:bg-indigo-50/30 active:bg-indigo-100/30 rounded-2xl border border-slate-100 flex justify-between items-center text-xs transition-all hover:scale-[1.01] hover:shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-slate-800">
                        {booking.customerServiceOpted || 'Home Visit Booking'}
                      </p>
                      <p className="text-slate-500">Scheduled: {booking.date} • {booking.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-indigo-600 font-bold hover:underline hidden sm:inline">Inspect Details</span>
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

      {/* TAB: VERIFY PROFESSIONALS */}
      {currentTab === 'users' && (
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
                    className="text-[10px] h-8 font-bold rounded-xl"
                    onClick={() => handleVerifyToggle(pro.id, pro.name, pro.verified)}
                  >
                    {pro.verified ? 'Revoke Verification' : 'Verify Expert'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: LIVE SUPPORT CHAT */}
      {currentTab === 'messages' && (
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[500px]">
          
          <div className="border-r border-slate-200/60 p-4 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">Chats</h3>
            <button 
              onClick={() => setActiveChatContact('helpdesk')}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all bg-white shadow-sm border border-slate-200/50`}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">🛎️</div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">Support Desk</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[120px]">Live coordinator desk</p>
              </div>
            </button>
          </div>

          <div className="md:col-span-2 flex flex-col justify-between h-full bg-white/30">
            <div className="p-4 border-b border-slate-200/60 bg-white/80 font-bold text-xs text-slate-850 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Talking to Live Desk
            </div>

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

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200/60 bg-white/80 flex gap-2">
              <input 
                type="text" 
                required
                placeholder="Type administrative broadcast..."
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

      {/* TAB: ADMIN PREFERENCES */}
      {currentTab === 'settings' && (
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-indigo-600" /> Admin Preferences & Log Parameters
            </h3>
            <p className="text-xs text-slate-500">Modify administrative settings for platform audits and credential managers.</p>
          </div>

          {settingsSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-xl font-bold text-center">
              {settingsSuccess}
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Admin User Name</label>
              <input 
                type="text" 
                required
                value={settingsName}
                onChange={(e) => setSettingsName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Administrative Contact Email</label>
              <input 
                type="email" 
                required
                value={settingsEmail}
                onChange={(e) => setSettingsEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Support Mobile Number</label>
              <input 
                type="tel" 
                required
                value={settingsMobile}
                onChange={(e) => setSettingsMobile(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl">
              Save Admin Settings
            </Button>
          </form>
        </div>
      )}

      {/* Sleek Order Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Booking ID: # {selectedBooking.id}</span>
                <h3 className="font-extrabold text-slate-900 text-base">Platform Service Audit</h3>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="h-8 w-8 rounded-full hover:bg-slate-200/60 active:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Customer Name</span>
                  <p className="font-bold text-slate-900 mt-1">{selectedBooking.customerName}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Amount Paid</span>
                  <p className="font-bold text-slate-900 mt-1">₹{selectedBooking.totalPrice} INR</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Service Selected</span>
                <p className="font-extrabold text-slate-800">{selectedBooking.customerServiceOpted}</p>
                <p className="text-slate-500 mt-1">Schedule: {selectedBooking.date} at {selectedBooking.time}</p>
              </div>

              <div className="p-4 bg-indigo-50/20 rounded-2xl border border-indigo-100/50 text-xs">
                <span className="text-[10px] font-bold text-indigo-600 uppercase block mb-1">Notes from customer</span>
                <p className="text-slate-700 italic">"{selectedBooking.notes || 'No notes left.'}"</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedBooking(null)}
                className="text-xs font-bold rounded-xl h-10 border-slate-200"
              >
                Close Audit
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
