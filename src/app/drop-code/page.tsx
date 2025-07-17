"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar";
import { TextAnimate } from "@/components/magicui/text-animate";
import "@fontsource/press-start-2p";

// Mock: Replace with real code from backend/session
const CORRECT_WORDS = ["unicorn", "pizza", "laser", "banana"];

const heroColors = [
  "text-accent-secondary", // F
  "text-coral",           // O
  "text-accent-primary",  // U
  "text-accent-tertiary", // R
];

const boxVariants = {
  hidden: { scale: 0, opacity: 0, y: 40 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 18 } },
  shake: {
    x: [0, -10, 10, -8, 8, -4, 4, 0],
    transition: { duration: 0.5 },
  },
};

export default function DropCodePage() {
  const [inputs, setInputs] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const router = useRouter();

  // Animate in sequence
  const [boxesEntered, setBoxesEntered] = useState(false);

  // Handle input change and auto-focus next
  const handleInput = (idx: number, val: string) => {
    // If paste or space, split and fill
    if (/\s/.test(val) || val.split(/\s+/).length > 1) {
      const words = val.trim().split(/\s+/).filter(Boolean).slice(0, 4);
      let newInputs = ["", "", "", ""];
      for (let i = 0; i < words.length; i++) newInputs[i] = words[i];
      setInputs(newInputs);
      // If all 4 words are filled, instantly validate
      if (words.length === 4 && newInputs.every(w => w.length > 0)) {
        handleSubmit(newInputs);
      } else if (words.length > 0) {
        inputRefs[Math.min(words.length, 3)].current?.focus();
      }
      return;
    }
    // Normal typing: update only current box
    let newInputs = [...inputs];
    newInputs[idx] = val.replace(/\s/g, "");
    setInputs(newInputs);
  };

  // Move to next box on space, Enter, or blur
  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && inputs[idx].length > 0) {
      e.preventDefault();
      // If all 4 boxes are filled, instantly validate
      if (inputs.every(w => w.length > 0)) {
        handleSubmit(inputs);
      } else if (idx < 3) {
        inputRefs[idx + 1].current?.focus();
      }
    }
    if (e.key === "Backspace" && inputs[idx] === "" && idx > 0) {
      inputRefs[idx - 1].current?.focus();
    }
  };

  const handleBlur = (idx: number) => {
    if (inputs[idx].length > 0 && idx < 3) {
      inputRefs[idx + 1].current?.focus();
    }
    if (inputs.every((w) => w.length > 0)) handleSubmit(inputs);
  };

  // Handle submit
  const handleSubmit = (words: string[]) => {
    if (loading) return; // Prevent double submit
    if (words.map((w) => w.toLowerCase()).join(" ") === CORRECT_WORDS.join(" ")) {
      setLoading(true);
      // Keep overlay up until redirect
      setTimeout(() => {
        router.push("/confirmation");
      }, 5000);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setInputs(["", "", "", ""]);
        setError(false);
        inputRefs[0].current?.focus();
      }, 700);
    }
  };

  // Animate boxes after heading
  useEffect(() => {
    // Delay matches the heading animation (F:0.1, O:0.3, U:0.5, R:0.7, PLAY:1)
    const timeout = setTimeout(() => setBoxesEntered(true), 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FFF8F1] flex flex-col relative">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center pt-5 ">
        {/* Animated Heading - match main page */}
        <div className="flex flex-col items-center select-none mb-16">
        <motion.span
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, delay: 1 }}
            className="font-press-start-2p text-7xl sm:text-5xl text-[#FFF8F1] mb-5 drop-shadow-[0_0_8px_#7F5AF0,0_0_24px_#2CB67D,0_0_32px_#FF5C58] outline-text"
            style={{ WebkitTextStroke: '2px #7F5AF0' }}
          >
            LET'S
          </motion.span>
          <div className="flex gap-4 sm:gap-8 md:gap-12 lg:gap-7 items-center">
            {/* F O U R */}
            {['F', 'O', 'U', 'R'].map((char, i) => (
              <motion.span
                key={char}
                initial={
                  i === 0 ? { x: -200, opacity: 0 }
                  : i === 1 ? { y: -200, opacity: 0 }
                  : i === 2 ? { scale: 0.2, x: 200, opacity: 0 }
                  : { rotate: 180, y: 200, opacity: 0 }
                }
                animate={
                  i === 0 ? { x: 0, opacity: 1 }
                  : i === 1 ? { y: 0, opacity: 1 }
                  : i === 2 ? { scale: 1, x: 0, opacity: 1 }
                  : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ type: "spring", stiffness: 120 + i * 20, delay: 0.1 + i * 0.2 }}
                className={`font-press-start-2p ${heroColors[i]} text-7xl sm:text-8xl drop-shadow-[0_2px_24px_rgba(44,182,125,0.4)]`}
              >
                {char}
              </motion.span>
            ))}
          </div>
          {/* PLAY with outline or bold drop-shadow */}
          <motion.span
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, delay: 1 }}
            className="font-press-start-2p text-7xl sm:text-7xl text-[#FFF8F1] mt-4 drop-shadow-[0_0_8px_#7F5AF0,0_0_24px_#2CB67D,0_0_32px_#FF5C58] outline-text"
            style={{ WebkitTextStroke: '2px #7F5AF0' }}
          >
            PLAY
          </motion.span>
        </div>
        {/* Animated Boxes */}
        <div className="flex gap-12 mt-5 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial="hidden"
              animate={boxesEntered ? (shake ? "shake" : "visible") : "hidden"}
              variants={boxVariants}
              transition={{ delay: boxesEntered && !shake ? 0.5 + i * 0.12 : 0 }}
              className={`rounded-[2rem] bg-accent-primary w-64 h-32 flex items-center justify-center shadow-lg relative transition-all duration-200 ${error ? "ring-4 ring-coral" : ""}`}
            >
              <input
                ref={inputRefs[i]}
                type="text"
                inputMode="text"
                autoComplete="off"
                maxLength={16}
                className="w-full h-full text-center text-3xl font-bungee bg-transparent outline-none text-white placeholder:text-white/60 tracking-wider"
                value={inputs[i]}
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onBlur={() => handleBlur(i)}
                disabled={loading}
                spellCheck={false}
                style={{ caretColor: "#FFF8F1" }}
                placeholder={""}
              />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-7 w-32 h-0.5 bg-white/60 rounded-full" />
            </motion.div>
          ))}
        </div>
        {/* Description */}
        <div className="text-lg font-bungee text-accent-tertiary mb-2 text-center">
          Enter the four words to proceed with the payment
        </div>
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-coral font-bungee text-lg mt-2 mb-2"
            >
              Incorrect code! Try again.
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFF8F1]/90 backdrop-blur-lg pointer-events-auto"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="text-2xl font-bungee text-accent-primary text-center">
              Fourplay initiated...getting in the mood
            </div>
            <div className="mt-8">
              <LoadingDots />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple animated loading dots
function LoadingDots() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-4 h-4 rounded-full bg-accent-primary"
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
