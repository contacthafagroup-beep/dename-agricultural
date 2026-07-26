export type UserRole = "admin" | "exporter";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  phone: string;
  whatsapp: string;
  country: string;
  address: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// ─── Product Categories ────────────────────────────────────────────────────
export interface ProductCategory {
  id: string;
  name: string;
  name_am?: string;
  slug: string;
  icon?: string;
  description?: string;
  description_am?: string;
  cover_image?: string;
  color?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Static category data (used for pages before Supabase is configured)
export const STATIC_CATEGORIES: ProductCategory[] = [
  { id: "1", name: "Ginger",       name_am: "ዝንጅብል",    slug: "ginger",       icon: "🫚", description: "Fresh and dried Ethiopian ginger from Hadiya Zone",         color: "#1B5E20", order_index: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Coffee",       name_am: "ቡና",         slug: "coffee",       icon: "☕", description: "Specialty and commercial Ethiopian Arabica coffee",          color: "#6B3F1F", order_index: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Rosemary",     name_am: "ሮዝሜሪ",      slug: "rosemary",     icon: "🌿", description: "Fresh and dried Ethiopian rosemary herb",                    color: "#2E7D32", order_index: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Turmeric",     name_am: "ቱርሜሪክ",     slug: "turmeric",     icon: "🟡", description: "Fresh and dried Ethiopian turmeric root",                    color: "#F57F17", order_index: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Garlic",       name_am: "ነጭ ሽንኩርት", slug: "garlic",       icon: "🧄", description: "Fresh, peeled and dried Ethiopian garlic",                   color: "#827717", order_index: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "6", name: "Cardamom",     name_am: "ኮረሪማ",      slug: "cardamom",     icon: "🌱", description: "Ethiopian Korerima (false cardamom), whole and dried",       color: "#1B5E20", order_index: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "7", name: "Black Pepper", name_am: "ጥቁር ፍልፍል", slug: "black-pepper", icon: "⚫", description: "Whole and ground Ethiopian black pepper",                    color: "#212121", order_index: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "8", name: "Honey",        name_am: "ማር",         slug: "honey",        icon: "🍯", description: "White honey, forest honey, and organic Ethiopian honey",     color: "#E65100", order_index: 8, is_active: true, created_at: "", updated_at: "" },
];

// ─── Products ──────────────────────────────────────────────────────────────
export type ProductStatus = "available" | "limited" | "sold_out";

export interface Product {
  id: string;
  name: string;
  grade: string;
  origin: string;
  available_quantity: number;
  unit: string;
  packaging: string;
  harvest_date: string;
  moisture_level: number;
  color: string;
  size: string;
  minimum_order: number;
  delivery_time: string;
  export_standard: string;
  description: string;
  status: ProductStatus;
  images: string[];
  price_per_unit?: number;
  // Extended agricultural fields
  category_id?: string;
  category?: ProductCategory;
  sub_category?: string;
  growing_region?: string;
  harvest_season?: string;
  storage_conditions?: string;
  quality_standards?: string;
  export_readiness?: string;
  expiry_date?: string;
  is_organic?: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Orders ────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending_review"
  | "quotation_sent"
  | "quotation_accepted"
  | "awaiting_payment"
  | "payment_submitted"
  | "payment_verified"
  | "preparing"
  | "packaging"
  | "dispatched"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  product_id: string;
  product?: Product;
  profile?: Profile;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  address: string;
  grade: string;
  quantity: number;
  unit: string;
  packaging: string;
  delivery_destination: string;
  preferred_delivery_date: string;
  shipping_method: string;
  special_requirements?: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

// ─── Quotations ────────────────────────────────────────────────────────────
export interface Quotation {
  id: string;
  quotation_number: string;
  order_id: string;
  order?: Order;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  transportation_cost: number;
  tax_rate: number;
  tax_amount: number;
  subtotal: number;
  total: number;
  delivery_time: string;
  validity_period: string;
  notes?: string;
  status: "sent" | "accepted" | "rejected" | "expired";
  created_at: string;
  updated_at: string;
}

// ─── Payments ─────────────────────────────────────────────────────────────
export type PaymentMethod =
  | "commercial_bank_ethiopia"
  | "awash_bank"
  | "dashen_bank"
  | "bank_of_abyssinia"
  | "telebirr"
  | "swift_transfer"
  | "wire_transfer"
  | "letter_of_credit"
  | "wise";

export type PaymentStatus = "pending" | "submitted" | "verified" | "rejected";

export interface Payment {
  id: string;
  order_id: string;
  order?: Order;
  quotation_id: string;
  quotation?: Quotation;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  receipt_url?: string;
  transaction_reference?: string;
  status: PaymentStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

// ─── Invoices ──────────────────────────────────────────────────────────────
export interface Invoice {
  id: string;
  invoice_number: string;
  order_id: string;
  order?: Order;
  payment_id?: string;
  customer_name: string;
  customer_email: string;
  customer_company: string;
  customer_address: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  grand_total: number;
  payment_status: "unpaid" | "partial" | "paid";
  due_date: string;
  created_at: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
}

// ─── Messages ─────────────────────────────────────────────────────────────
export interface Message {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  is_read: boolean;
  reply?: string;
  created_at: string;
}

// ─── Gallery ──────────────────────────────────────────────────────────────
export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  category: "warehouse" | "farm" | "fresh_ginger" | "packing" | "transportation" | "coffee" | "rosemary" | "turmeric" | "garlic" | "honey";
  order_index: number;
  created_at: string;
}

// ─── Testimonials ─────────────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  company: string;
  country: string;
  message: string;
  rating: number;
  avatar_url?: string;
  is_featured: boolean;
  created_at: string;
}

// ─── News / Blog ──────────────────────────────────────────────────────────
export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  category: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────
export interface DashboardStats {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_revenue: number;
  available_stock: number;
  farmers_network: number;
  exporters_served: number;
  regions_covered: number;
  product_categories: number;
}

// ─── Newsletter ───────────────────────────────────────────────────────────
export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}
