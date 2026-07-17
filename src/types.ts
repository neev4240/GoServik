export type Role = 'customer' | 'professional' | 'admin';

export interface User {
  id: string;
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
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ProfessionalService {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  priceUnit: 'hourly' | 'fixed' | 'starting_at';
  experienceYears: number;
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
  gallery: string[];
  certifications: string[];
  workingHours: Record<string, string>;
  responseTime: string;
  availabilityStatus: 'available' | 'busy' | 'offline';
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
}

export interface Booking {
  id: string;
  customerId: string;
  professionalId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  totalPrice: number;
  createdAt: string;
  customerName?: string;
  customerMobile?: string;
  customerAddress?: string;
  customerServiceOpted?: string;
  paymentMethod?: 'cash' | 'razorpay';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  paymentStatus?: 'pending' | 'paid';
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  professionalId: string;
  rating: number;
  text: string;
  createdAt: string;
  customerName: string;
  customerAvatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}
