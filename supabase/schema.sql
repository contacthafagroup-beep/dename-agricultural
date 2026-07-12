-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  country TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'exporter' CHECK (role IN ('admin', 'exporter')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  origin TEXT NOT NULL DEFAULT 'Ethiopia',
  available_quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'MT',
  packaging TEXT NOT NULL,
  harvest_date DATE,
  moisture_level NUMERIC,
  color TEXT,
  size TEXT,
  minimum_order NUMERIC NOT NULL DEFAULT 1,
  delivery_time TEXT,
  export_standard TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'limited', 'sold_out')),
  images TEXT[] DEFAULT '{}',
  price_per_unit NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  country TEXT NOT NULL,
  address TEXT NOT NULL,
  grade TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'MT',
  packaging TEXT NOT NULL,
  delivery_destination TEXT NOT NULL,
  preferred_delivery_date DATE,
  shipping_method TEXT NOT NULL,
  special_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (
    status IN (
      'pending_review', 'quotation_sent', 'quotation_accepted',
      'awaiting_payment', 'payment_submitted', 'payment_verified',
      'preparing', 'packaging', 'dispatched', 'delivered', 'cancelled'
    )
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotations table
CREATE TABLE quotations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quotation_number TEXT NOT NULL UNIQUE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'MT',
  unit_price NUMERIC NOT NULL,
  transportation_cost NUMERIC NOT NULL DEFAULT 0,
  tax_rate NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  subtotal NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  delivery_time TEXT,
  validity_period TEXT NOT NULL DEFAULT '30 days',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT NOT NULL CHECK (
    payment_method IN (
      'commercial_bank_ethiopia', 'awash_bank', 'dashen_bank', 'bank_of_abyssinia',
      'telebirr', 'swift_transfer', 'wire_transfer', 'letter_of_credit', 'wise'
    )
  ),
  receipt_url TEXT,
  transaction_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'verified', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_company TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC NOT NULL,
  tax_rate NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  grand_total NUMERIC NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery table
CREATE TABLE gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN ('warehouse', 'farm', 'fresh_ginger', 'packing', 'transportation')
  ),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  country TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- News posts table
CREATE TABLE news_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL DEFAULT 'news',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products - public read, admin write
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Quotations
CREATE POLICY "Users can view quotations for their orders" ON quotations FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage quotations" ON quotations FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payments
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create payments" ON payments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Invoices
CREATE POLICY "Users can view their own invoices" ON invoices FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage invoices" ON invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Messages
CREATE POLICY "Anyone can create messages" ON messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can view their own messages" ON messages FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all messages" ON messages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Gallery - public read, admin write
CREATE POLICY "Anyone can view gallery" ON gallery FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage gallery" ON gallery FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Testimonials - public read, admin write
CREATE POLICY "Anyone can view testimonials" ON testimonials FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- News posts - public read published, admin write
CREATE POLICY "Anyone can view published posts" ON news_posts FOR SELECT USING (published = TRUE);
CREATE POLICY "Admins can manage news posts" ON news_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Newsletter
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can view subscribers" ON newsletter_subscribers FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'exporter')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
