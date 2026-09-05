import { createClient } from '@supabase/supabase-js';
import { 
  User, 
  ProfessionalProfile, 
  ServiceCategory, 
  Booking, 
  Review, 
  IncentiveRule, 
  PlatformConfig 
} from '../types';

export const SUPABASE_PROJECT_ID = 'ltsnomiigobgihmgtsxi';

function normalizeSupabaseUrl(rawUrl?: string): string {
  const fallback = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  
  let cleaned = rawUrl.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    if (/^[a-z0-9]{15,30}$/i.test(cleaned)) {
      return `https://${cleaned}.supabase.co`;
    }
    cleaned = `https://${cleaned}`;
  }

  try {
    const parsed = new URL(cleaned);
    const cleanHost = parsed.host.replace(/\.+$/, '');
    return `${parsed.protocol}//${cleanHost}`;
  } catch {
    return fallback;
  }
}

const rawEnvUrl = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_URL : undefined;
export const SUPABASE_URL = normalizeSupabaseUrl(rawEnvUrl);

export const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || 
  'sb_publishable_XrmgH7eFsduRtvHBLwDdog_Kf3kT7An';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper for converting camelCase to snake_case for Supabase database tables
export function toSnakeCase(obj: Record<string, any>): Record<string, any> {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const newObj: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    newObj[snakeKey] = val !== undefined ? val : null;
  }
  return newObj;
}

// Helper for converting snake_case table records to camelCase application models
export function toCamelCase(obj: Record<string, any>): Record<string, any> {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const newObj: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const camelKey = key.replace(/(_\w)/g, m => m[1].toUpperCase());
    newObj[camelKey] = val;
  }
  return newObj;
}

