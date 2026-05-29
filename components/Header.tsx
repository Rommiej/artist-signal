"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const path = usePathname();
  const isDeals = path.startsWith("/deals");

  return (
    <header className="sticky top-0 z-50 bg-bg-card border-b border-bg-border"
      style={{ boxShadow: "0 1px 3px rgba(13,22,51,0.06)" }}>
      <div className="max-w-6xl mx-auto px-6 h-[52px] flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3 no-underline group flex-shrink-0">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-label="Signal globe logo mark">
            <circle cx="13" cy="13" r="11" stroke="#2B5FD9" strokeWidth="1" fill="none" opacity="0.3"/>
            <circle cx="13" cy="13" r="7" stroke="#2B5FD9" strokeWidth="0.9" fill="none" opacity="0.5"/>
            <circle cx="13" cy="13" r="3" fill="#2B5FD9"/>
            <line x1="2" y1="13" x2="24" y2="13" stroke="#2B5FD9" strokeWidth="0.6" opacity="0.2"/>
            <ellipse cx="13" cy="13" rx="4.5" ry="11" stroke="#2B5FD9" strokeWidth="0.6" fill="none" opacity="0.18"/>
          </svg>
          <div>
            <div className="font-mono text-[13px] font-bold text-ink-primary tracking-[0.05em] leading-none">SIGNAL</div>
            <div className="font-mono text-[9px] text-ink-tertiary tracking-[0.04em] mt-[3px]">A Universal Music Initiative</div>
          </div>
        </Link>

        {/* Nav tabs */}
        <div className="flex items-center gap-1 mx-6">
          <Link href="/" className={`no-underline px-3 py-1.5 rounded-md font-mono text-[11px] font-medium tracking-wide transition-all
            ${!isDeals ? "bg-umg-blue-light text-umg-blue border border-umg-blue-mid" : "text-ink-secondary hover:text-ink-primary hover:bg-bg-raised"}`}>
            A&R Discovery
          </Link>
          <Link href="/deals" className={`no-underline px-3 py-1.5 rounded-md font-mono text-[11px] font-medium tracking-wide transition-all
            ${isDeals ? "bg-umg-blue-light text-umg-blue border border-umg-blue-mid" : "text-ink-secondary hover:text-ink-primary hover:bg-bg-raised"}`}>
            Catalog Deals
          </Link>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-[6px] h-[6px] rounded-full bg-sig-green" />
            <span className="font-mono text-[10px] text-ink-secondary">Universal Music Asia · Publishing</span>
          </div>
          <div className="hidden sm:block h-[14px] w-px bg-bg-border" />
          <span className="font-mono text-[10px] text-ink-tertiary">Demo</span>
        </div>
      </div>
    </header>
  );
}
