"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar";
import "@fontsource/press-start-2p";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import { useAccount } from 'wagmi';
import { useWalletClient, usePublicClient } from 'wagmi';

// Remove CORRECT_WORDS and related mock logic

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

// Helper to shorten address
function shortenAddress(addr: string) {
  if (!addr) return '';
  return addr.slice(0, 4) + '...' + addr.slice(-2);
}

type QuoteResult = {
  quotes?: Array<{
    fees?: Array<{ amount: string }>;
    dstAmountMin?: string;
    steps: Array<{
      transaction: {
        to: string;
        data: string;
        value?: string;
      };
    }>;
  }>;
  error?: string;
};

export default function DropCodePage() {
  const [inputs, setInputs] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [receipt, setReceipt] = useState<null | { toaddress: string; value: string; description: string; meme_code: string; destination_chain: string; token_address: string }>(null);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [paySuccess, setPaySuccess] = useState<string | null>(null);
  const [payHashes, setPayHashes] = useState<string[]>([]);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // Animate in sequence
  const [boxesEntered, setBoxesEntered] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  // Handle input change and auto-focus next
  const handleInput = (idx: number, val: string) => {
    // If paste or space, split and fill
    if (/\s/.test(val) || val.split(/\s+/).length > 1) {
      const words = val.trim().split(/\s+/).filter(Boolean).slice(0, 4);
      const newInputs = ["", "", "", ""];
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
    const newInputs = [...inputs];
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
  const handleSubmit = async (words: string[]) => {
    if (loading) return; // Prevent double submit
    const code = words.map((w) => w.toLowerCase()).join(" ");
    setLoading(true);
    setError(false);
    // Query Supabase for the meme code
    const { data } = await supabase
      .from('receipts')
      .select('toaddress, value, description, meme_code, destination_chain, token_address')
      .eq('meme_code', code)
      .single();
    setLoading(false);
    if (data) {
      setReceipt(data);
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

  // Function to get quote and pay
  async function handleGetQuoteAndPay() {
    if (!receipt) return;
    setQuoteLoading(true);
    setQuoteResult(null);
    try {
      const params = {
        srcChainKey: selectedChain, // user paying side
        srcToken: selectedToken,    // user paying side
        srcAddress: address, // currently connected wallet
        dstChainKey: receipt.destination_chain, // from receipt
        dstToken: receipt.token_address,        // from receipt
        dstAddress: receipt.toaddress,         // from receipt
        srcAmount: receipt.value,              // from receipt
        dstAmountMin: Math.floor(Number(receipt.value) * 0.95).toString(),
      };
      const res = await axios.get('https://stargate.finance/api/v1/quotes', { params });
      console.log("parameters-",params);
      setQuoteResult(res.data);
      setShowPayModal(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setQuoteResult({ error: err.response?.data?.message || err.message });
      } else if (err instanceof Error) {
        setQuoteResult({ error: err.message });
      } else {
        setQuoteResult({ error: 'Unknown error' });
      }
    }
    setQuoteLoading(false);
  }

  // Handler for Pay button using wagmi viem and multi-step execution
  async function handlePay() {
    setPayLoading(true);
    setPayError(null);
    setPaySuccess(null);
    setPayHashes([]);
    try {
      if (!quoteResult || !quoteResult.quotes || !quoteResult.quotes.length) throw new Error('No quote available');
      if (!walletClient || !publicClient || !address) throw new Error('Wallet not connected');
      const route = quoteResult.quotes[0];
      const hashes: string[] = [];
      for (let i = 0; i < route.steps.length; i++) {
        const executableTransaction = route.steps[i].transaction;
        const txParams: Record<string, unknown> = {
          account: address,
          to: executableTransaction.to,
          data: executableTransaction.data,
        };
        if (executableTransaction.value && executableTransaction.value !== '0') {
          txParams.value = BigInt(executableTransaction.value);
        }
        // Send transaction
        const txHash = await walletClient.sendTransaction(txParams);
        hashes.push(txHash);
        setPayHashes([...hashes]);
        // Wait for transaction to be mined
        await publicClient.waitForTransactionReceipt({ hash: txHash });
      }
      setPaySuccess('All steps executed successfully');
      setPayHashes([...hashes]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setPayError(error.message || 'Transaction failed');
      } else {
        setPayError('Transaction failed');
      }
    }
    setPayLoading(false);
  }

  // Animate boxes after heading
  useEffect(() => {
    // Delay matches the heading animation (F:0.1, O:0.3, U:0.5, R:0.7, PLAY:1)
    const timeout = setTimeout(() => setBoxesEntered(true), 1200);
    return () => clearTimeout(timeout);
  }, []);

  type Chain = { chainKey: string; name: string };
  type Token = { address: string; symbol: string; name: string; chainKey: string };
  const [chains, setChains] = useState<Chain[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<string>("");

  // Fetch chains and tokens on mount
  useEffect(() => {
    async function fetchChainsAndTokens() {
      try {
        const chainRes = await axios.get("https://stargate.finance/api/v1/chains");
        setChains(chainRes.data.chains);
        if (chainRes.data.chains.length > 0) setSelectedChain(chainRes.data.chains[0].chainKey);
        const tokenRes = await axios.get("https://stargate.finance/api/v1/tokens");
        setTokens(tokenRes.data.tokens);
      } catch {}
    }
    fetchChainsAndTokens();
  }, []);

  // Update selectedToken when selectedChain changes
  useEffect(() => {
    const filtered = tokens.filter((token) => token.chainKey === selectedChain);
    if (filtered.length > 0) setSelectedToken(filtered[0].address);
    else setSelectedToken("");
  }, [selectedChain, tokens]);

  return (
    <div className="w-full min-h-screen bg-[#FFF8F1] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col md:flex-row items-stretch justify-center px-4 pt-25 pb-25 gap-8 max-w-7xl mx-auto w-full">
        {/* Left Side: Heading and instructions */}
        <div className="flex-1 max-w-md flex flex-col justify-center items-start pr-0 md:pr-12">
          <motion.span
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, delay: 1 }}
            className="font-press-start-2p text-4xl sm:text-5xl text-[#FFF8F1] mb-5 drop-shadow-[0_0_8px_#7F5AF0,0_0_24px_#2CB67D,0_0_32px_#FF5C58] outline-text"
            style={{ WebkitTextStroke: '2px #7F5AF0' }}
          >
            LET&apos;S
          </motion.span>
          <div className="flex gap-2 sm:gap-2 md:gap-8 lg:gap-3 items-center mb-2">
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
                className={`font-press-start-2p ${heroColors[i]} text-6xl sm:text-8xl drop-shadow-[0_2px_24px_rgba(44,182,125,0.4)]`}
              >
                {char}
              </motion.span>
            ))}
          </div>
          <motion.span
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, delay: 1 }}
            className="font-press-start-2p text-5xl sm:text-7xl text-[#FFF8F1] mt-4 drop-shadow-[0_0_8px_#7F5AF0,0_0_24px_#2CB67D,0_0_32px_#FF5C58] outline-text"
            style={{ WebkitTextStroke: '2px #7F5AF0' }}
          >
            PLAY
          </motion.span>
          <div className="text-lg font-bungee text-accent-tertiary sm:mb-2 mb:20 text-left px-2 mt-8">
            Enter the four words to proceed with the payment
          </div>
        </div>
        {/* Right Side: Input boxes or receipt card */}
        <div className="flex-[2] max-w-xl w-full flex flex-col justify-center items-stretch">
          {receipt ? (
            <div className="bg-white/90 rounded-3xl shadow-2xl border border-light p-10 flex flex-col gap-4 items-stretch w-full max-w-[90vw] sm:max-w-[600px] lg:max-w-[900px] min-h-[120px] backdrop-blur-md">
              <div className="text-2xl font-bungee text-accent-primary mb-4 text-center">Receipt</div>
              <DetailRow label="To Address" value={receipt.toaddress} />
              <DetailRow label="Amount" value={receipt.value} />
              <DetailRow label="Description" value={receipt.description} />
              <DetailRow label="Meme Code" value={receipt.meme_code} />
              {/* Source Chain and Token Dropdowns in a row at the bottom */}
              <div className="flex flex-row gap-4 mt-6">
                {/* Source Chain Dropdown */}
                <div className="flex-1">
                  <label className="block font-bungee text-accent-primary mb-2">Select Chain</label>
                  <div className="relative">
                    <select
                      value={selectedChain}
                      onChange={e => setSelectedChain(e.target.value)}
                      className="px-4 py-3 rounded-lg border border-light bg-highlight-2 font-bungee text-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition w-full appearance-none cursor-pointer"
                      style={{ maxHeight: '48px', overflowY: 'auto' }}
                      size={1}
                    >
                      {chains.length === 0 && <option value="">Loading...</option>}
                      {chains.map((chain) => (
                        <option key={chain.chainKey} value={chain.chainKey} className="font-bungee text-accent-primary bg-white hover:bg-accent-primary/10">
                          {chain.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-accent-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Source Token Dropdown */}
                <div className="flex-1">
                  <label className="block font-bungee text-accent-primary mb-2">Select Token</label>
                  <div className="relative">
                    <select
                      value={selectedToken}
                      onChange={e => setSelectedToken(e.target.value)}
                      className="px-4 py-3 rounded-lg border border-light bg-highlight-2 font-bungee text-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition w-full appearance-none cursor-pointer"
                      style={{ maxHeight: '48px', overflowY: 'auto' }}
                      size={1}
                    >
                      {tokens.filter((token) => token.chainKey === selectedChain).length === 0 && <option value="">Loading...</option>}
                      {tokens.filter((token) => token.chainKey === selectedChain).map((token) => (
                        <option key={token.address} value={token.address} className="font-bungee text-accent-primary bg-white hover:bg-accent-primary/10">
                          {token.symbol} ({token.name})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-accent-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              {/* Get Quotes and Pay Button */}
              <button
                className="btn-accent text-xl font-bungee px-8 py-4 rounded-full shadow-lg mt-6 hover:scale-105 transition-transform disabled:opacity-60"
                onClick={handleGetQuoteAndPay}
                disabled={quoteLoading}
                type="button"
              >
                {quoteLoading ? "Fetching Quote..." : "Get Quotes and Pay"}
              </button>
              {/* Show 'No routes available' if quoteResult is present but has no quotes */}
              {quoteResult && (!quoteResult.quotes || !quoteResult.quotes.length) && (
                <div className="mt-2 text-coral font-bungee text-center">No routes available</div>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 sm:mt-5 sm:mb-8 mb-10 w-full max-w-3xl justify-center items-center">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial="hidden"
                    animate={boxesEntered ? (shake ? "shake" : "visible") : "hidden"}
                    variants={boxVariants}
                    transition={{ delay: boxesEntered && !shake ? 0.5 + i * 0.12 : 0 }}
                    className={`relative flex flex-col items-center w-30 sm:w-60 h-20 sm:h-32 transition-all duration-200 ${error ? "ring-4 ring-coral" : ""}`}
                  >
                    <input
                      ref={inputRefs[i]}
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      maxLength={16}
                      className="w-full h-12 sm:h-16 text-center text-2xl sm:text-3xl font-bungee bg-transparent outline-none text-accent-primary placeholder:text-accent-primary/60 tracking-wider border-none"
                      value={inputs[i]}
                      onChange={(e) => handleInput(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onBlur={() => handleBlur(i)}
                      disabled={loading}
                      spellCheck={false}
                      style={{ caretColor: "#7F5AF0" }}
                      placeholder={""}
                    />
                    <span className="block w-full h-1 bg-accent-primary rounded-full mt-2" />
                  </motion.div>
                ))}
              </div>
              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-coral font-bungee text-lg mt-2 mb-2 text-center"
                  >
                    Incorrect code! Try again.
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
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
      {/* Loader spinner style */}
      <style jsx global>{`
        .loader {
          border-width: 2px;
          border-style: solid;
          border-radius: 9999px;
          border-color: var(--primary-accent) transparent var(--primary-accent) var(--primary-accent);
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      {/* Show pay modal if needed */}
      {showPayModal && quoteResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg">
          <div className="absolute inset-0" onClick={() => !payLoading && setShowPayModal(false)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-light p-8 flex flex-col gap-4 min-w-[320px] max-w-[90vw]">
            {(!quoteResult.quotes || !quoteResult.quotes.length) ? (
              <div className="text-lg font-bungee text-coral text-center">No quotes found.</div>
            ) : (
              <>
                <div className="text-xl font-bungee text-accent-primary mb-2 text-center">Confirm Payment</div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between items-center">
                    <span className="font-bungee text-accent-secondary">Destination Address</span>
                    <span className="font-geist-sans text-accent-primary">{shortenAddress(receipt?.toaddress || '')}</span>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <span className="font-bungee text-accent-secondary">Destination Chain</span>
                    <span className="font-geist-sans text-accent-primary">{receipt?.destination_chain || '-'}</span>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <span className="font-bungee text-accent-secondary">Amount</span>
                    <span className="font-geist-sans text-accent-primary">{receipt?.value || '-'}</span>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <span className="font-bungee text-accent-secondary">Route Fee</span>
                    <span className="font-geist-sans text-accent-primary">{quoteResult.quotes[0].fees && quoteResult.quotes[0].fees[0] ? quoteResult.quotes[0].fees[0].amount : '-'}</span>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <span className="font-bungee text-accent-secondary">Min. Destination Amount</span>
                    <span className="font-geist-sans text-accent-primary">{quoteResult.quotes[0].dstAmountMin}</span>
                  </div>
                </div>
                {!paySuccess && (
                  <button
                    className="btn-accent text-xl font-bungee px-8 py-4 rounded-full shadow-lg mt-4 hover:scale-105 transition-transform disabled:opacity-60"
                    onClick={async () => { if (!payLoading) await handlePay(); }}
                    disabled={payLoading}
                    type="button"
                  >
                    {payLoading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <span className="loader inline-block w-5 h-5 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : "Pay"}
                  </button>
                )}
                {/* Show pay status */}
                {payError && <div className="mt-2 text-red-500 font-bungee">{payError}</div>}
                {paySuccess && (
                  <div className="mt-4 flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 mb-2 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l3 3 5-5" />
                    </svg>
                    <div className="text-2xl font-bungee text-green-600 mb-2">Transaction Successful!</div>
                    {payHashes.length > 0 && (
                      <div className="flex flex-col gap-1 mt-2">
                        {payHashes.map((hash, idx) => (
                          <span key={hash} className="break-all text-base text-accent-primary">Step {idx + 1} Tx Hash: {hash}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
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

// DetailRow for receipt display
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row justify-between items-center py-2 border-b border-light last:border-b-0">
      <span className="font-bungee text-accent-secondary text-base">{label}</span>
      <span className="font-geist-sans text-base text-accent-primary break-all">{value}</span>
    </div>
  );
}