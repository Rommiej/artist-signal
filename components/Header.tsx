"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg-card border-b border-bg-border shadow-sm"
      style={{ boxShadow: "0 1px 3px rgba(13,22,51,0.06)" }}>
      <div className="max-w-5xl mx-auto px-6 h-[52px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="Signal globe logo mark">
            <circle cx="14" cy="14" r="12" stroke="#2B5FD9" strokeWidth="1" fill="none" opacity="0.3"/>
            <circle cx="14" cy="14" r="7.5" stroke="#2B5FD9" strokeWidth="0.9" fill="none" opacity="0.5"/>
            <circle cx="14" cy="14" r="3.2" fill="#2B5FD9"/>
            <line x1="2" y1="14" x2="26" y2="14" stroke="#2B5FD9" strokeWidth="0.6" opacity="0.2"/>
            <ellipse cx="14" cy="14" rx="4.8" ry="12" stroke="#2B5FD9" strokeWidth="0.6" fill="none" opacity="0.18"/>
          </svg>
          <div>
            <div className="font-mono text-[13px] font-bold text-ink-primary tracking-[0.05em] leading-none">
              SIGNAL
            </div>
            <div className="font-mono text-[9px] text-ink-tertiary tracking-[0.04em] mt-[3px]">
              A Universal Music Initiative
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-[6px] h-[6px] rounded-full bg-sig-green" />
            <span className="font-mono text-[10px] text-ink-secondary">
              Universal Music Asia · Publishing
            </span>
          </div>
          <div className="hidden sm:block h-[14px] w-px bg-bg-border" />
          <span className="font-mono text-[10px] text-ink-tertiary">Demo</span>
        </div>
      </div>
    </header>
  );
}
