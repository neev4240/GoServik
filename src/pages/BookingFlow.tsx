import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { 
  ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle2, 
  AlertCircle, MapPin, Sparkles, HelpCircle, Map as MapIcon, Compass
} from 'lucide-react';
import { format, addDays } from 'date-fns';

// Interactive Leaflet Map Picker Component
export function MapPicker({ value, onChange }: { value?: { lat: number, lng: number }, onChange: (coords: { lat: number, lng: number }) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    // 1. Check if Leaflet CSS is loaded
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // 2. Load Leaflet script dynamically
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    } else {
      setLeafletLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !containerRef.current || !(window as any).L) return;

    const L = (window as any).L;
    // Standard starting coordinates (Mumbai center as map focus, but value remains undefined until user clicks)
    const initialLat = value?.lat || 19.0760;
    const initialLng = value?.lng || 72.8777;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView([initialLat, initialLng], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      mapRef.current.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        onChange({ lat, lng });

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
        }
      });
    }

    if (value && mapRef.current) {
      const pos = [value.lat, value.lng] as [number, number];
      if (markerRef.current) {
        markerRef.current.setLatLng(pos);
      } else {
        markerRef.current = L.marker(pos).addTo(mapRef.current);
      }
      mapRef.current.setView(pos, mapRef.current.getZoom());
    }
  }, [leafletLoaded, value, onChange]);

  // Clean up map ref on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <div 
        ref={containerRef} 
        style={{ height: '280px', width: '100%' }} 
        className="rounded-2xl border border-slate-200 overflow-hidden shadow-inner bg-slate-100 relative z-0"
      />
      {!value ? (
        <p className="text-rose-600 text-[11px] font-extrabold flex items-center gap-1">
          ⚠️ Please click on the map to pinpoint your location coordinates (Mandatory).
        </p>
      ) : (
        <p className="text-emerald-600 text-[11px] font-bold flex items-center gap-1">
          ✅ Pinplaced Coordinates: {value.lat.toFixed(5)} Latitude, {value.lng.toFixed(5)} Longitude
        </p>
      )}
    </div>
  );
}

