import { create } from 'zustand';
import { User, ProfessionalProfile, ServiceCategory, Booking, Review, Message, Role } from './types';
import { db } from './lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

// Mock Data
export const MOCK_CUSTOMERS: User[] = [
  {
    id: 'cust-neev',
    name: 'Neev Aggarwal',
    email: 'neevaggarwalji@gmail.com',
    role: 'customer',
    joinedAt: '2023-05-12T08:30:00Z',
    mobile: '9876543210',
    dob: '1995-08-25',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: '400001',
    addressLine: 'Flat 402, Green Avenue',
    landmark: 'Near Central Park',
    companyName: ''
  },
  {
    id: 'cust-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    role: 'customer',
    joinedAt: '2023-07-20T11:45:00Z',
    mobile: '9123456780',
    dob: '1992-03-14',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    pincode: '560066',
    addressLine: 'Villa 12, Palm Meadows',
    landmark: 'Gate No. 2',
    companyName: ''
  },
  {
    id: 'cust-michael',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'customer',
    joinedAt: '2023-09-05T14:15:00Z',
    mobile: '9876123456',
    dob: '1988-11-30',
    country: 'India',
    state: 'Delhi',
    city: 'New Delhi',
    pincode: '110001',
    addressLine: 'A-45, Connaught Place',
    landmark: 'Opposite Metro Station',
    companyName: ''
  }
];

export const MOCK_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-1', name: 'Home Cleaning', description: 'Deep cleaning, regular cleaning, move in/out', icon: 'Sparkles' },
  { id: 'cat-2', name: 'Plumbing', description: 'Repairs, installations, emergencies', icon: 'Wrench' },
  { id: 'cat-3', name: 'Electrical', description: 'Wiring, fixtures, inspections', icon: 'Zap' },
  { id: 'cat-4', name: 'Photography', description: 'Events, portraits, commercial', icon: 'Camera' },
  { id: 'cat-5', name: 'Tutoring', description: 'Math, languages, sciences', icon: 'GraduationCap' },
  { id: 'cat-6', name: 'Personal Training', description: 'Fitness, yoga, nutrition', icon: 'Dumbbell' },
  { id: 'cat-7', name: 'Landscaping', description: 'Gardening, lawn care, design', icon: 'TreePine' },
  { id: 'cat-8', name: 'IT Support', description: 'Troubleshooting, setup, networking', icon: 'Computer' },
];

