import { ProfessionalProfile, Booking, Review, IncentiveRule, PlatformConfig } from '../types';
import { ALL_DEMO_80_PROFESSIONALS } from './demoProfessionals';

export { ALL_DEMO_80_PROFESSIONALS };

export const DEMO_SAMPLE_TESTING_PRO: ProfessionalProfile = {
  id: 'pro-sample-testing',
  uid: 'uid-sample-testing',
  name: 'Sample Testing',
  personalName: 'Sample Testing (Master Technician)',
  email: 'sample.testing@kaamnow.com',
  mobile: '9876543210',
  city: 'New Delhi',
  state: 'Delhi',
  role: 'professional',
  verified: true,
  joinedAt: '2025-01-15T10:00:00.000Z',
  avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300',
  tagline: 'Certified Senior Multi-Trade Specialist | 7+ Years Experience',
  bio: 'Specializing in residential & commercial electrical setups, complex plumbing leaks, smart home CCTV installations, and appliance repairs. Dedicated to clean, safe, and punctual execution.',
  location: 'South Delhi & Noida',
  serviceRadiusKm: 25,
  coordinates: { lat: 28.5355, lng: 77.2410 }, // South Delhi
  languages: ['Hindi', 'English', 'Punjabi'],
  // KaamNow multi-category skills
  skills: [
    {
      categoryId: 'cat-electrical',
      categoryName: 'Electrical Services',
      subcategories: [
        'Wiring',
        'Switch/socket repair',
        'Fan installation',
        'MCB repair',
        'Inverter/battery service',
        'Electrical fault repair'
      ]
    },
    {
      categoryId: 'cat-plumbing',
      categoryName: 'Plumbing Services',
      subcategories: [
        'Faucet repair',
        'Pipe leakage repair',
        'Bathroom fittings',
        'Drain blockage removal',
        'Toilet/flush repair',
        'Water tank work'
      ]
    },
    {
      categoryId: 'cat-smarthome',
      categoryName: 'Smart Home & Security',
      subcategories: [
        'CCTV installation',
        'Video doorbell',
        'Smart lock',
        'Smart lighting',
        'Wi-Fi/network setup'
      ]
    }
  ],
  // Independent rates
  hourlyRate: 350,
  fourHourRate: 1200,
  fullDayRate: 2200,
  supportsDiagnosticVisit: true,
  services: [
    {
      id: 'srv-1',
      categoryId: 'cat-electrical',
      name: 'Electrical Inspection & Repair',
      description: 'Comprehensive electrical fault diagnostics, MCB repair and socket installation.',
      basePrice: 350,
      priceUnit: 'hourly',
      experienceYears: 7,
      subcategories: ['Switch/socket repair', 'Fan installation', 'MCB repair']
    },
    {
      id: 'srv-2',
      categoryId: 'cat-plumbing',
      name: 'Plumbing & Leakage Fixes',
      description: 'Emergency pipe leakage sealing, faucet replacements, and drain blockage clearing.',
      basePrice: 350,
      priceUnit: 'hourly',
      experienceYears: 7,
      subcategories: ['Faucet repair', 'Pipe leakage repair', 'Drain blockage removal']
    },
    {
      id: 'srv-3',
      categoryId: 'cat-smarthome',
      name: 'Smart Home & CCTV Setup',
      description: 'Installation of high-definition CCTV security cameras, video doorbells and smart locks.',
      basePrice: 450,
      priceUnit: 'hourly',
      experienceYears: 5,
      subcategories: ['CCTV installation', 'Smart lock', 'Video doorbell']
    }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600'
  ],
  certifications: [
    'Government Certified Wireman License (Class A)',
    'Advanced Plumbing & Sanitary Standards Certificate',
    'Certified Smart Home Automation Associate'
  ],
  workingHours: {
    Mon: '08:00 - 20:00',
    Tue: '08:00 - 20:00',
    Wed: '08:00 - 20:00',
    Thu: '08:00 - 20:00',
    Fri: '08:00 - 20:00',
    Sat: '09:00 - 19:00',
    Sun: '10:00 - 16:00'
  },
  responseTime: 'Within 20 minutes',
  availabilityStatus: 'available',
  rating: 4.9,
  reviewCount: 48,
  jobsCompleted: 154,
  satisfiesElderSafe: true,
  satisfiesWomenSafe: true,
  subscriptionStatus: 'active_free_tier',
  subscriptionQuarter: 1,
  calculatedMonthlySubscription: 110, // 100 + (5.0 - 4.9)*100 = 110
  earnedIncentivesTotal: 3500
};

