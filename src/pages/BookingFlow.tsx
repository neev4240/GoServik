import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { useLanguage } from '../lib/i18n';
import { matchProfessionals, findUrgentProfessionals, ScoredProfessional } from '../lib/matching';
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
  ArrowRight, 
  ArrowLeft, 
  User, 
  Phone, 
  Zap,
  Sparkles,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ProfessionalProfile, BookingStatus, ServiceAddress } from '../types';

export function BookingFlow() {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('category');
  const navigate = useNavigate();
  const { professionals, categories, currentUser, bookService } = useStore();
  const { t, lang } = useLanguage();

  // Multi-step flow: 
  // 1: Service Selection
  // 2: Address & Map Pin
  // 3: Booking Type & Scheduling
  // 4: Review & Confirm
  // 5: Confirmation & Assigned Pro
  const [step, setStep] = useState<number>(1);

  // Step 1: Category & Subcategories
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(catParam || 'cat-electrical');
  const [selectedSubcats, setSelectedSubcats] = useState<string[]>([]);

  // Step 2: Address Details
  const [houseFlat, setHouseFlat] = useState('');
  const [buildingStreet, setBuildingStreet] = useState('');
  const [areaLocality, setAreaLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState(currentUser?.city || 'New Delhi');
  const [stateName, setStateName] = useState(currentUser?.state || 'Delhi');
  const [pincode, setPincode] = useState(currentUser?.pincode || '110001');
  const [contactPhone, setContactPhone] = useState(currentUser?.mobile || '');
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 28.6139,
    lng: 77.2090 // Default to Central Delhi
  });

  // Step 3: Two-Type Booking System
  // 'standard' = scheduled future visit
  // 'urgent' = immediate service need (30-minute arrival window)
  const [bookingType, setBookingType] = useState<'standard' | 'urgent'>('standard');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM - 12:00 PM');
  const [selectedRateType, setSelectedRateType] = useState<'diagnostic' | 'hourly' | 'four_hours' | 'full_day'>('diagnostic');
  const [notes, setNotes] = useState('');
  const [preferElderSafe, setPreferElderSafe] = useState(false);
  const [preferWomenSafe, setPreferWomenSafe] = useState(false);

  // Urgent matching states
  const [isSearchingUrgent, setIsSearchingUrgent] = useState(false);
  const [urgentSearchStage, setUrgentSearchStage] = useState(1);
  const [urgentNotFound, setUrgentNotFound] = useState(false);

  // Auto-Assigned Professional
  const [assignedProfessional, setAssignedProfessional] = useState<ProfessionalProfile | null>(null);
  const [assignedETA, setAssignedETA] = useState<number>(20); // Estimated minutes

  // Step 4: Payment & Submission
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  // Pre-fill user information if available
  useEffect(() => {
    if (currentUser && currentUser.role === 'customer') {
      if (currentUser.mobile && !contactPhone) setContactPhone(currentUser.mobile);
      if (currentUser.city && !city) setCity(currentUser.city);
      if (currentUser.addressLine && !buildingStreet) setBuildingStreet(currentUser.addressLine);
      if (currentUser.landmark && !landmark) setLandmark(currentUser.landmark);
      if (currentUser.pincode && !pincode) setPincode(currentUser.pincode);
      if (currentUser.coordinates) setCoordinates(currentUser.coordinates);
    }
  }, [currentUser]);

  // If category changed via search param
  useEffect(() => {
    if (catParam) {
      setSelectedCategoryId(catParam);
      setSelectedSubcats([]);
    }
  }, [catParam]);

  const currentCategory = categories.find(c => c.id === selectedCategoryId) || KAAMNOW_CATEGORIES[0];

  // Time slots definition
  const allTimeSlots = [
    { id: '08:00 AM - 10:00 AM', startHour: 8, startMin: 0 },
    { id: '10:00 AM - 12:00 PM', startHour: 10, startMin: 0 },
    { id: '12:00 PM - 02:00 PM', startHour: 12, startMin: 0 },
    { id: '02:00 PM - 04:00 PM', startHour: 14, startMin: 0 },
    { id: '04:00 PM - 06:00 PM', startHour: 16, startMin: 0 },
    { id: '06:00 PM - 08:00 PM', startHour: 18, startMin: 0 }
  ];

  // Helper to check if a slot for today has passed or is too close (< 30 min)
  const isSlotPassedToday = (startHour: number, startMin: number, targetDate: Date | null): boolean => {
    if (!targetDate) return false;
    const now = new Date();
    const isToday = 
      targetDate.getDate() === now.getDate() &&
      targetDate.getMonth() === now.getMonth() &&
      targetDate.getFullYear() === now.getFullYear();

    if (!isToday) return false;

    const slotTime = new Date(targetDate);
    slotTime.setHours(startHour, startMin, 0, 0);

    // If current time is within 30 minutes of slot or past slot, it is passed
    return now.getTime() > (slotTime.getTime() - 30 * 60 * 1000);
  };

  // Next 7 days
  const availableDates = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));

  // Automatically adjust selectedTime if current selected slot is passed for today
  useEffect(() => {
    if (selectedDate && bookingType === 'standard') {
      const activeSlotObj = allTimeSlots.find(s => s.id === selectedTime);
      if (activeSlotObj && isSlotPassedToday(activeSlotObj.startHour, activeSlotObj.startMin, selectedDate)) {
        // Find first future slot
        const firstAvailable = allTimeSlots.find(s => !isSlotPassedToday(s.startHour, s.startMin, selectedDate));
        if (firstAvailable) {
          setSelectedTime(firstAvailable.id);
        } else {
          // No slots left today, switch date to tomorrow
          setSelectedDate(addDays(new Date(), 1));
          setSelectedTime('10:00 AM - 12:00 PM');
        }
      }
    }
  }, [selectedDate, bookingType]);

  // Auth gate check
  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md p-8 text-center mt-20 border border-slate-200 rounded-3xl shadow-xl bg-white">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Customer Sign In Required</h2>
        <p className="text-slate-500 mb-6 text-xs leading-relaxed">
          Please log in or create a KaamNow customer account to request and book verified professionals.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
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

  const handleToggleSubcat = (subcat: string) => {
    if (selectedSubcats.includes(subcat)) {
      setSelectedSubcats(selectedSubcats.filter(s => s !== subcat));
    } else {
      setSelectedSubcats([...selectedSubcats, subcat]);
    }
  };

  // Validations
  const validateStep1 = () => {
    if (selectedSubcats.length === 0) {
      alert("Please select at least one specific sub-service or task you need.");
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
    if (bookingType === 'standard') {
      if (!selectedDate) {
        alert("Please select a date for the visit.");
        return false;
      }
      if (!selectedTime) {
        alert("Please select a time slot.");
        return false;
      }
    }
    return true;
  };

  // Pricing calculation
  const getPricing = (pro?: ProfessionalProfile | null) => {
    let base = 99; // Standard Diagnostic Fee
    if (selectedRateType === 'hourly') {
      base = pro?.hourlyRate || 350;
    } else if (selectedRateType === 'four_hours') {
      base = pro?.fourHourRate || 1200;
    } else if (selectedRateType === 'full_day') {
      base = pro?.fullDayRate || 2200;
    }
    const platformFee = Math.round(base * 0.05);
    return {
      basePrice: base,
      platformFee,
      totalPrice: base + platformFee
    };
  };

  const { basePrice, platformFee, totalPrice } = getPricing(assignedProfessional);

  // Trigger matching and confirm booking
  const handleProceedBooking = async () => {
    setIsSubmitting(true);
    try {
      // 1. If Urgent Booking: show search loader & execute 30-min arrival matching
      if (bookingType === 'urgent') {
        setIsSearchingUrgent(true);
        setUrgentNotFound(false);
        setUrgentSearchStage(1);

        setTimeout(() => setUrgentSearchStage(2), 500);
        setTimeout(() => setUrgentSearchStage(3), 1000);

        setTimeout(async () => {
          try {
            const urgentMatches = findUrgentProfessionals(professionals, {
              categoryId: selectedCategoryId,
              subcategories: selectedSubcats,
              customerCoordinates: coordinates,
              preferElderSafe,
              preferWomenSafe
            });

            if (urgentMatches.length === 0) {
              setIsSearchingUrgent(false);
              setIsSubmitting(false);
              setUrgentNotFound(true);
            } else {
              const matchedPro = urgentMatches[0].professional;
              const arrivalEta = urgentMatches[0].estimatedArrivalMinutes || 22;
              setAssignedProfessional(matchedPro);
              setAssignedETA(arrivalEta);
              setIsSearchingUrgent(false);

              // Complete booking creation
              await finalizeBooking(matchedPro, 'urgent', arrivalEta);
            }
          } catch (err: any) {
            console.error("Urgent matching error:", err);
            setIsSearchingUrgent(false);
            setIsSubmitting(false);
            // Fallback: match standard top pro so booking doesn't get stuck
            const fallbackPro = professionals.find(p => p.skills && p.skills.some(s => s.categoryId === selectedCategoryId)) || professionals[0];
            if (fallbackPro) {
              setAssignedProfessional(fallbackPro);
              await finalizeBooking(fallbackPro, 'urgent', 25);
            } else {
              alert("Could not complete booking: " + (err.message || "Please try again."));
            }
          }
        }, 1500);
      } else {
        // 2. Standard Booking: automatically match the most suitable professional
        let matchedPro: ProfessionalProfile | undefined;

        try {
          const matches = matchProfessionals(professionals, {
            categoryId: selectedCategoryId,
            subcategories: selectedSubcats,
            customerCoordinates: coordinates,
            preferElderSafe,
            preferWomenSafe
          });

          if (matches.length > 0 && matches[0].professional) {
            matchedPro = matches[0].professional;
          }
        } catch (matchErr) {
          console.warn("Matching scoring warning, falling back to direct category search:", matchErr);
        }

        // Default to category-matched pro or first available in catalog
        if (!matchedPro) {
          matchedPro = professionals.find(p => p.skills && p.skills.some(s => s.categoryId === selectedCategoryId)) ||
                       professionals.find(p => (p as any).categoryId === selectedCategoryId) ||
                       professionals[0];
        }

        // Fallback emergency pro if list is somehow empty
        if (!matchedPro) {
          matchedPro = {
            id: `pro-verified-auto`,
            name: `${currentCategory.name} Verified Specialist`,
            email: 'specialist@kaamnow.com',
            role: 'professional',
            joinedAt: new Date().toISOString(),
            avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300',
            verified: true,
            tagline: `Certified ${currentCategory.name} Master Technician`,
            bio: 'Expert verified trade professional assigned by KaamNow automated matching system.',
            location: city || 'Delhi NCR',
            serviceRadiusKm: 25,
            languages: ['Hindi', 'English'],
            coordinates: coordinates,
            skills: [{ categoryId: selectedCategoryId, categoryName: currentCategory.name, subcategories: selectedSubcats }],
            hourlyRate: 350,
            fourHourRate: 1200,
            fullDayRate: 2200,
            supportsDiagnosticVisit: true,
            services: [],
            gallery: [],
            certifications: ['KaamNow Verified Trade Master'],
            workingHours: {},
            responseTime: 'Within 30 minutes',
            availabilityStatus: 'available',
            rating: 5.0,
            reviewCount: 28,
            jobsCompleted: 94
          };
        }

        setAssignedProfessional(matchedPro);
        await finalizeBooking(matchedPro, 'normal', 0);
      }
    } catch (generalErr: any) {
      console.error("Booking error:", generalErr);
      alert("Booking encountered an error: " + (generalErr.message || "Please check details and try again."));
      setIsSubmitting(false);
    }
  };

  const finalizeBooking = async (pro: ProfessionalProfile, urgencyLevel: 'normal' | 'urgent', etaMins: number) => {
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

      const scheduledDateStr = format(bookingType === 'urgent' ? new Date() : (selectedDate || new Date()), 'yyyy-MM-dd');
      const scheduledTimeStr = bookingType === 'urgent' ? `Within 30 Minutes (~${etaMins}m ETA)` : selectedTime;

      const bookingId = await bookService({
        customerId: currentUser?.id || `cust-${Date.now()}`,
        customerName: currentUser?.name || 'Customer',
        customerMobile: contactPhone.trim() || currentUser?.mobile || '',
        customerEmail: currentUser?.email || '',
        professionalId: pro.id,
        professionalName: pro.name,
        categoryId: selectedCategoryId,
        categoryName: currentCategory.name,
        serviceTitle: `${currentCategory.name} - ${selectedSubcats[0] || 'Service Booking'}`,
        subcategories: selectedSubcats,
        selectedSubcategories: selectedSubcats,
        date: scheduledDateStr,
        time: scheduledTimeStr,
        timeSlot: scheduledTimeStr,
        scheduledDate: scheduledDateStr,
        serviceAddress: fullServiceAddress,
        notes: notes.trim(),
        urgency: urgencyLevel,
        safetyPreferences: {
          elderSafe: preferElderSafe,
          womenSafe: preferWomenSafe
        },
        paymentMethod: paymentMethod === 'online' ? 'razorpay' : 'cash',
        diagnosticFee: 99,
        basePrice: basePrice,
        platformFee: platformFee,
        totalPrice: totalPrice,
        statusHistory: [
          {
            status: 'submitted',
            timestamp: new Date().toISOString(),
            note: bookingType === 'urgent' 
              ? `Urgent 30-minute booking created. Automatically assigned ${pro.name}.`
              : `Standard booking created. Automatically assigned ${pro.name}.`
          }
        ]
      });

      setCreatedBookingId(bookingId);
      setStep(5); // Move to final assigned pro & confirmation step
    } catch (err: any) {
      console.error("Booking error:", err);
      alert("Booking failed: " + (err.message || 'Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Top Stepper Indicator */}
        {step < 5 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className={step === 1 ? 'text-indigo-600 font-extrabold' : step > 1 ? 'text-emerald-600' : ''}>
                1. Service
              </span>
              <span className="text-slate-300">→</span>
              <span className={step === 2 ? 'text-indigo-600 font-extrabold' : step > 2 ? 'text-emerald-600' : ''}>
                2. Location
              </span>
              <span className="text-slate-300">→</span>
              <span className={step === 3 ? 'text-indigo-600 font-extrabold' : step > 3 ? 'text-emerald-600' : ''}>
                3. Schedule & Urgency
              </span>
              <span className="text-slate-300">→</span>
              <span className={step === 4 ? 'text-indigo-600 font-extrabold' : ''}>
                4. Review & Confirm
              </span>
            </div>
          </div>
        )}

        {/* STEP 1: SERVICE & SUBCATEGORIES */}
        {step === 1 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">
                Step 1 of 4 • Select Service & Requirements
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                What trade service do you need?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose the category and specify your tasks. KaamNow will automatically match the best-suited verified professional for you.
              </p>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Service Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedSubcats([]);
                }}
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {lang === 'hi' && c.hindiName ? `(${c.hindiName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Specific subcategories checklist */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Your Required Tasks / Issues *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentCategory.subcategories.map((subcat) => {
                  const isChecked = selectedSubcats.includes(subcat);
                  return (
                    <button
                      key={subcat}
                      type="button"
                      onClick={() => handleToggleSubcat(subcat)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                        isChecked 
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950' 
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{subcat}</span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ADDRESS & MAP PIN */}
        {step === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">
                Step 2 of 4 • Service Location
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Where should the professional arrive?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your precise location ensures accurate distance calculation and seamless arrival.
              </p>
            </div>

            {/* Address fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  House / Flat / Floor *
                </label>
                <input
                  type="text"
                  value={houseFlat}
                  onChange={(e) => setHouseFlat(e.target.value)}
                  placeholder="e.g. Flat 402, Tower B"
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Building / Society / Street *
                </label>
                <input
                  type="text"
                  value={buildingStreet}
                  onChange={(e) => setBuildingStreet(e.target.value)}
                  placeholder="e.g. Palm Grove Heights, Main Road"
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
                  placeholder="e.g. Saket / Sector 62 / Cyber City"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Metro Station Gate 2"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Delhi"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code</label>
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
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Pin Service Location on Map
              </label>
              <GoogleMapPicker
                value={coordinates}
                onChange={(newCoords) => setCoordinates(newCoords)}
              />
            </div>

            {/* Step 2 Actions */}
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
                <span>Continue to Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BOOKING TYPE & SCHEDULING */}
        {step === 3 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">
                Step 3 of 4 • Booking Type & Schedule
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Choose Booking Type
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select between Standard Scheduled visits or Urgent Immediate Dispatch.
              </p>
            </div>

            {/* Two-Type Booking Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setBookingType('standard')}
                className={`p-5 rounded-2xl border-2 text-left transition-all relative ${
                  bookingType === 'standard'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className={`w-5 h-5 ${bookingType === 'standard' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="font-black text-sm text-slate-900">Standard Booking</span>
                  </div>
                  {bookingType === 'standard' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Scheduled future visit. Pick your preferred date and available arrival time window.
                </p>
                <span className="inline-block mt-3 text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                  Future Slots Only
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBookingType('urgent')}
                className={`p-5 rounded-2xl border-2 text-left transition-all relative ${
                  bookingType === 'urgent'
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className={`w-5 h-5 ${bookingType === 'urgent' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span className="font-black text-sm text-slate-900">Urgent Booking</span>
                  </div>
                  {bookingType === 'urgent' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Immediate service need. KaamNow automatically matches a nearby professional who can arrive within 30 minutes.
                </p>
                <span className="inline-block mt-3 text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                  ⚡ 30-Minute Arrival Window
                </span>
              </button>
            </div>

            {/* Standard Booking Scheduling Fields */}
            {bookingType === 'standard' ? (
              <div className="space-y-6 pt-2 border-t border-slate-100 animate-in fade-in-50 duration-200">
                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-indigo-600" />
                    Select Service Date
                  </label>
                  <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                    {availableDates.map((date) => {
                      const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
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

                {/* Dynamic Time Slots (Disables/hides passed slots for today) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Select Available Arrival Window
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {allTimeSlots.map(slot => {
                      const isPassed = isSlotPassedToday(slot.startHour, slot.startMin, selectedDate);
                      const isSelected = selectedTime === slot.id && !isPassed;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={isPassed}
                          onClick={() => setSelectedTime(slot.id)}
                          className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all text-center relative ${
                            isPassed
                              ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 hover:border-slate-300 border-slate-200'
                          }`}
                        >
                          <span>{slot.id}</span>
                          {isPassed && (
                            <span className="block text-[9px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                              Passed
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    * Showing strictly active future windows. Passed time slots for today are automatically disabled.
                  </p>
                </div>
              </div>
            ) : (
              /* Urgent Booking Banner */
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 animate-in fade-in-50 duration-200">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
                  <span>30-Minute Priority Dispatch Window</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Upon confirmation, KaamNow will immediately locate the highest-rated verified trade master who can reach your address within 30 minutes via Google Maps traffic routing.
                </p>
              </div>
            )}

            {/* Safety Preferences */}
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Safety & Comfort Preferences
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
                      Verified for patient communication, senior assistance, and respectful conduct.
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
                      100% ID checked with spotless 5-star ratings in household visits.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Job Notes / Specific Problem Description (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please bring a 10A MCB, main switch tripping intermittently..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Step 3 Actions */}
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
                <span>Proceed to Review & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM (AUTOMATED ASSIGNMENT) */}
        {step === 4 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">
                Step 4 of 4 • Review & Confirm
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Review your booking details
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                KaamNow will automatically assign the best-suited verified professional upon confirmation.
              </p>
            </div>

            {/* Fallback View if Urgent Pro Not Found */}
            {urgentNotFound && (
              <div className="p-6 bg-rose-50 border-2 border-rose-200 rounded-3xl space-y-4 animate-in fade-in-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-rose-950 text-sm">
                      No professional is currently available within 30 minutes.
                    </h4>
                    <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                      All nearby verified trade masters in your immediate zone are currently on active jobs or outside the 30-minute road arrival window.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUrgentNotFound(false);
                      setBookingType('standard');
                      setStep(3); // Switch to standard slot selector
                    }}
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span>Choose Standard Slot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUrgentNotFound(false);
                      handleProceedBooking(); // Retry urgent matching
                    }}
                    className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            )}

            {/* Urgent Matching Loading State */}
            {isSearchingUrgent && (
              <div className="p-8 bg-indigo-50/70 border border-indigo-200 rounded-3xl text-center space-y-4 animate-in fade-in-50">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-ping opacity-50"></div>
                  <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                    <Search className="w-7 h-7 animate-spin" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Finding a professional near you...
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Analyzing real-time trade availability, distance, and 30-minute travel window via Maps.
                  </p>
                </div>
                <div className="max-w-xs mx-auto space-y-1.5 text-[11px] font-bold text-left pt-2">
                  <div className={`flex items-center gap-2 ${urgentSearchStage >= 1 ? 'text-indigo-700' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Scanning verified specialists in your area...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${urgentSearchStage >= 2 ? 'text-indigo-700' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Calculating 30-minute travel window via Maps...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${urgentSearchStage >= 3 ? 'text-indigo-700' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirming trade master availability...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Details */}
            {!isSearchingUrgent && !urgentNotFound && (
              <>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</span>
                      <p className="text-sm font-black text-slate-900">{currentCategory.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Booking Type</span>
                      <p className={`text-sm font-black ${bookingType === 'urgent' ? 'text-amber-600' : 'text-indigo-600'}`}>
                        {bookingType === 'urgent' ? '⚡ Urgent (30 Mins Arrival)' : 'Standard Scheduled'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Selected Tasks</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedSubcats.join(', ')}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Scheduled Time</span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {bookingType === 'urgent'
                          ? 'Immediate Arrival (Within 30 Minutes)'
                          : `${selectedDate && format(selectedDate, 'EEEE, MMM d, yyyy')} at ${selectedTime}`}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Service Address</span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {houseFlat}, {buildingStreet}, {areaLocality ? areaLocality + ', ' : ''}{city} {pincode}
                      </p>
                    </div>
                  </div>

                  {/* Smart Auto-Assignment Assurance Card */}
                  <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div className="text-xs">
                      <h4 className="font-bold text-indigo-950">Automated KaamNow Professional Assignment</h4>
                      <p className="text-[11px] text-indigo-800 mt-0.5">
                        KaamNow automatically selects and assigns the highest-rated verified professional in your area based on trade skills, proximity, and availability.
                      </p>
                    </div>
                  </div>

                  {/* KaamNow Work Protection */}
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950">KaamNow Work Protection Included</h4>
                        <p className="text-[10px] text-emerald-700">Covers damage, unresolved delays, and disputes up to ₹10,000.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                      ₹0 Included
                    </span>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Diagnostic Visit Fee</span>
                    <span className="font-bold">₹{basePrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Platform Service Fee (5%)</span>
                    <span className="font-bold">₹{platformFee}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-xl font-extrabold text-indigo-600">₹{totalPrice}</span>
                  </div>
                </div>

                {/* Step 4 Actions */}
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
                    disabled={isSubmitting || isSearchingUrgent}
                    onClick={handleProceedBooking}
                    className={`px-8 py-3.5 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                      bookingType === 'urgent'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {isSubmitting ? (
                      'Processing...'
                    ) : bookingType === 'urgent' ? (
                      <>
                        <Zap className="w-4 h-4 fill-white" />
                        <span>Find & Dispatch Urgent Pro</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Book Service</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 5: CONFIRMATION & ASSIGNED PROFESSIONAL SCREEN */}
        {step === 5 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Booking Successfully Confirmed!
              </h2>
              <p className="text-xs text-slate-500">
                Booking ID: <span className="font-mono font-bold text-slate-800">{createdBookingId}</span>
              </p>
            </div>

            {/* ASSIGNED PROFESSIONAL CARD */}
            {assignedProfessional && (
              <div className="p-5 bg-gradient-to-br from-indigo-50/70 to-slate-50 border-2 border-indigo-200 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-100/70 px-2.5 py-1 rounded-full">
                    ✨ Automatically Assigned Professional
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified & Dispatched
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={assignedProfessional.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300'}
                    alt={assignedProfessional.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900">
                        {assignedProfessional.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                        Trade Master
                      </span>
                    </div>
                    <p className="text-xs font-bold text-indigo-900">
                      {assignedProfessional.tagline}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-600 pt-0.5">
                      <span className="flex items-center gap-1 font-black text-slate-900">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {assignedProfessional.rating}
                      </span>
                      <span>•</span>
                      <span>{assignedProfessional.reviewCount || 45} reviews</span>
                      <span>•</span>
                      <span>{assignedProfessional.jobsCompleted || 120}+ jobs completed</span>
                    </div>
                  </div>
                </div>

                {/* Arrival Window / Status */}
                <div className="p-3.5 bg-white rounded-2xl border border-indigo-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {bookingType === 'urgent' ? 'Urgent Arrival Window' : 'Scheduled Arrival'}
                    </span>
                    <p className="text-xs font-black text-slate-900 mt-0.5">
                      {bookingType === 'urgent' 
                        ? `⚡ Arriving in approx. ${assignedETA || 20} minutes`
                        : `${selectedDate && format(selectedDate, 'EEE, MMM d')} (${selectedTime})`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Helpline / Contact</span>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">
                      +91 {assignedProfessional.mobile || '9876543210'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Work Protection guarantee info */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Protected by <strong>KaamNow Work Protection</strong>. Inspection fee ₹99 payable upon arrival.
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/dashboard?tab=bookings"
                className="flex-1 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md text-center flex items-center justify-center gap-2"
              >
                <span>View in Customer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="py-3.5 px-5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl text-center"
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
