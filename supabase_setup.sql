-- ==========================================
-- MAVI ENTERTAINMENT - SUPABASE SCHEMA SETUP
-- Run this script in your Supabase SQL Editor
-- (https://supabase.com/dashboard/project/_/sql)
-- ==========================================

-- 1. Create the 'events' table
CREATE TABLE IF NOT EXISTS public.events (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'Fashion Event',
    location TEXT,
    event_date DATE NOT NULL,
    is_month_only BOOLEAN DEFAULT FALSE,
    registration_deadline DATE,
    preliminary_fee NUMERIC,
    finale_fee NUMERIC,
    max_participants INTEGER,
    status TEXT DEFAULT 'Upcoming',
    is_featured BOOLEAN DEFAULT FALSE,
    image_url TEXT
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for website visitors)
DROP POLICY IF EXISTS "Allow public read access on events" ON public.events;
CREATE POLICY "Allow public read access on events" 
ON public.events FOR SELECT 
USING (true);

-- Allow authenticated users full access (for logged-in admin)
DROP POLICY IF EXISTS "Allow authenticated full access on events" ON public.events;
CREATE POLICY "Allow authenticated full access on events" 
ON public.events FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Allow anon key full access (for local admin / server access)
DROP POLICY IF EXISTS "Allow anon full access on events" ON public.events;
CREATE POLICY "Allow anon full access on events" 
ON public.events FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);


-- 2. Create the 'direct_messages' table (for Contact modal)
CREATE TABLE IF NOT EXISTS public.direct_messages (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT,
    message TEXT
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on direct_messages" ON public.direct_messages;
CREATE POLICY "Allow public insert on direct_messages"
ON public.direct_messages FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read on direct_messages" ON public.direct_messages;
CREATE POLICY "Allow authenticated read on direct_messages"
ON public.direct_messages FOR SELECT
TO authenticated
USING (true);


-- 3. Create Collaboration Tables (for /collaborate page)
CREATE TABLE IF NOT EXISTS public.studio_partners (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    details TEXT
);
ALTER TABLE public.studio_partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on studio_partners" ON public.studio_partners;
CREATE POLICY "Allow public insert on studio_partners" ON public.studio_partners FOR INSERT TO public WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.models (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    portfolio_link TEXT,
    details TEXT
);
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on models" ON public.models;
CREATE POLICY "Allow public insert on models" ON public.models FOR INSERT TO public WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.photographers_videographers (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    portfolio_link TEXT,
    details TEXT
);
ALTER TABLE public.photographers_videographers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on photographers_videographers" ON public.photographers_videographers;
CREATE POLICY "Allow public insert on photographers_videographers" ON public.photographers_videographers FOR INSERT TO public WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.artists_performers (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    portfolio_link TEXT,
    details TEXT
);
ALTER TABLE public.artists_performers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on artists_performers" ON public.artists_performers FOR INSERT TO public WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.makeup_artists (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    portfolio_link TEXT,
    details TEXT
);
ALTER TABLE public.makeup_artists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on makeup_artists" ON public.makeup_artists;
CREATE POLICY "Allow public insert on makeup_artists" ON public.makeup_artists FOR INSERT TO public WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.sponsors_brands (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    details TEXT
);
ALTER TABLE public.sponsors_brands ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on sponsors_brands" ON public.sponsors_brands;
CREATE POLICY "Allow public insert on sponsors_brands" ON public.sponsors_brands FOR INSERT TO public WITH CHECK (true);


-- 4. Create Public Storage Bucket 'event-images'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for 'event-images'
DROP POLICY IF EXISTS "Allow public view on event-images" ON storage.objects;
CREATE POLICY "Allow public view on event-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'event-images');

DROP POLICY IF EXISTS "Allow upload on event-images" ON storage.objects;
CREATE POLICY "Allow upload on event-images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'event-images');

DROP POLICY IF EXISTS "Allow update on event-images" ON storage.objects;
CREATE POLICY "Allow update on event-images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'event-images');

DROP POLICY IF EXISTS "Allow delete on event-images" ON storage.objects;
CREATE POLICY "Allow delete on event-images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'event-images');


-- ==========================================
-- 5. Create 'event_registrations' table (Event-wise registrations)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
    event_title TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    age INTEGER,
    date_of_birth DATE,
    gender TEXT,
    category TEXT,
    social_media_profile TEXT,
    portfolio_link TEXT,
    professional_bio TEXT,
    terms_accepted BOOLEAN DEFAULT TRUE NOT NULL,
    status TEXT DEFAULT 'Pending'
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone registering for an event)
DROP POLICY IF EXISTS "Allow public insert on event_registrations" ON public.event_registrations;
CREATE POLICY "Allow public insert on event_registrations"
ON public.event_registrations FOR INSERT
TO public
WITH CHECK (true);

-- Allow authenticated users full access (for logged-in admin)
DROP POLICY IF EXISTS "Allow authenticated full access on event_registrations" ON public.event_registrations;
CREATE POLICY "Allow authenticated full access on event_registrations"
ON public.event_registrations FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow anon key full access (for client / local admin)
DROP POLICY IF EXISTS "Allow anon full access on event_registrations" ON public.event_registrations;
CREATE POLICY "Allow anon full access on event_registrations"
ON public.event_registrations FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Indexes for performance & fast event-wise querying
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at ON public.event_registrations(created_at DESC);