export const MOCK_PROFESSIONALS: ProfessionalProfile[] = [
  {
    id: 'pro-1',
    name: 'Sample Testing',
    email: 'sample.pro@goservik.com',
    role: 'professional',
    joinedAt: '2023-01-15T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
    verified: true,
    tagline: 'Master Plumber & Home Repair Specialist',
    bio: 'With over 15 years of experience in residential and commercial plumbing, I pride myself on delivering top-quality service, clear communication, and transparent pricing. No job is too small, and emergencies are handled with priority.',
    location: 'London, UK',
    serviceRadiusKm: 50,
    languages: ['English', 'Spanish'],
    services: [
      {
        id: 'srv-1',
        categoryId: 'cat-2',
        name: 'Emergency Pipe Repair',
        description: '24/7 emergency service for burst or leaking pipes.',
        basePrice: 12000,
        priceUnit: 'hourly',
        experienceYears: 15,
      },
      {
        id: 'srv-2',
        categoryId: 'cat-2',
        name: 'Fixture Installation',
        description: 'Installation of sinks, toilets, faucets, and showers.',
        basePrice: 8000,
        priceUnit: 'fixed',
        experienceYears: 12,
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1607472586893-edb57cb3b3e1?auto=format&fit=crop&q=80&w=600'
    ],
    certifications: ['Licensed Master Plumber', 'Advanced Water Systems Certified'],
    workingHours: {
      Monday: '08:00 - 18:00',
      Tuesday: '08:00 - 18:00',
      Wednesday: '08:00 - 18:00',
      Thursday: '08:00 - 18:00',
      Friday: '08:00 - 16:00',
      Saturday: 'Emergency Only',
      Sunday: 'Closed'
    },
    responseTime: 'Usually responds within 1 hour',
    availabilityStatus: 'available',
    rating: 4.9,
    reviewCount: 128,
    jobsCompleted: 350,
  },
  {
    id: 'pro-2',
    name: 'Emma Watson',
    email: 'emma@photography.com',
    role: 'professional',
    joinedAt: '2023-05-20T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    verified: true,
    tagline: 'Professional Event & Portrait Photographer',
    bio: 'Capturing life\'s most precious moments. Specializing in natural light portraits and candid event photography.',
    location: 'Manchester, UK',
    serviceRadiusKm: 30,
    languages: ['English', 'French'],
    services: [
      {
        id: 'srv-3',
        categoryId: 'cat-4',
        name: 'Event Photography',
        description: 'Full coverage for weddings, parties, and corporate events.',
        basePrice: 50000,
        priceUnit: 'starting_at',
        experienceYears: 8,
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600'
    ],
    certifications: ['BFA in Photography'],
    workingHours: {
      Monday: '10:00 - 18:00',
      Tuesday: '10:00 - 18:00',
      Wednesday: '10:00 - 18:00',
      Thursday: '10:00 - 18:00',
      Friday: '10:00 - 18:00',
      Saturday: 'By Appointment',
      Sunday: 'By Appointment'
    },
    responseTime: 'Usually responds within 24 hours',
    availabilityStatus: 'busy',
    rating: 4.8,
    reviewCount: 45,
    jobsCompleted: 90,
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-mock-1',
    customerId: 'cust-neev',
    professionalId: 'pro-1',
    serviceId: 'srv-1',
    date: new Date().toISOString(),
    time: '10:30 AM',
    status: 'pending',
    notes: 'Please bring extra high pressure pipes for the garden installation. Sump pump needs a health check too.',
    totalPrice: 149,
    createdAt: new Date().toISOString(),
    customerName: 'Neev Aggarwal',
    customerMobile: '9876543210',
    customerAddress: 'Flat 402, Green Avenue, Landmark: Near Central Park, Mumbai, Maharashtra, 400001, India',
    customerServiceOpted: 'Emergency Leak Repair'
  },
  {
    id: 'bk-mock-2',
    customerId: 'cust-sarah',
    professionalId: 'pro-1',
    serviceId: 'srv-2',
    date: new Date(Date.now() + 86400000).toISOString(),
    time: '02:00 PM',
    status: 'confirmed',
    notes: 'Need standard kitchen sink and faucet replacement. Already purchased the mixer tap.',
    totalPrice: 99,
    createdAt: new Date().toISOString(),
    customerName: 'Sarah Jenkins',
    customerMobile: '9123456780',
    customerAddress: 'Villa 12, Palm Meadows, Landmark: Gate No. 2, Bengaluru, Karnataka, 560066, India',
    customerServiceOpted: 'Faucet & Sink Installation'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    bookingId: 'bk-1',
    customerId: 'cust-1',
    professionalId: 'pro-1',
    rating: 5,
    text: 'Sample Testing was incredibly professional and fixed our emergency leak in record time. Highly recommended!',
    createdAt: '2023-11-10T14:30:00Z',
    customerName: 'Sarah Jenkins',
    customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100'
  },
  {
    id: 'rev-2',
    bookingId: 'bk-2',
    customerId: 'cust-2',
    professionalId: 'pro-1',
    rating: 5,
    text: 'Great service, clear pricing, and left the place cleaner than he found it.',
    createdAt: '2023-10-05T09:15:00Z',
    customerName: 'Michael Chen'
  }
];

interface AppState {
  currentUser: User | ProfessionalProfile | null;
  categories: ServiceCategory[];
  professionals: ProfessionalProfile[];
  bookings: Booking[];
  reviews: Review[];
  savedProfessionals: string[];
  customers: User[];
  initializeFromFirestore: () => Promise<void>;
  login: (emailOrPhone: string, role?: Role, name?: string, additionalDetails?: any) => void;
  logout: () => void;
  bookService: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  toggleSavedProfessional: (proId: string) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  addProfessionalService: (proId: string, service: any) => void;
  updateUserProfile: (profile: Partial<User & ProfessionalProfile>) => void;
  updateCustomer: (id: string, updated: Partial<User>) => void;
  deleteCustomer: (id: string) => void;
  updateProfessional: (id: string, updated: Partial<ProfessionalProfile>) => void;
  deleteProfessional: (id: string) => void;
  deleteBooking: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  categories: MOCK_CATEGORIES,
  professionals: MOCK_PROFESSIONALS,
  bookings: MOCK_BOOKINGS,
  reviews: MOCK_REVIEWS,
  savedProfessionals: [],
  customers: MOCK_CUSTOMERS,
  
  login: (emailOrPhone, role, name, additionalDetails) => set((state) => {
    const isEmail = emailOrPhone.includes('@');
    const cleanedIdentifier = emailOrPhone.trim();

    // Check if it's an existing professional in mock
    const existingPro = state.professionals.find(p => 
      p.email.toLowerCase() === cleanedIdentifier.toLowerCase() || 
      p.id === cleanedIdentifier
    );
    if (existingPro) {
      return { currentUser: existingPro };
    }
    
    // Admin login
    if (cleanedIdentifier.toLowerCase() === 'admin@goservik.com' || cleanedIdentifier.toLowerCase() === 'admin') {
      return {
        currentUser: {
          id: 'admin-1',
          name: name || 'Platform Admin',
          email: 'admin@goservik.com',
          role: 'admin',
          joinedAt: new Date().toISOString()
        }
      };
    }

    const finalRole = role || 'customer';
    
    if (finalRole === 'professional') {
      const proCategory = additionalDetails?.category || 'cat-1';
      const catObj = state.categories.find(c => c.id === proCategory);
      
      const newPro: ProfessionalProfile = {
        id: `pro-${Date.now()}`,
        name: name || cleanedIdentifier.split('@')[0],
        email: isEmail ? cleanedIdentifier : `${cleanedIdentifier}@goservik.com`,
        role: 'professional',
        joinedAt: new Date().toISOString(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
        verified: true,
        tagline: additionalDetails?.companyName ? `Partner with ${additionalDetails.companyName}` : 'Verified Partner',
        bio: 'Dedicated independent professional registered on GoServik.',
        location: additionalDetails?.city ? `${additionalDetails.city}, ${additionalDetails.state || 'India'}` : 'Mumbai, India',
        serviceRadiusKm: 25,
        languages: ['English', 'Hindi'],
        services: [
          {
            id: `srv-${Date.now()}`,
            categoryId: proCategory,
            name: catObj ? `${catObj.name} Expert Services` : 'General Service',
            description: 'Standard high-quality service package.',
            basePrice: 99,
            priceUnit: 'fixed',
            experienceYears: 5
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
        mobile: additionalDetails?.mobile || '',
        dob: additionalDetails?.dob || '',
        country: additionalDetails?.country || 'India',
        state: additionalDetails?.state || '',
        city: additionalDetails?.city || '',
        pincode: additionalDetails?.pincode || '',
        addressLine: additionalDetails?.addressLine || '',
        landmark: additionalDetails?.landmark || ''
      };
      return {
        professionals: [...state.professionals, newPro],
        currentUser: newPro
      };
    }

    // Default to customer
    const existingCustomer = state.customers.find(c => c.email.toLowerCase() === cleanedIdentifier.toLowerCase());
    if (existingCustomer) {
      return { currentUser: existingCustomer };
    }

    const mockCustomer: User = {
      id: `cust-${Date.now()}`,
      name: name || cleanedIdentifier.split('@')[0],
      email: isEmail ? cleanedIdentifier : `${cleanedIdentifier}@goservik.com`,
      role: 'customer',
      joinedAt: new Date().toISOString(),
      companyName: '',
      mobile: additionalDetails?.mobile || '',
      dob: additionalDetails?.dob || '',
      country: additionalDetails?.country || 'India',
      state: additionalDetails?.state || '',
      city: additionalDetails?.city || '',
      pincode: additionalDetails?.pincode || '',
      addressLine: additionalDetails?.addressLine || '',
      landmark: additionalDetails?.landmark || ''
    };

    setDoc(doc(db, 'customers', mockCustomer.id), mockCustomer).catch(err => 
      console.warn("Firestore customer login write failed", err)
    );

    return { 
      customers: [...state.customers, mockCustomer],
      currentUser: mockCustomer 
    };
  }),
  
  logout: () => set({ currentUser: null }),
  
  initializeFromFirestore: async () => {
    try {
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
      if (loadedProfessionals.length === 0) {
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
      if (loadedReviews.length === 0) {
        for (const rev of MOCK_REVIEWS) {
          await setDoc(doc(db, 'reviews', rev.id), rev);
        }
        loadedReviews = MOCK_REVIEWS;
      }

      // 5. Fetch Customers
      const custSnap = await getDocs(collection(db, 'customers'));
      let loadedCustomers = custSnap.docs.map(doc => doc.data() as User);
      if (loadedCustomers.length === 0) {
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

  updateBookingStatus: async (bookingId, status) => {
    set((state) => ({
      bookings: state.bookings.map(b => b.id === bookingId ? { ...b, status } : b)
    }));

    try {
      await setDoc(doc(db, 'bookings', bookingId), { status }, { merge: true });
    } catch (err) {
      console.error("Firestore booking status update failed", err);
    }
  },

  addProfessionalService: async (proId, service) => {
    const newService = { ...service, id: `srv-${Date.now()}` };
    
    set((state) => {
      const updatedProfessionals = state.professionals.map(p => 
        p.id === proId 
          ? { ...p, services: [...p.services, newService] } 
          : p
      );
      
      const updatedCurrentUser = state.currentUser && state.currentUser.id === proId && state.currentUser.role === 'professional'
        ? { 
            ...state.currentUser, 
            services: [...(state.currentUser as ProfessionalProfile).services, newService] 
          }
        : state.currentUser;

      // Sync updated professional profile
      const proObj = updatedProfessionals.find(p => p.id === proId);
      if (proObj) {
        setDoc(doc(db, 'professionals', proId), proObj).catch(err => 
          console.error("Firestore professional service write failed", err)
        );
      }

      return {
        professionals: updatedProfessionals,
        currentUser: updatedCurrentUser
      };
    });
  },

  updateUserProfile: async (profile) => {
    set((state) => {
      if (!state.currentUser) return {};
      const updatedUser = { ...state.currentUser, ...profile } as any;
      const isPro = state.currentUser.role === 'professional';

      if (isPro) {
        const updatedPro = {
          ...state.professionals.find(p => p.id === state.currentUser?.id),
          ...profile
        } as any;
        setDoc(doc(db, 'professionals', state.currentUser.id), updatedPro).catch(err =>
          console.error("Firestore user profile update failed", err)
        );
      } else {
        setDoc(doc(db, 'active_sessions', state.currentUser.id), updatedUser).catch(err =>
          console.error("Firestore active session sync failed", err)
        );
      }

      return {
        currentUser: updatedUser,
        professionals: state.professionals.map(p => p.id === state.currentUser?.id ? { ...p, ...profile } as any : p)
      };
    });
  },

  updateCustomer: async (id, updated) => {
    set((state) => {
      const updatedCustomers = state.customers.map(c => c.id === id ? { ...c, ...updated } : c);
      const isCurrentUser = state.currentUser?.id === id;
      
      const target = updatedCustomers.find(c => c.id === id);
      if (target) {
        setDoc(doc(db, 'customers', id), target).catch(err =>
          console.error("Firestore customer update failed", err)
        );
      }
      
      return {
        customers: updatedCustomers,
        currentUser: isCurrentUser ? { ...state.currentUser, ...updated } as any : state.currentUser
      };
    });
  },

  deleteCustomer: async (id) => {
    set((state) => {
      const updatedCustomers = state.customers.filter(c => c.id !== id);
      const isCurrentUser = state.currentUser?.id === id;
      
      deleteDoc(doc(db, 'customers', id)).catch(err =>
        console.error("Firestore customer delete failed", err)
      );
      
      return {
        customers: updatedCustomers,
        currentUser: isCurrentUser ? null : state.currentUser
      };
    });
  },

  updateProfessional: async (id, updated) => {
    set((state) => {
      const updatedProfessionals = state.professionals.map(p => p.id === id ? { ...p, ...updated } as any : p);
      const isCurrentUser = state.currentUser?.id === id;
      
      const target = updatedProfessionals.find(p => p.id === id);
      if (target) {
        setDoc(doc(db, 'professionals', id), target).catch(err =>
          console.error("Firestore professional update failed", err)
        );
      }
      
      return {
        professionals: updatedProfessionals,
        currentUser: isCurrentUser ? { ...state.currentUser, ...updated } as any : state.currentUser
      };
    });
  },

  deleteProfessional: async (id) => {
    set((state) => {
      const updatedProfessionals = state.professionals.filter(p => p.id !== id);
      const isCurrentUser = state.currentUser?.id === id;
      
      deleteDoc(doc(db, 'professionals', id)).catch(err =>
        console.error("Firestore professional delete failed", err)
      );
      
      return {
        professionals: updatedProfessionals,
        currentUser: isCurrentUser ? null : state.currentUser
      };
    });
  },

  deleteBooking: async (id) => {
    set((state) => {
      const updatedBookings = state.bookings.filter(b => b.id !== id);
      
      deleteDoc(doc(db, 'bookings', id)).catch(err =>
        console.error("Firestore booking delete failed", err)
      );
      
      return {
        bookings: updatedBookings
      };
    });
  }
}));
