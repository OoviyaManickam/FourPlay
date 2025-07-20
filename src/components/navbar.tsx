import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed bottom-6 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-full shadow-lg flex items-center px-3 sm:px-6 py-2 sm:py-3 gap-2 sm:gap-4 border border-light">
      <Link href="/write-receipt" className="font-bungee text-accent-primary text-base sm:text-lg px-2 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-highlight-1 transition-colors">
        Create Receipt
      </Link>
      <Link href="/drop-code" className="font-bungee text-accent-secondary text-base sm:text-lg px-2 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-highlight-1 transition-colors">
        Drop the Code
      </Link>
      <Link href="/" className="btn-accent font-bungee text-base sm:text-lg px-4 sm:px-6 py-1.5 sm:py-2 rounded-full ml-1 sm:ml-2 shadow hover:scale-105 transition-transform">
        Let's Fourplay
      </Link>
    </nav>
  );
}
