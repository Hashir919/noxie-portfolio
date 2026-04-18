-- Supabase Schema for Dynamic Portfolio website

-- 1. Setup global_settings table
CREATE TABLE IF NOT EXISTS global_settings (
  id integer PRIMARY KEY DEFAULT 1,
  site_title text NOT NULL DEFAULT 'NOXIE DIGITAL ART',
  meta_description text DEFAULT 'Digital Artist Portfolio',
  accent_color text DEFAULT '#9a8cff',
  bg_color text DEFAULT '#0f0e13',
  text_main_color text DEFAULT '#f4f4f5',
  text_dim_color text DEFAULT '#a1a1aa',
  font_family text DEFAULT 'Inter',
  nav_links jsonb DEFAULT '[{"name":"Home","href":"/","enabled":true},{"name":"Portfolio","href":"/portfolio","enabled":true},{"name":"About","href":"/about","enabled":true},{"name":"Contact","href":"/contact","enabled":true}]'::jsonb,
  updated_at timestamp with time zone DEFAULT now()
);

-- Ensure only one row exists for global settings
ALTER TABLE global_settings ADD CONSTRAINT global_settings_single_row CHECK (id = 1);

-- 2. Setup homepage_content table
CREATE TABLE IF NOT EXISTS homepage_content (
  id integer PRIMARY KEY DEFAULT 1,
  heading text NOT NULL DEFAULT 'THE NOXIE WORLD',
  subtext text NOT NULL DEFAULT 'Transform Your Space with Soft Digital Art. Digital art is redefining the way we experience emotion and character.',
  bottom_text text DEFAULT 'Exploring the quiet moments of life through celestial light and softness.',
  hero_image text DEFAULT '',
  side_image text DEFAULT '',
  crystal_image text DEFAULT '',
  button_text text DEFAULT 'READ PROFILE',
  button_link text DEFAULT '/about',
  updated_at timestamp with time zone DEFAULT now()
);

-- Ensure only one row exists
ALTER TABLE homepage_content ADD CONSTRAINT homepage_content_single_row CHECK (id = 1);

-- 3. Setup about_content
CREATE TABLE IF NOT EXISTS about_content (
  id integer PRIMARY KEY DEFAULT 1,
  heading text NOT NULL DEFAULT 'CREATING SOFT REALITY',
  bio_text text NOT NULL DEFAULT 'Based in Tokyo, specializing in digital illustration that focuses on the interplay between light and emotion. Every piece is a story told in silence.',
  profile_image text DEFAULT '',
  experience text DEFAULT '5+ YEARS',
  clients text DEFAULT '50+ WORLDWIDE',
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE about_content ADD CONSTRAINT about_content_single_row CHECK (id = 1);

-- 4. Setup categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. Setup portfolio works
CREATE TABLE IF NOT EXISTS portfolio_works (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  display_order integer DEFAULT 0
);

-- 6. Setup contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  is_read boolean DEFAULT false
);

-- 7. Insert Defaults if empty
INSERT INTO global_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
INSERT INTO homepage_content (id) VALUES (1) ON CONFLICT DO NOTHING;
INSERT INTO about_content (id) VALUES (1) ON CONFLICT DO NOTHING;

-- 8. Row Level Security Setup
-- Enable RLS
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can read content
CREATE POLICY "Public read global_settings" ON global_settings FOR SELECT USING (true);
CREATE POLICY "Public read homepage_content" ON homepage_content FOR SELECT USING (true);
CREATE POLICY "Public read about_content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read portfolio_works" ON portfolio_works FOR SELECT USING (true);

-- Public can insert messages
CREATE POLICY "Public can insert messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Admin can do everything (Assuming authenticated users are admins)
CREATE POLICY "Admin full access global_settings" ON global_settings FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access homepage_content" ON homepage_content FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access about_content" ON about_content FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access portfolio_works" ON portfolio_works FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access contact_messages" ON contact_messages FOR ALL USING (auth.uid() IS NOT NULL);

-- 9. Storage Setup (Assuming you create a bucket named 'portfolio-images' manually via dashboard first)
-- You must create a bucket named 'portfolio-images' as 'Public' before these policies work.
CREATE POLICY "Public can view images" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Admins can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL);
