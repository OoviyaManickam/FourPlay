export default function Footer() {
  return (
    <footer className="w-full bg-[#FFF8F1] border-t border-light py-8 flex flex-col items-center justify-center gap-2 font-geist-sans mt-12">
      <div className="font-bungee text-accent-primary text-lg mb-1">Fourplay</div>
      <div className="text-muted text-sm mb-2">foreplay gets you excited. fourplay gets you paid.</div>
      <div className="flex gap-6 text-base">
        <a href="/about" className="text-accent-primary hover:underline">About</a>
        <a href="/privacy" className="text-accent-secondary hover:underline">Privacy</a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-accent-tertiary hover:underline">Twitter</a>
      </div>
      <div className="text-xs text-muted mt-2">&copy; {new Date().getFullYear()} Fourplay. All rights reserved.</div>
    </footer>
  );
}
