import { create } from 'zustand';
import { 
  User, 
  ProfessionalProfile, 
  ServiceCategory, 
  Booking, 
  BookingStatus,
  Review, 
  Message, 
  Role,
  IncentiveRule,
  PlatformConfig,
  ServiceAddress
} from './types';
import { supabase, supabaseDb, supabaseStorage } from './lib/supabase';
import { firebaseDb } from './lib/firebase';
import { KAAMNOW_CATEGORIES } from './lib/categories';
import { 
  DEMO_SAMPLE_TESTING_PRO, 
  DEMO_SECONDARY_PROS, 
  ALL_DEMO_80_PROFESSIONALS,
  DEMO_SAMPLE_TESTING_REVIEWS, 
  DEMO_SAMPLE_TESTING_BOOKINGS,
  INITIAL_INCENTIVE_RULES,
  INITIAL_PLATFORM_CONFIG
} from './lib/demoData';

export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

export const MOCK_CUSTOMERS: User[] = [];

interface WorkProtectionClaim {
  id: string;
  bookingId: string;
  customerId: string;
  professionalId: string;
  issueType: 'damage' | 'unfinished' | 'delay' | 'conduct' | 'other';
  description: string;
  amountClaimed: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'settled';
  createdAt: string;
}

interface AppState {
  currentUser: User | ProfessionalProfile | null;
  categories: ServiceCategory[];
  professionals: ProfessionalProfile[];
  bookings: Booking[];
  reviews: Review[];
  savedProfessionals: string[];
  customers: User[];
  incentiveRules: IncentiveRule[];
  platformConfig: PlatformConfig;
  workProtectionClaims: WorkProtectionClaim[];
  listenersInitialized?: boolean;
  
  initializeFromFirestore: () => Promise<void>;
  initializeFromSupabase: () => Promise<void>;
  syncToSupabase: () => Promise<{ success: boolean; message: string }>;
  migrateToKaamNow: (purgeUsers?: boolean) => Promise<{ success: boolean; message: string }>;
  login: (emailOrPhone: string, role?: Role, name?: string, additionalDetails?: any) => void;
  logout: () => void;
  bookService: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  toggleSavedProfessional: (proId: string) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus, note?: string, professionalId?: string) => Promise<void>;
  addProfessionalService: (proId: string, service: any) => Promise<void>;
  updateUserProfile: (profile: Partial<User & ProfessionalProfile>) => Promise<void>;
  completeUserProfile: (details: { mobile: string; city: string; state?: string; pincode?: string }) => Promise<void>;
  updateCustomer: (id: string, updated: Partial<User>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  updateProfessional: (id: string, updated: Partial<ProfessionalProfile>) => Promise<void>;
  deleteProfessional: (id: string) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  submitWorkProtectionClaim: (claim: Omit<WorkProtectionClaim, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updatePlatformConfig: (config: Partial<PlatformConfig>) => void;
  addIncentiveRule: (rule: IncentiveRule) => void;
  toggleIncentiveRule: (ruleId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: (() => {
    try {
      const saved = localStorage.getItem('kaamnow_user') || localStorage.getItem('goservik_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })(),
  categories: KAAMNOW_CATEGORIES,
  professionals: [DEMO_SAMPLE_TESTING_PRO, ...ALL_DEMO_80_PROFESSIONALS],
  bookings: DEMO_SAMPLE_TESTING_BOOKINGS,
  reviews: DEMO_SAMPLE_TESTING_REVIEWS,
  savedProfessionals: [],
  customers: MOCK_CUSTOMERS,
  incentiveRules: INITIAL_INCENTIVE_RULES,
  platformConfig: INITIAL_PLATFORM_CONFIG,
  workProtectionClaims: [],
  listenersInitialized: false,

  login: (emailOrPhone, role, name, additionalDetails) => set((state) => {
    const isEmail = emailOrPhone.includes('@');
    const cleanedIdentifier = emailOrPhone.trim();

    // Admin login
    if (cleanedIdentifier.toLowerCase() === 'admin@kaamnow.com' || 
        cleanedIdentifier.toLowerCase() === 'admin@goservik.com' || 
        cleanedIdentifier.toLowerCase() === 'admin') {
      const adminUser: User = {
        id: 'admin-kaamnow-1',
        name: name || 'KaamNow Admin',
        email: 'admin@kaamnow.com',
        role: 'admin',
        joinedAt: new Date().toISOString()
      };
      localStorage.setItem('kaamnow_user', JSON.stringify(adminUser));
      return { currentUser: adminUser };
    }

    const finalRole = role || 'customer';

    // Normalize phone numbers for checks
    let extractedPhone = '';
    if (cleanedIdentifier.endsWith('@kaamnow.com') || cleanedIdentifier.endsWith('@goservik.com')) {
      const prefix = cleanedIdentifier.split('@')[0];
      if (prefix.startsWith('+') || /^\d+$/.test(prefix)) {
        extractedPhone = prefix;
      }
    } else if (/^\+?\d+$/.test(cleanedIdentifier)) {
      extractedPhone = cleanedIdentifier;
    }

    const matchesEmailOrPhone = (user: any) => {
      const uEmail = (user.email || '').toLowerCase();
      const uPhone = (user.mobile || '').replace(/\D/g, '');
      const searchId = cleanedIdentifier.toLowerCase();
      const searchPhone = extractedPhone.replace(/\D/g, '');
      
      if (uEmail === searchId) return true;
      if (searchPhone && uPhone.slice(-10) === searchPhone.slice(-10)) return true;
      if (additionalDetails?.mobile) {
        const inputPhone = additionalDetails.mobile.replace(/\D/g, '');
        if (inputPhone && uPhone.slice(-10) === inputPhone.slice(-10)) return true;
      }
      return false;
    };

    // 1. Cross-role verification (Strict Separation)
    if (finalRole === 'customer') {
      const existAsPro = state.professionals.find(matchesEmailOrPhone);
      if (existAsPro) {
        throw new Error("This account is registered as a Professional. A Professional cannot log in or register as a Customer.");
      }
    } else if (finalRole === 'professional') {
      const existAsCust = state.customers.find(matchesEmailOrPhone);
      if (existAsCust) {
        throw new Error("This account is registered as a Customer. A Customer cannot log in or register as a Professional.");
      }
    }

    // 2. Phone number duplication across different accounts
    const phoneToCheck = extractedPhone || additionalDetails?.mobile || '';
    const cleanPhoneToCheck = phoneToCheck.replace(/\D/g, '');

    if (cleanPhoneToCheck) {
      const emailToIgnore = cleanedIdentifier.toLowerCase();
      
      const duplicateProPhone = state.professionals.find(p => {
        const pPhone = (p.mobile || '').replace(/\D/g, '');
        const pEmail = (p.email || '').toLowerCase();
        return pPhone.slice(-10) === cleanPhoneToCheck.slice(-10) && pEmail !== emailToIgnore;
      });

      const duplicateCustPhone = state.customers.find(c => {
        const cPhone = (c.mobile || '').replace(/\D/g, '');
        const cEmail = (c.email || '').toLowerCase();
        return cPhone.slice(-10) === cleanPhoneToCheck.slice(-10) && cEmail !== emailToIgnore;
      });

      if (duplicateProPhone || duplicateCustPhone) {
        throw new Error("This mobile number is already linked to another registered account. One login per unique phone number is allowed.");
      }
    }

    // 3. Handle Professional Login/Registration
    if (finalRole === 'professional') {
      const existingPro = state.professionals.find(matchesEmailOrPhone);
      if (existingPro) {
        localStorage.setItem('kaamnow_user', JSON.stringify(existingPro));
        return { currentUser: existingPro };
      }

      const defaultCategory = additionalDetails?.category || 'cat-electrical';
      const catObj = state.categories.find(c => c.id === defaultCategory) || state.categories[0];
      
      const newPro: ProfessionalProfile = {
        id: additionalDetails?.uid || `pro-${Date.now()}`,
        uid: additionalDetails?.uid || undefined,
        name: additionalDetails?.companyName || name || cleanedIdentifier.split('@')[0],
        personalName: name || cleanedIdentifier.split('@')[0],
        email: isEmail ? cleanedIdentifier : `${cleanedIdentifier}@kaamnow.com`,
        role: 'professional',
        joinedAt: new Date().toISOString(),
        avatar: additionalDetails?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300',
        verified: true,
        tagline: additionalDetails?.tagline || 'Verified KaamNow Partner',
        bio: additionalDetails?.bio || 'Skilled independent professional on KaamNow.',
        location: additionalDetails?.city ? `${additionalDetails.city}, ${additionalDetails.state || ''}` : 'Delhi NCR',
        serviceRadiusKm: additionalDetails?.serviceRadiusKm || 20,
        languages: additionalDetails?.languages || ['Hindi', 'English'],
        coordinates: additionalDetails?.coordinates || { lat: 28.5355, lng: 77.2410 },
        // Multi-category skills
        skills: additionalDetails?.skills || [
          {
            categoryId: catObj.id,
            categoryName: catObj.name,
            subcategories: additionalDetails?.subcategories || [catObj.subcategories[0]]
          }
        ],
        hourlyRate: additionalDetails?.hourlyRate || 350,
        fourHourRate: additionalDetails?.fourHourRate || 1200,
        fullDayRate: additionalDetails?.fullDayRate || 2200,
        supportsDiagnosticVisit: additionalDetails?.supportsDiagnosticVisit ?? true,
        services: [
          {
            id: `srv-${Date.now()}`,
            categoryId: catObj.id,
            name: `${catObj.name} Professional Work`,
            description: 'Comprehensive skilled on-site service.',
            basePrice: additionalDetails?.hourlyRate || 350,
            priceUnit: 'hourly',
            experienceYears: additionalDetails?.experienceYears || 5,
            subcategories: additionalDetails?.subcategories || [catObj.subcategories[0]]
          }
        ],
        gallery: [],
        certifications: ['Verified KaamNow Professional'],
        workingHours: {
          Mon: '08:00 - 20:00',
          Tue: '08:00 - 20:00',
          Wed: '08:00 - 20:00',
          Thu: '08:00 - 20:00',
          Fri: '08:00 - 20:00',
          Sat: '09:00 - 18:00'
        },
        responseTime: 'Within 30 minutes',
        availabilityStatus: 'available',
        rating: 5.0,
        reviewCount: 0,
        jobsCompleted: 0,
        companyName: additionalDetails?.companyName || '',
        mobile: phoneToCheck || '',
        dob: additionalDetails?.dob || '',
        country: additionalDetails?.country || 'India',
        state: additionalDetails?.state || 'Delhi',
        city: additionalDetails?.city || 'New Delhi',
        pincode: additionalDetails?.pincode || '',
        addressLine: additionalDetails?.addressLine || '',
        landmark: additionalDetails?.landmark || '',
        satisfiesElderSafe: additionalDetails?.satisfiesElderSafe ?? true,
        satisfiesWomenSafe: additionalDetails?.satisfiesWomenSafe ?? true,
        subscriptionStatus: 'active_free_tier',
        subscriptionQuarter: 1,
        calculatedMonthlySubscription: 100
      };

      supabaseDb.upsertProfessional(newPro).catch(err => 
        console.warn("Supabase professional login write failed", err)
      );
      firebaseDb.saveProfile(newPro).catch(err =>
        console.warn("Firebase professional profile save warning", err)
      );

      localStorage.setItem('kaamnow_user', JSON.stringify(newPro));
      return {
        professionals: [...state.professionals, newPro],
        currentUser: newPro
      };
    }

    // 4. Default to Customer Login/Registration
    const existingCustomer = state.customers.find(matchesEmailOrPhone);
    if (existingCustomer) {
      localStorage.setItem('kaamnow_user', JSON.stringify(existingCustomer));
      firebaseDb.saveProfile(existingCustomer).catch(() => {});
      return { currentUser: existingCustomer };
    }

    const isComplete = Boolean(phoneToCheck && (additionalDetails?.city || ''));

    const mockCustomer: User = {
      id: additionalDetails?.uid || `cust-${Date.now()}`,
      uid: additionalDetails?.uid || undefined,
      name: name || cleanedIdentifier.split('@')[0],
      email: isEmail ? cleanedIdentifier : `${cleanedIdentifier}@kaamnow.com`,
      role: 'customer',
      joinedAt: new Date().toISOString(),
      avatar: additionalDetails?.avatar,
      companyName: '',
      mobile: phoneToCheck || '',
      dob: additionalDetails?.dob || '',
      country: additionalDetails?.country || 'India',
      state: additionalDetails?.state || 'Delhi',
      city: additionalDetails?.city || '',
      pincode: additionalDetails?.pincode || '',
      addressLine: additionalDetails?.addressLine || '',
      landmark: additionalDetails?.landmark || '',
      coordinates: additionalDetails?.coordinates || undefined,
      isProfileComplete: isComplete
    };

    supabaseDb.upsertCustomer(mockCustomer).catch(err => 
      console.warn("Supabase customer login write failed", err)
    );
    firebaseDb.saveProfile(mockCustomer).catch(err =>
      console.warn("Firebase customer profile save warning", err)
    );

    localStorage.setItem('kaamnow_user', JSON.stringify(mockCustomer));
    return { 
      customers: [...state.customers, mockCustomer],
      currentUser: mockCustomer 
    };
  }),

  logout: () => {
    localStorage.removeItem('kaamnow_user');
    localStorage.removeItem('goservik_user');
    supabase.auth.signOut().catch((err) => {
      console.warn("Supabase signOut failed", err);
    });
    set({ currentUser: null });
  },

  syncToSupabase: async () => {
    try {
      const state = get();
      // Sync categories to Supabase and Firebase
      for (const cat of state.categories) {
        await supabaseDb.upsertCategory(cat);
        await firebaseDb.saveCategory(cat);
      }
      // Sync professionals to Supabase and Firebase
      for (const pro of state.professionals) {
        await supabaseDb.upsertProfessional(pro);
        await firebaseDb.saveProfile(pro);
      }
      // Sync bookings to Supabase and Firebase
      for (const bk of state.bookings) {
        await supabaseDb.upsertBooking(bk);
        await firebaseDb.saveBooking(bk);
      }
      // Sync reviews to Supabase and Firebase
      for (const rev of state.reviews) {
        await supabaseDb.upsertReview(rev);
        await firebaseDb.saveReview(rev);
      }
      // Sync customers to Supabase and Firebase
      for (const cust of state.customers) {
        await supabaseDb.upsertCustomer(cust);
        await firebaseDb.saveProfile(cust);
      }
      return {
        success: true,
        message: 'Successfully synchronized all categories, professionals, bookings, reviews, and customers to both Supabase & Firebase!'
      };
    } catch (err: any) {
      console.error('Failed to sync to Supabase/Firebase:', err);
      return {
        success: false,
        message: `Cloud sync error: ${err.message || err}`
      };
    }
  },

  initializeFromSupabase: async () => {
    try {
      // 1. Fetch Categories from Supabase & Firebase
      let loadedCategories = await supabaseDb.getCategories();
      if (!loadedCategories || loadedCategories.length === 0) {
        loadedCategories = await firebaseDb.getAllCategories();
      }
      if (!loadedCategories || loadedCategories.length === 0) {
        console.log("KaamNow: Initializing 16 categories in Supabase & Firebase...");
        for (const cat of KAAMNOW_CATEGORIES) {
          supabaseDb.upsertCategory(cat).catch(() => {});
          firebaseDb.saveCategory(cat).catch(() => {});
        }
        loadedCategories = KAAMNOW_CATEGORIES;
      }

      // 2. Fetch Professionals from Supabase & Firebase
      let loadedProfessionals = await supabaseDb.getProfessionals();
      const fbProfessionals = await firebaseDb.getAllProfessionals();
      if (fbProfessionals && fbProfessionals.length > 0) {
        for (const fp of fbProfessionals) {
          if (!loadedProfessionals.some(p => p.id === fp.id)) {
            loadedProfessionals.push(fp);
          }
        }
      }

      if (!loadedProfessionals || loadedProfessionals.length < 80) {
        const allProsToSeed = [DEMO_SAMPLE_TESTING_PRO, ...ALL_DEMO_80_PROFESSIONALS];
        for (const pro of allProsToSeed) {
          if (!loadedProfessionals.some(p => p.id === pro.id)) {
            supabaseDb.upsertProfessional(pro).catch(() => {});
            firebaseDb.saveProfile(pro).catch(() => {});
          }
        }
        loadedProfessionals = allProsToSeed;
      }

      // 3. Fetch Bookings from Supabase & Firebase
      let loadedBookings = await supabaseDb.getBookings();
      const fbBookings = await firebaseDb.getAllBookings();
      if (fbBookings && fbBookings.length > 0) {
        for (const fb of fbBookings) {
          if (!loadedBookings.some(b => b.id === fb.id)) {
            loadedBookings.push(fb);
          }
        }
      }

      if (!loadedBookings || loadedBookings.length === 0) {
        for (const bk of DEMO_SAMPLE_TESTING_BOOKINGS) {
          supabaseDb.upsertBooking(bk).catch(() => {});
          firebaseDb.saveBooking(bk).catch(() => {});
        }
        loadedBookings = DEMO_SAMPLE_TESTING_BOOKINGS;
      }

      // 4. Fetch Reviews from Supabase & Firebase
      let loadedReviews = await supabaseDb.getReviews();
      const fbReviews = await firebaseDb.getAllReviews();
      if (fbReviews && fbReviews.length > 0) {
        for (const fr of fbReviews) {
          if (!loadedReviews.some(r => r.id === fr.id)) {
            loadedReviews.push(fr);
          }
        }
      }

      if (!loadedReviews || loadedReviews.length === 0) {
        for (const rev of DEMO_SAMPLE_TESTING_REVIEWS) {
          supabaseDb.upsertReview(rev).catch(() => {});
          firebaseDb.saveReview(rev).catch(() => {});
        }
        loadedReviews = DEMO_SAMPLE_TESTING_REVIEWS;
      }

      // 5. Fetch Customers from Supabase & Firebase
      let loadedCustomers = await supabaseDb.getCustomers();
      const fbCustomers = await firebaseDb.getAllCustomers();
      if (fbCustomers && fbCustomers.length > 0) {
        for (const fc of fbCustomers) {
          if (!loadedCustomers.some(c => c.id === fc.id)) {
            loadedCustomers.push(fc);
          }
        }
      }

      // 6. Restore Profile on Login & Session Check
      const cachedUserStr = localStorage.getItem('kaamnow_user') || localStorage.getItem('goservik_user');
      let restoredUser = get().currentUser;
      if (cachedUserStr) {
        try {
          const parsed = JSON.parse(cachedUserStr);
          // Check Firebase profiles collection
          const fbProfile = await firebaseDb.getProfile(parsed.id);
          const sbProfile = parsed.role === 'professional' 
            ? loadedProfessionals.find(p => p.id === parsed.id)
            : loadedCustomers.find(c => c.id === parsed.id);
          
          restoredUser = fbProfile || sbProfile || parsed;
          localStorage.setItem('kaamnow_user', JSON.stringify(restoredUser));
        } catch {}
      }

      set({
        categories: loadedCategories,
        professionals: loadedProfessionals,
        bookings: loadedBookings,
        reviews: loadedReviews,
        customers: loadedCustomers,
        currentUser: restoredUser
      });

      // 7. Set up real-time postgres_changes listeners
      const currentState = get();
      if (!currentState.listenersInitialized) {
        supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, async () => {
            const liveBookings = await supabaseDb.getBookings();
            if (liveBookings.length > 0) set({ bookings: liveBookings });
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, async () => {
            const liveCustomers = await supabaseDb.getCustomers();
            set({ customers: liveCustomers });
            const current = get().currentUser;
            if (current && current.role === 'customer') {
              const updatedMe = liveCustomers.find(c => c.id === current.id);
              if (updatedMe) {
                set({ currentUser: updatedMe });
                localStorage.setItem('kaamnow_user', JSON.stringify(updatedMe));
              }
            }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'professionals' }, async () => {
            const liveProfessionals = await supabaseDb.getProfessionals();
            set({ professionals: liveProfessionals });
            const current = get().currentUser;
            if (current && current.role === 'professional') {
              const updatedMe = liveProfessionals.find(p => p.id === current.id);
              if (updatedMe) {
                set({ currentUser: updatedMe });
                localStorage.setItem('kaamnow_user', JSON.stringify(updatedMe));
              }
            }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, async () => {
            const liveCategories = await supabaseDb.getCategories();
            if (liveCategories.length > 0) set({ categories: liveCategories });
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, async () => {
            const liveReviews = await supabaseDb.getReviews();
            if (liveReviews.length > 0) set({ reviews: liveReviews });
          })
          .subscribe();

        set({ listenersInitialized: true });
      }
    } catch (err) {
      console.warn("Supabase/Firebase initialization fallback to KaamNow local models", err);
    }
  },

  // Backward-compatibility alias
  initializeFromFirestore: async () => {
    return get().initializeFromSupabase();
  },

  migrateToKaamNow: async (purgeUsers = false) => {
    try {
      // 1. Clean old categories
      const oldCategories = await supabaseDb.getCategories();
      for (const cat of oldCategories) {
        await supabaseDb.deleteCategory(cat.id);
      }
      // Seed 16 KaamNow categories
      for (const cat of KAAMNOW_CATEGORIES) {
        await supabaseDb.upsertCategory(cat);
      }

      // 2. Clean and re-seed professionals/customers if requested
      if (purgeUsers) {
        const pros = await supabaseDb.getProfessionals();
        for (const p of pros) {
          await supabaseDb.deleteProfessional(p.id);
        }
        const custs = await supabaseDb.getCustomers();
        for (const c of custs) {
          await supabaseDb.deleteCustomer(c.id);
        }
      }

      // Re-seed Sample Testing pro and secondary demo pros
      await supabaseDb.upsertProfessional(DEMO_SAMPLE_TESTING_PRO);
      for (const pro of DEMO_SECONDARY_PROS) {
        await supabaseDb.upsertProfessional(pro);
      }

      // Re-seed bookings and reviews
      for (const bk of DEMO_SAMPLE_TESTING_BOOKINGS) {
        await supabaseDb.upsertBooking(bk);
      }
      for (const rev of DEMO_SAMPLE_TESTING_REVIEWS) {
        await supabaseDb.upsertReview(rev);
      }

      set({
        categories: KAAMNOW_CATEGORIES,
        professionals: [DEMO_SAMPLE_TESTING_PRO, ...DEMO_SECONDARY_PROS],
        bookings: DEMO_SAMPLE_TESTING_BOOKINGS,
        reviews: DEMO_SAMPLE_TESTING_REVIEWS,
        customers: purgeUsers ? [] : get().customers
      });

      return {
        success: true,
        message: "KaamNow database migration successful! 16 service categories & 'Sample Testing' verified pro seeded to Supabase."
      };
    } catch (err: any) {
      console.error("Migration error:", err);
      return {
        success: false,
        message: `Migration encountered an issue: ${err.message || err}`
      };
    }
  },

  bookService: async (bookingData) => {
    const bookingId = `bk-${Date.now()}`;
    const initialStatus: BookingStatus = bookingData.professionalId ? 'pro_selected' : 'submitted';
    
    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      status: initialStatus,
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Customer submitted requirement on KaamNow'
        },
        ...(bookingData.professionalId ? [
          {
            status: 'pro_selected' as BookingStatus,
            timestamp: new Date().toISOString(),
            note: 'Customer selected professional'
          }
        ] : [])
      ],
      platformFee: Math.round((bookingData.totalPrice || 0) * 0.05),
      workProtectionApplied: true
    };

    set((state) => ({
      bookings: [newBooking, ...state.bookings]
    }));

    try {
      await supabaseDb.upsertBooking(newBooking);
    } catch (err) {
      console.error("Supabase booking write failed", err);
    }

    try {
      await firebaseDb.saveBooking(newBooking);
    } catch (err) {
      console.warn("Firebase booking write warning", err);
    }

    return bookingId;
  },

  updateBookingStatus: async (bookingId, status, note, professionalId) => {
    let updatedBooking: Booking | undefined;

    set((state) => {
      const updatedList = state.bookings.map(b => {
        if (b.id === bookingId) {
          const existingHistory = b.statusHistory || [];
          const newHistoryItem = {
            status,
            timestamp: new Date().toISOString(),
            note: note || `Status updated to ${status}`
          };
          updatedBooking = {
            ...b,
            status,
            ...(professionalId ? { professionalId } : {}),
            statusHistory: [...existingHistory, newHistoryItem]
          };
          return updatedBooking;
        }
        return b;
      });
      return { bookings: updatedList };
    });

    if (updatedBooking) {
      try {
        await supabaseDb.upsertBooking(updatedBooking);
      } catch (err) {
        console.error("Supabase booking status update failed", err);
      }
      try {
        await firebaseDb.saveBooking(updatedBooking);
      } catch (err) {
        console.warn("Firebase booking status update warning", err);
      }
    }
  },

  toggleSavedProfessional: (proId) => set((state) => {
    const isSaved = state.savedProfessionals.includes(proId);
    return {
      savedProfessionals: isSaved 
        ? state.savedProfessionals.filter(id => id !== proId)
        : [...state.savedProfessionals, proId]
    };
  }),

  addProfessionalService: async (proId, service) => {
    const newService = { ...service, id: `srv-${Date.now()}` };
    let proObj: ProfessionalProfile | undefined;
    let updatedCurrentUser: any;

    set((state) => {
      const updatedProfessionals = state.professionals.map(p => {
        if (p.id === proId) {
          proObj = { ...p, services: [...p.services, newService] };
          return proObj;
        }
        return p;
      });
      
      updatedCurrentUser = state.currentUser && state.currentUser.id === proId && state.currentUser.role === 'professional'
        ? { 
            ...state.currentUser, 
            services: [...(state.currentUser as ProfessionalProfile).services, newService] 
          }
        : state.currentUser;

      return {
        professionals: updatedProfessionals,
        currentUser: updatedCurrentUser
      };
    });

    if (proObj) {
      try {
        await supabaseDb.upsertProfessional(proObj);
      } catch (err) {
        console.error("Supabase professional service write failed", err);
      }
    }
  },

  updateUserProfile: async (profile) => {
    let updatedUser: any;
    let isPro = false;
    let updatedPro: any;
    let updatedCust: any;

    set((state) => {
      if (!state.currentUser) return {};
      updatedUser = { ...state.currentUser, ...profile } as any;
      isPro = state.currentUser.role === 'professional';

      if (isPro) {
        updatedPro = {
          ...state.professionals.find(p => p.id === state.currentUser?.id),
          ...profile
        } as any;
      } else {
        updatedCust = {
          ...state.customers.find(c => c.id === state.currentUser?.id),
          ...profile
        } as any;
      }

      return {
        currentUser: updatedUser,
        professionals: state.professionals.map(p => p.id === state.currentUser?.id ? { ...p, ...profile } as any : p),
        customers: state.customers.map(c => c.id === state.currentUser?.id ? { ...c, ...profile } as any : c)
      };
    });

    if (updatedUser) {
      localStorage.setItem('kaamnow_user', JSON.stringify(updatedUser));
      try {
        if (isPro && updatedPro) {
          await supabaseDb.upsertProfessional(updatedPro);
          await firebaseDb.saveProfile(updatedPro);
        } else if (!isPro && updatedCust) {
          await supabaseDb.upsertCustomer(updatedCust);
          await firebaseDb.saveProfile(updatedCust);
        }
      } catch (err) {
        console.error("Cloud user profile update failed", err);
      }
    }
  },

  completeUserProfile: async (details) => {
    const current = get().currentUser;
    if (!current) return;

    await get().updateUserProfile({
      mobile: details.mobile,
      city: details.city,
      state: details.state || current.state || 'Delhi',
      pincode: details.pincode || current.pincode || '',
      isProfileComplete: true
    });
  },

  updateCustomer: async (id, updated) => {
    let targetCustomer: User | undefined;

    set((state) => {
      const updatedCustomers = state.customers.map(c => {
        if (c.id === id) {
          targetCustomer = { ...c, ...updated };
          return targetCustomer;
        }
        return c;
      });
      const isCurrentUser = state.currentUser?.id === id;
      
      return {
        customers: updatedCustomers,
        currentUser: isCurrentUser ? { ...state.currentUser, ...updated } as any : state.currentUser
      };
    });

    if (targetCustomer) {
      try {
        await supabaseDb.upsertCustomer(targetCustomer);
        await firebaseDb.saveProfile(targetCustomer);
      } catch (err) {
        console.error("Cloud customer update failed", err);
      }
    }
  },

  deleteCustomer: async (id) => {
    set((state) => {
      const updatedCustomers = state.customers.filter(c => c.id !== id);
      const isCurrentUser = state.currentUser?.id === id;
      return {
        customers: updatedCustomers,
        currentUser: isCurrentUser ? null : state.currentUser
      };
    });

    try {
      await supabaseDb.deleteCustomer(id);
    } catch (err) {
      console.error("Supabase customer delete failed", err);
    }
  },

  updateProfessional: async (id, updated) => {
    let targetPro: ProfessionalProfile | undefined;

    set((state) => {
      const updatedProfessionals = state.professionals.map(p => {
        if (p.id === id) {
          targetPro = { ...p, ...updated } as any;
          return targetPro;
        }
        return p;
      });
      const isCurrentUser = state.currentUser?.id === id;
      
      return {
        professionals: updatedProfessionals,
        currentUser: isCurrentUser ? { ...state.currentUser, ...updated } as any : state.currentUser
      };
    });

    if (targetPro) {
      try {
        await supabaseDb.upsertProfessional(targetPro);
        await firebaseDb.saveProfile(targetPro);
      } catch (err) {
        console.error("Cloud professional update failed", err);
      }
    }
  },

  deleteProfessional: async (id) => {
    set((state) => {
      const updatedProfessionals = state.professionals.filter(p => p.id !== id);
      const isCurrentUser = state.currentUser?.id === id;
      return {
        professionals: updatedProfessionals,
        currentUser: isCurrentUser ? null : state.currentUser
      };
    });

    try {
      await supabaseDb.deleteProfessional(id);
      await firebaseDb.deleteProfile(id);
    } catch (err) {
      console.error("Cloud professional delete failed", err);
    }
  },

  deleteBooking: async (id) => {
    set((state) => ({
      bookings: state.bookings.filter(b => b.id !== id)
    }));

    try {
      await supabaseDb.deleteBooking(id);
      await firebaseDb.deleteBooking(id);
    } catch (err) {
      console.error("Cloud booking delete failed", err);
    }
  },

  addReview: async (reviewData) => {
    const booking = get().bookings.find(b => b.id === reviewData.bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.status !== 'completed') {
      throw new Error("Reviews can only be submitted after the service is marked completed.");
    }

    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      reviews: [newReview, ...state.reviews]
    }));

    // Update Pro's average rating
    const proReviews = [...get().reviews.filter(r => r.professionalId === reviewData.professionalId), newReview];
    const avgRating = Math.round(
      (proReviews.reduce((sum, r) => sum + r.rating, 0) / proReviews.length) * 10
    ) / 10;

    const pro = get().professionals.find(p => p.id === reviewData.professionalId);
    if (pro) {
      await get().updateProfessional(pro.id, {
        rating: avgRating,
        reviewCount: proReviews.length,
        jobsCompleted: (pro.jobsCompleted || 0) + 1
      });
    }

    // Mark booking as reviewed
    await get().updateBookingStatus(reviewData.bookingId, 'reviewed', 'Customer submitted review');

    try {
      await supabaseDb.upsertReview(newReview);
      await firebaseDb.saveReview(newReview);
    } catch (err) {
      console.error("Cloud review write failed", err);
    }
  },

  submitWorkProtectionClaim: async (claimData) => {
    const newClaim: WorkProtectionClaim = {
      ...claimData,
      id: `claim-${Date.now()}`,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      workProtectionClaims: [newClaim, ...state.workProtectionClaims]
    }));

    try {
      await supabaseDb.upsertClaim(newClaim);
    } catch (err) {
      console.error("Supabase claim write failed", err);
    }
  },

  updatePlatformConfig: (config) => {
    set((state) => ({
      platformConfig: { ...state.platformConfig, ...config }
    }));
  },

  addIncentiveRule: (rule) => {
    set((state) => ({
      incentiveRules: [...state.incentiveRules, rule]
    }));
  },

  toggleIncentiveRule: (ruleId) => {
    set((state) => ({
      incentiveRules: state.incentiveRules.map(r => 
        r.id === ruleId ? { ...r, active: !r.active } : r
      )
    }));
  }
}));