// Database helper operations
export const supabaseDb = {
  // Categories
  async getCategories(): Promise<ServiceCategory[]> {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.warn('Supabase getCategories error:', error.message);
      return [];
    }
    return (data || []).map(item => {
      const cat = toCamelCase(item) as ServiceCategory;
      cat.subcategories = (item as any).popular_subcategories || (item as any).subcategories || cat.subcategories || [];
      cat.diagnosticFeeSupported = true;
      return cat;
    });
  },

  async upsertCategory(cat: ServiceCategory): Promise<void> {
    const validCategoryPayload = {
      id: cat.id,
      name: cat.name,
      description: cat.description || cat.name,
      icon: cat.icon || 'wrench',
      banner_image: (cat as any).bannerImage || (cat as any).banner_image || '',
      base_price: (cat as any).basePrice || (cat as any).base_price || 0,
      features: (cat as any).features || [],
      popular_subcategories: cat.subcategories || (cat as any).popularSubcategories || (cat as any).popular_subcategories || [],
      faqs: (cat as any).faqs || []
    };
    const { error } = await supabase.from('categories').upsert(validCategoryPayload, { onConflict: 'id' });
    if (error) console.error('Supabase upsertCategory error:', error.message);
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) console.error('Supabase deleteCategory error:', error.message);
  },

  // Professionals
  async getProfessionals(): Promise<ProfessionalProfile[]> {
    const { data, error } = await supabase.from('professionals').select('*');
    if (error) {
      console.warn('Supabase getProfessionals error:', error.message);
      return [];
    }
    return (data || []).map(item => {
      const parsed = toCamelCase(item) as ProfessionalProfile;
      // Ensure arrays and objects have fallbacks if null
      parsed.services = parsed.services || [];
      parsed.skills = parsed.skills || [];
      parsed.languages = parsed.languages || ['Hindi', 'English'];
      parsed.gallery = parsed.gallery || [];
      parsed.certifications = parsed.certifications || [];
      parsed.workingHours = parsed.workingHours || {};
      parsed.verified = (item as any).is_verified ?? parsed.verified ?? true;
      parsed.hourlyRate = parsed.hourlyRate || parsed.services?.[0]?.basePrice || 199;
      parsed.tagline = parsed.tagline || parsed.bio || '';
      return parsed;
    });
  },

  async upsertProfessional(pro: ProfessionalProfile): Promise<void> {
    const validProfessionalPayload = {
      id: pro.id,
      uid: pro.uid || pro.id,
      name: pro.name,
      email: pro.email || '',
      mobile: pro.mobile || '',
      role: pro.role || 'professional',
      avatar: pro.avatar || '',
      bio: pro.bio || pro.tagline || '',
      category_id: (pro as any).categoryId || (pro as any).category_id || pro.services?.[0]?.categoryId || null,
      category: (pro as any).category || pro.services?.[0]?.name || '',
      company_name: pro.companyName || (pro as any).company_name || '',
      dob: pro.dob || '',
      country: pro.country || 'India',
      state: pro.state || 'Delhi',
      city: pro.city || 'New Delhi',
      pincode: pro.pincode || '',
      address_line: pro.addressLine || (pro as any).address_line || pro.location || '',
      landmark: pro.landmark || '',
      coordinates: pro.coordinates || null,
      services: pro.services || [],
      skills: pro.skills || [],
      languages: pro.languages || ['Hindi', 'English'],
      experience_years: (pro as any).experienceYears || (pro as any).experience_years || 1,
      rating: pro.rating ?? 5.0,
      review_count: pro.reviewCount ?? (pro as any).review_count ?? 0,
      jobs_completed: pro.jobsCompleted ?? (pro as any).jobs_completed ?? 0,
      response_time: pro.responseTime || (pro as any).response_time || 'Within 30 minutes',
      availability_status: pro.availabilityStatus || (pro as any).availability_status || 'available',
      is_verified: pro.verified ?? (pro as any).isVerified ?? (pro as any).is_verified ?? true,
      satisfies_elder_safe: pro.satisfiesElderSafe ?? (pro as any).satisfies_elder_safe ?? true,
      satisfies_women_safe: pro.satisfiesWomenSafe ?? (pro as any).satisfies_women_safe ?? true,
      working_hours: pro.workingHours || (pro as any).working_hours || {},
      subscription_status: pro.subscriptionStatus || (pro as any).subscription_status || 'active_free_tier',
      subscription_quarter: pro.subscriptionQuarter ?? (pro as any).subscription_quarter ?? 1,
      calculated_monthly_subscription: pro.calculatedMonthlySubscription ?? (pro as any).calculated_monthly_subscription ?? 100,
      certifications: pro.certifications || [],
      gallery: pro.gallery || [],
      joined_at: pro.joinedAt || (pro as any).joined_at || new Date().toISOString()
    };
    const { error } = await supabase.from('professionals').upsert(validProfessionalPayload, { onConflict: 'id' });
    if (error) console.error('Supabase upsertProfessional error:', error.message);
  },

  async deleteProfessional(id: string): Promise<void> {
    const { error } = await supabase.from('professionals').delete().eq('id', id);
    if (error) console.error('Supabase deleteProfessional error:', error.message);
  },

  // Customers
  async getCustomers(): Promise<User[]> {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) {
      console.warn('Supabase getCustomers error:', error.message);
      return [];
    }
    return (data || []).map(item => toCamelCase(item) as User);
  },

  async upsertCustomer(cust: User): Promise<void> {
    const validCustomerPayload = {
      id: cust.id,
      uid: cust.uid || cust.id,
      name: cust.name || 'Customer',
      email: cust.email || '',
      mobile: cust.mobile || '',
      role: cust.role || 'customer',
      avatar: cust.avatar || '',
      dob: cust.dob || '',
      country: cust.country || 'India',
      state: cust.state || 'Delhi',
      city: cust.city || 'New Delhi',
      pincode: cust.pincode || '',
      address_line: cust.addressLine || (cust as any).address_line || '',
      landmark: cust.landmark || '',
      coordinates: cust.coordinates || null,
      is_profile_complete: cust.isProfileComplete ?? (cust as any).is_profile_complete ?? false,
      joined_at: cust.joinedAt || (cust as any).joined_at || new Date().toISOString()
    };
    const { error } = await supabase.from('customers').upsert(validCustomerPayload, { onConflict: 'id' });
    if (error) console.error('Supabase upsertCustomer error:', error.message);
  },

  async deleteCustomer(id: string): Promise<void> {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) console.error('Supabase deleteCustomer error:', error.message);
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase getBookings error:', error.message);
      return [];
    }
    return (data || []).map(item => {
      const b = toCamelCase(item) as Booking;
      b.statusHistory = b.statusHistory || [];
      b.categoryName = (item as any).service_title || b.categoryName || 'Service';
      b.serviceTitle = (item as any).service_title || b.serviceTitle || 'Service';
      b.time = (item as any).time_slot || b.time || '';
      b.timeSlot = (item as any).time_slot || b.timeSlot || '';
      b.customerMobile = (item as any).customer_phone || b.customerMobile || '';
      b.serviceAddress = (item as any).address || b.serviceAddress;
      b.selectedSubcategories = b.selectedSubcategories?.length ? b.selectedSubcategories : [(item as any).service_title || 'Service'];
      b.photos = b.photos || [];
      return b;
    });
  },

  async upsertBooking(booking: Booking): Promise<void> {
    const serviceTitle = booking.serviceTitle || booking.categoryName || (booking.selectedSubcategories && booking.selectedSubcategories[0]) || 'Service';
    const timeSlot = booking.timeSlot || booking.time || (booking as any).scheduledTime || 'Flexible';
    const validBookingPayload = {
      id: booking.id,
      customer_id: booking.customerId,
      customer_name: booking.customerName || '',
      customer_phone: booking.customerMobile || (booking as any).customerPhone || (booking as any).customer_phone || '',
      customer_email: booking.customerEmail || (booking as any).customer_email || '',
      professional_id: booking.professionalId || null,
      professional_name: booking.professionalName || '',
      category_id: booking.categoryId || (booking as any).category_id || null,
      service_title: serviceTitle,
      date: booking.date || booking.scheduledDate || new Date().toISOString().split('T')[0],
      time_slot: timeSlot,
      total_price: booking.totalPrice || 0,
      platform_fee: booking.platformFee || 0,
      work_protection_applied: booking.workProtectionApplied ?? true,
      status: booking.status || 'submitted',
      status_history: booking.statusHistory || [],
      notes: booking.notes || '',
      address: booking.serviceAddress || booking.structuredAddress || (booking.customerAddress ? { addressLine: booking.customerAddress } : null) || (booking as any).address || null,
      created_at: booking.createdAt || new Date().toISOString()
    };

    const { error } = await supabase.from('bookings').upsert(validBookingPayload, { onConflict: 'id' });
    if (error) console.error('Supabase upsertBooking error:', error.message);
  },

  async deleteBooking(id: string): Promise<void> {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) console.error('Supabase deleteBooking error:', error.message);
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase getReviews error:', error.message);
      return [];
    }
    return (data || []).map(item => {
      const rev = toCamelCase(item) as Review;
      rev.text = (item as any).comment || rev.text || '';
      return rev;
    });
  },

  async upsertReview(review: Review): Promise<void> {
    const validReviewPayload = {
      id: review.id,
      booking_id: review.bookingId || null,
      professional_id: review.professionalId,
      customer_id: review.customerId,
      customer_name: review.customerName || 'Customer',
      customer_avatar: review.customerAvatar || '',
      rating: review.rating || 5,
      comment: [review.text, review.serviceSpecificFeedback].filter(Boolean).join(' | ') || (review as any).comment || '',
      created_at: review.createdAt || new Date().toISOString()
    };
    const { error } = await supabase.from('reviews').upsert(validReviewPayload, { onConflict: 'id' });
    if (error) console.error('Supabase upsertReview error:', error.message);
  },

  // Protection Claims
  async getClaims(): Promise<any[]> {
    const { data, error } = await supabase.from('protection_claims').select('*');
    if (error) return [];
    return (data || []).map(item => toCamelCase(item));
  },

  async upsertClaim(claim: any): Promise<void> {
    const validClaimPayload = {
      id: claim.id,
      booking_id: claim.bookingId || (claim as any).booking_id || null,
      customer_id: claim.customerId || (claim as any).customer_id || null,
      customer_name: claim.customerName || (claim as any).customer_name || '',
      description: claim.description || '',
      claim_amount: claim.claimAmount ?? (claim as any).claim_amount ?? 0,
      status: claim.status || 'submitted',
      created_at: claim.createdAt || (claim as any).created_at || new Date().toISOString()
    };
    const { error } = await supabase.from('protection_claims').upsert(validClaimPayload, { onConflict: 'id' });
    if (error) console.error('Supabase upsertClaim error:', error.message);
  },

  // Incentive Rules
  async getIncentiveRules(): Promise<IncentiveRule[]> {
    try {
      const { data, error } = await supabase.from('incentive_rules').select('*');
      if (error) return [];
      return (data || []).map(item => toCamelCase(item) as IncentiveRule);
    } catch {
      return [];
    }
  },

  async upsertIncentiveRule(rule: IncentiveRule): Promise<void> {
    try {
      const record = toSnakeCase(rule);
      const { error } = await supabase.from('incentive_rules').upsert(record, { onConflict: 'id' });
      if (error) {
        // Table may not exist yet in user's schema, ignore silently
        console.warn('Supabase upsertIncentiveRule warning:', error.message);
      }
    } catch {
      // ignore
    }
  }
};

