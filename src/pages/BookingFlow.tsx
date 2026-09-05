import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { useLanguage } from '../lib/i18n';
import { matchProfessionals } from '../lib/matching';
import { KAAMNOW_CATEGORIES } from '../lib/categories';
import { GoogleMapPicker } from '../components/GoogleMapPicker';
import { 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  Shield, 
  Star, 
  HeartHandshake, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Phone, 
  Home as HomeIcon, 
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ProfessionalProfile, BookingStatus, ServiceAddress } from '../types';

export function BookingFlow() {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('category');
  const proParam = searchParams.get('proId');
  const navigate = useNavigate();
  const { professionals, categories, currentUser, bookService, bookings, updateBookingStatus } = useStore();
  const { t, lang } = useLanguage();

  // Current multi-step flow: 1: Service Selection, 2: Address, 3: Schedule & Preferences, 4: Compare Pros, 5: Review & Confirm, 6: Success
  const [step, setStep] = useState<number>(1);

  // Step 1: Category & Subcategories
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(catParam || 'cat-electrical');
  const [selectedSubcats, setSelectedSubcats] = useState<string[]>([]);

  // Step 2: Address Details
  const [houseFlat, setHouseFlat] = useState('');
  const [buildingStreet, setBuildingStreet] = useState('');
  const [areaLocality, setAreaLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState(currentUser?.city || '');
  const [stateName, setStateName] = useState(currentUser?.state || 'Delhi');
  const [pincode, setPincode] = useState(currentUser?.pincode || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.mobile || '');
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>(
    currentUser?.coordinates || { lat: 28.6139, lng: 77.2090 } // Default to New Delhi coordinates
  );

  // Step 3: Date, Time, Urgency & Safety
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM - 12:00 PM');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'emergency'>('normal');
  const [notes, setNotes] = useState('');
  const [preferElderSafe, setPreferElderSafe] = useState(false);
  const [preferWomenSafe, setPreferWomenSafe] = useState(false);

  // Step 4: Selected Professional & Package
  const [selectedProId, setSelectedProId] = useState<string | null>(proParam || null);
  const [selectedRateType, setSelectedRateType] = useState<'diagnostic' | 'hourly' | 'four_hours' | 'full_day'>('diagnostic');

  // Step 5: Payment
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  // Pre-fill if customer has existing details
  useEffect(() => {
    if (currentUser && currentUser.role === 'customer') {
      if (currentUser.mobile && !contactPhone) setContactPhone(currentUser.mobile);
      if (currentUser.city && !city) setCity(currentUser.city);
      if (currentUser.addressLine && !buildingStreet) setBuildingStreet(currentUser.addressLine);
      if (currentUser.landmark && !landmark) setLandmark(currentUser.landmark);
      if (currentUser.pincode && !pincode) setPincode(currentUser.pincode);
      if (currentUser.coordinates && !coordinates) setCoordinates(currentUser.coordinates);
    }
  }, [currentUser]);

  // If proParam is passed, pre-select that professional
  useEffect(() => {
    if (proParam) {
      const p = professionals.find(pro => pro.id === proParam);
      if (p) {
        setSelectedProId(p.id);
        if (p.skills && p.skills.length > 0) {
          setSelectedCategoryId(p.skills[0].categoryId);
          if (p.skills[0].subcategories.length > 0) {
            setSelectedSubcats([p.skills[0].subcategories[0]]);
          }
        }
      }
    }
  }, [proParam, professionals]);

  // Auth gate
  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md p-8 text-center mt-20 border border-slate-200 rounded-3xl shadow-xl bg-white">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{t('signInRequired')}</h2>
        <p className="text-slate-500 mb-6 text-xs leading-relaxed">
          Please sign in to your KaamNow customer account to connect and compare verified local professionals.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Go Back
          </button>
          <Link 
            to="/login" 
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
          >
            {t('signIn')}
          </Link>
        </div>
      </div>
    );
  }

  // Prevent Professionals from booking services
  if (currentUser.role === 'professional') {
    return (
      <div className="mx-auto max-w-md p-8 text-center mt-20 border border-slate-200 rounded-3xl shadow-xl bg-white">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Professional Account</h2>
        <p className="text-slate-500 mb-6 text-xs leading-relaxed">
          You are logged in as a KaamNow Professional partner. Professional accounts manage service requests on their Dashboard and cannot book jobs.
        </p>
        <Link 
          to="/dashboard" 
          className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
        >
          Open Professional Dashboard
        </Link>
      </div>
    );
  }

  const currentCategory = KAAMNOW_CATEGORIES.find(c => c.id === selectedCategoryId) || KAAMNOW_CATEGORIES[0];
  const subcategoriesList = currentCategory.subcategories;

  // Matching engine scored professionals
  const matchedPros = matchProfessionals(professionals, {
    categoryId: selectedCategoryId,
    subcategories: selectedSubcats,
    customerLat: coordinates?.lat,
    customerLng: coordinates?.lng,
    preferElderSafe,
    preferWomenSafe
  });

  const selectedProfessional = professionals.find(p => p.id === selectedProId) || (matchedPros[0]?.professional ?? professionals[0]);

  // Calculate price based on selected rate package
  const getCalculatedPrice = () => {
    if (!selectedProfessional) return 99;
    if (selectedRateType === 'diagnostic') return 99;
    if (selectedRateType === 'hourly') return selectedProfessional.hourlyRate || 350;
    if (selectedRateType === 'four_hours') return selectedProfessional.fourHourRate || 1200;
    if (selectedRateType === 'full_day') return selectedProfessional.fullDayRate || 2200;
    return 99;
  };

  const basePrice = getCalculatedPrice();
  const platformFee = Math.round(basePrice * 0.05); // 5% platform fee
  const totalPrice = basePrice + platformFee;

  // Available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM'
  ];

  const handleToggleSubcat = (subcat: string) => {
    if (selectedSubcats.includes(subcat)) {
      setSelectedSubcats(selectedSubcats.filter(s => s !== subcat));
    } else {
      setSelectedSubcats([...selectedSubcats, subcat]);
    }
  };

  // Step validation
  const validateStep1 = () => {
    if (selectedSubcats.length === 0) {
      alert("Please check at least one specific sub-service or task you need.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!houseFlat.trim() || !buildingStreet.trim()) {
      alert("Please provide your House/Flat number and Street address.");
      return false;
    }
    if (!contactPhone.trim() || contactPhone.replace(/\D/g, '').length !== 10) {
      alert("Please provide a valid 10-digit contact mobile number.");
      return false;
    }
    if (!city.trim()) {
      alert("Please enter your city.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!selectedDate) {
      alert("Please select a date for the visit.");
      return false;
    }
    if (!selectedTime) {
      alert("Please select a time slot.");
      return false;
    }
    return true;
  };

  const handleConfirmBooking = async () => {
    try {
      setIsSubmitting(true);

      const fullServiceAddress: ServiceAddress = {
        houseFlat: houseFlat.trim(),
        buildingStreet: buildingStreet.trim(),
        areaLocality: areaLocality.trim() || undefined,
        landmark: landmark.trim() || undefined,
        city: city.trim(),
        state: stateName.trim() || 'Delhi',
        pincode: pincode.trim(),
        contactPhone: contactPhone.trim(),
        addressLabel: addressLabel,
        coordinates: coordinates
      };

      const bookingId = await bookService({
        customerId: currentUser.id,
        customerName: currentUser.name,
        customerMobile: contactPhone.trim(),
        customerEmail: currentUser.email,
        professionalId: selectedProfessional?.id,
        professionalName: selectedProfessional?.name,
        categoryId: selectedCategoryId,
        categoryName: currentCategory.name,
        subcategories: selectedSubcats,
        selectedSubcategories: selectedSubcats,
        date: format(selectedDate!, 'yyyy-MM-dd'),
        time: selectedTime,
        scheduledDate: format(selectedDate!, 'yyyy-MM-dd'),
        timeSlot: selectedTime,
        serviceAddress: fullServiceAddress,
        deliveryAddress: `${houseFlat}, ${buildingStreet}, ${areaLocality ? areaLocality + ', ' : ''}${city} ${pincode}`,
        deliveryCoordinates: coordinates,
        urgency: urgency,
        notes: notes,
        preferElderSafe: preferElderSafe,
        preferWomenSafe: preferWomenSafe,
        basePrice: basePrice,
        platformFee: platformFee,
        totalPrice: totalPrice,
        paymentMethod: paymentMethod,
        rateType: selectedRateType,
        workProtectionApplied: true
      });

      setCreatedBookingId(bookingId);
      setStep(6); // Step 6: Confirmation & Live Tracker
    } catch (err: any) {
      alert("Booking creation failed: " + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Progress Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            {[
              { num: 1, label: 'Service & Tasks' },
              { num: 2, label: 'Address & Map' },
              { num: 3, label: 'Schedule & Safety' },
              { num: 4, label: 'Compare & Select' },
              { num: 5, label: 'Confirm' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                    step === s.num
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : step > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`hidden sm:inline ${step === s.num ? 'text-indigo-600 font-extrabold' : ''}`}>
                  {s.label}
                </span>
                {s.num < 5 && <div className="hidden md:block w-8 h-0.5 bg-slate-200 ml-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: CATEGORY & CHECKLIST SUBCATEGORIES */}
        {step === 1 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">
                Step 1 of 5 • Service Requirement
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                What kind of help do you need today?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your main category and check off the exact tasks needed.
              </p>
            </div>

            {/* Category Picker Dropdown / Chips */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Main Trade Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedSubcats([]);
                }}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {KAAMNOW_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.hindiName || ''})
                  </option>
                ))}
              </select>
            </div>

            {/* Checklist of Sub-Services */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Specific Tasks (Check all that apply) *
                </label>
                <span className="text-xs text-indigo-600 font-bold">
                  {selectedSubcats.length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subcategoriesList.map((subcat) => {
                  const isChecked = selectedSubcats.includes(subcat);
                  return (
                    <button
                      key={subcat}
                      type="button"
                      onClick={() => handleToggleSubcat(subcat)}
                      className={`p-3.5 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span>{subcat}</span>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Continue to Service Address</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SERVICE ADDRESS & GOOGLE MAPS PIN */}
        {step === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">
                Step 2 of 5 • Service Address
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Where should the professional arrive?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Detailed address and Google Maps pin ensure precise travel calculation.
              </p>
            </div>

            {/* Address Label Chips */}
            <div className="flex gap-3">
              {(['Home', 'Office', 'Other'] as const).map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setAddressLabel(lbl)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    addressLabel === lbl
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  House / Flat / Unit Number *
                </label>
                <input
                  type="text"
                  value={houseFlat}
                  onChange={(e) => setHouseFlat(e.target.value)}
                  placeholder="e.g. Flat 402, Block B"
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Building / Street / Road Name *
                </label>
                <input
                  type="text"
                  value={buildingStreet}
                  onChange={(e) => setBuildingStreet(e.target.value)}
                  placeholder="e.g. Green Meadows, Sector 15"
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Area / Locality
                </label>
                <input
                  type="text"
                  value={areaLocality}
                  onChange={(e) => setAreaLocality(e.target.value)}
                  placeholder="e.g. Rohini / Indira Nagar"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Metro Pillar 120"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. New Delhi"
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Delhi"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="110001"
                    maxLength={6}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Mobile Number *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    required
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Google Maps Pin */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  Pin Location On Map (For Accurate Distance Calculation)
                </label>
                {coordinates && (
                  <span className="text-[11px] font-mono text-slate-500">
                    {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
                  </span>
                )}
              </div>
              <GoogleMapPicker
                value={coordinates}
                onChange={setCoordinates}
                addressInput={`${houseFlat} ${buildingStreet} ${city} ${stateName}`}
              />
            </div>

            {/* Action */}
            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Continue to Schedule & Safety</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE, URGENCY & SAFETY PREFERENCES */}
        {step === 3 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">
                Step 3 of 5 • Timing & Safety
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Schedule your visit & set comfort preferences
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Customize arrival timing, urgency level, and elder/women safe comfort criteria.
              </p>
            </div>

            {/* Date Slider */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-indigo-600" />
                Select Preferred Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {availableDates.map(date => {
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border min-w-[76px] transition-all shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-slate-50 text-slate-700 hover:border-slate-300 border-slate-200'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase opacity-80">{format(date, 'MMM')}</span>
                      <span className="text-lg font-black my-0.5">{format(date, 'd')}</span>
                      <span className="text-[10px] font-bold opacity-80">{format(date, 'EEE')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                Select Preferred Arrival Window
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      selectedTime === slot
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 hover:border-slate-300 border-slate-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'normal', label: 'Standard Visit', sub: 'Regular scheduled time' },
                  { id: 'urgent', label: 'Urgent (Within 4 hrs)', sub: 'Priority dispatch' },
                  { id: 'emergency', label: 'Emergency (Immediate)', sub: 'Active leak / outage' }
                ].map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUrgency(u.id as any)}
                    className={`p-3 rounded-xl border-2 text-left text-xs transition-all ${
                      urgency === u.id
                        ? 'border-indigo-600 bg-indigo-50/60 font-bold text-indigo-900'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="block font-bold">{u.label}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{u.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Safety & Comfort Preferences */}
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Safety & Comfort Matching Filters
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-indigo-100 cursor-pointer hover:border-indigo-300 transition-all">
                  <input
                    type="checkbox"
                    checked={preferElderSafe}
                    onChange={(e) => setPreferElderSafe(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Elder-Safe Verified Professional
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Professionals verified for respectful communication, patience, and senior home protocols.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-indigo-100 cursor-pointer hover:border-indigo-300 transition-all">
                  <input
                    type="checkbox"
                    checked={preferWomenSafe}
                    onChange={(e) => setPreferWomenSafe(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Women-Safe Verified Professional
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Professionals with verified ID background checks and 5-star conduct records in family residences.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Additional Instructions / Problem Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Describe any specifics e.g. switchboard sparking in kitchen, bring 15A socket..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Action */}
            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep3()) setStep(4);
                }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Compare Matched Professionals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: COMPARE & SELECT SUITABLE MATCHED PROFESSIONALS */}
        {step === 4 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">
                Step 4 of 5 • Compare & Select
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Matched Professionals Nearby
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Scored by skill overlap, GPS distance, verified ratings, safety credentials, and transparent rates.
              </p>
            </div>

            {/* Matched Pros List */}
            <div className="space-y-4">
              {matchedPros.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs border border-dashed rounded-2xl">
                  No direct local match found with selected filters. Showing all verified professionals.
                </div>
              ) : (
                matchedPros.map(({ professional: pro, score, distanceKm, skillOverlapCount }) => {
                  const isSelected = (selectedProId === pro.id) || (!selectedProId && pro.id === matchedPros[0].professional.id);

                  return (
                    <div
                      key={pro.id}
                      onClick={() => setSelectedProId(pro.id)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-md ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        
                        {/* Pro identity */}
                        <div className="flex items-start gap-4">
                          <img
                            src={pro.avatar}
                            alt={pro.name}
                            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black text-slate-900">{pro.name}</h3>
                              {pro.verified && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black">
                                {score}% Match
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{pro.tagline}</p>

                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                              <span className="flex items-center gap-1 font-bold text-amber-500">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                {pro.rating} ({pro.reviewCount})
                              </span>
                              <span>•</span>
                              <span className="text-slate-500">
                                {pro.jobsCompleted}+ jobs completed
                              </span>
                              <span>•</span>
                              <span className="text-indigo-600 font-semibold flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {distanceKm ? `${distanceKm} km away` : pro.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing & Selection */}
                        <div className="w-full sm:w-auto text-right flex flex-col items-end gap-2 shrink-0">
                          <div>
                            <span className="text-xs text-slate-400 block font-medium">Standard Rate</span>
                            <span className="text-lg font-black text-slate-900">₹{pro.hourlyRate}/hr</span>
                          </div>

                          <div className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}>
                            {isSelected ? 'Selected ✓' : 'Select Professional'}
                          </div>
                        </div>

                      </div>

                      {/* Package selector inside selected pro */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-indigo-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRateType('diagnostic');
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                              selectedRateType === 'diagnostic'
                                ? 'border-indigo-600 bg-white shadow-xs font-bold text-indigo-900'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold text-indigo-600 block">Inspection</span>
                            <span className="text-sm font-black text-slate-900 block">₹99</span>
                            <span className="text-[10px] text-slate-500">Visit & diagnosis</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRateType('hourly');
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                              selectedRateType === 'hourly'
                                ? 'border-indigo-600 bg-white shadow-xs font-bold text-indigo-900'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold text-indigo-600 block">1 Hour</span>
                            <span className="text-sm font-black text-slate-900 block">₹{pro.hourlyRate}</span>
                            <span className="text-[10px] text-slate-500">Standard task</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRateType('four_hours');
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                              selectedRateType === 'four_hours'
                                ? 'border-indigo-600 bg-white shadow-xs font-bold text-indigo-900'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold text-indigo-600 block">Half Day (4h)</span>
                            <span className="text-sm font-black text-slate-900 block">₹{pro.fourHourRate || 1200}</span>
                            <span className="text-[10px] text-slate-500">Multiple repairs</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRateType('full_day');
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                              selectedRateType === 'full_day'
                                ? 'border-indigo-600 bg-white shadow-xs font-bold text-indigo-900'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold text-indigo-600 block">Full Day (8h)</span>
                            <span className="text-sm font-black text-slate-900 block">₹{pro.fullDayRate || 2200}</span>
                            <span className="text-[10px] text-slate-500">Comprehensive job</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Action */}
            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Proceed to Review & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & CONFIRM BOOKING */}
        {step === 5 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">
                Step 5 of 5 • Review & Confirm
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Confirm your booking details
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                KaamNow Work Protection is automatically applied to this booking.
              </p>
            </div>

            {/* Summary details card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Professional</span>
                  <p className="text-sm font-black text-slate-900">{selectedProfessional?.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</span>
                  <p className="text-sm font-bold text-indigo-600">{currentCategory.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Selected Tasks</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedSubcats.join(', ')}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Schedule Window</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Arrival Address</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {houseFlat}, {buildingStreet}, {areaLocality ? areaLocality + ', ' : ''}{city} {pincode}
                  </p>
                </div>
              </div>

              {/* KaamNow Work Protection Badge */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">KaamNow Work Protection Applied</h4>
                    <p className="text-[10px] text-emerald-700">Covers damage, unresolved delays, and verified dispute resolution up to ₹10,000.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">Included</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Payment Option
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900 block">Cash / UPI on Visit</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Pay directly to the professional upon diagnostic arrival or completion.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    paymentMethod === 'online'
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900 block">Pay Online via UPI/Card</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Secure checkout with instant digital invoice.
                  </span>
                </button>
              </div>
            </div>

            {/* Transparent Pricing Breakdown */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Service Rate ({selectedRateType === 'diagnostic' ? 'Diagnostic Visit' : selectedRateType})</span>
                <span className="font-bold">₹{basePrice}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Fee (5%)</span>
                <span className="font-bold">₹{platformFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-xl font-extrabold text-indigo-600">₹{totalPrice}</span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm & Book Now'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: CONFIRMATION & LIVE TRACKER */}
        {step === 6 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Booking Confirmed!
              </h2>
              <p className="text-xs text-slate-500">
                Booking ID: <span className="font-mono font-bold text-slate-800">{createdBookingId}</span>
              </p>
            </div>

            {/* Real-time Status Tracker */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  KaamNow Live Status Machine
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                  Pro Selected
                </span>
              </div>

              {/* Status Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {[
                  { status: 'submitted', label: '1. Submitted', active: true },
                  { status: 'pro_selected', label: '2. Pro Selected', active: true },
                  { status: 'confirmed', label: '3. En Route / Arrived', active: false },
                  { status: 'completed', label: '4. Completed', active: false }
                ].map((st, i) => (
                  <div 
                    key={i} 
                    className={`p-2 rounded-xl text-center text-xs font-bold ${
                      st.active 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white border border-slate-200 text-slate-400'
                    }`}
                  >
                    {st.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/dashboard"
                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md text-center flex items-center justify-center gap-2"
              >
                <span>View in Customer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="py-3 px-5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl text-center"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
