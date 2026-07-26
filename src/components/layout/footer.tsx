import React from "react";
import Link from "next/link";
import { Leaf, Mail, Phone, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { NewsletterForm } from "@/components/shared/newsletter-form";

const footerLinks = {
  company: [
    { label: "About Us",        href: "/about" },
    { label: "Farmer Network",  href: "/about#farmers" },
    { label: "Our Products",    href: "/products" },
    { label: "Contact Us",      href: "/contact" },
  ],
  products: [
    { label: "🫚 Ginger",        href: "/products/ginger" },
    { label: "☕ Coffee",        href: "/products/coffee" },
    { label: "🌿 Rosemary",      href: "/products/rosemary" },
    { label: "🟡 Turmeric",      href: "/products/turmeric" },
    { label: "🧄 Garlic",        href: "/products/garlic" },
    { label: "🌱 Cardamom",      href: "/products/cardamom" },
    { label: "⚫ Black Pepper",   href: "/products/black-pepper" },
    { label: "🍯 Honey",         href: "/products/honey" },
  ],
  support: [
    { label: "Get Quote",        href: "/contact" },
    { label: "Place Order",      href: "/products" },
    { label: "Track Order",      href: "/dashboard/orders" },
    { label: "Contact Us",       href: "/contact" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

// Real SVG social media icons
const SocialIcons = () => (
  <div className="flex items-center gap-3 mt-6">
    {/* Facebook */}
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
      className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-all duration-200 hover:scale-110">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    </a>
    {/* X / Twitter */}
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
      className="w-9 h-9 rounded-lg bg-white/10 hover:bg-black flex items-center justify-center transition-all duration-200 hover:scale-110">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </a>
    {/* Instagram */}
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
      className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#F77737] flex items-center justify-center transition-all duration-200 hover:scale-110">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    </a>
    {/* LinkedIn */}
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
      className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#0A66C2] flex items-center justify-center transition-all duration-200 hover:scale-110">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    </a>
    {/* WhatsApp */}
    <a href="https://wa.me/251954742383" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
      className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-all duration-200 hover:scale-110">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
    {/* TikTok */}
    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
      className="w-9 h-9 rounded-lg bg-white/10 hover:bg-black flex items-center justify-center transition-all duration-200 hover:scale-110">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z" />
      </svg>
    </a>
  </div>
);

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Stay Updated with Agricultural Market Insights
              </h3>
              <p className="text-[#D89C2B] text-sm mb-1">ስለ ምርቶቻችን ዝማኔ ይቀበሉ</p>
              <p className="text-gray-400 text-sm">
                Get the latest updates on product availability, prices, and new products.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#1B5E20] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm leading-tight">Dename</div>
                <div className="text-[10px] text-[#D89C2B] font-semibold uppercase tracking-wider">Agricultural Supplier</div>
              </div>
            </Link>

            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              Supplying Ethiopia&apos;s finest agricultural products to bulk buyers and exporters worldwide.
              <span className="block mt-1 text-gray-500 text-xs">
                የኢትዮጵያ ምርጥ የግብርና ምርቶች ለዓለም ኤክስፖርተሮች።
              </span>
            </p>

            <div className="space-y-2.5 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                <span>Hosaena Sport Hotel, Hosaena, Hadiya Zone, Ethiopia</span>
              </div>
              <a href="tel:+251954742383" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#1B5E20] shrink-0" />
                <span>+251 954 742 383</span>
              </a>
              <a href="tel:+251465550111" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#1B5E20] shrink-0" />
                <span>+251 046 555 0111</span>
              </a>
              <a href="mailto:contact.dename@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#1B5E20] shrink-0" />
                <span>contact.dename@gmail.com</span>
              </a>
              <a href="https://wa.me/251954742383" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#25D366] transition-colors">
                <MessageCircle className="w-4 h-4 text-[#1B5E20] shrink-0" />
                <span>+251 954 742 383 (WhatsApp)</span>
              </a>
            </div>

            <SocialIcons />
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Products</h4>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Dename Agricultural Supplier · Hosaena, Ethiopia. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
