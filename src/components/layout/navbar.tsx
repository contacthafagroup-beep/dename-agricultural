"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Leaf, Phone, ChevronDown, User, LayoutDashboard,
  LogOut, ShoppingBag, FileText, CreditCard, MessageSquare,
  ArrowRight, Bell, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Profile } from "@/types";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

const productCategories = [
  { href: "/products/ginger",       icon: "🫚", label: "Ginger",       labelAm: "ዝንጅብል" },
  { href: "/products/coffee",       icon: "☕", label: "Coffee",       labelAm: "ቡና" },
  { href: "/products/rosemary",     icon: "🌿", label: "Rosemary",     labelAm: "ሮዝሜሪ" },
  { href: "/products/turmeric",     icon: "🟡", label: "Turmeric",     labelAm: "ቱርሜሪክ" },
  { href: "/products/garlic",       icon: "🧄", label: "Garlic",       labelAm: "ነጭ ሽንኩርት" },
  { href: "/products/cardamom",     icon: "🌱", label: "Cardamom",     labelAm: "ኮረሪማ" },
  { href: "/products/black-pepper", icon: "⚫", label: "Black Pepper", labelAm: "ጥቁር ፍልፍል" },
  { href: "/products/honey",        icon: "🍯", label: "Honey",        labelAm: "ማር" },
];

