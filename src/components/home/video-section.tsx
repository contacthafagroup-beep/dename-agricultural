"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
    setIsPlaying(!isPlaying);
  };
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #1B5E20 0%, transparent 50%), radial-gradient(circle at 80% 50%, #D89C2B 0%, transparent 50%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left — text */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-widest">Company Profile</span>
            </div>
            <h2 className="font-bold text-white leading-tight mb-4"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
              See Dename Agricultural <span className="text-[#D89C2B]">in Action</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md">
              From the farms of Hadiya Zone to export-ready packaging — watch how we deliver
              Ethiopia&apos;s finest agricultural products to the world.
              <span className="block mt-1 text-[#D89C2B]/70">
                ደናሜ የግብርና ምርቶች አቅራቢ — የኩባንያ መገለጫ
              </span>
            </p>

            {/* 3 highlights */}
            <div className="space-y-4 mb-8">
              {[
                { icon: "🌿", title: "Farm Visits", desc: "Ginger, coffee, turmeric & herb farms in Hadiya Zone." },
                { icon: "✨", title: "Processing", desc: "Sorting, washing, drying for all 8 product categories." },
                { icon: "📦", title: "Export Ready", desc: "Premium packaging & full documentation for global markets." },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-lg shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-white/50 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about"
              className="inline-flex items-center gap-2 text-[#D89C2B] font-semibold text-sm hover:gap-3 transition-all">
              Learn More About Us <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right — video player */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1 }}>
            <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/50 group"
              style={{ aspectRatio: "16/9" }}>
              <video ref={videoRef} className="w-full h-full object-cover" muted loop playsInline
                poster="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop"
                onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
                <source src="/videos/dename-profile.mp4" type="video/mp4" />
              </video>

              {/* Play overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                  onClick={togglePlay}>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    className="w-18 h-18 rounded-full bg-[#1B5E20] border-4 border-white/30 flex items-center justify-center shadow-2xl"
                    style={{ width: 72, height: 72 }}>
                    <Play className="w-7 h-7 text-white ml-1" />
                  </motion.div>
                </div>
              )}

              {/* Controls bar */}
              <div className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-2 transition-opacity duration-300 ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
                <button onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
                <button onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <div className="flex-1 text-white/50 text-xs">
                  Dename Agricultural — Company Profile
                </div>
                <button onClick={() => setLightboxOpen(true)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                  <Maximize className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Upload hint */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white/60 text-[10px] px-2 py-1 rounded-full">
                Replace: /videos/dename-profile.mp4
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center p-4">
          <button onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10">
            <X className="w-5 h-5" />
          </button>
          <div className="w-full max-w-5xl" style={{ aspectRatio: "16/9" }}>
            <video className="w-full h-full rounded-2xl" controls autoPlay
              poster="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop">
              <source src="/videos/dename-profile.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
