export type Role = 'customer' | 'professional' | 'admin';

export type Language = 'en' | 'hi';

export interface ServiceAddress {
  houseNumber?: string;
  houseFlat?: string;
  buildingStreet: string;
  areaLocality: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  contactPhone: string;
  addressLabel?: 'Home' | 'Office' | 'Other';
  coordinates: { lat: number; lng: number };
}

export interface User {
  id: string;
  uid?: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  joinedAt: string;
  // Detailed Profile and Address Fields
  mobile?: string;
  dob?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  addressLine?: string;
  landmark?: string;
  companyName?: string;
  personalName?: string;
  coordinates?: { lat: number; lng: number };
  savedAddresses?: ServiceAddress[];
  isProfileComplete?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  hindiName?: string;
  description: string;
  hindiDescription?: string;
  icon: string;
  subcategories: string[];
  diagnosticFeeSupported?: boolean;
}

export interface ProfessionalService {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  priceUnit: 'hourly' | 'fixed' | 'starting_at';
  experienceYears: number;
  subcategories: string[];
}

export interface CategorySkillMapping {
  categoryId: string;
  categoryName: string;
  subcategories: string[];
}

export interface ProfessionalProfile extends User {
  role: 'professional';
  verified: boolean;
  tagline: string;
  bio: string;
  location: string;
  serviceRadiusKm: number;
  languages: string[];
  services: ProfessionalService[];
  // KaamNow multi-category skill selections
  skills: CategorySkillMapping[];
  // Independent rates
  hourlyRate: number;
  fourHourRate?: number;
  fullDayRate?: number; // 8 hours
  supportsDiagnosticVisit?: boolean;
  gallery: string[];
  certifications: string[];
  workingHours: Record<string, string>;
  responseTime: string;
  availabilityStatus: 'available' | 'busy' | 'offline';
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  // Safety badges
  satisfiesElderSafe?: boolean;
  satisfiesWomenSafe?: boolean;
  // Subscription & incentives
  subscriptionStatus?: 'active_free_tier' | 'active_paid' | 'grace_period';
  subscriptionQuarter?: number;
  calculatedMonthlySubscription?: number;
  earnedIncentivesTotal?: number;
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'draft'
  | 'submitted'
  | 'matching'
  | 'pro_selected'
  | 'accepted'
  | 'scheduled'
  | 'in_transit'
  | 'arrived'
  | 'diagnostic_in_progress'
  | 'work_in_progress'
  | 'in_progress'
  | 'completed'
  | 'reviewed'
  | 'cancelled'
  | 'rejected'
  | 'expired'
  | 'disputed';

export interface BookingStatusHistoryItem {
  status: BookingStatus;
  timestamp: string;
  note?: string;
  actorId?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  professionalId?: string;
  serviceId?: string;
  categoryId?: string;
  categoryName?: string;
  serviceTitle?: string;
  selectedSubcategories: string[];
  coordinates?: { lat: number; lng: number };
  date: string;
  time: string;
  status: BookingStatus;
  statusHistory?: BookingStatusHistoryItem[];
  notes: string;
  urgency?: 'normal' | 'urgent' | 'emergency';
  photos?: string[];
  safetyPreferences?: {
    elderSafe?: boolean;
    womenSafe?: boolean;
  };
  totalPrice: number;
  isDiagnosticBooking?: boolean;
  diagnosticFee?: number;
  platformFee?: number;
  workProtectionApplied?: boolean;
  createdAt: string;
  customerName?: string;
  customerMobile?: string;
  customerEmail?: string;
  customerAddress?: string;
  structuredAddress?: ServiceAddress;
  customerServiceOpted?: string;
  paymentMethod?: 'cash' | 'razorpay';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  paymentStatus?: 'pending' | 'paid';
  professionalName?: string;
  subcategories?: string[];
  scheduledDate?: string;
  timeSlot?: string;
  serviceAddress?: ServiceAddress;
  deliveryAddress?: string;
  deliveryCoordinates?: { lat: number; lng: number };
  preferElderSafe?: boolean;
  preferWomenSafe?: boolean;
  basePrice?: number;
  rateType?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  professionalId: string;
  rating: number;
  text: string;
  serviceSpecificFeedback?: string;
  createdAt: string;
  customerName: string;
  customerAvatar?: string;
}

export interface Message {
  id: string;
  bookingId?: string;
  senderId: string;
  receiverId: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  read: boolean;
}

export interface IncentiveRule {
  id: string;
  title: string;
  description: string;
  minCompletedJobs: number;
  minRating: number;
  bonusAmount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface WorkProtectionPolicy {
  coverageLimit: number;
  termsUrl: string;
  claimWindowDays: number;
  active: boolean;
  description: string;
}

export interface PlatformConfig {
  platformFeePercent: number; // 5%
  diagnosticFee: number; // ₹99
  currentQuarter: number; // 1, 2, 3: free; 4+: formula
  workProtectionEnabled: boolean;
  workProtectionLimit: number; // ₹10,000
}
