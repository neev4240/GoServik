import { useState, useEffect } from 'react';
import { Language } from '../types';

export const translations = {
  en: {
    // Brand
    brandName: 'KaamNow',
    tagline: 'Connect. Book. Sorted.',
    brandPromise: 'Fast, trusted marketplace connecting you with nearby independent skilled professionals.',
    disclaimer: 'KaamNow is a connector marketplace. Professionals are independent workers, not KaamNow employees.',

    // Nav & Common
    exploreServices: 'Explore Services',
    dashboard: 'Dashboard',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    joinAsPro: 'Join as Professional',
    switchRole: 'Switch Role',
    language: 'Language',
    customer: 'Customer',
    professional: 'Professional',
    admin: 'Admin',
    searchPlaceholder: 'Search service, trade, or nearby professional...',
    needAPro: 'Need a Professional? KaamNow.',
    heroSub: 'Find trusted local professionals, compare your options, and book the right person for your work.',
    findAProBtn: 'Find a Professional',
    joinAsProBtn: 'Join as a Professional',
    browseCategories: '16 Service Categories',
    popularTrades: 'Popular Trades',
    verifiedBadge: 'Verified Partner',
    reviewsCount: 'reviews',
    completedJobs: 'jobs completed',
    yearsExp: 'yrs experience',
    hourlyRate: '/hr',
    fourHrRate: '4-Hour Package',
    fullDayRate: '8-Hour Full Day',
    diagnosticFeeNotice: 'Standard Visit/Diagnostic Fee: ₹99',
    workProtection: 'KaamNow Work Protection',
    workProtectionDesc: 'Book through KaamNow to activate job protection coverage against damages or delays.',
    
    // Booking Flow
    selectCategory: 'Select Service Category',
    selectSubServices: 'Select Required Sub-Services',
    subServicesHelp: 'Select one or more specific tasks you need done. Multiple choices allowed.',
    serviceAddress: 'Complete Service Address',
    addressHelp: 'Provide your accurate address and pin your exact location on the map.',
    houseNo: 'House / Flat Number',
    buildingStreet: 'Building / Street Name',
    areaLocality: 'Area / Locality',
    landmark: 'Landmark (Optional)',
    city: 'City',
    state: 'State',
    pincode: 'PIN Code',
    contactPhone: 'Contact Phone Number',
    addressLabel: 'Address Label',
    dateTime: 'Preferred Date & Time',
    urgency: 'Job Urgency',
    normalUrgency: 'Normal (Within 24-48 hrs)',
    urgent: 'Urgent (Within 4-6 hrs)',
    emergency: 'Emergency (Immediate)',
    safetyComfort: 'Safety & Comfort Preferences',
    elderSafe: 'Elder-Safe Preference (Experienced with seniors)',
    womenSafe: 'Women-Safe Preference (Verified background & high family rating)',
    additionalNotes: 'Additional Notes & Photos',
    notesPlaceholder: 'Describe the issue or requirements in detail...',
    findMatchingPros: 'Find & Compare Suitable Professionals',
    matchingTitle: 'Available Verified Professionals',
    matchScore: 'Match Score',
    skillsMatched: 'Skills Matched',
    hirePro: 'Hire Selected Professional',
    bookingConfirmed: 'Booking Submitted Successfully',

    // Statuses
    draft: 'Draft',
    submitted: 'Submitted',
    matching: 'Matching',
    pro_selected: 'Professional Selected',
    accepted: 'Accepted',
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
    reviewed: 'Reviewed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
    expired: 'Expired',
    disputed: 'Disputed',

    // Pro onboarding
    proRegisterTitle: 'Register as an Independent KaamNow Professional',
    proRegisterSub: 'Set your own prices, select your categories and sub-services, and get direct local leads.',
    fullName: 'Full Name',
    email: 'Email Address',
    mobile: 'Mobile Number',
    password: 'Password',
    selectSkills: 'Select Categories & Sub-Services (Multi-Select)',
    searchSkills: 'Search sub-services or trades...',
    setPricing: 'Set Your Independent Rates',
    hourlyRateInput: 'Standard Hourly Rate (₹)',
    fourHourRateInput: '4+ Hour Half-Day Rate (₹)',
    fullDayRateInput: '8-Hour Full-Day Rate (₹)',
    offerDiagnostic: 'Offer ₹99 Diagnostic/Inspection Visit for uncertain jobs',
    serviceRadius: 'Service Radius (KM)',
    bio: 'About Your Experience / Bio',
    languagesKnown: 'Languages Spoken',
    completeRegistration: 'Complete Professional Registration',

    // Reviews
    leaveReview: 'Rate & Review Professional',
    reviewNotice: 'Reviews can only be submitted after a booking is marked completed.',

    // Google Profile Completion
    completeProfileTitle: 'Complete Your KaamNow Profile',
    completeProfileDesc: 'Please provide your 10-digit mobile number and city to finalize your account setup.',
    signInRequired: 'Sign In Required'
  },
  hi: {
    // Brand
    brandName: 'KaamNow',
    tagline: 'कनेक्ट. बुक. सॉर्टेड.',
    brandPromise: 'आपके पास के कुशल व इंडिपेंडेंट प्रोफेशनल्स से जुड़ने का सबसे तेज़ और भरोसेमंद माध्यम।',
    disclaimer: 'कामनाउ एक कनेक्टर मार्केटप्लेस है। प्रोफेशनल्स स्वतंत्र कारीगर हैं, कामनाउ के कर्मचारी नहीं।',

    // Nav & Common
    exploreServices: 'सर्विसेज़ देखें',
    dashboard: 'डैशबोर्ड',
    signIn: 'लॉग इन',
    signOut: 'लॉग आउट',
    joinAsPro: 'प्रोफेशनल बनें',
    switchRole: 'रोल बदलें',
    language: 'भाषा (Language)',
    customer: 'कस्टमर',
    professional: 'प्रोफेशनल (कारीगर)',
    admin: 'एडमिन',
    searchPlaceholder: 'काम, सर्विस या पास के कारीगर खोजें...',
    needAPro: 'काम चाहिए? कामनाउ (KaamNow)',
    heroSub: 'अपने पास के भरोसेमंद प्रोफेशनल्स खोजें, तुलना करें और अपने काम के लिए सही व्यक्ति चुनें।',
    findAProBtn: 'प्रोफेशनल खोजें',
    joinAsProBtn: 'प्रोफेशनल के रूप में जुड़ें',
    browseCategories: '16 मुख्य काम/सर्विसेज़',
    popularTrades: 'पॉपुलर काम',
    verifiedBadge: 'वेरिफाइड पार्टनर',
    reviewsCount: 'रिव्यूज',
    completedJobs: 'काम पूरे किए',
    yearsExp: 'वर्षों का अनुभव',
    hourlyRate: '/घंटा',
    fourHrRate: '4 घंटे का पैकेज',
    fullDayRate: '8 घंटे का पूरा दिन',
    diagnosticFeeNotice: 'मानक विज़िट/जाँच शुल्क: ₹99',
    workProtection: 'कामनाउ वर्क प्रोटेक्शन',
    workProtectionDesc: 'कामनाउ से बुकिंग पर काम की सुरक्षा और वारंटी सपोर्ट पाएं।',
    
    // Booking Flow
    selectCategory: 'काम की श्रेणी चुनें',
    selectSubServices: 'ज़रूरी काम चुनें (चेकबॉक्स)',
    subServicesHelp: 'एक या एक से अधिक काम चुनें जो आपको करवाने हैं।',
    serviceAddress: 'काम का पूरा पता',
    addressHelp: 'अपना सही पता दर्ज करें और मैप पर पिन करें।',
    houseNo: 'मकान / फ्लैट नंबर',
    buildingStreet: 'बिल्डिंग / गली का नाम',
    areaLocality: 'इलाका / कॉलोनी',
    landmark: 'लैंडमार्क (पहचान)',
    city: 'शहर',
    state: 'राज्य',
    pincode: 'पिन कोड',
    contactPhone: 'मोबाइल नंबर',
    addressLabel: 'पते का प्रकार',
    dateTime: 'पसंदीदा तारीख और समय',
    urgency: 'काम की तत्परता',
    normalUrgency: 'सामान्य (24-48 घंटों में)',
    urgent: 'जल्दी (4-6 घंटों में)',
    emergency: 'तुरंत (इमरजेंसी)',
    safetyComfort: 'सुरक्षा व कम्फर्ट प्राथमिकता',
    elderSafe: 'बुजुर्ग-सुरक्षित (वरिष्ठ नागरिकों के साथ काम करने में अनुभवी)',
    womenSafe: 'महिला-सुरक्षित (बैकग्राउंड चेक व उच्च रेटिंग)',
    additionalNotes: 'अतिरिक्त विवरण और फोटो',
    notesPlaceholder: 'काम के बारे में विस्तार से बताएं...',
    findMatchingPros: 'सही प्रोफेशनल्स देखें और तुलना करें',
    matchingTitle: 'उपलब्ध वेरिफाइड प्रोफेशनल्स',
    matchScore: 'मैच स्कोर',
    skillsMatched: 'मैच हुए काम',
    hirePro: 'प्रोफेशनल को बुक करें',
    bookingConfirmed: 'बुकिंग सफलतापूर्वक सबमिट हुई',

    // Statuses
    draft: 'ड्राफ्ट',
    submitted: 'सबमिट हुआ',
    matching: 'मैचिंग जारी',
    pro_selected: 'प्रोफेशनल चुना गया',
    accepted: 'स्वीकार किया गया',
    scheduled: 'शेड्यूल्ड',
    in_progress: 'काम जारी है',
    completed: 'काम पूरा हुआ',
    reviewed: 'रिव्यू दिया गया',
    cancelled: 'कैंसिल हुआ',
    rejected: 'अस्वीकार',
    expired: 'एक्सपायर',
    disputed: 'विवादित',

    // Pro onboarding
    proRegisterTitle: 'कामनाउ पर स्वतंत्र प्रोफेशनल के रूप में रजिस्टर करें',
    proRegisterSub: 'अपनी रेट खुद तय करें, अपने काम चुनें और सीधे लोकल कस्टमर ऑर्डर पाएं।',
    fullName: 'पूरा नाम',
    email: 'ईमेल एड्रेस',
    mobile: 'मोबाइल नंबर',
    password: 'पासवर्ड',
    selectSkills: 'अपने काम व हुनर चुनें (मल्टी-सेलेक्ट)',
    searchSkills: 'काम या हुनर सर्च करें...',
    setPricing: 'अपनी रेट खुद तय करें',
    hourlyRateInput: 'घंटे का रेट (₹)',
    fourHourRateInput: '4 घंटे (हाफ-डे) का रेट (₹)',
    fullDayRateInput: '8 घंटे (पूरा दिन) का रेट (₹)',
    offerDiagnostic: 'जाँच/विज़िट के लिए ₹99 मॉडल ऑन रखें',
    serviceRadius: 'काम का दायरा (KM)',
    bio: 'अपने अनुभव के बारे में लिखें',
    languagesKnown: 'भाषाएं जो आप बोलते हैं',
    completeRegistration: 'रजिस्ट्रेशन पूरा करें',

    // Reviews
    leaveReview: 'रेटिंग और रिव्यू दें',
    reviewNotice: 'रिव्यू केवल काम पूरा होने के बाद ही दिया जा सकता है।',

    // Google Profile Completion
    completeProfileTitle: 'अपनी कामनाउ प्रोफाइल पूरी करें',
    completeProfileDesc: 'बुकिंग करने या अकाउंट उपयोग करने के लिए कृपया अपना 10 अंकों का मोबाइल नंबर और शहर दर्ज करें।',
    signInRequired: 'साइन इन आवश्यक है'
  }
};

const LANG_KEY = 'kaamnow_lang';

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'en' || saved === 'hi') return saved;
  return 'en';
}

export function setStoredLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANG_KEY, lang);
    window.dispatchEvent(new Event('kaamnow_lang_changed'));
  }
}

export function useLanguage() {
  const [lang, setLang] = useState<Language>(getStoredLanguage());

  useEffect(() => {
    const handler = () => {
      setLang(getStoredLanguage());
    };
    window.addEventListener('kaamnow_lang_changed', handler);
    return () => window.removeEventListener('kaamnow_lang_changed', handler);
  }, []);

  const changeLanguage = (newLang: Language) => {
    setStoredLanguage(newLang);
    setLang(newLang);
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return { lang, setLanguage: changeLanguage, t };
}
