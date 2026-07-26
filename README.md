# 🌿 Dename Ginger Supplier — B2B Agricultural Sourcing Platform

**Ethiopia's premier B2B ginger supplier platform.** A full-stack, production-ready web application built with Next.js 16, Supabase, and Tailwind CSS.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.local` and fill in your real values:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend (email notifications)
RESEND_API_KEY=re_your_key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Maps (contact page)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
```

### 3. Set up Supabase database
- Create a new project at [supabase.com](https://supabase.com)
- Run the SQL schema: `supabase/schema.sql` in the SQL Editor
- Create a storage bucket named `payment-receipts` (public)

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx          # Home
│   │   ├── about/            # About
│   │   ├── products/         # Products + [id]
│   │   ├── services/         # Services
│   │   ├── gallery/          # Gallery
│   │   └── contact/          # Contact
│   ├── auth/                 # Login, Register, Reset Password
│   ├── dashboard/            # Exporter portal
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── orders/           # Order list + detail
│   │   ├── quotations/       # View & accept quotes
│   │   ├── payments/         # Submit payments
│   │   ├── invoices/         # Download invoices
│   │   ├── messages/         # Support messages
│   │   └── profile/          # Account settings
│   ├── admin/                # Admin panel
│   │   ├── page.tsx          # Admin dashboard
│   │   ├── orders/           # Manage orders + create quotes
│   │   ├── products/         # CRUD products
│   │   ├── payments/         # Verify payments
│   │   ├── quotations/       # View all quotations
│   │   ├── invoices/         # Generate invoices
│   │   ├── customers/        # View all exporters
│   │   ├── gallery/          # Manage gallery
│   │   ├── messages/         # Reply to messages
│   │   └── settings/         # Platform settings
│   └── api/                  # API routes
│       ├── orders/           # Create/list orders
│       ├── quotations/       # Create quotations
│       ├── contact/          # Contact form + reply
│       ├── newsletter/       # Newsletter subscribe
│       └── invoices/[id]/pdf # Generate invoice HTML
├── components/
│   ├── home/                 # Homepage sections
│   ├── layout/               # Navbar + Footer
│   ├── orders/               # Order request form
│   ├── shared/               # WhatsApp button, Newsletter
│   └── ui/                   # Button, Card, Input, etc.
├── lib/
│   ├── supabase/             # Client, Server, Middleware
│   └── utils.ts              # Helpers
├── types/                    # TypeScript types
└── middleware.ts             # Auth protection
```

---

## ✨ Features

### Public Website
- 🏠 **Homepage** — Hero, stats, featured products, services, testimonials
- 📋 **Products** — Filter/search ginger stock with detailed specs
- 🏭 **Services** — Complete supply chain services overview
- 🖼️ **Gallery** — Lightbox gallery of operations
- ℹ️ **About** — Company story, mission, farmer network, timeline
- 📞 **Contact** — Form with Google Maps integration

### Exporter Portal
- 🔐 **Authentication** — Register, login, forgot/reset password
- 📊 **Dashboard** — Order stats and quick actions
- 📦 **Orders** — Full order timeline tracking with visual progress
- 💰 **Quotations** — Review, accept or reject price quotes
- 💳 **Payments** — Submit payment receipts for multiple methods
- 🧾 **Invoices** — Download HTML invoices
- 💬 **Messages** — Direct support messaging
- 👤 **Profile** — Edit company details

### Admin Panel
- 📈 **Dashboard** — Real-time statistics
- 🗂️ **Order Management** — Update order status, create quotations
- 🛒 **Product CRUD** — Add/edit/delete ginger products
- ✅ **Payment Verification** — Approve/reject submitted payments
- 👥 **Customer Management** — View all exporters
- 📷 **Gallery Management** — Add/remove gallery images
- 📨 **Message Replies** — Reply to customer inquiries
- 🧾 **Invoice Generation** — Create invoices from orders

### Technical
- 🔒 **RLS Security** — Row-level security on all tables
- 📧 **Email Notifications** — Resend integration for order events
- 🗺️ **Sitemap & Robots** — SEO optimized
- 📱 **Fully Responsive** — Mobile, tablet, desktop
- 🌙 **Dark Mode** — CSS variable-based theming
- ⚡ **Animations** — Framer Motion throughout
- 🟢 **WhatsApp Button** — Floating contact widget

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | Extended user info (company, role, contact) |
| `products` | Ginger product listings with stock levels |
| `orders` | Order requests from exporters |
| `quotations` | Price quotations created by admin |
| `payments` | Payment submissions and verification |
| `invoices` | Generated invoices with line items |
| `messages` | Contact form + support messages |
| `gallery` | Gallery images with categories |
| `testimonials` | Customer testimonials |
| `news_posts` | Blog/news posts |
| `newsletter_subscribers` | Email subscribers |

---

## 🔑 Admin Setup

To create your first admin user:
1. Register a new account at `/auth/register`
2. In Supabase SQL Editor, run:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```
3. Sign in and navigate to `/admin`

---

## 🚀 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# or use vercel.json (already configured)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + custom |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Email | Resend |
| Deployment | Vercel |

---

## 📞 Support

- 📧 contact.dename@gmail.com
- 📧 tilahunmekbib345@gmail.com
- 📱 +251 954 742 383
- 📱 +251 046 555 0111 (WhatsApp: +251 954 742 383)
- 📍 Hosaena Sport Hotel, Hosaena, Ethiopia

---

*Built with ❤️ for Ethiopian agricultural exporters*
