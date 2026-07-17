import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { 
  ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle2, 
  AlertCircle, MapPin, Star, Sparkles, Building, Ruler, HelpCircle 
} from 'lucide-react';
import { format, addDays } from 'date-fns';

interface SimulatedPro {
  id: string;
  name: string;
  avatar: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  location: string;
  distanceKm: number;
  visitCharge: number;
}

export function BookingFlow() {
  const { proId } = useParams<{ proId: string }>();
  const navigate = useNavigate();
  const { professionals, categories, currentUser, bookService } = useStore();

  const [step, setStep] = useState(1);

  // STEP 1 state: Service selection & size details
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('cat-1');
  const [selectedServiceName, setSelectedServiceName] = useState<string>('');
  const [approximateSize, setApproximateSize] = useState<string>('');
  const [tilingAreaSqFt, setTilingAreaSqFt] = useState<string>('');

  // STEP 2 state: Professional selection
  const [selectedProId, setSelectedProId] = useState<string>('');
  const [sortSetting, setSortSetting] = useState<'nearest' | 'rating'>('nearest');

  // STEP 3 state: Date & Time
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');

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

  // Pre-populate category services for dropdown
  const standardServicesByCategory: Record<string, string[]> = {
    'cat-1': ['Full Home Deep Cleaning', 'Bathroom Sanitization', 'Sofa & Carpet Cleaning', 'Tiling Services / Repair'],
    'cat-2': ['Emergency Leak Repair', 'Faucet & Sink Installation', 'Drain Blockage Removal', 'Geycer Diagnostics & Repair'],
    'cat-3': ['Ceiling Fan Installation', 'House Re-wiring Inspection', 'Switchboard Repair', 'Inverter Battery Setup'],
    'cat-4': ['AC Filter Cleaning & Servicing', 'AC Installation', 'AC Gas Charging', 'AC Compressor Repair'],
    'cat-5': ['Washing Machine Diagnostics', 'Refrigerator Gas Top-up', 'Microwave Oven Repair', 'Water Purifier Filter Change'],
  };

  const servicesList = standardServicesByCategory[selectedCategoryId] || [];

  // Determine current active service name
  const currentServiceName = selectedServiceName || servicesList[0] || '';

  // Calculate pricing based on service and inputs
  const calculatedPrice = useMemo(() => {
    const sNameLower = currentServiceName.toLowerCase();
    
    // AC Installation: flat 99
    if (sNameLower.includes('ac installation')) {
      return 99;
    }
    
    // Tiling: based on area: <= 500 sq ft is 99, otherwise 199
    if (sNameLower.includes('tiling')) {
      const area = Number(tilingAreaSqFt) || 0;
      if (area === 0) return 99; // Default preview
      return area <= 500 ? 99 : 199;
    }

    // For other services, we'll check the selected professional's visit fee (defaults to ₹99 if no pro chosen yet)
    if (selectedProId) {
      const pro = professionals.find(p => p.id === selectedProId);
      if (pro) {
        // Look for service price or default to professional's standard visit charge parameter or general mock visit charge
        const matchService = pro.services.find(s => s.categoryId === selectedCategoryId);
        return matchService ? matchService.basePrice : 99;
      }
    }
    
    return 99; // Base fallback visit charge
  }, [currentServiceName, tilingAreaSqFt, selectedProId, selectedCategoryId, professionals]);

  // Generate lists of professionals who provide services in this category, with simulated distances
  const availablePros: SimulatedPro[] = useMemo(() => {
    // Filter pros that have services or are registered in this category
    const list = professionals.filter(pro => 
      pro.role === 'professional' && 
      (pro.id === proId || proId === 'any' || !proId || pro.services.some(s => s.categoryId === selectedCategoryId))
    );

    return list.map((pro, index) => {
      // Deterministic distance calculation based on ID so sorting remains stable
      const distanceKm = Number((((pro.name.charCodeAt(0) || 1) * 3 + index * 1.5) % 8 + 1.2).toFixed(1));
      
      // Determine visit charge of the pro for this service category (or choose from approved 49, 99, 149, 199, 249)
      const chargeOptions = [49, 99, 149, 199, 249];
      const matchSrv = pro.services.find(s => s.categoryId === selectedCategoryId);
      let visitCharge = matchSrv ? matchSrv.basePrice : chargeOptions[index % chargeOptions.length];
      
      // Force constraints
      if (!chargeOptions.includes(visitCharge)) {
        visitCharge = chargeOptions[Math.floor(visitCharge / 50) % chargeOptions.length] || 99;
      }

      return {
        id: pro.id,
        name: pro.name,
        avatar: pro.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100',
        tagline: pro.tagline || 'Certified Home Specialist',
        rating: pro.rating || 4.8,
        reviewCount: pro.reviewCount || 12,
        location: pro.location || 'Mumbai, India',
        distanceKm,
        visitCharge
      };
    });
  }, [professionals, selectedCategoryId, proId]);

  // Sort professionals based on selection (Only Nearest and Rating are allowed)
  const sortedPros = useMemo(() => {
    const prosCopy = [...availablePros];
    if (sortSetting === 'nearest') {
      return prosCopy.sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      return prosCopy.sort((a, b) => b.rating - a.rating);
    }
  }, [availablePros, sortSetting]);

  // Allocate nearest professional automatically for the selected service
  const nearestPro = useMemo(() => {
    if (availablePros.length === 0) return null;
    return [...availablePros].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  }, [availablePros]);

  // Auto-select nearest professional when step 2 is entered or category changes
  const handleNextToStep2 = () => {
    if (!currentServiceName) return;
    if (!approximateSize.trim()) return;
    
    // Auto-allocate nearest pro
    if (nearestPro) {
      setSelectedProId(nearestPro.id);
    }
    setStep(2);
  };

  const handleNextToStep3 = () => {
    if (!selectedProId) return;
    setStep(3);
  };

  // Generate next 14 days for booking
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i + 1));
  const availableTimes = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'];

  const handleBook = () => {
    const finalPro = professionals.find(p => p.id === selectedProId);
    if (!finalPro || !selectedDate || !selectedTime) return;
    
    const formattedAddress = [
      currentUser.addressLine,
      currentUser.landmark,
      currentUser.city,
      currentUser.state,
      currentUser.pincode,
      currentUser.country
    ].filter(Boolean).join(', ');

    bookService({
      customerId: currentUser.id,
      professionalId: finalPro.id,
      serviceId: `srv-custom-${Date.now()}`,
      date: selectedDate.toISOString(),
      time: selectedTime,
      notes: `Size/Info: ${approximateSize}. ${notes}`.trim(),
      totalPrice: calculatedPrice,
      customerName: currentUser.name || 'Anonymous Customer',
      customerMobile: currentUser.mobile || 'Not Provided',
      customerAddress: formattedAddress || 'No detailed address registered',
      customerServiceOpted: currentServiceName || 'General Standard Service'
    });
    setStep(4); // Success step
  };

  const currentCategoryObj = categories.find(c => c.id === selectedCategoryId);
  const activeProObj = availablePros.find(p => p.id === selectedProId);

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
        {step < 4 && (
          <div className="mb-8 bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white/40 shadow-sm">
            <h1 className="text-xl font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" /> Book Home Visit Service
            </h1>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs">
              <span className={`px-2.5 py-1 rounded-xl font-bold ${step === 1 ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>1. Service & Size Info</span>
              <div className="h-px w-3 bg-slate-300" />
              <span className={`px-2.5 py-1 rounded-xl font-bold ${step === 2 ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>2. Allocate Partner</span>
              <div className="h-px w-3 bg-slate-300" />
              <span className={`px-2.5 py-1 rounded-xl font-bold ${step === 3 ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>3. Date, Time & Confirm</span>
            </div>
          </div>
        )}

        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 overflow-hidden">
          
          {/* STEP 1: SERVICE SELECTION & APPROXIMATE SIZE */}
          {step === 1 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 mb-1">Select Service Parameters</h2>
                <p className="text-xs text-slate-500">Provide work category, specific service, and the approximate size details for our records.</p>
              </div>

              <div className="space-y-4">
                {/* Category Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Service Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategoryId(cat.id);
                          const firstService = standardServicesByCategory[cat.id]?.[0] || '';
                          setSelectedServiceName(firstService);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          selectedCategoryId === cat.id 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <p className="text-xs font-bold truncate">{cat.name}</p>
                        <p className={`text-[9px] mt-0.5 truncate ${selectedCategoryId === cat.id ? 'text-slate-300' : 'text-slate-400'}`}>{cat.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific Service Dropdown */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Specific Service Work</label>
                  <select
                    value={currentServiceName}
                    onChange={(e) => setSelectedServiceName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    {servicesList.map(sName => (
                      <option key={sName} value={sName}>{sName}</option>
                    ))}
                  </select>
                </div>

                {/* Approximate Size Input (Mandatory, just for info to the company) */}
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700">
                    <Building className="h-4 w-4" />
                    <h4 className="text-xs font-bold uppercase">Approximate Size & Scope Details</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Please provide the approximate size or scale of the job (e.g. "300 sq feet", "2 rooms", "single appliance"). This information is shared strictly with the company and technician for prior equipment planning.
                  </p>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Scope description (Just for info to company)</label>
                    <input 
                      type="text"
                      required
                      placeholder='e.g. 450 sq feet tiling, or 1 window AC installation'
                      value={approximateSize}
                      onChange={(e) => setApproximateSize(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Special conditional input for Tiling area */}
                  {currentServiceName.toLowerCase().includes('tiling') && (
                    <div className="space-y-2 pt-2 border-t border-slate-200/50 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Ruler className="h-3.5 w-3.5 text-indigo-600" />
                        <label className="block text-[10px] font-bold uppercase">Specify exact area (In Sq Feet)</label>
                      </div>
                      <input 
                        type="number"
                        required
                        placeholder="e.g. 350"
                        value={tilingAreaSqFt}
                        onChange={(e) => setTilingAreaSqFt(e.target.value)}
                        className="w-40 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                      <p className="text-[10px] text-indigo-600 font-semibold">
                        Automatic Pricing Logic: &le; 500 sq feet = ₹99 Visit fee. &gt; 500 sq feet = ₹199 Visit fee.
                      </p>
                    </div>
                  )}

                  {/* Special notice for AC Installation */}
                  {currentServiceName.toLowerCase().includes('ac installation') && (
                    <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[10px] text-indigo-700 font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-spin" />
                      <span>Standard Rate Auto-Locked: ₹99 Visit charge for AC installation parameters.</span>
                    </div>
                  )}
                </div>

                {/* Displaying Current Calculated Visit Price */}
                <div className="p-4 bg-white border border-slate-200/60 rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Service Visit Charge</span>
                    <span className="text-[11px] text-slate-500">Based on visit standards & your parameters</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-indigo-600 block">₹{calculatedPrice}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block">Visit Fee Only</span>
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  onClick={handleNextToStep2} 
                  disabled={!approximateSize.trim() || (currentServiceName.toLowerCase().includes('tiling') && !tilingAreaSqFt)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs h-10 shadow-lg shadow-indigo-100"
                >
                  Continue to Select Professionals
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: PROFESSIONAL ALLOCATION & SORTING */}
          {step === 2 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 mb-1">Allocate Service Specialist</h2>
                  <p className="text-xs text-slate-500">We have loaded certified experts nearby. The nearest professional is automatically allocated.</p>
                </div>

                {/* ONLY 2 SORT SETTINGS ALLOWED: NEAREST AND RATING */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSortSetting('nearest')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                      sortSetting === 'nearest' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Nearest
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortSetting('rating')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                      sortSetting === 'rating' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Rating
                  </button>
                </div>
              </div>

              {/* Auto-Allocated Highlight Block */}
              {nearestPro && (
                <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-4 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={nearestPro.avatar} alt={nearestPro.name} className="w-12 h-12 rounded-full object-cover border border-indigo-200" referrerPolicy="no-referrer" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-indigo-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Auto-Allocated</span>
                        <span className="text-xs font-bold text-slate-900">{nearestPro.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{nearestPro.tagline}</p>
                      <p className="text-[9px] text-indigo-600 font-bold flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> Nearest to you ({nearestPro.distanceKm} km away)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProId(nearestPro.id)}
                    className={`text-[10px] font-extrabold px-4 py-2 rounded-xl border transition-all ${
                      selectedProId === nearestPro.id 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {selectedProId === nearestPro.id ? 'Selected' : 'Select Nearest'}
                  </button>
                </div>
              )}

              {/* List of experts */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Available Experts ({sortedPros.length})</h3>
                {sortedPros.map(pro => {
                  const isSelected = selectedProId === pro.id;
                  const isNearest = nearestPro?.id === pro.id;
                  return (
                    <label
                      key={pro.id}
                      className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected ? 'border-slate-900 bg-slate-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white/40'
                      }`}
                    >
                      <input 
                        type="radio"
                        name="allocatedPro"
                        checked={isSelected}
                        onChange={() => setSelectedProId(pro.id)}
                        className="mt-1.5 mr-4 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-xs text-slate-900">{pro.name}</h4>
                            {isNearest && <span className="bg-slate-200 text-slate-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full">Nearest</span>}
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">{pro.tagline}</p>
                          
                          <div className="flex items-center gap-3 text-[9px] text-slate-400 font-semibold mt-1.5">
                            <span className="flex items-center gap-0.5 text-amber-600">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {pro.rating.toFixed(1)} ({pro.reviewCount} reviews)
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="h-3 w-3" /> {pro.distanceKm} km away
                            </span>
                            <span>•</span>
                            <span>Visit: ₹{pro.visitCharge}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide block">Base Visit Charge</span>
                          <span className="text-sm font-extrabold text-slate-900 block">₹{pro.visitCharge}</span>
                        </div>
                      </div>
                    </label>
                  );
                })}

                {sortedPros.length === 0 && (
                  <div className="text-center py-10 border rounded-2xl bg-slate-50/50">
                    <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-bold">No verified experts registered for this specific category yet.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl text-xs h-10 font-bold">Back</Button>
                <Button 
                  onClick={handleNextToStep3} 
                  disabled={!selectedProId}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs h-10 shadow-lg shadow-indigo-100"
                >
                  Continue to Date & Time
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: DATE, TIME & CONFIRM */}
          {step === 3 && activeProObj && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 mb-1">Select Date & Time</h2>
                <p className="text-xs text-slate-500">Pick a comfortable date and slot for your independent visit. Standard tools provided.</p>
              </div>

              {/* Date Slider */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Available Visit Dates</label>
                <div className="flex overflow-x-auto pb-4 gap-2.5 snap-x">
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
                        <span className="text-lg font-extrabold my-0.5">{format(date, 'd')}</span>
                        <span className="text-[9px] font-bold opacity-80">{format(date, 'EEE')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-200">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Select Preferred Arrival Slot</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
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
                </div>
              )}

              {/* Additional notes */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instructions or Landmark (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none min-h-[70px]"
                  placeholder="Describe standard parameters, instructions, or gate passcode..."
                />
              </div>

              {/* Summary card */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-150 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">Booking Visit Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Category</span>
                    <span className="font-bold text-slate-800">{currentCategoryObj?.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Specific Work</span>
                    <span className="font-bold text-slate-800">{currentServiceName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approximate Size / Scope</span>
                    <span className="font-bold text-slate-800 text-indigo-600">{approximateSize}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Allocated Specialist</span>
                    <span className="font-bold text-slate-800">{activeProObj.name} ({activeProObj.distanceKm} km away)</span>
                  </div>
                  {selectedDate && selectedTime && (
                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Schedule Slot</span>
                      <span className="font-bold text-slate-800">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block">Total Calculated Visit Fee</span>
                    <span className="text-[9px] text-slate-400 block">Payable directly to expert upon visit arrival</span>
                  </div>
                  <span className="text-2xl font-extrabold text-slate-900">₹{calculatedPrice}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl text-xs h-10 font-bold">Back</Button>
                <Button 
                  onClick={handleBook} 
                  disabled={!selectedDate || !selectedTime}
                  className="bg-slate-900 hover:bg-slate-850 text-white font-bold px-8 py-2.5 rounded-xl text-xs h-10 shadow-lg"
                >
                  Confirm Visit Booking
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS STEP */}
          {step === 4 && (
            <div className="p-12 text-center space-y-6">
              <div className="mx-auto h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Visit Request Sent!</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Your standardized visit booking request has been successfully created and synced to Firebase. The technician has been notified to confirm the arrival window.
                </p>
              </div>

              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 max-w-sm mx-auto text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">What happens next?</p>
                <p className="text-[11px] leading-relaxed">
                  1. You can track this booking on your customer dashboard.<br />
                  2. Use the "Helpline & Chat" tab to communicate with the professional.<br />
                  3. Compare other professionals by creating more visit requests!
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
    </div>
  );
}
