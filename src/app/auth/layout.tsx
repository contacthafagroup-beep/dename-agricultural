import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // pt-20 = 80px to clear the fixed navbar
    // min-h-screen so the background fills the full viewport
    <div className="min-h-screen pt-20 pb-10 relative flex flex-col items-center justify-center px-4 overflow-hidden">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      {/* Dark overlays for readability */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B5E20]/65 via-black/45 to-[#1B5E20]/30" />

      {/* Decorative glows */}
      <div className="absolute top-32 left-16 w-64 h-64 bg-[#1B5E20]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-16 w-48 h-48 bg-[#D89C2B]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Form card — centered */}
      <div className="relative z-10 w-full max-w-[430px]">
        {children}
      </div>

      <p className="relative z-10 mt-8 text-xs text-white/35 text-center">
        © {new Date().getFullYear()} Dename Agricultural Supplier · Hosaena, Ethiopia
      </p>
    </div>
  );
}