export const DEMO_SECONDARY_PROS: ProfessionalProfile[] = [
  {
    id: 'pro-rajesh-sharma',
    uid: 'uid-rajesh-sharma',
    name: 'Rajesh Sharma',
    personalName: 'Rajesh Sharma (Senior Carpenter)',
    email: 'rajesh.carpentry@kaamnow.com',
    mobile: '9811223344',
    city: 'New Delhi',
    state: 'Delhi',
    role: 'professional',
    verified: true,
    joinedAt: '2025-02-01T10:00:00.000Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    tagline: 'Master Carpenter | Modular Furniture & Custom Woodwork',
    bio: '10 years crafting modular wardrobes, kitchen cabinets, door repairs and hardwood restorations.',
    location: 'Central & West Delhi',
    serviceRadiusKm: 20,
    coordinates: { lat: 28.6139, lng: 77.2090 },
    languages: ['Hindi', 'English'],
    skills: [
      {
        categoryId: 'cat-carpentry',
        categoryName: 'Carpentry & Woodwork',
        subcategories: [
          'Door repair',
          'Lock/hinge work',
          'Furniture assembly',
          'Wardrobe work',
          'Modular furniture',
          'Custom woodwork'
        ]
      }
    ],
    hourlyRate: 300,
    fourHourRate: 1050,
    fullDayRate: 1900,
    supportsDiagnosticVisit: true,
    services: [],
    gallery: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=600'
    ],
    certifications: ['National Skill Development Council (NSDC) Woodcraft'],
    workingHours: { Mon: '09:00 - 19:00' },
    responseTime: 'Within 30 minutes',
    availabilityStatus: 'available',
    rating: 4.8,
    reviewCount: 32,
    jobsCompleted: 89,
    satisfiesElderSafe: true,
    satisfiesWomenSafe: true,
    subscriptionStatus: 'active_free_tier',
    subscriptionQuarter: 1,
    calculatedMonthlySubscription: 120
  },
  {
    id: 'pro-priya-cleaning',
    uid: 'uid-priya-cleaning',
    name: 'Priya Verma',
    personalName: 'Priya Verma (Deep Cleaning Lead)',
    email: 'priya.cleaning@kaamnow.com',
    mobile: '9822334455',
    city: 'New Delhi',
    state: 'Delhi',
    role: 'professional',
    verified: true,
    joinedAt: '2025-02-10T10:00:00.000Z',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    tagline: 'Eco-Friendly Residential & Commercial Deep Cleaning Expert',
    bio: 'Specialist in full-home deep sanitization, sofa fabric shampooing, kitchen degreasing, and water tank hygiene.',
    location: 'South Delhi & Gurgaon',
    serviceRadiusKm: 25,
    coordinates: { lat: 28.4595, lng: 77.0266 },
    languages: ['Hindi', 'English'],
    skills: [
      {
        categoryId: 'cat-cleaning',
        categoryName: 'Home Cleaning & Sanitization',
        subcategories: [
          'Full home deep cleaning',
          'Sofa cleaning',
          'Kitchen cleaning',
          'Bathroom sanitization',
          'Water tank cleaning'
        ]
      }
    ],
    hourlyRate: 400,
    fourHourRate: 1400,
    fullDayRate: 2600,
    supportsDiagnosticVisit: false,
    services: [],
    gallery: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'
    ],
    certifications: ['Hospital Grade Sanitization Certified'],
    workingHours: { Mon: '08:00 - 18:00' },
    responseTime: 'Within 15 minutes',
    availabilityStatus: 'available',
    rating: 4.95,
    reviewCount: 64,
    jobsCompleted: 140,
    satisfiesElderSafe: true,
    satisfiesWomenSafe: true,
    subscriptionStatus: 'active_free_tier',
    subscriptionQuarter: 1,
    calculatedMonthlySubscription: 105
  }
];

