-- ==========================================
-- SUPABASE BACKEND SCHEMA FOR GAMING APP
-- Run this script in Supabase SQL Editor
-- ==========================================

-- 1. Games / Apps Table
CREATE TABLE IF NOT EXISTS public.games (
  id TEXT PRIMARY KEY,
  ranking INTEGER DEFAULT 0,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  logo TEXT,
  poster TEXT,
  banner TEXT,
  screenshots JSONB DEFAULT '[]'::jsonb,
  short_description TEXT,
  description TEXT,
  category TEXT,
  bonus NUMERIC DEFAULT 0,
  bonus_label TEXT,
  min_withdrawal NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 4.8,
  version TEXT,
  apk_size TEXT,
  package_name TEXT,
  developer_name TEXT,
  download_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  last_updated TEXT,
  created_at TEXT,
  updated_at TEXT,
  download_type TEXT,
  google_play_url TEXT,
  official_website_url TEXT,
  direct_download_url TEXT,
  external_store_url TEXT,
  download_url TEXT,
  telegram_group TEXT,
  official_website TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  features JSONB DEFAULT '[]'::jsonb,
  withdrawal_rules JSONB DEFAULT '[]'::jsonb,
  registration_guide JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  icon TEXT,
  description TEXT,
  game_count INTEGER DEFAULT 0
);

-- 3. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  site_name TEXT,
  site_tagline TEXT,
  telegram_link TEXT,
  notice_title TEXT,
  notice_content TEXT,
  restricted_states JSONB DEFAULT '[]'::jsonb,
  maintenance_mode BOOLEAN DEFAULT false,
  contact_email TEXT,
  contact_phone TEXT,
  whatsapp_link TEXT,
  hero_notice TEXT,
  meta_title TEXT,
  meta_description TEXT
);

-- 4. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  date TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Media Items Table
CREATE TABLE IF NOT EXISTS public.media_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT,
  size TEXT,
  uploaded_at TEXT
);

-- 6. Enable Row Level Security (RLS) & Policies
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
DROP POLICY IF EXISTS "Allow public all games" ON public.games;
CREATE POLICY "Allow public all games" ON public.games FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all categories" ON public.categories;
CREATE POLICY "Allow public all categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all settings" ON public.site_settings;
CREATE POLICY "Allow public all settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all messages" ON public.contact_messages;
CREATE POLICY "Allow public all messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all media" ON public.media_items;
CREATE POLICY "Allow public all media" ON public.media_items FOR ALL USING (true) WITH CHECK (true);
