import { create } from 'zustand';
import { User, ProfessionalProfile, ServiceCategory, Booking, Review, Message, Role } from './types';
import { db, auth } from './lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

// Mock Data
export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const MOCK_CUSTOMERS: User[] = [];

export const MOCK_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-1',
    name: 'Electrical Services',
    description: 'Wiring, switches, sockets, fan installations, EV charger setup, and fault repairs',
    icon: 'Zap',
    subcategories: [
      'Wiring',
      'Switches & Sockets',
      'Fan Installation',
      'Lighting',
      'MCB & Distribution Boards',
      'Inverter Installation',
      'Generator Connection',
      'EV Charger Installation',
      'Electrical Fault Repair'
    ]
  },
  {
    id: 'cat-2',
    name: 'Plumbing Services',
    description: 'Faucet repair, pipe leakage, bathroom fittings, water tanks, sewage and drain cleaning',
    icon: 'Wrench',
    subcategories: [
      'Tap & Faucet Repair',
      'Pipe Leakage',
      'Bathroom Fittings',
      'Kitchen Plumbing',
      'Water Tank Installation',
      'Drain Cleaning',
      'Toilet Repair',
      'Sewage Line',
      'Water Pressure Issues'
    ]
  },
  {
    id: 'cat-3',
    name: 'Carpentry & Woodwork',
    description: 'Furniture assembly, modular furniture, doors, windows, locks, wardrobes, and custom work',
    icon: 'Hammer',
    subcategories: [
      'Furniture Assembly',
      'Modular Furniture',
      'Doors & Windows',
      'Locks',
      'Cabinets',
      'Wardrobes',
      'Shelves',
      'Wooden Flooring',
      'Custom Furniture'
    ]
  },
  {
    id: 'cat-4',
    name: 'Masonry & Civil Work',
    description: 'Brickwork, plastering, RCC repair, boundary walls, floor repairs, stairs and tile base prep',
    icon: 'Grid3X3',
    subcategories: [
      'Brickwork',
      'Plastering',
      'RCC Repair',
      'Concrete Work',
      'Boundary Walls',
      'Floor Repair',
      'Stair Construction',
      'Tile Base Preparation',
      'Structural Repairs'
    ]
  },
  {
    id: 'cat-5',
    name: 'Painting & Wall Finishes',
    description: 'Interior & exterior painting, texture paint, putty work, waterproof coatings, and wallpaper',
    icon: 'Paintbrush',
    subcategories: [
      'Interior Painting',
      'Exterior Painting',
      'Texture Paint',
      'Putty Work',
      'Waterproof Coatings',
      'Wall Repair',
      'Wallpaper Installation',
      'POP Designs'
    ]
  },
  {
    id: 'cat-6',
    name: 'Tiles, Marble & Flooring',
    description: 'Tile installation, replacement, marble/granite work, vinyl/wooden flooring, and polishing',
    icon: 'Layers',
    subcategories: [
      'Tile Installation',
      'Tile Replacement',
      'Marble Installation',
      'Granite Work',
      'Wooden Flooring',
      'Vinyl Flooring',
      'Floor Polishing',
      'Grouting'
    ]
  },
  {
    id: 'cat-7',
    name: 'Aluminium, Glass & UPVC',
    description: 'UPVC windows, sliding windows, aluminium doors, toughened glass, and mosquito mesh',
    icon: 'Columns',
    subcategories: [
      'UPVC Windows',
      'Aluminium Doors',
      'Sliding Windows',
      'Toughened Glass',
      'Glass Partitions',
      'Shower Enclosures',
      'Mosquito Mesh',
      'Balcony Glazing'
    ]
  },
  {
    id: 'cat-8',
    name: 'AC & Home Appliances',
    description: 'AC install & repair, refrigerator, washing machine, microwave, chimney, and geysers',
    icon: 'Tv',
    subcategories: [
      'AC Installation',
      'AC Repair',
      'Refrigerator Repair',
      'Washing Machine Repair',
      'Microwave Repair',
      'Chimney Service',
      'Geyser Repair',
      'Dishwasher Repair',
      'Water Purifier (RO)'
    ]
  },
  {
    id: 'cat-9',
    name: 'Home Cleaning & Sanitization',
    description: 'Deep home cleaning, sofa & carpet cleaning, water tanks, kitchen and post-construction cleaning',
    icon: 'Sparkles',
    subcategories: [
      'Deep Cleaning',
      'Sofa Cleaning',
      'Carpet Cleaning',
      'Bathroom Cleaning',
      'Kitchen Cleaning',
      'Water Tank Cleaning',
      'Move-in Cleaning',
      'Post-Construction Cleaning'
    ]
  },
  {
    id: 'cat-10',
    name: 'Waterproofing & Roofing',
    description: 'Roof & terrace waterproofing, crack repairs, basement waterproofing, and heatproof coatings',
    icon: 'Umbrella',
    subcategories: [
      'Roof Waterproofing',
      'Terrace Waterproofing',
      'Crack Repair',
      'Basement Waterproofing',
      'Roof Leakage Repair',
      'Heatproof Coating',
      'Rainwater Protection'
    ]
  },
  {
    id: 'cat-11',
    name: 'Interior & Modular Solutions',
    description: 'Modular kitchens, wardrobes, TV units, false ceilings, office interiors, and layout planning',
    icon: 'Layout',
    subcategories: [
      'Modular Kitchen',
      'Wardrobes',
      'TV Units',
      'False Ceiling',
      'Partition Walls',
      'Office Interiors',
      'Space Planning',
      'Interior Consultation'
    ]
  },
  {
    id: 'cat-12',
    name: 'Smart Home & Security',
    description: 'CCTV setup, video door phones, smart locks, home automation, wifi and intercom setups',
    icon: 'Cctv',
    subcategories: [
      'CCTV Installation',
      'Video Door Phone',
      'Smart Locks',
      'Home Automation',
      'Wi-Fi Setup',
      'Alarm Systems',
      'Access Control',
      'Intercom Systems'
    ]
  },
  {
    id: 'cat-13',
    name: 'Construction & Renovation',
    description: 'House construction, room extensions, demolition, remodels, and structural consultation',
    icon: 'Building',
    subcategories: [
      'House Construction',
      'Room Extension',
      'Demolition',
      'Renovation',
      'Remodeling',
      'Foundation Work',
      'Structural Consultation',
      'Turnkey Projects'
    ]
  },
  {
    id: 'cat-14',
    name: 'Outdoor & Exterior Services',
    description: 'Gates, fencing, paver blocks, driveways, landscaping, and garden irrigation',
    icon: 'Sun',
    subcategories: [
      'Gates',
      'Fencing',
      'Paver Blocks',
      'Driveways',
      'Landscaping',
      'Garden Irrigation',
      'Outdoor Lighting',
      'Compound Wall Repair'
    ]
  },
  {
    id: 'cat-15',
    name: 'Metal Fabrication & Welding',
    description: 'Steel gates, railings, grills, staircases, welding repairs, and shed fabrication',
    icon: 'Flame',
    subcategories: [
      'Steel Gates',
      'Railings',
      'Grills',
      'Staircases',
      'Shed Fabrication',
      'Welding Repair',
      'Stainless Steel Work',
      'Iron Fabrication'
    ]
  },
  {
    id: 'cat-16',
    name: 'Home Inspection & Maintenance',
    description: 'Property inspections, electrical/plumbing safety inspects, snag lists, and handyman services',
    icon: 'ClipboardCheck',
    subcategories: [
      'Property Inspection',
      'Electrical Safety Inspection',
      'Plumbing Inspection',
      'Annual Home Maintenance',
      'Preventive Maintenance',
      'Snag List Inspection',
      'Rental Property Check',
      'General Handyman Services'
    ]
  }
];

export const MOCK_PROFESSIONALS: ProfessionalProfile[] = [];

export const MOCK_BOOKINGS: Booking[] = [];

export const MOCK_REVIEWS: Review[] = [];

interface AppState {
  currentUser: User | ProfessionalProfile | null;
  categories: ServiceCategory[];
  professionals: ProfessionalProfile[];
  bookings: Booking[];
  reviews: Review[];
  savedProfessionals: string[];
  customers: User[];
  listenersInitialized?: boolean;
  initializeFromFirestore: () => Promise<void>;
  login: (emailOrPhone: string, role?: Role, name?: string, additionalDetails?: any) => void;
  logout: () => void;
  bookService: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  toggleSavedProfessional: (proId: string) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status'], professionalId?: string) => void;
  addProfessionalService: (proId: string, service: any) => void;
  updateUserProfile: (profile: Partial<User & ProfessionalProfile>) => void;
  updateCustomer: (id: string, updated: Partial<User>) => void;
  deleteCustomer: (id: string) => void;
  updateProfessional: (id: string, updated: Partial<ProfessionalProfile>) => void;
  deleteProfessional: (id: string) => void;
  deleteBooking: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: (() => {
    try {
      const saved = localStorage.getItem('goservik_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })(),
  categories: MOCK_CATEGORIES,
  professionals: MOCK_PROFESSIONALS,
  bookings: MOCK_BOOKINGS,
  reviews: MOCK_REVIEWS,
  savedProfessionals: [],
  customers: MOCK_CUSTOMERS,
  listenersInitialized: false,
  
  login: (emailOrPhone, role, name, additionalDetails) => set((state) => {
    const isEmail = emailOrPhone.includes('@');
    const cleanedIdentifier = emailOrPhone.trim();

    // Admin login
    if (cleanedIdentifier.toLowerCase() === 'admin@goservik.com' || cleanedIdentifier.toLowerCase() === 'admin') {
      const adminUser = {
        id: 'admin-1',
        name: name || 'Platform Admin',
        email: 'admin@goservik.com',
        role: 'admin' as const,
        joinedAt: new Date().toISOString()
      };
      localStorage.setItem('goservik_user', JSON.stringify(adminUser));
      return {
        currentUser: adminUser
      };
    }

    const finalRole = role || 'customer';

    // Normalize phone numbers for checks
    let extractedPhone = '';
    if (cleanedIdentifier.endsWith('@goservik.com')) {
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
      if (searchPhone && uPhone === searchPhone) return true;
      if (additionalDetails?.mobile) {
        const inputPhone = additionalDetails.mobile.replace(/\D/g, '');
        if (inputPhone && uPhone === inputPhone) return true;
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
        return pPhone === cleanPhoneToCheck && pEmail !== emailToIgnore;
      });

      const duplicateCustPhone = state.customers.find(c => {
        const cPhone = (c.mobile || '').replace(/\D/g, '');
        const cEmail = (c.email || '').toLowerCase();
        return cPhone === cleanPhoneToCheck && cEmail !== emailToIgnore;
      });

      if (duplicateProPhone || duplicateCustPhone) {
        throw new Error("This mobile number is already linked to another registered account. One login per unique phone number is allowed.");
      }
    }

    // 3. Handle Professional Login/Registration
    if (finalRole === 'professional') {
      const existingPro = state.professionals.find(matchesEmailOrPhone);
      if (existingPro) {
        localStorage.setItem('goservik_user', JSON.stringify(existingPro));
        return { currentUser: existingPro };
      }

      const proCategory = additionalDetails?.category || 'cat-1';
      const catObj = state.categories.find(c => c.id === proCategory);
      
      const newPro: ProfessionalProfile = {
        id: additionalDetails?.uid || `pro-${Date.now()}`,
        uid: additionalDetails?.uid || undefined,
        name: additionalDetails?.companyName || name || cleanedIdentifier.split('@')[0],
        personalName: name || cleanedIdentifier.split('@')[0],
        email: isEmail ? cleanedIdentifier : `${cleanedIdentifier}@goservik.com`,
        role: 'professional',
        joinedAt: new Date().toISOString(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
        verified: true,
        tagline: additionalDetails?.companyName ? `Partner with ${additionalDetails.companyName}` : 'Verified Partner',
        bio: 'Dedicated independent professional registered on GoServik.',
        location: additionalDetails?.city ? `${additionalDetails.city}, ${additionalDetails.state || ''}` : '',
        serviceRadiusKm: additionalDetails?.serviceRadiusKm || 10,
        languages: ['English', 'Hindi'],
        coordinates: additionalDetails?.coordinates || undefined,
        services: [
          {
            id: `srv-${Date.now()}`,
            categoryId: proCategory,
            name: catObj ? `${catObj.name} Expert Services` : 'General Service',
            description: 'Standard high-quality service package.',
            basePrice: 99,
            priceUnit: 'fixed',
            experienceYears: 5,
            subcategories: catObj ? [catObj.subcategories[0]] : []
          }
        ],
        gallery: [],
        certifications: ['Verified GoServik Partner'],
        workingHours: {
          Monday: '09:00 - 18:00',
          Tuesday: '09:00 - 18:00',
          Wednesday: '09:00 - 18:00',
          Thursday: '09:00 - 18:00',
          Friday: '09:00 - 18:00',
          Saturday: '10:00 - 16:00',
          Sunday: 'Closed'
        },
        responseTime: 'Responds within 2 hours',
        availabilityStatus: 'available',
        rating: 5.0,
        reviewCount: 0,
        jobsCompleted: 0,
        // Detailed parameters
        companyName: additionalDetails?.companyName || '',
        mobile: phoneToCheck || '',
        dob: additionalDetails?.dob || '',
        country: additionalDetails?.country || '',
        state: additionalDetails?.state || '',
        city: additionalDetails?.city || '',
        pincode: additionalDetails?.pincode || '',
        addressLine: additionalDetails?.addressLine || '',
        landmark: additionalDetails?.landmark || ''
      };

      setDoc(doc(db, 'professionals', newPro.id), newPro).catch(err => 
        console.warn("Firestore professional login write failed", err)
      );

      localStorage.setItem('goservik_user', JSON.stringify(newPro));
      return {
        professionals: [...state.professionals, newPro],
        currentUser: newPro
      };
    }

    // 4. Default to Customer Login/Registration
    const existingCustomer = state.customers.find(matchesEmailOrPhone);
    if (existingCustomer) {
      localStorage.setItem('goservik_user', JSON.stringify(existingCustomer));
      return { currentUser: existingCustomer };
    }

    const mockCustomer: User = {
      id: additionalDetails?.uid || `cust-${Date.now()}`,
      uid: additionalDetails?.uid || undefined,
      name: name || cleanedIdentifier.split('@')[0],
      email: isEmail ? cleanedIdentifier : `${cleanedIdentifier}@goservik.com`,
      role: 'customer',
      joinedAt: new Date().toISOString(),
      companyName: '',
      mobile: phoneToCheck || '',
      dob: additionalDetails?.dob || '',
      country: additionalDetails?.country || '',
      state: additionalDetails?.state || '',
      city: additionalDetails?.city || '',
      pincode: additionalDetails?.pincode || '',
      addressLine: additionalDetails?.addressLine || '',
      landmark: additionalDetails?.landmark || '',
      coordinates: additionalDetails?.coordinates || undefined
    };

    setDoc(doc(db, 'customers', mockCustomer.id), mockCustomer).catch(err => 
      console.warn("Firestore customer login write failed", err)
    );

    localStorage.setItem('goservik_user', JSON.stringify(mockCustomer));
    return { 
      customers: [...state.customers, mockCustomer],
      currentUser: mockCustomer 
    };
  }),
  
  logout: () => {
    localStorage.removeItem('goservik_user');
    signOut(auth).catch((err) => {
      console.warn("Firebase signOut failed", err);
    });
    set({ currentUser: null });
  },
  
  initializeFromFirestore: async () => {
    try {
      // 0. Purge all pre-existing mock/user data once to guarantee clean sync
      const isPurged = localStorage.getItem('goservik_data_purged_v2');
      if (!isPurged) {
        const collectionsToPurge = ['customers', 'professionals', 'bookings', 'reviews'];
        for (const colName of collectionsToPurge) {
          try {
            const snap = await getDocs(collection(db, colName));
            for (const docObj of snap.docs) {
              await deleteDoc(doc(db, colName, docObj.id));
            }
          } catch (e) {
            console.warn(`Failed to purge ${colName} during database clear`, e);
          }
        }
        localStorage.setItem('goservik_data_purged_v2', 'true');
      }

      // 1. Fetch Categories
      const catSnap = await getDocs(collection(db, 'categories'));
      let loadedCategories = catSnap.docs.map(doc => doc.data() as ServiceCategory);
      if (loadedCategories.length === 0) {
        for (const cat of MOCK_CATEGORIES) {
          await setDoc(doc(db, 'categories', cat.id), cat);
        }
        loadedCategories = MOCK_CATEGORIES;
      }

      // 2. Fetch Professionals
      const proSnap = await getDocs(collection(db, 'professionals'));
      let loadedProfessionals = proSnap.docs.map(doc => doc.data() as ProfessionalProfile);
      if (loadedProfessionals.length === 0 && MOCK_PROFESSIONALS.length > 0) {
        for (const pro of MOCK_PROFESSIONALS) {
          await setDoc(doc(db, 'professionals', pro.id), pro);
        }
        loadedProfessionals = MOCK_PROFESSIONALS;
      }

      // 3. Fetch Bookings
      const bkSnap = await getDocs(collection(db, 'bookings'));
      const loadedBookings = bkSnap.docs.map(doc => doc.data() as Booking);

      // 4. Fetch Reviews
      const revSnap = await getDocs(collection(db, 'reviews'));
      let loadedReviews = revSnap.docs.map(doc => doc.data() as Review);
      if (loadedReviews.length === 0 && MOCK_REVIEWS.length > 0) {
        for (const rev of MOCK_REVIEWS) {
          await setDoc(doc(db, 'reviews', rev.id), rev);
        }
        loadedReviews = MOCK_REVIEWS;
      }

      // 5. Fetch Customers
      const custSnap = await getDocs(collection(db, 'customers'));
      let loadedCustomers = custSnap.docs.map(doc => doc.data() as User);
      if (loadedCustomers.length === 0 && MOCK_CUSTOMERS.length > 0) {
        for (const cust of MOCK_CUSTOMERS) {
          await setDoc(doc(db, 'customers', cust.id), cust);
        }
        loadedCustomers = MOCK_CUSTOMERS;
      }

      set({
        categories: loadedCategories,
        professionals: loadedProfessionals,
        bookings: loadedBookings,
        reviews: loadedReviews,
        customers: loadedCustomers
      });

      // 6. Set up real-time snapshot listeners (avoiding duplicates)
      const currentState = useStore.getState();
      if (!currentState.listenersInitialized) {
        onSnapshot(collection(db, 'bookings'), (snapshot) => {
          const liveBookings = snapshot.docs.map(doc => doc.data() as Booking);
          // Sort or update bookings state
          set({ bookings: liveBookings });
        });

        onSnapshot(collection(db, 'customers'), (snapshot) => {
          const liveCustomers = snapshot.docs.map(doc => doc.data() as User);
          set({ customers: liveCustomers });
          const current = useStore.getState().currentUser;
          if (current && current.role === 'customer') {
            const updatedMe = liveCustomers.find(c => c.id === current.id);
            if (updatedMe) {
              set({ currentUser: updatedMe });
              localStorage.setItem('goservik_user', JSON.stringify(updatedMe));
            }
          }
        });

        onSnapshot(collection(db, 'professionals'), (snapshot) => {
          const liveProfessionals = snapshot.docs.map(doc => doc.data() as ProfessionalProfile);
          set({ professionals: liveProfessionals });
          const current = useStore.getState().currentUser;
          if (current && current.role === 'professional') {
            const updatedMe = liveProfessionals.find(p => p.id === current.id);
            if (updatedMe) {
              set({ currentUser: updatedMe });
              localStorage.setItem('goservik_user', JSON.stringify(updatedMe));
            }
          }
        });

        onSnapshot(collection(db, 'categories'), (snapshot) => {
          const liveCategories = snapshot.docs.map(doc => doc.data() as ServiceCategory);
          set({ categories: liveCategories });
        });

        onSnapshot(collection(db, 'reviews'), (snapshot) => {
          const liveReviews = snapshot.docs.map(doc => doc.data() as Review);
          set({ reviews: liveReviews });
        });

        set({ listenersInitialized: true });
      }
    } catch (err) {
      console.warn("Firestore initialization failed, using mock data fallback", err);
    }
  },
  
  bookService: async (booking) => {
    const newBooking = {
      ...booking,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending' as const
    };
    
    set((state) => ({
      bookings: [...state.bookings, newBooking]
    }));

    try {
      await setDoc(doc(db, 'bookings', newBooking.id), newBooking);
    } catch (err) {
      console.error("Firestore booking write failed", err);
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

  updateBookingStatus: async (bookingId, status, professionalId) => {
    let updatedBooking: Booking | undefined;

    set((state) => {
      const updatedList = state.bookings.map(b => {
        if (b.id === bookingId) {
          updatedBooking = { ...b, status, ...(professionalId ? { professionalId } : {}) };
          return updatedBooking;
        }
        return b;
      });
      return { bookings: updatedList };
    });

    if (updatedBooking) {
      try {
        await setDoc(doc(db, 'bookings', bookingId), updatedBooking);
      } catch (err) {
        console.error("Firestore booking status update failed", err);
      }
    }
  },

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
        await setDoc(doc(db, 'professionals', proId), proObj);
      } catch (err) {
        console.error("Firestore professional service write failed", err);
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
      localStorage.setItem('goservik_user', JSON.stringify(updatedUser));
      try {
        if (isPro && updatedPro) {
          await setDoc(doc(db, 'professionals', updatedUser.id), updatedPro);
        } else if (!isPro && updatedCust) {
          await setDoc(doc(db, 'customers', updatedUser.id), updatedCust);
        }
      } catch (err) {
        console.error("Firestore user profile update failed", err);
      }
    }
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
        await setDoc(doc(db, 'customers', id), targetCustomer);
      } catch (err) {
        console.error("Firestore customer update failed", err);
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
      await deleteDoc(doc(db, 'customers', id));
    } catch (err) {
      console.error("Firestore customer delete failed", err);
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
        await setDoc(doc(db, 'professionals', id), targetPro);
      } catch (err) {
        console.error("Firestore professional update failed", err);
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
      await deleteDoc(doc(db, 'professionals', id));
    } catch (err) {
      console.error("Firestore professional delete failed", err);
    }
  },

  deleteBooking: async (id) => {
    set((state) => {
      const updatedBookings = state.bookings.filter(b => b.id !== id);
      return {
        bookings: updatedBookings
      };
    });

    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (err) {
      console.error("Firestore booking delete failed", err);
    }
  }
}));