export const DEMO_SAMPLE_TESTING_REVIEWS: Review[] = [
  {
    id: 'rev-sample-1',
    bookingId: 'bk-test-1',
    customerId: 'cust-demo-1',
    customerName: 'Amit Saxena',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    professionalId: 'pro-sample-testing',
    rating: 5,
    text: 'Sample Testing arrived right on time! Fixed our main tripping MCB and installed two ceiling fans cleanly without any wall chipping. Very polite and professional.',
    serviceSpecificFeedback: 'Prompt diagnosis, clean wiring, transparent hourly charges.',
    createdAt: '2025-02-18T14:30:00.000Z'
  },
  {
    id: 'rev-sample-2',
    bookingId: 'bk-test-2',
    customerId: 'cust-demo-2',
    customerName: 'Meenakshi Iyer',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    professionalId: 'pro-sample-testing',
    rating: 5,
    text: 'Great plumbing job. Resolved a stubborn underground pipe leak that three other handymen failed to diagnose. Highly recommend Sample Testing on KaamNow!',
    serviceSpecificFeedback: 'Expert leak detection, high precision tooling.',
    createdAt: '2025-02-22T16:00:00.000Z'
  },
  {
    id: 'rev-sample-3',
    bookingId: 'bk-test-3',
    customerId: 'cust-demo-3',
    customerName: 'Sunil Mathur',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    professionalId: 'pro-sample-testing',
    rating: 4.8,
    text: 'Installed 4 CCTV security cameras across our driveway and configured the mobile phone viewer in 2 hours. Very trustworthy and patient with senior citizens.',
    serviceSpecificFeedback: 'Clean cabling, friendly guidance on app controls.',
    createdAt: '2025-02-28T11:20:00.000Z'
  }
];

export const DEMO_SAMPLE_TESTING_BOOKINGS: Booking[] = [
  {
    id: 'bk-test-sample-active',
    customerId: 'cust-demo-1',
    customerName: 'Vikram Malhotra',
    customerMobile: '9899112233',
    customerAddress: 'Flat 402, Lotus Tower, Sector 62, Noida, UP 201309',
    structuredAddress: {
      houseNumber: 'Flat 402',
      buildingStreet: 'Lotus Tower',
      areaLocality: 'Sector 62',
      landmark: 'Near Fortis Hospital',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201309',
      contactPhone: '9899112233',
      addressLabel: 'Home',
      coordinates: { lat: 28.6279, lng: 77.3719 }
    },
    professionalId: 'pro-sample-testing',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical Services',
    selectedSubcategories: ['Fan installation', 'Switch/socket repair'],
    coordinates: { lat: 28.6279, lng: 77.3719 },
    date: '2025-03-10',
    time: '11:00 AM',
    status: 'scheduled',
    statusHistory: [
      { status: 'submitted', timestamp: '2025-03-05T09:00:00.000Z', note: 'Customer requested service' },
      { status: 'pro_selected', timestamp: '2025-03-05T09:05:00.000Z', note: 'Matched with Sample Testing' },
      { status: 'accepted', timestamp: '2025-03-05T09:12:00.000Z', note: 'Sample Testing confirmed the job' },
      { status: 'scheduled', timestamp: '2025-03-05T09:15:00.000Z', note: 'Appointment finalized for March 10' }
    ],
    notes: 'Two fans need to be mounted in bedrooms, and 1 bedroom switchboard sparking.',
    urgency: 'normal',
    safetyPreferences: { elderSafe: true, womenSafe: true },
    totalPrice: 700,
    platformFee: 35, // 5%
    workProtectionApplied: true,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    createdAt: '2025-03-05T09:00:00.000Z'
  }
];

export const INITIAL_INCENTIVE_RULES: IncentiveRule[] = [
  {
    id: 'inc-milestone-10',
    title: '10 Jobs Milestone Bonus',
    description: 'Earn a cash reward of ₹1,000 for completing 10 high-quality jobs with 4.5+ average rating.',
    minCompletedJobs: 10,
    minRating: 4.5,
    bonusAmount: 1000,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    active: true
  },
  {
    id: 'inc-top-rated',
    title: 'Top Rated Star Performer',
    description: 'Maintain 4.8+ rating across 25+ completed bookings to receive ₹2,500 monthly performance incentive.',
    minCompletedJobs: 25,
    minRating: 4.8,
    bonusAmount: 2500,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    active: true
  }
];

export const INITIAL_PLATFORM_CONFIG: PlatformConfig = {
  platformFeePercent: 5,
  diagnosticFee: 99,
  currentQuarter: 1, // First 3 quarters free
  workProtectionEnabled: true,
  workProtectionLimit: 10000
};
