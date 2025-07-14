'use client';

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import "@fontsource/bungee";
import "@fontsource/press-start-2p";

const heroColors = [
  "text-[#a259ff]", // Electric purple
  "text-[#00ffb3]", // Cyber green
  "text-[#ff3cac]", // Hot pink
  "text-[#171717] dark:text-[#ededed]", // Soft black
];

const memeCards = [
  {
    emoji: "🦄",
    title: "Pay me like one of your French DAOs.",
    desc: "Cross-chain, meme-powered payments for DAOs, degens, and freelancers.",
  },
  {
    emoji: "🤡",
    title: "No wallet? No problem. Just drop the memes.",
    desc: "No addresses, no stress. Just four funny words to get paid.",
  },
];

const features = [
  {
    icon: "📝",
    title: "Write a Receipt",
    desc: "Generate Meme Words",
    color: "from-[#a259ff] to-[#00ffb3]",
  },
  {
    icon: "🔗",
    title: "Share Meme Words",
    desc: "Claim Tokens",
    color: "from-[#ff3cac] to-[#a259ff]",
  },
  {
    icon: "🪐",
    title: "Built for Mantle",
    desc: "Gas-efficient, smooth",
    color: "from-[#00ffb3] to-[#ff3cac]",
  },
  {
    icon: "🌐",
    title: "Send from Polygon",
    desc: "Land in Mantle.",
    color: "from-[#a259ff] to-[#171717]",
  },
  {
    icon: "😂",
    title: "It’s like Venmo, but funnier.",
    desc: "Meme your way to payment.",
    color: "from-[#ff3cac] to-[#00ffb3]",
  },
];

export default function Home() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="w-full min-h-screen h-screen flex flex-col items-center justify-center bg-[#FFF8F1]">
        <div className="flex flex-col items-center select-none">
          <div className="flex gap-4 sm:gap-8 md:gap-12 lg:gap-16 items-center">
            {/* F */}
            <motion.span
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
              className="font-press-start-2p text-accent-secondary text-7xl sm:text-8xl drop-shadow-[0_2px_24px_rgba(44,182,125,0.4)]"
            >
              F
            </motion.span>
            {/* O */}
            <motion.span
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.3 }}
              className="font-press-start-2p text-coral text-7xl sm:text-8xl drop-shadow-[0_2px_24px_rgba(255,92,88,0.4)]"
            >
              O
            </motion.span>
            {/* U */}
            <motion.span
              initial={{ scale: 0.2, x: 200, opacity: 0 }}
              animate={{ scale: 1, x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180, delay: 0.5 }}
              className="font-press-start-2p text-accent-primary text-7xl sm:text-8xl drop-shadow-[0_2px_24px_rgba(127,90,240,0.4)]"
            >
              U
            </motion.span>
            {/* R */}
            <motion.span
              initial={{ rotate: 180, y: 200, opacity: 0 }}
              animate={{ rotate: 0, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.7 }}
              className="font-press-start-2p text-accent-tertiary text-7xl sm:text-8xl drop-shadow-[0_2px_24px_rgba(255,119,85,0.4)]"
            >
              R
            </motion.span>
          </div>
          {/* PLAY with outline or bold drop-shadow */}
          <motion.span
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, delay: 1 }}
            className="font-press-start-2p text-7xl sm:text-8xl text-[#FFF8F1] mt-4 drop-shadow-[0_0_8px_#7F5AF0,0_0_24px_#2CB67D,0_0_32px_#FF5C58] outline-text"
            style={{ WebkitTextStroke: '2px #7F5AF0' }}
          >
            PLAY
          </motion.span>
        </div>
        {/* Subtitle with typewriter effect */}
        <div className="mt-8 text-center text-accent-primary font-press-start-2p text-base sm:text-2xl min-h-[2.5em]">
          <Typewriter
            words={[
              "foreplay gets you excited.",
              "fourplay gets you paid.",
            ]}
            loop={0}
            cursor
            cursorStyle="_"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1200}
          />
        </div>
      </section>

      {/* WTF IS FOURPLAY SECTION */}
      <section className="w-full min-h-screen h-screen flex flex-col justify-center items-center bg-[#FAFAFA]">
        <h2 className="text-3xl sm:text-5xl font-bungee text-accent-primary mb-10 text-center">🧠 WTF is Fourplay?</h2>
        <div className="flex flex-col sm:flex-row gap-10 justify-center items-stretch w-full max-w-4xl px-4">
          {memeCards.map((card, i) => (
            <div
              key={i}
              className="card-white flex-1 rounded-2xl p-8 shadow-lg border-light hover:scale-105 hover:rotate-[-2deg] transition-transform duration-300 cursor-pointer min-w-[220px] max-w-xs mx-auto border-t-4"
              style={{ borderTopColor: i === 0 ? '#2CB67D' : '#FF5C58' }}
            >
              <div className="text-4xl mb-4">{card.emoji}</div>
              <div className="font-bungee text-2xl text-accent-tertiary mb-2">{card.title}</div>
              <div className="text-muted text-base font-geist-sans">{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES CAROUSEL */}
      <section className="w-full min-h-screen h-screen flex flex-col justify-center items-center bg-highlight-1">
        <h2 className="text-3xl sm:text-5xl font-bungee text-accent-secondary mb-10 text-center">🛠 Features Preview</h2>
        <div className="flex gap-10 overflow-x-auto snap-x snap-mandatory pb-4 px-2 scrollbar-thin scrollbar-thumb-[#7F5AF0]/60 scrollbar-track-transparent w-full max-w-5xl">
          {features.map((f, i) => (
            <div
              key={i}
              className="card-white snap-center min-w-[320px] max-w-sm rounded-2xl p-10 flex flex-col items-center justify-center shadow-lg border-light hover:scale-105 hover:rotate-1 transition-transform duration-300 cursor-pointer border-t-4"
              style={{ borderTopColor: f.color.includes('a259ff') ? '#7F5AF0' : f.color.includes('00ffb3') ? '#2CB67D' : f.color.includes('ff3cac') ? '#FF5C58' : '#FF7755' }}
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <div className="font-bungee text-2xl text-accent-primary mb-2 text-center">{f.title}</div>
              <div className="text-muted text-base font-geist-sans text-center">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="w-full min-h-screen h-screen flex flex-col items-center justify-center bg-[#FFF3E8]">
        <h2 className="text-3xl sm:text-5xl font-bungee text-accent-tertiary mb-10 text-center">📣 Ready to Fourplay?</h2>
        <a
          href="/write-receipt"
          className="btn-accent text-2xl px-16 py-6 rounded-full shadow-lg border-4 border-light transition-all duration-300 flex items-center gap-3"
        >
          <span>Get Started</span> <span className="text-3xl">✨💸</span>
        </a>
      </section>
    </div>
  );
}
