import { create } from 'zustand';
import { User, ProfessionalProfile, ServiceCategory, Booking, Review, Message } from './types';

// Mock Data
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
        basePrice: 120,
        priceUnit: 'hourly',
        experienceYears: 15,
      },
      {
        id: 'srv-2',
        categoryId: 'cat-2',
        name: 'Fixture Installation',
        description: 'Installation of sinks, toilets, faucets, and showers.',
        basePrice: 80,
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
        basePrice: 500,
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
  login: (email: string) => void;
  logout: () => void;
  bookService: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  toggleSavedProfessional: (proId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  categories: MOCK_CATEGORIES,
  professionals: MOCK_PROFESSIONALS,
  bookings: [],
  reviews: MOCK_REVIEWS,
  savedProfessionals: [],
  
  login: (email) => set((state) => {
    // Mock login logic: if it's the sample pro email, log them in. Otherwise, create a mock customer.
    if (email === 'sample.pro@goservik.com') {
      return { currentUser: state.professionals.find(p => p.email === email) || null };
    }
    
    // Admin login
    if (email === 'admin@goservik.com') {
      return {
        currentUser: {
          id: 'admin-1',
          name: 'Platform Admin',
          email: 'admin@goservik.com',
          role: 'admin',
          joinedAt: new Date().toISOString()
        }
      }
    }

    // Default to customer
    const mockCustomer: User = {
      id: 'cust-current',
      name: email.split('@')[0],
      email,
      role: 'customer',
      joinedAt: new Date().toISOString()
    };
    return { currentUser: mockCustomer };
  }),
  
  logout: () => set({ currentUser: null }),
  
  bookService: (booking) => set((state) => ({
    bookings: [
      ...state.bookings,
      {
        ...booking,
        id: `bk-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
    ]
  })),

  toggleSavedProfessional: (proId) => set((state) => {
    const isSaved = state.savedProfessionals.includes(proId);
    return {
      savedProfessionals: isSaved 
        ? state.savedProfessionals.filter(id => id !== proId)
        : [...state.savedProfessionals, proId]
    };
  })
}));
