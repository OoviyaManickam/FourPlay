'use client';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useState } from "react";
import { TextAnimate } from "@/components/magicui/text-animate";
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from "@/components/ui/text-reveal-card";
import { useRef } from "react";
import { motion } from "framer-motion";
import celebrationImg from "@/public/celebration.jpeg";
import salaryImg from "@/public/salary.jpeg";
import daoImg from "@/public/dao.jpeg";
import reimburseImg from "@/public/reimburse.png";

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
  const [mode, setMode] = useState<'choose' | 'custom' | 'template'>('choose');
  const [templateIdx, setTemplateIdx] = useState<number | null>(null);
  const [templateAmounts, setTemplateAmounts] = useState(["", "", "", ""]);

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

  function handleTemplateAmountChange(idx: number, value: string) {
    setTemplateAmounts(amts => amts.map((a, i) => i === idx ? value : a));
  }
  function handleTemplateFourplay(idx: number) {
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
        {/* Right Side: Card with options, then form or templates */}
        <div className="flex-[2] max-w-xl w-full flex flex-col items-center justify-center min-h-[500px]">
          {mode === 'choose' && (
            <div className="w-full bg-white/90 rounded-3xl shadow-2xl border border-light p-10 flex flex-col gap-6 items-center backdrop-blur-md">
              <h2 className="font-bungee text-2xl text-accent-primary mb-4 text-center">How do you want to start?</h2>
              <button
                className="btn-accent text-lg font-bungee px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform w-full mb-2"
                onClick={() => setMode('custom')}
              >
                Create your own receipt
              </button>
              <button
                className="btn-accent text-lg font-bungee px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform w-full"
                onClick={() => setMode('template')}
              >
                Choose a template
              </button>
            </div>
          )}
          {mode === 'custom' && (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px]">
              <form
                className="w-full bg-white/90 rounded-3xl shadow-2xl border border-light p-10 flex flex-col gap-8 justify-center items-stretch backdrop-blur-md"
                onSubmit={handleFourplay}
              >
                <h1 className="text-2xl sm:text-3xl font-bungee text-accent-secondary  text-center">                
                <button type="button" className="text-accent-primary font-bungee mb-1 mr-6 text-left" onClick={() => setMode('choose')}>← </button>
                Four words loading...</h1>
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
            </div>
          )}
          {mode === 'template' && (
            <div className="w-full flex  justify-between w-full relative flex-col gap-6 items-center  min-h-[400px]">
              <button type="button" className="text-accent-primary text-2xl font-bungee mt-1 absolute left-0" onClick={() => setMode('choose')}>← </button>
              <h2 className="font-bungee text-2xl text-accent-primary mb-4 mx-auto text-center">Pick a template</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Template 1: Bounty */}
                <div className="relative bg-gradient-to-br from-yellow-200 to-pink-200 rounded-2xl shadow-lg border-2 border-yellow-400 p-6 flex flex-col items-center justify-between min-h-[260px]">
                  <img src="/celebration.jpeg" alt="Bounty" className="w-16 h-16 mb-2" />
                  <div className="font-bungee text-lg text-yellow-700 mb-1">Bounty</div>
                  <div className="text-sm text-yellow-900 mb-2 text-center">Congrats! You earned a bounty for your awesome work. Claim it below.</div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Amount"
                    className="w-full px-4 py-2 rounded-lg border border-yellow-400 bg-yellow-50 text-base font-geist-sans mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={templateAmounts[0]}
                    onChange={e => handleTemplateAmountChange(0, e.target.value)}
                  />
                  <button
                    className="btn-accent text-base font-bungee px-6 py-2 rounded-full shadow-lg mt-2 hover:scale-105 transition-transform"
                    onClick={() => handleTemplateFourplay(0)}
                    type="button"
                  >
                    Fourplay
                  </button>
                </div>
                {/* Template 2: Salary */}
                <div className="relative bg-gradient-to-br from-green-200 to-blue-200 rounded-2xl shadow-lg border-2 border-green-400 p-6 flex flex-col items-center justify-between min-h-[260px]">
                  <img src="/salary.jpeg" alt="Salary" className="w-16 h-16 mb-2" />
                  <div className="font-bungee text-lg text-green-700 mb-1">Salary</div>
                  <div className="text-sm text-green-900 mb-2 text-center">Payday! Your salary is ready to claim. Enter the amount and Fourplay.</div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Amount"
                    className="w-full px-4 py-2 rounded-lg border border-green-400 bg-green-50 text-base font-geist-sans mb-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={templateAmounts[1]}
                    onChange={e => handleTemplateAmountChange(1, e.target.value)}
                  />
                  <button
                    className="btn-accent text-base font-bungee px-6 py-2 rounded-full shadow-lg mt-2 hover:scale-105 transition-transform"
                    onClick={() => handleTemplateFourplay(1)}
                    type="button"
                  >
                    Fourplay
                  </button>
                </div>
                {/* Template 3: DAO Ops */}
                <div className="relative bg-gradient-to-br from-purple-200 to-pink-100 rounded-2xl shadow-lg border-2 border-purple-400 p-6 flex flex-col items-center justify-between min-h-[260px]">
                  <img src="/dao.jpeg" alt="DAO Ops" className="w-16 h-16 mb-2" />
                  <div className="font-bungee text-lg text-purple-700 mb-1">DAO Ops</div>
                  <div className="text-sm text-purple-900 mb-2 text-center">DAO work done! Enter the amount to claim your ops payment.</div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Amount"
                    className="w-full px-4 py-2 rounded-lg border border-purple-400 bg-purple-50 text-base font-geist-sans mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={templateAmounts[2]}
                    onChange={e => handleTemplateAmountChange(2, e.target.value)}
                  />
                  <button
                    className="btn-accent text-base font-bungee px-6 py-2 rounded-full shadow-lg mt-2 hover:scale-105 transition-transform"
                    onClick={() => handleTemplateFourplay(2)}
                    type="button"
                  >
                    Fourplay
                  </button>
                </div>
                {/* Template 4: Reimbursement */}
                <div className="relative bg-gradient-to-br from-blue-100 to-gray-200 rounded-2xl shadow-lg border-2 border-blue-400 p-6 flex flex-col items-center justify-between min-h-[260px]">
                  <img src="/reimburse.png" alt="Reimbursement" className="w-16 h-16 mb-2" />
                  <div className="font-bungee text-lg text-blue-700 mb-1">Reimbursement</div>
                  <div className="text-sm text-blue-900 mb-2 text-center">Get your money back! Enter the amount to claim your reimbursement.</div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Amount"
                    className="w-full px-4 py-2 rounded-lg border border-blue-400 bg-blue-50 text-base font-geist-sans mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={templateAmounts[3]}
                    onChange={e => handleTemplateAmountChange(3, e.target.value)}
                  />
                  <button
                    className="btn-accent text-base font-bungee px-6 py-2 rounded-full shadow-lg mt-2 hover:scale-105 transition-transform"
                    onClick={() => handleTemplateFourplay(3)}
                    type="button"
                  >
                    Fourplay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
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
      
    </div>
  );
}
