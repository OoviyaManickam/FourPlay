'use client';

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import "@fontsource/bungee";
import "@fontsource/press-start-2p";
import { HyperText } from "@/components/magicui/hyper-text";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TextAnimate } from "@/components/magicui/text-animate";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      {/* HERO SECTION */}
      <section className="w-full min-h-[80vh] md:min-h-screen md:h-screen flex flex-col items-center justify-center bg-[#FFF8F1] pt-16 pb-10 md:pt-0 md:pb-0">
        <div className="flex flex-col items-center select-none">
          <div className="flex gap-4 sm:gap-8 md:gap-12 lg:gap-7 items-center">
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
            className="font-press-start-2p text-7xl sm:text-7xl text-[#FFF8F1] mt-4 drop-shadow-[0_0_8px_#7F5AF0,0_0_24px_#2CB67D,0_0_32px_#FF5C58] outline-text"
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


      {/* CTA SECTION - Redefined as two-column bento grid + animated text */}
      <section className="w-full min-h-[80vh] md:min-h-screen md:h-screen flex flex-col md:flex-row items-center justify-center bg-[#FAFAFA] px-2 sm:px-4 gap-8 sm:gap-2 relative overflow-hidden pt-12 pb-10 md:pt-0 md:pb-0">
        {/* Left: Animated heading, content, button */}
        <div className="flex-1 flex flex-col pl-2 sm:pl-10 md:pl-16 justify-center items-start max-w-xl z-10 mb-8 md:mb-0">
          <TextAnimate
            className="text-2xl sm:text-3xl md:text-5xl font-bungee text-accent-tertiary mb-4 sm:mb-6 text-left"
            animation="slideUp"
            by="word"
            duration={0.7}
            startOnView
          >
            Ready to Fourplay?
          </TextAnimate>
          <div className="text-base sm:text-lg md:text-2xl text-accent-primary font-bungee mb-1 sm:mb-2 text-left">Funny words in.<br />Real money out.</div>
          <div className="text-sm sm:text-base md:text-lg text-muted font-geist-sans mb-4 sm:mb-8 text-left">
            No middlemen. No stress. No friction.<br />That’s Fourplay.
          </div>

          <a
          href="/write-receipt"
          className="btn-accent font-bungee text-lg sm:text-2xl px-6 sm:px-12 py-3 sm:py-6 rounded-full shadow-lg border-4 border-light transition-all duration-300 flex items-center gap-3"
        >
          <span>Get Started</span> 
        </a>

        </div>
        {/* Right: Bento grid */}
        <div className="flex-1 flex items-center justify-center w-full max-w-xl z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-4 sm:grid-rows-2 gap-4 sm:gap-6 w-full max-w-md">
            {/* Block 1 */}
            <div className="group relative bg-[#FFF3E8] rounded-2xl shadow-lg border border-light p-4 sm:p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-2xl sm:text-4xl mb-1 sm:mb-2 font-bungee text-accent-secondary"
              >1</motion.div>
              <div className="font-bungee text-accent-tertiary text-base sm:text-lg mb-1">Write Receipt</div>
              <div className="text-muted text-xs sm:text-sm text-center">Generate 4 funny words</div>
            </div>
            {/* Block 2 */}
            <div className="group relative bg-[#FFF3E8] rounded-2xl shadow-lg border border-light p-4 sm:p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
              <motion.div
                animate={{ y: [0, -8, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="text-2xl sm:text-4xl mb-1 sm:mb-2 font-bungee text-accent-primary"
              >2</motion.div>
              <div className="font-bungee text-accent-secondary text-base sm:text-lg mb-1">Share Meme Words</div>
              <div className="text-muted text-xs sm:text-sm text-center">Send them like a link</div>
            </div>
            {/* Block 3 */}
            <div className="group relative bg-[#FFF3E8] rounded-2xl shadow-lg border border-light p-4 sm:p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="text-2xl sm:text-4xl mb-1 sm:mb-2 font-bungee text-accent-primary "
              >3</motion.div>
              <div className="font-bungee text-accent-tertiary text-base sm:text-lg mb-1">Claim Tokens</div>
              <div className="text-muted text-xs sm:text-sm text-center">User enters words</div>
            </div>
            {/* Block 4 */}
            <div className="group relative bg-[#FFF3E8] rounded-2xl shadow-lg border border-light p-4 sm:p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
              <motion.div
                animate={{ scale: [1, 1.1, 0.95, 1], rotate: [0, 6, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="text-2xl sm:text-4xl mb-1 sm:mb-2 font-bungee text-accent-tertiary "
              >4</motion.div>
              <div className="font-bungee text-accent-primary text-base sm:text-lg mb-1">Land on Mantle</div>
              <div className="text-muted text-xs sm:text-sm text-center">Boom. Tokens on Mantle.</div>
            </div>
          </div>
        </div>
      </section>

      {/* WTF IS FOURPLAY SECTION */}
      <section className="w-full min-h-[80vh] md:min-h-screen md:h-screen flex flex-col justify-center items-center bg-[#FFF3E8] px-2 sm:px-4 pt-12 pb-10 md:pt-0 md:pb-0">
        <div className="w-full max-w-3xl flex flex-col items-center">
          <HyperText
            className="text-2xl sm:text-5xl font-bungee text-accent-primary mb-6 text-center"
            startOnView
            duration={1200}
          >
            WTF is FourPlay?
          </HyperText>
          <p className="text-base sm:text-xl text-center text-muted mb-8 font-geist-sans max-w-2xl">
            You ever wish getting paid on-chain was as easy as saying four stupid words?
            Now it is.
          </p>
          <div className="flex flex-col gap-8 w-full">
            {/* Block 1 */}
            <div className="group transition-all duration-300 hover:scale-[1.03] hover:shadow-xl bg-white rounded-2xl px-8 py-6 border border-light flex flex-col items-start relative overflow-hidden">
              <motion.h3
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, delay: 0.1 }}
                viewport={{ once: true }}
                className="font-bungee text-xl sm:text-2xl text-accent-secondary mb-2"
              >
                Forget addresses. Just drop the memes.
              </motion.h3>
              <motion.p
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-base sm:text-lg text-muted font-geist-sans"
              >
                No addresses. No QR codes. Just four funny words to get paid.
              </motion.p>
              <span className="absolute right-0 top-0 w-2 h-full bg-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {/* Block 2 */}
            <div className="group transition-all duration-300 hover:scale-[1.03] hover:shadow-xl bg-white rounded-2xl px-8 py-6 border border-light flex flex-col items-start relative overflow-hidden">
              <motion.h3
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, delay: 0.1 }}
                viewport={{ once: true }}
                className="font-bungee text-xl sm:text-2xl text-accent-primary mb-2"
              >
                Send anywhere. Land on Mantle.
              </motion.h3>
              <motion.p
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-base sm:text-lg text-muted font-geist-sans"
              >
                Works from any chain. All receipts settle on Mantle for max efficiency.
              </motion.p>
              <span className="absolute right-0 top-0 w-2 h-full bg-accent-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {/* Block 3 */}
            <div className="group transition-all duration-300 hover:scale-[1.03] hover:shadow-xl bg-white rounded-2xl px-8 py-6 border border-light flex flex-col items-start relative overflow-hidden">
              <motion.h3
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, delay: 0.1 }}
                viewport={{ once: true }}
                className="font-bungee text-xl sm:text-2xl text-accent-tertiary mb-2"
              >
                Secret codes, but make it silly.
              </motion.h3>
              <motion.p
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-base sm:text-lg text-muted font-geist-sans"
              >
                Only the person with the four-word combo can claim the funds.
              </motion.p>
              <span className="absolute right-0 top-0 w-2 h-full bg-accent-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
