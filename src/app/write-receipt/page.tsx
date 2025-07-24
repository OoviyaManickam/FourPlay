'use client';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useState, useRef, useEffect } from "react";
import { TextAnimate } from "@/components/magicui/text-animate";
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from "@/components/ui/text-reveal-card";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useAccount } from 'wagmi';
// Make sure to install axios: npm install axios
import axios from "axios";

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

const SHUFFLE_SOUND = "/sounds/shuffle.mp3";
const REVEAL_SOUND = "/sounds/reveal.mp3";

export default function WriteReceiptPage() {
  const [crypto, setCrypto] = useState("");
  const [tag, setTag] = useState("");
  const [showReveal, setShowReveal] = useState(false);
  const [words, setWords] = useState(() => getRandomWords());
  const [wordsLoaded, setWordsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chaos, setChaos] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const revealTimeout = useRef<NodeJS.Timeout | null>(null);
  const { address: toaddress, isConnected } = useAccount();
  type Token = { address: string; symbol: string; name: string; chainKey: string };
  const [tokens, setTokens] = useState<Token[]>([]);

  // Fetch tokens for destination chain 'mantle' on mount
  useEffect(() => {
    async function fetchTokens() {
      try {
        const res = await axios.get("https://stargate.finance/api/v1/tokens");
        const mantleTokens = res.data.tokens.filter((token: Token) => token.chainKey === "mantle");
        setTokens(mantleTokens);
        if (mantleTokens.length > 0) setCrypto(mantleTokens[0].address);
      } catch {
        setTokens([]);
      }
    }
    fetchTokens();
  }, []);

  function playSound(url: string) {
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play();
  }

  async function handleFourplay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isConnected || !toaddress) {
      setError("Please connect your wallet before submitting.");
      return;
    }
    if (!description.trim() || !amount) {
      setError("Please fill in all required fields.");
      return;
    }
    const newWords = getRandomWords();
    const memeCode = newWords.join(" ");
    setLoading(true);
    // Store in Supabase
    const { error: supabaseError } = await supabase.from('receipts').insert([
      {
        meme_code: memeCode,
        toaddress,
        value: amount,
        description,
        destination_chain: 'mantle',
        token_address: crypto,
      }
    ]);
    console.log("token address",crypto);
    setLoading(false);
    if (supabaseError) {
      setError("Error saving receipt: " + supabaseError.message);
      return;
    }
    // Only now show the reveal modal and animation
    setWords(newWords);
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
             We&apos;ll cast the spell.
          </TextAnimate>
          <p className="text-lg text-muted font-bungee mb-4">Fill in the deets and let Fourplay turn your request into a secret meme code.</p>
          <p className="text-base text-muted font-bungee">No wallet addresses. No awkward follow-ups. Just funny words and fast payments.</p>
        </div>
        {/* Right Side: Form */}
        <form
          className="flex-[2] max-w-xl w-full bg-white/90 rounded-3xl shadow-2xl border border-light p-10 flex flex-col gap-8 justify-center items-stretch backdrop-blur-md"
          onSubmit={handleFourplay}
        >
          <h1 className="text-2xl sm:text-3xl font-bungee text-accent-secondary  text-center"> Four words loading...</h1>
          {error && <div className="text-red-500 text-center font-bold mb-2">{error}</div>}
          {/* Description */}
          <div>
            <label className="block font-bungee text-accent-primary mb-2">Description</label>
            <input
              type="text"
              placeholder="What is this for?"
              className="w-full px-4 py-3 rounded-lg border border-light bg-highlight-2 text-base font-geist-sans focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
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
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-bungee text-accent-primary mb-2">Token</label>
              <div className="relative">
                <select
                  value={crypto}
                  onChange={e => setCrypto(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-light bg-highlight-2 font-bungee text-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition w-full appearance-none cursor-pointer"
                  style={{ maxHeight: '48px', overflowY: 'auto' }}
                  size={1}
                >
                  {tokens.length === 0 && <option value="">Loading...</option>}
                  {tokens.map((token: Token) => (
                    <option key={token.address} value={token.address} className="font-bungee text-accent-primary bg-white hover:bg-accent-primary/10">
                      {token.symbol} ({token.name})
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-accent-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
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
            disabled={loading}
          >
            {loading ? "Saving..." : "Fourplay"}
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