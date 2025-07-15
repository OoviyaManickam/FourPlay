import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center px-6 py-3 gap-4 border border-light">
      <Link href="/write-receipt" className="font-bungee text-accent-primary text-lg px-4 py-2 rounded-full hover:bg-highlight-1 transition-colors">
        Create Receipt
      </Link>
      <Link href="/drop-code" className="font-bungee text-accent-secondary text-lg px-4 py-2 rounded-full hover:bg-highlight-1 transition-colors">
        Drop the Code
      </Link>
      <Link href="/" className="btn-accent font-bungee text-lg px-6 py-2 rounded-full ml-2 shadow hover:scale-105 transition-transform">
        Let's Fourplay
      </Link>
    </nav>
  );
}
