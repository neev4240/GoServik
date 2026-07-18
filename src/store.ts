import { create } from 'zustand';
import { User, ProfessionalProfile, ServiceCategory, Booking, Review, Message, Role } from './types';
import { db } from './lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

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
    companyName: '',
    coordinates: { lat: 19.0760, lng: 72.8777 }
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
    companyName: '',
    coordinates: { lat: 12.9716, lng: 77.5946 }
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
    companyName: '',
    coordinates: { lat: 28.6139, lng: 77.2090 }
  }
];

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

export const MOCK_PROFESSIONALS: ProfessionalProfile[] = [
  {
    id: 'pro-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@goservik.com',
    role: 'professional',
    joinedAt: '2023-01-15T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
    verified: true,
    tagline: 'Master Plumber & Home Repair Specialist',
    bio: 'With over 15 years of experience in residential and commercial plumbing, I pride myself on delivering top-quality service, clear communication, and transparent pricing.',
    location: 'Mumbai, Maharashtra',
    serviceRadiusKm: 15,
    languages: ['English', 'Hindi'],
    coordinates: { lat: 19.0760, lng: 72.8777 },
    services: [
      {
        id: 'srv-1',
        categoryId: 'cat-2',
        name: 'Plumbing Repair & Fixture Installation',
        description: 'Comprehensive plumbing inspection and leak rectification.',
        basePrice: 99,
        priceUnit: 'fixed',
        experienceYears: 15,
        subcategories: ['Tap & Faucet Repair', 'Pipe Leakage', 'Bathroom Fittings', 'Kitchen Plumbing']
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=600'
    ],
    certifications: ['Licensed Master Plumber', 'Advanced Water Systems Certified'],
    workingHours: {
      Monday: '08:00 - 18:00',
      Tuesday: '08:00 - 18:00',
      Wednesday: '08:00 - 18:00',
      Thursday: '08:00 - 18:00',
      Friday: '08:00 - 16:00',
      Saturday: 'Closed',
      Sunday: 'Closed'
    },
    responseTime: 'Responds within 1 hour',
    availabilityStatus: 'available',
    rating: 4.9,
    reviewCount: 128,
    jobsCompleted: 350,
  },
  {
    id: 'pro-2',
    name: 'Emma Watson',
    email: 'emma@goservik.com',
    role: 'professional',
    joinedAt: '2023-05-20T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    verified: true,
    tagline: 'Senior Electrical Engineer & Smart Solutions',
    bio: 'Dedicated home automation and electrical wiring service technician covering the complete suburbs with prompt diagnostic checks.',
    location: 'Mumbai, Maharashtra',
    serviceRadiusKm: 25,
    languages: ['English', 'Hindi'],
    coordinates: { lat: 19.0522, lng: 72.8800 },
    services: [
      {
        id: 'srv-3',
        categoryId: 'cat-1',
        name: 'Electrical Diagnostics & Smart Installations',
        description: 'Complete inspection and setups of MCBs, switchboards and lightings.',
        basePrice: 99,
        priceUnit: 'fixed',
        experienceYears: 8,
        subcategories: ['Wiring', 'Switches & Sockets', 'Fan Installation', 'Lighting', 'MCB & Distribution Boards']
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600'
    ],
    certifications: ['Certified Smart Home Tech'],
    workingHours: {
      Monday: '10:00 - 18:00',
      Tuesday: '10:00 - 18:00',
      Wednesday: '10:00 - 18:00',
      Thursday: '10:00 - 18:00',
      Friday: '10:00 - 18:00',
      Saturday: '10:00 - 14:00',
      Sunday: 'Closed'
    },
    responseTime: 'Responds within 2 hours',
    availabilityStatus: 'available',
    rating: 4.8,
    reviewCount: 45,
    jobsCompleted: 90,
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-mock-1',
    customerId: 'cust-neev',
    status: 'pending',
    notes: 'Need expert checkup for pipe leakage and tap repairs.',
    totalPrice: 99,
    createdAt: new Date().toISOString(),
    customerName: 'Neev Aggarwal',
    customerMobile: '9876543210',
    customerAddress: 'Flat 402, Green Avenue, Mumbai, Maharashtra, 400001',
    customerServiceOpted: 'Plumbing Services (Pipe Leakage, Tap & Faucet Repair)',
    categoryId: 'cat-2',
    selectedSubcategories: ['Tap & Faucet Repair', 'Pipe Leakage'],
    coordinates: { lat: 19.0760, lng: 72.8777 },
    date: new Date().toISOString().split('T')[0],
    time: '10:30 AM'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    bookingId: 'bk-1',
    customerId: 'cust-1',
    professionalId: 'pro-1',
    rating: 5,
    text: 'Rajesh Kumar was incredibly professional and fixed our emergency leak in record time. Highly recommended!',
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
        return { currentUser: existingPro };
      }

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

      return {
        professionals: [...state.professionals, newPro],
        currentUser: newPro
      };
    }

    // 4. Default to Customer Login/Registration
    const existingCustomer = state.customers.find(matchesEmailOrPhone);
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

  updateBookingStatus: async (bookingId, status, professionalId) => {
    set((state) => ({
      bookings: state.bookings.map(b => 
        b.id === bookingId 
          ? { ...b, status, ...(professionalId ? { professionalId } : {}) } 
          : b
      )
    }));

    try {
      const updateData: any = { status };
      if (professionalId) {
        updateData.professionalId = professionalId;
      }
      await setDoc(doc(db, 'bookings', bookingId), updateData, { merge: true });
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
        const updatedCust = {
          ...state.customers.find(c => c.id === state.currentUser?.id),
          ...profile
        } as any;
        setDoc(doc(db, 'customers', state.currentUser.id), updatedCust).catch(err =>
          console.error("Firestore customer profile update failed", err)
        );
      }

      return {
        currentUser: updatedUser,
        professionals: state.professionals.map(p => p.id === state.currentUser?.id ? { ...p, ...profile } as any : p),
        customers: state.customers.map(c => c.id === state.currentUser?.id ? { ...c, ...profile } as any : c)
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
