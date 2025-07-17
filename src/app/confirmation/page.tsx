"use client";
import { useState } from "react";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar";

// MOCK DATA: Replace with real data from state or backend
const receipt = {
  from: "0x1234...abcd",
  to: "0xabcd...5678",
  description: "Pizza party bounty",
  amount: "0.42 ETH",
  expiration: "1 day",
  tag: "Bounty",
};

export default function ConfirmationPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#FFF8F1] flex flex-col relative">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-20">
        {/* Animated Heading */}
        <TextAnimate
          className="text-3xl sm:text-5xl font-bungee text-accent-primary mb-6 text-center"
          animation="slideUp"
          by="word"
          duration={0.7}
          startOnView
        >
          Read. Relax. Release.
        </TextAnimate>
        {/* Description */}
        <div className="text-lg sm:text-xl font-bungee text-accent-tertiary mb-5 text-center max-w-2xl">
          Re-read the amount. Validate the vibes. Or just click send and pray to Vitalik.
        </div>
        {/* Receipt Card */}
        <div className="bg-white/90 rounded-3xl shadow-2xl border border-light p-10 flex flex-col gap-4 items-stretch w-full max-w-xl mb-5 backdrop-blur-md">
          <DetailRow label="From" value={receipt.from} />
          <DetailRow label="To" value={receipt.to} />
          <DetailRow label="Description" value={receipt.description} />
          <DetailRow label="Amount" value={receipt.amount} />
          <DetailRow label="Expiration" value={receipt.expiration} />
          {receipt.tag && <DetailRow label="Tag" value={receipt.tag} />}
        </div>
        {/* Send Button */}
        <button
          className="btn-accent text-2xl font-bungee px-16 py-4 rounded-full shadow-lg mt-2 hover:scale-105 transition-transform"
          onClick={() => setShowSuccess(true)}
        >
          Send
        </button>
        {/* Success Popup */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="bg-white rounded-3xl shadow-2xl border-2 border-accent p-12 flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.2 }}
                  className="text-6xl mb-4"
                ><svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="45" cy="45" r="40" stroke="#2CB67D" strokeWidth="7" fill="none" />
                <motion.path
                  d="M28 48L41 61L62 36"
                  stroke="#2CB67D"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeInOut" }}
                />
              </svg></motion.div>
                <div className="text-2xl font-bungee text-accent-primary mb-2 text-center">
                  You Just Fourplayed Someone.
                </div>
                <button
                  className="mt-6 btn-accent text-lg font-bungee px-8 py-3 rounded-full shadow hover:scale-105 transition-transform"
                  onClick={() => setShowSuccess(false)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row justify-between items-center py-2 border-b border-light last:border-b-0">
      <span className="font-bungee text-accent-secondary text-lg">{label}</span>
      <span className="font-bungee text-accent-primary text-lg text-right break-all">{value}</span>
    </div>
  );
}
