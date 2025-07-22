'use client';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useState } from "react";
import { TextAnimate } from "@/components/magicui/text-animate";
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from "@/components/ui/text-reveal-card";
import { useRef } from "react";
import { motion } from "framer-motion";

const cryptoOptions = ["MNT", "BTC", "ETH", "USDT"];
const expirationOptions = ["Never", "1 hour", "1 day", "7 days"];
const tagOptions = ["Freelance", "Bounty", "DAO Ops", "Salary", "Reimbursement"];

const funkyWordsList = [
  ["unicorn", "pizza", "laser", "banana"],
  ["moonwalk", "toaster", "jazz", "pickle"],
  ["ninja", "waffle", "disco", "sloth"],
  ["wizard", "burrito", "rocket", "llama"],
  ["meme", "socks", "vapor", "goblin"],
  ["cyber", "taco", "glitch", "otter"],
];

function getRandomWords() {
  return funkyWordsList[Math.floor(Math.random() * funkyWordsList.length)];
}

const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
function getRandomChar() {
  return randomChars[Math.floor(Math.random() * randomChars.length)];
}
function getRandomString(len = 6) {
  return Array.from({ length: len }, getRandomChar).join('');
}

const chaosColors = [
  "text-accent-primary",
  "text-accent-secondary",
  "text-accent-tertiary",
];

// Add sound effect URLs (place these files in public/sounds/ or use royalty-free URLs)
const SHUFFLE_SOUND = "/sounds/shuffle.mp3";
const REVEAL_SOUND = "/sounds/reveal.mp3";

