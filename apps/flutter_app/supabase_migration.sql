-- Supabase SQL Migration for MyPrayerTower
-- Tables for candles and prayer requests

-- ============================================
-- CANDLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS candles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL DEFAULT 'Anonymous',
  intention TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'standard', 'premium')),
  duration TEXT NOT NULL DEFAULT 'ONE_DAY' CHECK (duration IN ('ONE_DAY', 'THREE_DAYS', 'SEVEN_DAYS', 'THIRTY_DAYS')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  prayer_count INTEGER NOT NULL DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed'))
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_candles_expires_at ON candles(expires_at);
CREATE INDEX IF NOT EXISTS idx_candles_user_id ON candles(user_id);
CREATE INDEX IF NOT EXISTS idx_candles_tier ON candles(tier);

-- Enable Row Level Security
ALTER TABLE candles ENABLE ROW LEVEL SECURITY;

-- Policies for candles
-- Anyone can view active candles
CREATE POLICY "Anyone can view active candles" ON candles
  FOR SELECT USING (expires_at > NOW());

-- Anyone can insert candles (guest or logged in)
CREATE POLICY "Anyone can insert candles" ON candles
  FOR INSERT WITH CHECK (true);

-- Users can update their own candles
CREATE POLICY "Users can update own candles" ON candles
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to increment prayer count
CREATE OR REPLACE FUNCTION increment_candle_prayers(candle_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE candles 
  SET prayer_count = prayer_count + 1 
  WHERE id = candle_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PRAYER REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL DEFAULT 'Anonymous',
  intention TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  prayer_count INTEGER NOT NULL DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_pending BOOLEAN NOT NULL DEFAULT true
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_prayer_requests_is_approved ON prayer_requests(is_approved);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_is_pending ON prayer_requests(is_pending);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_user_id ON prayer_requests(user_id);

-- Enable Row Level Security
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

-- Policies for prayer_requests
-- Anyone can view approved requests
CREATE POLICY "Anyone can view approved requests" ON prayer_requests
  FOR SELECT USING (is_approved = true);

-- Users can view their own requests (including pending)
CREATE POLICY "Users can view own requests" ON prayer_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can insert prayer requests (guest or logged in)
CREATE POLICY "Anyone can insert prayer requests" ON prayer_requests
  FOR INSERT WITH CHECK (true);

-- Users can update their own requests
CREATE POLICY "Users can update own requests" ON prayer_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to increment prayer count
CREATE OR REPLACE FUNCTION increment_prayer_count(request_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prayer_requests 
  SET prayer_count = prayer_count + 1 
  WHERE id = request_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ADMIN POLICIES (requires admin role)
-- ============================================
-- Admins can view all requests for moderation
CREATE POLICY "Admins can view pending requests" ON prayer_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admins can update any request (for moderation)
CREATE POLICY "Admins can moderate requests" ON prayer_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );
