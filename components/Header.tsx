"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg-deep border-b"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}>
      <div className="max-w-5xl mx-auto px-6 h-[52px] flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3 no-underline group">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="Signal globe logo mark">
            <circle cx="14" cy="14" r="12" stroke="#2B7FE8" strokeWidth="1" fill="none" opacity="0.45"/>
            <circle cx="14" cy="14" r="7.5" stroke="#2B7FE8" strokeWidth="0.9" fill="none" opacity="0.6"/>
            <circle cx="14" cy="14" r="3.2" fill="#2B7FE8"/>
            <line x1="2" y1="14" x2="26" y2="14" stroke="#2B7FE8" strokeWidth="0.6" opacity="0.28"/>
            <ellipse cx="14" cy="14" rx="4.8" ry="12" stroke="#2B7FE8" strokeWidth="0.6" fill="none" opacity="0.22"/>
          </svg>
          <div>
            <div className="font-mono text-[13px] font-medium text-ink-primary tracking-[0.05em] leading-none">
              SIGNAL
            </div>
            <div className="font-mono text-[9px] text-ink-tertiary tracking-[0.05em] mt-[3px]">
              A Universal Music Initiative
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-[5px] h-[5px] rounded-full bg-sig-green"
              style={{ animation: "pulse 2.5s ease-in-out infinite" }} />
            <span className="font-mono text-[10px] text-ink-tertiary">
              Universal Music Asia · Publishing
            </span>
          </div>
          <div className="hidden sm:block h-[14px] w-px bg-bg-border" />
          <span className="font-mono text-[10px] text-ink-tertiary">Demo</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </header>
  );
}
