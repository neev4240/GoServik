-- ==============================================================================
-- KaamNow - Supabase PostgreSQL Schema & Table Generation Script
-- Project ID: ltsnomiigobgihmgtsxi
-- ==============================================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/ltsnomiigobgihmgtsxi
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "+ New query", paste this entire script, and click "RUN" (or Ctrl+Enter / Cmd+Enter)
-- 4. All tables, indexes, Row Level Security (RLS) policies, and Realtime replication will be created.
-- ==============================================================================

-- 1. SERVICE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hindi_name TEXT,
  description TEXT,
  hindi_description TEXT,
  icon TEXT,
  subcategories JSONB DEFAULT '[]'::jsonb,
  diagnostic_fee_supported BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFESSIONALS TABLE
CREATE TABLE IF NOT EXISTS professionals (
  id TEXT PRIMARY KEY,
  uid TEXT,
  name TEXT NOT NULL,
  personal_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'professional',
  avatar TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  mobile TEXT,
  dob TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  pincode TEXT,
  address_line TEXT,
  landmark TEXT,
  company_name TEXT,
  coordinates JSONB,
  saved_addresses JSONB DEFAULT '[]'::jsonb,
  is_profile_complete BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  tagline TEXT,
  bio TEXT,
  location TEXT,
  service_radius_km NUMERIC DEFAULT 20,
  languages JSONB DEFAULT '["Hindi", "English"]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  hourly_rate NUMERIC DEFAULT 350,
  four_hour_rate NUMERIC DEFAULT 1200,
  full_day_rate NUMERIC DEFAULT 2200,
  supports_diagnostic_visit BOOLEAN DEFAULT true,
  gallery JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  working_hours JSONB DEFAULT '{"Mon": "08:00 - 20:00", "Tue": "08:00 - 20:00", "Wed": "08:00 - 20:00", "Thu": "08:00 - 20:00", "Fri": "08:00 - 20:00", "Sat": "08:00 - 20:00", "Sun": "09:00 - 18:00"}'::jsonb,
  response_time TEXT DEFAULT 'Within 15 mins',
  availability_status TEXT DEFAULT 'available',
  rating NUMERIC DEFAULT 4.8,
  review_count INTEGER DEFAULT 0,
  jobs_completed INTEGER DEFAULT 0,
  satisfies_elder_safe BOOLEAN DEFAULT true,
  satisfies_women_safe BOOLEAN DEFAULT true,
  subscription_status TEXT DEFAULT 'active_free_tier',
  subscription_quarter INTEGER DEFAULT 1,
  calculated_monthly_subscription NUMERIC DEFAULT 0,
  earned_incentives_total NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  uid TEXT,
  name TEXT NOT NULL,
  personal_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'customer',
  avatar TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  mobile TEXT,
  dob TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  pincode TEXT,
  address_line TEXT,
  landmark TEXT,
  coordinates JSONB,
  saved_addresses JSONB DEFAULT '[]'::jsonb,
  is_profile_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  professional_id TEXT,
  service_id TEXT,
  category_id TEXT,
  category_name TEXT,
  selected_subcategories JSONB DEFAULT '[]'::jsonb,
  coordinates JSONB,
  date TEXT,
  time TEXT,
  status TEXT DEFAULT 'submitted',
  status_history JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  urgency TEXT DEFAULT 'normal',
  photos JSONB DEFAULT '[]'::jsonb,
  safety_preferences JSONB DEFAULT '{"elderSafe": false, "womenSafe": false}'::jsonb,
  total_price NUMERIC DEFAULT 0,
  is_diagnostic_booking BOOLEAN DEFAULT false,
  diagnostic_fee NUMERIC DEFAULT 99,
  platform_fee NUMERIC DEFAULT 0,
  work_protection_applied BOOLEAN DEFAULT true,
  customer_name TEXT,
  customer_mobile TEXT,
  customer_email TEXT,
  customer_address TEXT,
  structured_address JSONB,
  customer_service_opted TEXT,
  payment_method TEXT DEFAULT 'cash',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  professional_name TEXT,
  subcategories JSONB DEFAULT '[]'::jsonb,
  scheduled_date TEXT,
  time_slot TEXT,
  service_address JSONB,
  delivery_address TEXT,
  delivery_coordinates JSONB,
  prefer_elder_safe BOOLEAN DEFAULT false,
  prefer_women_safe BOOLEAN DEFAULT false,
  base_price NUMERIC DEFAULT 0,
  rate_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  booking_id TEXT,
  customer_id TEXT,
  professional_id TEXT,
  rating NUMERIC DEFAULT 5,
  text TEXT,
  service_specific_feedback TEXT,
  customer_name TEXT,
  customer_avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WORK PROTECTION CLAIMS TABLE
CREATE TABLE IF NOT EXISTS protection_claims (
  id TEXT PRIMARY KEY,
  booking_id TEXT,
  customer_id TEXT,
  professional_id TEXT,
  issue_type TEXT,
  description TEXT,
  amount_claimed NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INCENTIVE RULES TABLE
CREATE TABLE IF NOT EXISTS incentive_rules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  min_completed_jobs INTEGER DEFAULT 10,
  min_rating NUMERIC DEFAULT 4.5,
  bonus_amount NUMERIC DEFAULT 1000,
  start_date TEXT,
  end_date TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PLATFORM CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS platform_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  platform_fee_percent NUMERIC DEFAULT 5,
  diagnostic_fee NUMERIC DEFAULT 99,
  current_quarter INTEGER DEFAULT 1,
  work_protection_enabled BOOLEAN DEFAULT true,
  work_protection_limit NUMERIC DEFAULT 10000,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR FAST PERFORMANCE & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_professionals_role ON professionals(role);
CREATE INDEX IF NOT EXISTS idx_professionals_city ON professionals(city);
CREATE INDEX IF NOT EXISTS idx_professionals_mobile ON professionals(mobile);
CREATE INDEX IF NOT EXISTS idx_professionals_email ON professionals(email);

CREATE INDEX IF NOT EXISTS idx_customers_role ON customers(role);
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_professional_id ON bookings(professional_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_professional_id ON reviews(professional_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE protection_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE incentive_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_config ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running script
DROP POLICY IF EXISTS "Public access for categories" ON categories;
DROP POLICY IF EXISTS "Public access for professionals" ON professionals;
DROP POLICY IF EXISTS "Public access for customers" ON customers;
DROP POLICY IF EXISTS "Public access for bookings" ON bookings;
DROP POLICY IF EXISTS "Public access for reviews" ON reviews;
DROP POLICY IF EXISTS "Public access for protection_claims" ON protection_claims;
DROP POLICY IF EXISTS "Public access for incentive_rules" ON incentive_rules;
DROP POLICY IF EXISTS "Public access for platform_config" ON platform_config;

-- Allow full access for anon/authenticated clients
CREATE POLICY "Public access for categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for professionals" ON professionals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for protection_claims" ON protection_claims FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for incentive_rules" ON incentive_rules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for platform_config" ON platform_config FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- REALTIME REPLICATION ENABLEMENT
-- ==============================================================================
DO $$
BEGIN
  -- Add tables to supabase_realtime publication if not already added
  ALTER PUBLICATION supabase_realtime ADD TABLE categories;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE professionals;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE customers;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE protection_claims;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
