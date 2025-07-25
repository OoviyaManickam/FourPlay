import Link from "next/link";
import { ConnectButton } from "./ConnectButton";

export default function Navbar() {
  return (
    <>
    <nav className="fixed bottom-6 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-full shadow-lg flex items-center px-3 sm:px-6 py-2 sm:py-3 gap-2 sm:gap-4 border border-light">
      <Link href="/write-receipt" className="font-bungee text-accent-primary text-base sm:text-lg px-2 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-highlight-1 transition-colors">
      <span className="block sm:hidden">Receipt</span>
      <span className="hidden sm:block">Create Receipt</span>
      </Link>
      <Link href="/drop-code" className="font-bungee text-accent-secondary text-base sm:text-lg px-2 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-highlight-1 transition-colors">
      <span className="block sm:hidden">Code</span>
      <span className="hidden sm:block"> Drop the Code</span>
       
      </Link>
      <div className="ml-1 sm:ml-2">
        <ConnectButton />
      </div>
    </nav>
    </>
  );
}