export function BookingFlow() {
  const { proId } = useParams<{ proId: string }>();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('category') || useParams<{ categoryId: string }>().categoryId;
  const navigate = useNavigate();
  const { professionals, categories, currentUser, bookService } = useStore();

  const [step, setStep] = useState(1);

  // STEP 1 state: Category & checklist subcategories selection
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(catParam || 'cat-1');
  const [selectedSubcats, setSelectedSubcats] = useState<string[]>([]);

  // STEP 2 state: Customer Details, Map Picker, Date & Time, Payment
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Mandatory input fields
  const [custName, setCustName] = useState('');
  const [custMobile, setCustMobile] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custAddressLine, setCustAddressLine] = useState('');
  const [custCoordinates, setCustCoordinates] = useState<{ lat: number, lng: number } | undefined>(undefined);

  // Optional fields
  const [custLandmark, setCustLandmark] = useState('');
  const [custCity, setCustCity] = useState('');
  const [custState, setCustState] = useState('');
  const [custPincode, setCustPincode] = useState('');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'razorpay'>('cash');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatedOrderData, setSimulatedOrderData] = useState<any>(null);

  // Prefill fields from authenticated customer profile
  useEffect(() => {
    if (currentUser && currentUser.role === 'customer') {
      setCustName(currentUser.name || '');
      setCustMobile(currentUser.mobile || '');
      setCustEmail(currentUser.email || '');
      setCustAddressLine(currentUser.addressLine || '');
      setCustLandmark(currentUser.landmark || '');
      setCustCity(currentUser.city || '');
      setCustState(currentUser.state || '');
      setCustPincode(currentUser.pincode || '');
      if (currentUser.coordinates) {
        setCustCoordinates(currentUser.coordinates);
      }
    }
  }, [currentUser]);

  // Handle category change -> reset chosen subcategories
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    setSelectedSubcats([]);
  };

  // Enforce authentication
  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md p-8 text-center mt-20 border rounded-3xl shadow-lg bg-white/80 backdrop-blur-md">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-slate-900">Sign in Required</h2>
        <p className="text-slate-500 mb-6 text-sm">You need to sign in to your customer account to book a professional.</p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl">Go Back</Button>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"><Link to="/login">Sign In</Link></Button>
        </div>
      </div>
    );
  }

  // Restrict professional partners from creating booking jobs
  if (currentUser.role === 'professional') {
    return (
      <div className="mx-auto max-w-md p-8 text-center mt-20 border rounded-3xl shadow-lg bg-white/80 backdrop-blur-md">
        <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-6 w-6 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-900">Access Restricted</h2>
        <p className="text-slate-500 mb-6 text-sm leading-relaxed">
          Professional partner accounts are designed exclusively for managing dashboard requests, chat messages, and job completions. 
          They are <span className="font-extrabold text-slate-800">not permitted</span> to place booking orders.
        </p>
        <div className="flex flex-col gap-2.5">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl w-full">
            <Link to="/dashboard">Go to Partner Dashboard</Link>
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl w-full">
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  const currentCategoryObj = categories.find(c => c.id === selectedCategoryId);
  const subcatsList = currentCategoryObj?.subcategories || [];

  // Flat transparent standard visit charge
  const calculatedPrice = 99;

  const handleNextToStep2 = () => {
    if (selectedSubcats.length === 0) {
      alert("Please select at least one service subcategory work checklist.");
      return;
    }
    setStep(2);
  };

  // Generate next 14 days for booking
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i + 1));
  const availableTimes = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'];

  // Mandatory fields checklist validator
  const isFormValid = () => {
    return (
      custName.trim().length > 0 &&
      custMobile.trim().length > 0 &&
      custEmail.trim().length > 0 &&
      custAddressLine.trim().length > 0 &&
      custCoordinates !== undefined &&
      selectedDate !== null &&
      selectedTime.length > 0
    );
  };

  const performBookingCreation = (paymentId?: string, orderId?: string) => {
    if (!selectedDate || !selectedTime || !custCoordinates) return;

    // Construct full customer address
    const fullAddr = [
      custAddressLine.trim(),
      custLandmark.trim(),
      custCity.trim(),
      custState.trim(),
      custPincode.trim(),
      'India'
    ].filter(Boolean).join(', ');

    bookService({
      customerId: currentUser?.id || 'guest',
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      notes: notes.trim() || 'Standard consultation visit requested.',
      totalPrice: calculatedPrice,
      customerName: custName.trim(),
      customerMobile: custMobile.trim(),
      customerAddress: fullAddr,
      customerServiceOpted: `${currentCategoryObj?.name} (${selectedSubcats.join(', ')})`,
      categoryId: selectedCategoryId,
      selectedSubcategories: selectedSubcats,
      coordinates: custCoordinates,
      paymentMethod: paymentMethod,
      razorpayPaymentId: paymentId,
      razorpayOrderId: orderId,
      paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending'
    });
    setStep(3); // Success step
  };

  const handleSimulatedPaymentSuccess = async (simulatedOrderId: string) => {
    setPaymentLoading(true);
    setShowSimulator(false);
    try {
      const simulatedPaymentId = `pay_sim_${Date.now()}`;
      const simulatedSignature = `sig_sim_${Date.now()}`;
      
      const verifyResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: simulatedOrderId,
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: simulatedSignature
        })
      });

      if (!verifyResponse.ok) {
        throw new Error('Simulation verification failed');
      }

      const verifyData = await verifyResponse.json();
      if (verifyData.verified) {
        performBookingCreation(simulatedPaymentId, simulatedOrderId);
      } else {
        throw new Error('Simulated verification returned failed status.');
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Simulated payment processing failed.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleBook = async () => {
    if (!isFormValid()) {
      alert("Please ensure all mandatory fields (Name, Mobile, Email, Address & Map Coordinates, Date & Time) are provided!");
      return;
    }
    
    setPaymentError(null);

    if (paymentMethod === 'cash') {
      performBookingCreation();
    } else {
      setPaymentLoading(true);
      try {
        const amountInPaise = Math.round(calculatedPrice * 100);
        const orderResponse = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`
          })
        });

        if (!orderResponse.ok) {
          const errData = await orderResponse.json();
          throw new Error(errData.error || 'Failed to create payment order');
        }

        const orderData = await orderResponse.json();

        if (orderData.simulated) {
          setSimulatedOrderData(orderData);
          setShowSimulator(true);
          setPaymentLoading(false);
          return;
        }

        const keyId = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_TEYA8yK9iWlsjJ';
        const options = {
          key: keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'GoServik',
          description: `Standard visit fee for ${currentCategoryObj?.name}`,
          order_id: orderData.id,
          handler: async function (response: any) {
            setPaymentLoading(true);
            try {
              const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              if (!verifyResponse.ok) {
                const verifyErr = await verifyResponse.json();
                throw new Error(verifyErr.error || 'Signature verification failed');
              }

              const verifyData = await verifyResponse.json();
              if (verifyData.verified) {
                performBookingCreation(response.razorpay_payment_id, response.razorpay_order_id);
              } else {
                throw new Error('Payment verification was unsuccessful.');
              }
            } catch (err: any) {
              console.error('Payment verification error:', err);
              setPaymentError(err.message || 'Payment verification failed');
            } finally {
              setPaymentLoading(false);
            }
          },
          prefill: {
            name: custName,
            email: custEmail,
            contact: custMobile
          },
          theme: {
            color: '#4f46e5'
          },
          modal: {
            ondismiss: function() {
              setPaymentLoading(false);
              setPaymentError('Payment window was closed before completion.');
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.error('Razorpay payment failed:', response.error);
          setPaymentError(`Payment failed: ${response.error.description}`);
          setPaymentLoading(false);
        });
        rzp.open();
      } catch (err: any) {
        console.error('Order creation error:', err);
        setPaymentError(err.message || 'Could not initiate Razorpay payment');
        setPaymentLoading(false);
      }
    }
  };

  return (
    <div className="bg-transparent min-h-screen py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} 
          className="flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {step > 1 ? 'Back to previous step' : 'Cancel booking'}
        </button>

        {/* Header Steps */}
        {step < 3 && (
          <div className="mb-8 bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white/40 shadow-sm">
            <h1 className="text-xl font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" /> Book Standard Home Visit
            </h1>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs">
              <span className={`px-2.5 py-1 rounded-xl font-bold ${step === 1 ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>1. Select Service Category & Works</span>
              <div className="h-px w-3 bg-slate-300" />
              <span className={`px-2.5 py-1 rounded-xl font-bold ${step === 2 ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>2. Details, Map & Schedule</span>
            </div>
          </div>
        )}

        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 overflow-hidden">
          
          {/* STEP 1: CATEGORY & WORK CHECKLIST SELECTION */}
          {step === 1 && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 mb-1">What service category do you require?</h2>
                <p className="text-xs text-slate-500">
                  Select a category and select as many works as you need from the checklist below.
                </p>
              </div>

              <div className="space-y-6">
                {/* Category Grid */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-wider">Service Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                          selectedCategoryId === cat.id 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]' 
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <p className="text-xs font-extrabold truncate w-full">{cat.name}</p>
                        <p className={`text-[9px] leading-snug line-clamp-2 mt-1.5 ${selectedCategoryId === cat.id ? 'text-slate-300' : 'text-slate-400'}`}>
                          {cat.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategory Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Select Required Works (Check multiple if needed)
                    </label>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg">
                      Checklist Selection
                    </span>
                  </div>
                  
                  {subcatsList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No subcategories registered.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {subcatsList.map(subcat => {
                        const isChecked = selectedSubcats.includes(subcat);
                        return (
                          <button
                            key={subcat}
                            type="button"
                            onClick={() => {
                              if (isChecked) {
                                setSelectedSubcats(selectedSubcats.filter(s => s !== subcat));
                              } else {
                                setSelectedSubcats([...selectedSubcats, subcat]);
                              }
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                              isChecked 
                                ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-300' 
                                : 'bg-white/80 hover:bg-white border-slate-200'
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                            />
                            <span className="text-xs font-bold text-slate-700">{subcat}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Flat Visit Fee Notice */}
                <div className="p-4 bg-gradient-to-r from-indigo-50/40 to-blue-50/40 border border-indigo-100 rounded-2xl flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Standard Visit & Diagnostics Fee</span>
                    <span className="text-[11px] text-indigo-600/90 font-medium leading-relaxed block max-w-sm">
                      Our system assigns this visit broadcast to all nearby qualified technicians within service range. Flat visit fee covers inspection & consult.
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black text-indigo-600 block">₹{calculatedPrice}</span>
                    <span className="text-[9px] text-indigo-500 font-bold block">Visit Fee Only</span>
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button 
                  onClick={handleNextToStep2} 
                  disabled={selectedSubcats.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-8 py-2.5 rounded-xl text-xs h-11 shadow-lg shadow-indigo-100"
                >
                  Continue to Booking details & Map
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS, MAP & CONFIRMATION */}
          {step === 2 && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              
              {/* Mandatory Fields Section */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">1. Contact & Booking Information</h3>
                  <p className="text-[10px] text-slate-400">Please provide mandatory contact and address coordinates below.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase">Contact Name <span className="text-rose-500">*</span></label>
                    <input 
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="Enter Full Name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase">Mobile Number <span className="text-rose-500">*</span></label>
                    <input 
                      type="tel"
                      required
                      value={custMobile}
                      onChange={(e) => setCustMobile(e.target.value)}
                      placeholder="Enter 10-digit Mobile"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase">Email Address <span className="text-rose-500">*</span></label>
                    <input 
                      type="email"
                      required
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="Enter Email Address"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase">House / Flat / Street Address <span className="text-rose-500">*</span></label>
                    <input 
                      type="text"
                      required
                      value={custAddressLine}
                      onChange={(e) => setCustAddressLine(e.target.value)}
                      placeholder="Flat No, Wing, Building Name, Street"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Landmark (Optional)</label>
                    <input 
                      type="text"
                      value={custLandmark}
                      onChange={(e) => setCustLandmark(e.target.value)}
                      placeholder="e.g. Near Station"
                      className="w-full rounded-xl border border-slate-150 bg-white px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">City (Optional)</label>
                    <input 
                      type="text"
                      value={custCity}
                      onChange={(e) => setCustCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full rounded-xl border border-slate-150 bg-white px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">State (Optional)</label>
                    <input 
                      type="text"
                      value={custState}
                      onChange={(e) => setCustState(e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full rounded-xl border border-slate-150 bg-white px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Pincode (Optional)</label>
                    <input 
                      type="text"
                      value={custPincode}
                      onChange={(e) => setCustPincode(e.target.value)}
                      placeholder="400001"
                      className="w-full rounded-xl border border-slate-150 bg-white px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Map Location Picker */}
              <div className="space-y-2">
                <div className="border-b pb-2">
                  <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                    <MapIcon className="h-4 w-4 text-indigo-600" /> 2. Pin Address Coordinates on Map <span className="text-rose-500">*</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Click on the map to pin your exact location. No preselected or default values set.</p>
                </div>
                <MapPicker value={custCoordinates} onChange={setCustCoordinates} />
              </div>

              {/* Date & Time Select */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4 text-indigo-600" /> 3. Schedule Visit Slot <span className="text-rose-500">*</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Select date and standard arrival time slot.</p>
                </div>

                {/* Date Slider */}
                <div className="flex overflow-x-auto pb-2 gap-2 snap-x scrollbar-thin">
                  {availableDates.map(date => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border min-w-[70px] shrink-0 snap-start transition-all ${
                          isSelected 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                            : 'bg-white text-slate-700 hover:border-slate-300 border-slate-200'
                        }`}
                      >
                        <span className="text-[9px] uppercase font-bold opacity-80">{format(date, 'MMM')}</span>
                        <span className="text-base font-extrabold my-0.5">{format(date, 'd')}</span>
                        <span className="text-[9px] font-bold opacity-80">{format(date, 'EEE')}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 animate-in slide-in-from-bottom-2 duration-200">
                    {availableTimes.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                          selectedTime === time 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                            : 'bg-white text-slate-600 hover:border-slate-300 border-slate-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Instructions / Notes */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instructions or Work Details (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none min-h-[70px]"
                  placeholder="Specify any special notes or entry instructions..."
                />
              </div>

              {/* Payment Gateway */}
              <div className="space-y-3 pt-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Payment Option</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-slate-900 bg-slate-50/50'
                        : 'border-slate-100 hover:border-slate-200 bg-white/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-slate-900">Cash / Pay on Visit</span>
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'cash' ? 'border-slate-900 bg-slate-900' : 'border-slate-300'
                      }`}>
                        {paymentMethod === 'cash' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                      Pay visit fee directly to partner in cash/UPI upon diagnostic arrival.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-slate-900 bg-slate-50/50'
                        : 'border-slate-100 hover:border-slate-200 bg-white/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-slate-900">Pay via Razorpay</span>
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'razorpay' ? 'border-slate-900 bg-slate-900' : 'border-slate-300'
                      }`}>
                        {paymentMethod === 'razorpay' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                      Secure checkout with UPI, Cards or Netbanking.
                    </p>
                  </button>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-150 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">Booking Visit Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Category</span>
                    <span className="font-bold text-slate-800">{currentCategoryObj?.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chosen specialization</span>
                    <span className="font-bold text-indigo-600">{selectedSubcats.join(', ')}</span>
                  </div>
                  {selectedDate && selectedTime && (
                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Schedule Slot</span>
                      <span className="font-bold text-slate-800">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                      </span>
                    </div>
                  )}
                  {custCoordinates && (
                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivery Coordinates</span>
                      <span className="font-mono text-slate-700 font-bold">
                        {custCoordinates.lat.toFixed(5)} °N, {custCoordinates.lng.toFixed(5)} °E
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block">Total Calculated Visit Fee</span>
                    <span className="text-[9px] text-slate-400 block">Standard diagnostic visit charge.</span>
                  </div>
                  <span className="text-2xl font-extrabold text-slate-900">₹{calculatedPrice}</span>
                </div>
              </div>

              {/* Payment Error */}
              {paymentError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-extrabold text-red-950">Payment Error</p>
                    <p className="text-red-700 mt-0.5">{paymentError}</p>
                  </div>
                </div>
              )}

              {/* Step 2 Actions */}
              <div className="flex justify-between items-center pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)} 
                  disabled={paymentLoading}
                  className="rounded-xl text-xs h-10 font-bold"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleBook} 
                  disabled={!isFormValid() || paymentLoading}
                  className="bg-slate-900 hover:bg-slate-850 text-white font-bold px-8 py-2.5 rounded-xl text-xs h-10 shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {paymentLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    paymentMethod === 'razorpay' ? 'Pay & Confirm Visit' : 'Confirm Visit Booking'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS STEP */}
          {step === 3 && (
            <div className="p-12 text-center space-y-6 animate-in fade-in duration-200">
              <div className="mx-auto h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Standard Visit Placed!</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Your standard visit request has been created and broadcasted to all technicians within their service radius in your area. First technician to accept gets assigned!
                </p>
              </div>

              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 max-w-sm mx-auto text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">First-Come-First-Serve Booking Broadcast</p>
                <p className="text-[11px] leading-relaxed text-left">
                  1. Your pinned coordinates and required works are broadcasted to qualified technicians within 10 km (or custom service radius).<br />
                  2. The first technician who clicks "Accept" on their dashboard secures the job.<br />
                  3. You can communicate via Helpline chat as soon as an expert accepts.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl text-xs h-11 px-6">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="border-slate-200/80 hover:bg-slate-50 font-bold rounded-xl text-xs h-11 px-6">
                  <Link to="/explore">Explore More Services</Link>
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Razorpay Sandbox Payment Simulator Overlay */}
      {showSimulator && simulatedOrderData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-indigo-600 px-6 py-5 text-white flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-200">Razorpay Secure</h3>
                <h4 className="text-lg font-black mt-0.5">Sandbox Payment Simulator</h4>
              </div>
              <div className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[9px] font-bold uppercase tracking-wider">
                Demo Mode
              </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-800 leading-relaxed">
                <span className="font-extrabold">Simulated Gateway:</span> Razorpay Key variables are not configured in your <code>.env</code> file. Exposing high-fidelity test flow for preview.
              </div>
            </div>

            {/* Merchant Details */}
            <div className="p-6 space-y-4 flex-1">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Booking Service</p>
                  <p className="text-sm font-extrabold text-slate-850 mt-0.5">{selectedSubcats.join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Amount Due</p>
                  <p className="text-lg font-black text-slate-900 mt-0.5">₹{calculatedPrice}.00</p>
                </div>
              </div>

              {/* Order Meta */}
              <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Reference</span>
                  <span className="font-mono font-bold text-slate-800">{simulatedOrderData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Email</span>
                  <span className="text-slate-800 font-bold">{custEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Contact</span>
                  <span className="text-slate-800 font-bold">{custMobile}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Select Simulated Outcome</p>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Toggle whether the payment succeeds or fails to test downstream order placement and database updates.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 space-y-2 bg-slate-50/50 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSimulatedPaymentSuccess(simulatedOrderData.id)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-100"
              >
                <CheckCircle2 className="h-4 w-4" />
                Simulate Successful Payment
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentError("Simulated checkout was cancelled by the user.");
                    setShowSimulator(false);
                  }}
                  className="py-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-[11px] font-bold border border-slate-200 transition-all text-center"
                >
                  Cancel / Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentError("Simulated transaction failed (Declined by bank).");
                    setShowSimulator(false);
                  }}
                  className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-[11px] font-bold border border-rose-100 transition-all text-center"
                >
                  Simulate Bank Failure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
