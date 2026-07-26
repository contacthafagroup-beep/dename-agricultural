"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Mail } from "lucide-react";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNumber = "+251954742383";
  const message = encodeURIComponent(
    "Hello! I'm interested in sourcing Ethiopian agricultural products. Could you please provide more information?"
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-border p-5 w-72"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Dename Agricultural Support</p>
                <p className="text-xs text-green-500">● Online now</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
              Hello! How can we help you today? Ask us about our agricultural products, pricing, or shipping.
            </p>

            <div className="space-y-2">
              <a
                href={`https://wa.me/${whatsappNumber.replace("+", "")}?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#20bd59] transition-colors w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
              <a
                href="tel:+251954742383"
                className="flex items-center gap-2 bg-[#1B5E20] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2E7D32] transition-colors w-full justify-center"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
              <a
                href="mailto:contact.dename@gmail.com"
                className="flex items-center gap-2 border border-border px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors w-full justify-center"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20bd59] text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="Contact us on WhatsApp"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