const accountMenuItems = [
  { href: "/dashboard",              icon: LayoutDashboard, label: "Dashboard",         labelAm: "ዳሽቦርድ" },
  { href: "/dashboard/orders",       icon: ShoppingBag,     label: "My Orders",         labelAm: "ትዕዛዞቼ" },
  { href: "/dashboard/quotations",   icon: FileText,        label: "My Quotations",     labelAm: "ዋጋ ዝርዝሮቼ" },
  { href: "/dashboard/payments",     icon: CreditCard,      label: "Payments",          labelAm: "ክፍያዎች" },
  { href: "/dashboard/messages",     icon: MessageSquare,   label: "Messages",          labelAm: "መልዕክቶች" },
  { href: "/dashboard/profile",      icon: Settings,        label: "Account Settings",  labelAm: "መለያ ቅንብሮች" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function getUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
        setUser(profile);
      }
    }
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: import("@supabase/supabase-js").AuthChangeEvent, session: import("@supabase/supabase-js").Session | null) => {
        if (!session) { setUser(null); setAccountOpen(false); }
        else getUser();
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  // Close account menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccountOpen(false);
    toast.success("Signed out successfully");
    router.push("/");
  };

  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !scrolled;

  const linkClass = cn(
    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
    isTransparent
      ? "text-white/90 hover:text-white hover:bg-white/10"
      : "text-gray-700 dark:text-gray-200 hover:bg-[#1B5E20]/10 hover:text-[#1B5E20]"
  );

  const activeLinkClass = cn(
    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
    isTransparent ? "text-white bg-white/20" : "text-[#1B5E20] bg-[#1B5E20]/10"
  );

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
        scrolled || !isHomePage
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#1B5E20] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className={cn("font-bold text-sm leading-tight transition-colors", isTransparent ? "text-white" : "text-[#1B5E20]")}>
                Dename
              </div>
              <div className="text-[10px] text-[#D89C2B] font-semibold uppercase tracking-widest">
                Agricultural Supplier
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              if (link.href === "/products") {
                return (
                  <div key={link.href} className="relative group">
                    <Link href={link.href}
                      className={cn("flex items-center gap-1", pathname.startsWith("/products") ? activeLinkClass : linkClass)}>
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                    </Link>
                    {/* Products dropdown */}
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-border overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-2">
                          Product Categories
                        </p>
                        <div className="grid grid-cols-2 gap-0.5">
                          {productCategories.map((cat) => (
                            <Link key={cat.href} href={cat.href}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#1B5E20]/8 transition-colors group/item">
                              <span className="text-base">{cat.icon}</span>
                              <div>
                                <p className="text-xs font-medium text-gray-900 dark:text-white group-hover/item:text-[#1B5E20] transition-colors">{cat.label}</p>
                                <p className="text-[9px] text-[#D89C2B]">{cat.labelAm}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-border mt-1.5 pt-1.5 px-3 pb-1">
                          <Link href="/products" className="flex items-center justify-between text-xs font-semibold text-[#1B5E20] hover:underline">
                            View All Products <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link key={link.href} href={link.href}
                  className={pathname === link.href ? activeLinkClass : linkClass}>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: phone + auth */}
          <div className="hidden md:flex items-center gap-2">
            <a href="tel:+251954742383"
              className={cn("flex items-center gap-1.5 text-sm font-medium transition-colors mr-1",
                isTransparent ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-[#1B5E20] dark:text-gray-300")}>
              <Phone className="w-4 h-4" />
              +251 954 742 383
            </a>

            {user ? (
              /* ── MY ACCOUNT DROPDOWN (only when signed in) ── */
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all",
                    isTransparent
                      ? "bg-white/15 text-white hover:bg-white/25 border border-white/25"
                      : "bg-[#1B5E20]/10 text-[#1B5E20] hover:bg-[#1B5E20]/20 border border-[#1B5E20]/20"
                  )}
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-[#1B5E20] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.full_name?.charAt(0)?.toUpperCase() ?? user.email?.charAt(0)?.toUpperCase() ?? "U"}
                  </div>
                  <span className="hidden lg:block max-w-[120px] truncate text-xs">
                    {user.full_name?.split(" ")[0] ?? "My Account"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-border overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="p-4 bg-[#1B5E20]/5 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1B5E20] flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {user.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                              {user.full_name ?? "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            {user.company_name && (
                              <p className="text-xs text-[#D89C2B] font-medium truncate">{user.company_name}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5">
                        {accountMenuItems.map((item) => (
                          <Link key={item.href} href={item.href}
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1B5E20]/8 transition-colors group">
                            <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-[#1B5E20] transition-colors shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#1B5E20] transition-colors">
                                {item.label}
                              </p>
                              <p className="text-[10px] text-[#D89C2B]">{item.labelAm}</p>
                            </div>
                          </Link>
                        ))}

                        {/* Admin link if admin */}
                        {user.role === "admin" && (
                          <Link href="/admin" onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 transition-colors group">
                            <LayoutDashboard className="w-4 h-4 text-amber-600 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-amber-700">Admin Panel</p>
                              <p className="text-[10px] text-amber-500">አስተዳዳሪ ፓነል</p>
                            </div>
                          </Link>
                        )}
                      </div>

                      {/* Sign out */}
                      <div className="p-1.5 border-t border-border">
                        <button onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group cursor-pointer">
                          <LogOut className="w-4 h-4 text-red-500 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-600 text-left">Sign Out</p>
                            <p className="text-[10px] text-red-400">ውጣ</p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── NOT SIGNED IN ── */
              <>
                <Button asChild variant={isTransparent ? "white" : "outline"} size="sm">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild variant={isTransparent ? "secondary" : "default"} size="sm">
                  <Link href="/auth/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setIsOpen(!isOpen)}
            className={cn("md:hidden p-2 rounded-lg transition-colors cursor-pointer",
              isTransparent ? "text-white hover:bg-white/20" : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800")}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-border shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                      ? "bg-[#1B5E20]/10 text-[#1B5E20]"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}>
                  {link.label}
                </Link>
              ))}

              {/* Product categories mobile */}
              <div className="px-4 py-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Products</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {productCategories.map(cat => (
                    <Link key={cat.href} href={cat.href} onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs hover:bg-[#1B5E20]/10 hover:text-[#1B5E20] transition-colors">
                      <span>{cat.icon}</span>
                      <span className="font-medium">{cat.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border space-y-2">
                {user ? (
                  <>
                    {/* User info */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-[#1B5E20]/5 rounded-xl">
                      <div className="w-9 h-9 rounded-full bg-[#1B5E20] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{user.full_name ?? "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.company_name ?? user.email}</p>
                      </div>
                    </div>
                    {accountMenuItems.map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#1B5E20]/8 transition-colors">
                        <item.icon className="w-4 h-4 text-[#1B5E20] shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-xs text-[#D89C2B] ml-auto">{item.labelAm}</span>
                      </Link>
                    ))}
                    {user.role === "admin" && (
                      <Link href="/admin" onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-700 font-semibold text-sm transition-colors">
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Panel · አስተዳዳሪ
                      </Link>
                    )}
                    <button onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-sm font-medium">
                      <LogOut className="w-4 h-4" />
                      Sign Out · ውጣ
                    </button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/auth/register" onClick={() => setIsOpen(false)}>Register as a Buyer</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
