-- ============================================================
-- Dename Agricultural Supplier — Schema Extension (v2)
-- Run this AFTER the original schema.sql
-- ============================================================

-- Product Categories table (dynamic, admin-managed)
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  name_am TEXT,                          -- Amharic name
  slug TEXT NOT NULL UNIQUE,             -- url-friendly: ginger, coffee, rosemary etc.
  icon TEXT,                             -- emoji icon
  description TEXT,
  description_am TEXT,
  cover_image TEXT,
  color TEXT DEFAULT '#1B5E20',          -- accent color for category page
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the 8 categories
INSERT INTO product_categories (name, name_am, slug, icon, description, order_index) VALUES
  ('Ginger',       'ዝንጅብል',    'ginger',      '🫚', 'Fresh and dried Ethiopian ginger from Hadiya Zone',         1),
  ('Coffee',       'ቡና',         'coffee',      '☕', 'Specialty and commercial Ethiopian Arabica coffee',          2),
  ('Rosemary',     'ሮዝሜሪ',      'rosemary',    '🌿', 'Fresh and dried Ethiopian rosemary herb',                    3),
  ('Turmeric',     'ቱርሜሪክ',     'turmeric',    '🟡', 'Fresh and dried Ethiopian turmeric root',                    4),
  ('Garlic',       'ነጭ ሽንኩርት', 'garlic',      '🧄', 'Fresh, peeled and dried Ethiopian garlic',                   5),
  ('Cardamom',     'ኮረሪማ',      'cardamom',    '🌱', 'Ethiopian Korerima (false cardamom), whole and dried',       6),
  ('Black Pepper', 'ጥቁር ፍልፍል', 'black-pepper','⚫', 'Whole and ground Ethiopian black pepper',                    7),
  ('Honey',        'ማር',         'honey',       '🍯', 'White honey, forest honey, and organic Ethiopian honey',     8)
ON CONFLICT (slug) DO NOTHING;

-- Extend products table with new agricultural fields
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sub_category TEXT,
  ADD COLUMN IF NOT EXISTS growing_region TEXT,
  ADD COLUMN IF NOT EXISTS harvest_season TEXT,
  ADD COLUMN IF NOT EXISTS storage_conditions TEXT,
  ADD COLUMN IF NOT EXISTS quality_standards TEXT,
  ADD COLUMN IF NOT EXISTS export_readiness TEXT DEFAULT 'Export Ready',
  ADD COLUMN IF NOT EXISTS expiry_date DATE,
  ADD COLUMN IF NOT EXISTS is_organic BOOLEAN DEFAULT FALSE;

-- Update existing ginger products to use ginger category
UPDATE products
SET category_id = (SELECT id FROM product_categories WHERE slug = 'ginger')
WHERE category_id IS NULL;

-- RLS for categories — public read, admin write
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON product_categories FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can manage categories"
  ON product_categories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON product_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index for performance
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON product_categories(slug);

-- ============================================================
-- Media Order Storage Bucket
-- Create this bucket in Supabase Dashboard → Storage
-- ============================================================
-- Bucket name: order-media
-- Public: true
-- Allowed MIME types: image/*, video/*, audio/*, application/pdf, application/msword

-- RLS policy for order-media storage bucket
-- (Run in Supabase SQL Editor after creating the bucket)
-- INSERT INTO storage.policies ...

-- Add media_urls column to orders to store media attachment URLs
ALTER TABLE orders ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}';
