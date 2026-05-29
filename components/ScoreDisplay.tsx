import { getVerdictColors } from "@/lib/artists";

interface ScoreDisplayProps {
  score: number;
  verdict: string;
  size?: "sm" | "md" | "lg";
  showVerdict?: boolean;
}

export default function ScoreDisplay({ score, verdict, size = "md", showVerdict = true }: ScoreDisplayProps) {
  const colors = getVerdictColors(verdict);
  const pct = Math.min(score, 100) / 100;
  const dims = { sm: 54, md: 70, lg: 86 };
  const strokes = { sm: 5, md: 6, lg: 6.5 };
  const d = dims[size];
  const sw = strokes[size];
  const r = (d - sw * 2) / 2;
  const cx = d / 2;
  const cy = d / 2;
  const total = 2 * Math.PI * r * 0.75;
  const filled = total * pct;
  const fz = { sm: "text-[18px]", md: "text-[24px]", lg: "text-[30px]" };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: d, height: d }}>
        <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} className="-rotate-[225deg]"
          aria-label={`Signal score ${score} out of 100`}>
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke="#D0D8EE" strokeWidth={sw}
            strokeDasharray={`${total} ${2 * Math.PI * r}`}
            strokeDashoffset="-10" strokeLinecap="round"/>
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke={colors.hex} strokeWidth={sw}
            strokeDasharray={`${filled} ${2 * Math.PI * r}`}
            strokeDashoffset="-10" strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.5s ease" }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${fz[size]} font-bold leading-none`} style={{ color: colors.hex }}>
            {score}
          </span>
          {size === "lg" && (
            <span className="font-mono text-[8px] text-ink-tertiary tracking-widest uppercase mt-1">signal</span>
          )}
        </div>
      </div>
      {showVerdict && (
        <span className="verdict-pill" style={{
          background: colors.dimBg,
          color: colors.hex,
          border: `0.5px solid ${colors.lineBorder}`,
        }}>
          {verdict}
        </span>
      )}
    </div>
  );
}
