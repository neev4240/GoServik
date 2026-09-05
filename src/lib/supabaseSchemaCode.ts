export const SUPABASE_PROJECT_ID = 'ltsnomiigobgihmgtsxi';
export const SUPABASE_URL = 'https://ltsnomiigobgihmgtsxi.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_XrmgH7eFsduRtvHBLwDdog_Kf3kT7An';

export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- KAAMNOW SUPABASE DATABASE SCHEMA GENERATION SCRIPT
-- Project ID: ltsnomiigobgihmgtsxi
-- Purpose: Creates all tables, primary keys, foreign keys, JSONB columns,
--          indexes, and Row Level Security (RLS) policies for KaamNow.
-- Instructions:
--   1. Log into your Supabase Dashboard: https://supabase.com/dashboard/project/ltsnomiigobgihmgtsxi
--   2. Click on "SQL Editor" in the left sidebar navigation.
--   3. Click "New Query", paste this entire script, and click "Run".
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. SERVICE CATEGORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  banner_image TEXT,
  base_price NUMERIC DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  popular_subcategories JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. REGISTERED CUSTOMERS (USERS) TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  uid TEXT,
  name TEXT NOT NULL,
  email TEXT,
  mobile TEXT,
  role TEXT DEFAULT 'customer',
  avatar TEXT,
  dob TEXT,
  country TEXT DEFAULT 'India',
  state TEXT DEFAULT 'Delhi',
  city TEXT DEFAULT 'New Delhi',
  pincode TEXT,
  address_line TEXT,
  landmark TEXT,
  coordinates JSONB,
  is_profile_complete BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. SERVICE PROFESSIONALS / PARTNERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.professionals (
  id TEXT PRIMARY KEY,
  uid TEXT,
  name TEXT NOT NULL,
  email TEXT,
  mobile TEXT,
  role TEXT DEFAULT 'professional',
  avatar TEXT,
  bio TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  category TEXT,
  company_name TEXT,
  dob TEXT,
  country TEXT DEFAULT 'India',
  state TEXT DEFAULT 'Delhi',
  city TEXT DEFAULT 'New Delhi',
  pincode TEXT,
  address_line TEXT,
  landmark TEXT,
  coordinates JSONB,
  services JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  experience_years NUMERIC DEFAULT 1,
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  jobs_completed INTEGER DEFAULT 0,
  response_time TEXT DEFAULT 'Within 30 minutes',
  availability_status TEXT DEFAULT 'available',
  is_verified BOOLEAN DEFAULT true,
  satisfies_elder_safe BOOLEAN DEFAULT true,
  satisfies_women_safe BOOLEAN DEFAULT true,
  working_hours JSONB,
  subscription_status TEXT DEFAULT 'active_free_tier',
  subscription_quarter INTEGER DEFAULT 1,
  calculated_monthly_subscription NUMERIC DEFAULT 100,
  joined_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. BOOKINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  professional_id TEXT,
  professional_name TEXT,
  category_id TEXT,
  service_title TEXT NOT NULL,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  total_price NUMERIC DEFAULT 0,
  platform_fee NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'submitted' NOT NULL,
  status_history JSONB DEFAULT '[]'::jsonb,
  address JSONB,
  work_protection_applied BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 6. REVIEWS & RATINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  booking_id TEXT,
  professional_id TEXT REFERENCES public.professionals(id) ON DELETE CASCADE,
  customer_id TEXT,
  customer_name TEXT,
  customer_avatar TEXT,
  rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. WORK PROTECTION CLAIMS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.protection_claims (
  id TEXT PRIMARY KEY,
  booking_id TEXT,
  customer_id TEXT,
  customer_name TEXT,
  description TEXT,
  claim_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7b. COLUMN COMPATIBILITY ENSURANCE
-- ==============================================================================
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS diagnostic_fee_supported BOOLEAN DEFAULT true;
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS earned_incentives_total NUMERIC DEFAULT 0;
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT true;
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC DEFAULT 199;
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS category_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS time TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS service_specific_feedback TEXT;

-- ==============================================================================
-- 8. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_professionals_category ON public.professionals(category_id);
CREATE INDEX IF NOT EXISTS idx_professionals_city ON public.professionals(city);
CREATE INDEX IF NOT EXISTS idx_professionals_rating ON public.professionals(rating DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pro ON public.bookings(professional_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_pro ON public.reviews(professional_id);

-- ==============================================================================
-- 9. ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protection_claims ENABLE ROW LEVEL SECURITY;

-- Drop existing public policies if recreating
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
DROP POLICY IF EXISTS "Public can insert/update categories" ON public.categories;
DROP POLICY IF EXISTS "Public can view professionals" ON public.professionals;
DROP POLICY IF EXISTS "Public can insert/update professionals" ON public.professionals;
DROP POLICY IF EXISTS "Public can delete professionals" ON public.professionals;
DROP POLICY IF EXISTS "Public can view customers" ON public.customers;
DROP POLICY IF EXISTS "Public can insert/update customers" ON public.customers;
DROP POLICY IF EXISTS "Public can delete customers" ON public.customers;
DROP POLICY IF EXISTS "Public can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can insert/update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can insert/update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can delete reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can view protection claims" ON public.protection_claims;
DROP POLICY IF EXISTS "Public can insert/update protection claims" ON public.protection_claims;

-- Create Open Access Policies for KaamNow Web Applet
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can insert/update categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can view professionals" ON public.professionals FOR SELECT USING (true);
CREATE POLICY "Public can insert/update professionals" ON public.professionals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete professionals" ON public.professionals FOR DELETE USING (true);

CREATE POLICY "Public can view customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Public can insert/update customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete customers" ON public.customers FOR DELETE USING (true);

CREATE POLICY "Public can view bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public can insert/update bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete bookings" ON public.bookings FOR DELETE USING (true);

CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public can insert/update reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete reviews" ON public.reviews FOR DELETE USING (true);

CREATE POLICY "Public can view protection claims" ON public.protection_claims FOR SELECT USING (true);
CREATE POLICY "Public can insert/update protection claims" ON public.protection_claims FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 10. ENABLE REALTIME ON PUBLIC TABLES
-- ==============================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
  EXCEPTION WHEN duplicate_object THEN END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.professionals;
  EXCEPTION WHEN duplicate_object THEN END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
  EXCEPTION WHEN duplicate_object THEN END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  EXCEPTION WHEN duplicate_object THEN END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
  EXCEPTION WHEN duplicate_object THEN END;
END $$;
`;
