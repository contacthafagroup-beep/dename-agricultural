"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Video, VideoOff, Camera, Upload,
  Square, Play, Pause, CheckCircle, Loader2, X, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type MediaType = "voice" | "video" | "photo" | "file" | null;

interface MediaOrderFormProps {
  product: { id: string; name: string; };
  onClose: () => void;
}

export function MediaOrderForm({ product, onClose }: MediaOrderFormProps) {
  const [activeType, setActiveType] = useState<MediaType>(null);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    };
  }, [mediaUrl]);

  const startRecording = async (type: "voice" | "video") => {
    setActiveType(type);
    setRecorded(false);
    setMediaBlob(null);
    setMediaUrl("");
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      });
      streamRef.current = stream;
      if (type === "video" && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      const mr = new MediaRecorder(stream, {
        mimeType: type === "video" ? "video/webm" : "audio/webm",
      });
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: type === "video" ? "video/webm" : "audio/webm",
        });
        setMediaBlob(blob);
        setMediaUrl(URL.createObjectURL(blob));
        setRecorded(true);
        stream.getTracks().forEach(t => t.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch {
      toast.error("Microphone/camera access denied · ይፍቀዱ");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const takePhoto = async () => {
    setActiveType("photo");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      toast.error("Camera access denied · ካሜራ አልተፈቀደም");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(blob => {
      if (blob) {
        setMediaBlob(blob);
        setMediaUrl(URL.createObjectURL(blob));
        setRecorded(true);
        streamRef.current?.getTracks().forEach(t => t.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
      }
    }, "image/jpeg");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setUploadedFiles(prev => [...prev, ...files]);
    setActiveType("file");
    setRecorded(true);
  };

  const reset = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setActiveType(null); setRecording(false); setRecorded(false);
    setMediaBlob(null); setMediaUrl(""); setUploadedFiles([]);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) { toast.error("Name and phone required · ስምና ስልክ ያስፈልጋል"); return; }
    if (!mediaBlob && uploadedFiles.length === 0) { toast.error("Please record or upload media · ሚዲያ ያስፈልጋል"); return; }
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const supabaseConfigured = supabaseUrl.length > 0 &&
        !supabaseUrl.includes("your-project") &&
        !supabaseUrl.includes("placeholder");

      if (supabaseConfigured) {
        // Upload main recorded media
        if (mediaBlob) {
          const ext = activeType === "photo" ? "jpg" : "webm";
          const path = `order-media/${Date.now()}-${activeType}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("order-media")
            .upload(path, mediaBlob, { contentType: mediaBlob.type, upsert: true });
          if (!upErr) {
            const { data: { publicUrl } } = supabase.storage.from("order-media").getPublicUrl(path);
            uploadedUrls.push(publicUrl);
          }
        }

        // Upload additional files
        for (const file of uploadedFiles) {
          const path = `order-media/${Date.now()}-${file.name}`;
          const { error: upErr } = await supabase.storage
            .from("order-media")
            .upload(path, file, { contentType: file.type, upsert: true });
          if (!upErr) {
            const { data: { publicUrl } } = supabase.storage.from("order-media").getPublicUrl(path);
            uploadedUrls.push(publicUrl);
          }
        }
      } else {
        // Supabase not configured — note the media types without uploading
        if (mediaBlob) uploadedUrls.push(`[local-${activeType}-recording-not-uploaded]`);
        uploadedFiles.forEach(f => uploadedUrls.push(`[local-file:${f.name}]`));
      }

      // Always create the order regardless of upload success
      const mediaCount = (mediaBlob ? 1 : 0) + uploadedFiles.length;
      const orderNote = `MEDIA ORDER | Type: ${activeType ?? "file"} | Files: ${mediaCount} | Note: ${note || "none"} | Media: ${uploadedUrls.join(", ")}`;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          company_name: name,
          contact_person: name,
          email: "media-order@pending.com",
          phone,
          whatsapp: phone,
          country: "Ethiopia",
          address: "Pending — media order",
          grade: "To be confirmed",
          quantity: 0,
          unit: "MT",
          packaging: "To be confirmed",
          delivery_destination: "Ethiopia",
          preferred_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          shipping_method: "Road Transport",
          special_requirements: orderNote,
          status: "pending_review",
        }),
      });

      if (!res.ok) throw new Error("Order failed");
      setSubmitted(true);
      toast.success("Media order submitted! · ሚዲያ ትዕዛዝ ደርሷል!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit order. Please try again or use the regular form.");
    } finally {
      setUploading(false);
    }
  };

  const mediaOptions = [
    { type: "voice" as const,  icon: Mic,    label: "Voice Order",  labelAm: "በድምፅ ያዝዙ",  color: "bg-green-50 border-green-200 text-green-700",  activeColor: "bg-[#1B5E20] text-white border-[#1B5E20]" },
    { type: "video" as const,  icon: Video,  label: "Video Order",  labelAm: "በቪዲዮ ያዝዙ", color: "bg-blue-50 border-blue-200 text-blue-700",    activeColor: "bg-blue-600 text-white border-blue-600" },
    { type: "photo" as const,  icon: Camera, label: "Photo Order",  labelAm: "ፎቶ ያሳዩ",    color: "bg-amber-50 border-amber-200 text-amber-700",  activeColor: "bg-[#D89C2B] text-white border-[#D89C2B]" },
    { type: "file" as const,   icon: Upload, label: "File Upload",  labelAm: "ፋይል ይጫኑ",   color: "bg-purple-50 border-purple-200 text-purple-700", activeColor: "bg-purple-600 text-white border-purple-600" },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto pt-4 pb-10 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">
              Order by Media <span className="text-[#D89C2B]">· በሚዲያ ያዝዙ</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Record your order by voice, video, photo, or upload any file
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-[#1B5E20]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-[#1B5E20]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Media Order Received!</h3>
            <p className="text-[#D89C2B] font-medium text-sm mb-2">ሚዲያ ትዕዛዝዎ ደርሷል!</p>
            <p className="text-muted-foreground text-sm mb-6">
              Our team will review your media and contact you within 24 hours to confirm pricing.
              <span className="block mt-1 text-xs">ቡድናችን ሚዲያዎን ይመለከታል — ዋጋ በ24 ሰዓት እናሳዝናለን።</span>
            </p>
            <Button onClick={onClose} className="w-full">Close · ዝጋ</Button>
          </div>
        ) : (
          <div className="p-5 space-y-5">

            {/* Media type selector */}
            <div>
              <p className="text-[10px] font-bold text-[#1B5E20] uppercase tracking-widest mb-3">
                Choose How to Order <span className="text-[#D89C2B]">· እንዴት ማዘዝ ይፈልጋሉ?</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {mediaOptions.map(opt => (
                  <button key={opt.type}
                    onClick={() => { if (!recording) { reset(); if (opt.type === "photo") takePhoto(); else if (opt.type !== "file") setActiveType(opt.type); else fileInputRef.current?.click(); } }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm transition-all cursor-pointer ${activeType === opt.type ? opt.activeColor : opt.color} hover:scale-105`}>
                    <opt.icon className="w-7 h-7" />
                    <span className="text-xs font-bold text-center leading-tight">{opt.label}</span>
                    <span className="text-[10px] font-normal opacity-80 text-center">{opt.labelAm}</span>
                  </button>
                ))}
              </div>
              <input ref={fileInputRef} type="file" multiple className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileUpload} />
            </div>

            {/* Recording area */}
            <AnimatePresence>
              {(activeType === "voice" || activeType === "video") && !recorded && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 0.999, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 text-center border border-border">
                  {activeType === "video" && (
                    <video ref={videoRef} muted playsInline
                      className="w-full max-h-48 rounded-xl mb-4 bg-black object-cover" />
                  )}
                  {!recording ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {activeType === "voice" ? "Tap to start recording your voice order · ድምፅዎን ይቅዱ" : "Tap to start video recording · ቪዲዮ ይቅዱ"}
                      </p>
                      <Button onClick={() => startRecording(activeType)} className="gap-2">
                        {activeType === "voice" ? <Mic className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        Start Recording · ቅዳ
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-sm font-semibold text-red-600">Recording… · እየቀዳ ነው</span>
                      </div>
                      <Button variant="destructive" onClick={stopRecording} className="gap-2">
                        <Square className="w-4 h-4" /> Stop · አቁም
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Photo capture */}
              {activeType === "photo" && !recorded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.999 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 text-center border border-border">
                  <video ref={videoRef} muted playsInline
                    className="w-full max-h-48 rounded-xl mb-4 bg-black object-cover" />
                  <Button onClick={capturePhoto} className="gap-2">
                    <Camera className="w-4 h-4" /> Capture Photo · ፎቶ ይቅዱ
                  </Button>
                </motion.div>
              )}

              {/* Preview recorded media */}
              {recorded && mediaUrl && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.999 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">
                      {activeType === "voice" ? "Voice recorded" : activeType === "video" ? "Video recorded" : "Photo captured"} ✓
                    </span>
                  </div>
                  {activeType === "voice" && (
                    <audio ref={audioRef} src={mediaUrl} controls className="w-full" />
                  )}
                  {activeType === "video" && (
                    <video src={mediaUrl} controls className="w-full rounded-xl max-h-40" />
                  )}
                  {activeType === "photo" && (
                    <img src={mediaUrl} alt="Captured" className="w-full rounded-xl max-h-40 object-cover" />
                  )}
                  <button onClick={reset}
                    className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-600 transition-colors cursor-pointer">
                    <RotateCcw className="w-3 h-3" /> Redo · እንደገና
                  </button>
                </motion.div>
              )}

              {/* Uploaded files list */}
              {uploadedFiles.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.999 }}
                  className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-purple-700 mb-2">
                    {uploadedFiles.length} file(s) ready · {uploadedFiles.length} ፋይሎች ዝግጁ
                  </p>
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-white dark:bg-gray-800 rounded-lg px-3 py-2">
                      <span className="truncate max-w-[200px]">{f.name}</span>
                      <span className="text-muted-foreground shrink-0 ml-2">
                        {(f.size / 1024).toFixed(0)}KB
                      </span>
                    </div>
                  ))}
                  <button onClick={() => setUploadedFiles([])}
                    className="text-xs text-red-500 hover:text-red-700 cursor-pointer mt-1">
                    Clear all · ሁሉ ሰርዝ
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Also add more files */}
            {(recorded || uploadedFiles.length > 0) && (
              <button onClick={() => fileInputRef.current?.click()}
                className="w-full text-xs text-[#1B5E20] font-semibold border border-dashed border-[#1B5E20]/40 rounded-xl py-2.5 hover:bg-[#1B5E20]/5 transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> Add more files · ተጨማሪ ፋይሎች ጨምሩ
              </button>
            )}

            {/* Your info */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-[#1B5E20] uppercase tracking-widest">
                Your Contact Info <span className="text-[#D89C2B]">· የእርስዎ ስም እና ስልክ</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Name * <span className="text-[#D89C2B]">· ስም *</span>
                  </Label>
                  <Input className="mt-1" placeholder="Your name · ስምዎ"
                    value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Phone * <span className="text-[#D89C2B]">· ስልክ *</span>
                  </Label>
                  <Input className="mt-1" type="tel" placeholder="+251 or international"
                    value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Additional Note <span className="text-[#D89C2B]">· ተጨማሪ ማስታወሻ</span>
                </Label>
                <Textarea className="mt-1" rows={2}
                  placeholder="Any extra details about your order · ተጨማሪ መረጃ"
                  value={note} onChange={e => setNote(e.target.value)} />
              </div>
            </div>

            {/* Info */}
            <div className="bg-[#1B5E20]/5 border border-[#1B5E20]/15 rounded-xl p-3 text-xs text-muted-foreground">
              <p className="font-bold text-[#1B5E20] mb-0.5">How it works · እንዴት ይሰራል?</p>
              <p>Your media is uploaded → our team reviews → we call/WhatsApp you within 24hrs to confirm order details and pricing.</p>
              <p className="text-[#D89C2B]/80 mt-0.5">ሚዲያዎ ይጫናል → ቡድናችን ይመለከታል → ዋጋ ለማረጋገጥ በ24 ሰዓት እንደውላለን።</p>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel · ሰርዝ
              </Button>
              <Button className="flex-grow" disabled={uploading || (!recorded && uploadedFiles.length === 0)}
                onClick={handleSubmit}>
                {uploading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                  : "Submit Media Order · ሚዲያ ትዕዛዝ ያስገቡ"
                }
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