// ==========================================
// SUPABASE STORAGE ENGINE
// ==========================================
export const supabaseStorage = {
  BUCKET_MEDIA: 'kaamnow-media',
  BUCKET_PROFILES: 'profiles',

  async uploadFile(bucket: string, filePath: string, file: File | Blob): Promise<{ url: string | null; error: string | null }> {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        upsert: true,
        cacheControl: '3600'
      });
      if (error) {
        console.warn('Supabase storage upload warning:', error.message);
        return { url: null, error: error.message };
      }
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return { url: publicUrlData.publicUrl, error: null };
    } catch (err: any) {
      return { url: null, error: err.message };
    }
  },

  async listFiles(bucket: string, folder: string = ''): Promise<any[]> {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });
      if (error) {
        console.warn('Supabase storage list warning:', error.message);
        return [];
      }
      return (data || []).map(file => {
        const fullPath = folder ? `${folder}/${file.name}` : file.name;
        const { data: pubUrl } = supabase.storage.from(bucket).getPublicUrl(fullPath);
        return {
          ...file,
          path: fullPath,
          publicUrl: pubUrl.publicUrl
        };
      });
    } catch (err) {
      console.warn('Supabase storage list error:', err);
      return [];
    }
  },

  async deleteFile(bucket: string, filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      return !error;
    } catch {
      return false;
    }
  }
};