export default function WriteReceiptPage() {
  const [crypto, setCrypto] = useState(cryptoOptions[0]);
  const [expiration, setExpiration] = useState(expirationOptions[0]);
  const [tag, setTag] = useState("");
  const [showReveal, setShowReveal] = useState(false);
  const [words, setWords] = useState(() => getRandomWords());
  const [wordsLoaded, setWordsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chaos, setChaos] = useState(false);
  const revealTimeout = useRef<NodeJS.Timeout | null>(null);

  function playSound(url: string) {
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play();
  }

  function handleFourplay(e: React.FormEvent) {
    e.preventDefault();
    setWords(getRandomWords());
    setShowReveal(true);
    setWordsLoaded(false);
    setCopied(false);
    setChaos(true);
    playSound(SHUFFLE_SOUND);
    if (revealTimeout.current) clearTimeout(revealTimeout.current);
    revealTimeout.current = setTimeout(() => {
      setChaos(false);
      setWordsLoaded(true);
      playSound(REVEAL_SOUND);
    }, 2000);
  }

  function handleCopy() {
    navigator.clipboard.writeText(words.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="w-full min-h-screen bg-[#FFF8F1] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col md:flex-row items-stretch justify-center px-4 pt-25 pb-25 gap-8 max-w-7xl mx-auto w-full">
        {/* Left Side */}
        <div className="flex-1 max-w-md flex flex-col justify-center items-start pr-0 md:pr-12">
        <TextAnimate
            className="text-2xl sm:text-3xl font-bungee text-accent-tertiary mb-6 text-left"
            animation="slideUp"
            by="word"
            duration={0.3}
            startOnView
          >
            You write the receipt.
          </TextAnimate>
          <TextAnimate
            className="text-2xl sm:text-3xl font-bungee text-accent-primary mb-6 text-left"
            animation="slideUp"
            by="word"
            duration={1.8}
            startOnView
          >
             We'll cast the spell.
          </TextAnimate>
          <p className="text-lg text-muted font-geist-sans mb-4">Fill in the deets and let Fourplay turn your request into a secret meme code.</p>
          <p className="text-base text-muted font-geist-sans">No wallet addresses. No awkward follow-ups. Just funny words and fast payments.</p>
        </div>
        {/* Right Side: Form */}
        <form
          className="flex-[2] max-w-xl w-full bg-white/90 rounded-3xl shadow-2xl border border-light p-10 flex flex-col gap-8 justify-center items-stretch backdrop-blur-md"
          onSubmit={handleFourplay}
        >
          <h1 className="text-2xl sm:text-3xl font-bungee text-accent-secondary  text-center"> Four words loading...</h1>
          {/* Description */}
          <div>
            <label className="block font-bungee text-accent-primary mb-2">Description</label>
            <input
              type="text"
              placeholder="What is this for?"
              className="w-full px-4 py-3 rounded-lg border border-light bg-highlight-2 text-base font-geist-sans focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
              required
            />
          </div>
          {/* Amount + Crypto */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block font-bungee text-accent-primary mb-2">Amount</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-lg border border-light bg-highlight-2 text-base font-geist-sans focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                required
              />
            </div>
            <div>
              <label className="block font-bungee text-accent-primary mb-2 invisible">Crypto</label>
              <select
                value={crypto}
                onChange={e => setCrypto(e.target.value)}
                className="px-4 py-3 rounded-lg border border-light bg-highlight-2 font-bungee text-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
              >
                {cryptoOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Expiration */}
          <div>
            <label className="block font-bungee text-accent-primary mb-2">Expiration</label>
            <select
              value={expiration}
              onChange={e => setExpiration(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-light bg-highlight-2 font-bungee text-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
            >
              {expirationOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          {/* Tag (optional) */}
          <div>
            <label className="block font-bungee text-accent-primary mb-2">Tag <span className="text-muted font-normal">(optional)</span></label>
            <select
              value={tag}
              onChange={e => setTag(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-light bg-highlight-2 font-bungee text-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
            >
              <option value="">Select a tag</option>
              {tagOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="btn-accent text-xl font-bungee px-8 py-4 rounded-full shadow-lg mt-4 hover:scale-105 transition-transform"
          >
            Fourplay
          </button>
        </form>
        {/* Text Reveal Modal */}
        {showReveal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setShowReveal(false)} />
            <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
              {/* Chaos animation */}
              {chaos && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8 w-full min-h-[120px]">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: 0, scale: 1, opacity: 1 }}
                      animate={{
                        y: [0, -40 + Math.random() * 80, 0],
                        scale: [1, 1.6, 1],
                        opacity: [1, 0.7, 1],
                        rotate: [0, Math.random() * 360, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7 + Math.random() * 0.5,
                        delay: Math.random() * 0.2,
                        ease: "easeInOut",
                      }}
                      className={`font-bungee text-2xl sm:text-3xl select-none ${chaosColors[i % chaosColors.length]}`}
                    >
                      {getRandomString(3 + Math.floor(Math.random() * 3))}
                    </motion.span>
                  ))}
                </div>
              )}
              {/* Reveal Card */}
              {wordsLoaded && (
                <div className="flex items-center justify-center w-full">
                  <TextRevealCard
                  text="hover over the words"
                  revealText={words.join(" ")}
                  className="bg-[#FFF8F1] border-accent-primary shadow-2xl w-full max-w-[90vw] sm:max-w-[600px] lg:max-w-[900px] min-h-[120px] rounded-xl sm:rounded-2xl flex flex-col items-center justify-center px-6 sm:px-10 py-6 sm:py-8"
                >

              <TextRevealCardTitle className="font-bungee text-accent-primary">
                Copy your secret meme code 
                <button
                  onClick={handleCopy}
                  className="ml-2 p-2 rounded-full bg-highlight-2 border border-light hover:bg-accent-primary/10 transition"
                  title="Copy words"
                  type="button"
                >
                  {copied ? (
                    <span className="text-accent-primary font-bold">✔</span>
                  ) : (
                    // Simple copy icon: two overlapping rectangles
                    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="text-accent-primary">
                      <rect x="6" y="6" width="9" height="9" rx="2" strokeWidth="2" />
                      <rect x="3" y="3" width="9" height="9" rx="2" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </TextRevealCardTitle>
              <TextRevealCardDescription className="text-accent-tertiary text-center">
                This is your Fourplay code. Keep it private. Copy and share only with Payer.
              </TextRevealCardDescription>
              <div className="flex items-center justify-center mt-4 w-full">
                {/* Only show the copy button, not the words themselves */}

              </div>
            </TextRevealCard>
          </div>
        )}
      </div>
    </div>
  )}
</main>
<Footer />
</div>
);
}