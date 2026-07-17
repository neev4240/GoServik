import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { Calendar, User as UserIcon, Settings, Heart, MessageSquare, Briefcase, FileText, Bell, MapPin } from 'lucide-react';

export function Dashboard() {
  const { currentUser, bookings, professionals, savedProfessionals } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'overview';

  if (!currentUser) {
    navigate('/login');
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
      { id: 'messages', label: 'Messages', icon: MessageSquare },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    professional: [
      { id: 'overview', label: 'Overview', icon: Briefcase },
      { id: 'bookings', label: 'Booking Requests', icon: Calendar },
      { id: 'services', label: 'My Services', icon: FileText },
      { id: 'messages', label: 'Messages', icon: MessageSquare },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    admin: [
      { id: 'overview', label: 'Platform Overview', icon: Briefcase },
      { id: 'users', label: 'Manage Users', icon: UserIcon },
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  };

  const roleNav = navItems[currentUser.role] || navItems.customer;

  // Filter bookings based on role
  const userBookings = bookings.filter(b => 
    currentUser.role === 'customer' ? b.customerId === currentUser.id : b.professionalId === currentUser.id
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl border shadow-sm p-4 sticky top-24">
            <div className="flex items-center gap-3 mb-6 p-2">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-6 w-6 text-slate-500" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-tight">{currentUser.name}</h3>
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === item.id 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl border shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 capitalize">
              {currentTab.replace('-', ' ')}
            </h1>
            <Button variant="outline" size="sm" className="gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </Button>
          </div>

          {currentTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentUser.role === 'customer' && (
                <>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Active Bookings</div>
                    <div className="text-3xl font-bold text-slate-900">{userBookings.filter(b => b.status === 'confirmed').length}</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Saved Professionals</div>
                    <div className="text-3xl font-bold text-slate-900">{savedProfessionals.length}</div>
                  </div>
                </>
              )}
              {currentUser.role === 'professional' && (
                <>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Pending Requests</div>
                    <div className="text-3xl font-bold text-slate-900">{userBookings.filter(b => b.status === 'pending').length}</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Completed Jobs</div>
                    <div className="text-3xl font-bold text-slate-900">{('jobsCompleted' in currentUser) ? currentUser.jobsCompleted : 0}</div>
                  </div>
                </>
              )}
            </div>
          )}

          {currentTab === 'bookings' && (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              {userBookings.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No bookings found.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {userBookings.map(booking => {
                    const relatedPro = professionals.find(p => p.id === booking.professionalId);
                    return (
                      <div key={booking.id} className="p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-semibold text-slate-900">
                              {new Date(booking.date).toLocaleDateString()} at {booking.time}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-slate-900 font-medium">
                            {currentUser.role === 'customer' ? `Service with ${relatedPro?.name}` : `Booking request from Customer`}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">Total: £{booking.totalPrice}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          {booking.status === 'pending' && currentUser.role === 'professional' && (
                            <Button size="sm">Accept Request</Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {currentTab === 'favorites' && currentUser.role === 'customer' && (
             <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
               {savedProfessionals.length === 0 ? (
                 <div className="p-12 text-center text-slate-500">
                   <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                   <p>You haven't saved any professionals yet.</p>
                 </div>
               ) : (
                 <div className="divide-y">
                   {savedProfessionals.map(proId => {
                     const pro = professionals.find(p => p.id === proId);
                     if (!pro) return null;
                     return (
                       <div key={pro.id} className="p-6 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <img src={pro.avatar} alt={pro.name} className="h-12 w-12 rounded-full object-cover" />
                           <div>
                             <h3 className="font-bold text-slate-900">{pro.name}</h3>
                             <p className="text-sm text-slate-500">{pro.tagline}</p>
                           </div>
                         </div>
                         <Button asChild variant="outline" size="sm">
                           <a href={`/pro/${pro.id}`}>View Profile</a>
                         </Button>
                       </div>
                     )
                   })}
                 </div>
               )}
             </div>
          )}

          {(currentTab === 'settings' || currentTab === 'messages' || currentTab === 'services' || currentTab === 'users' || currentTab === 'reports') && (
            <div className="bg-white rounded-2xl border shadow-sm p-12 text-center text-slate-500">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>This module is under development and will be available shortly.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
