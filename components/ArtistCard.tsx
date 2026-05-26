import Link from "next/link";
import { Artist } from "@/lib/types";
import { getVerdictColors } from "@/lib/artists";
import ScoreDisplay from "./ScoreDisplay";

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

export default function ArtistCard({ artist }: { artist: Artist }) {
  const colors = getVerdictColors(artist.verdict);
  const isPriority = artist.verdict === "Priority Sign";

  return (
    <Link href={`/artist/${artist.id}`} className="block no-underline group"
      style={{ borderRadius: 10 }}>
      <div className={`p-5 transition-all duration-150 group-hover:bg-bg-raised ${isPriority ? "card-green" : "card"}`}>
        {isPriority && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-[5px] h-[5px] rounded-full bg-sig-green"
              style={{ animation: "pulse 2s ease-in-out infinite" }} />
            <span className="font-mono text-[9px] text-sig-green tracking-[0.1em] uppercase">
              Priority signal · act within 48 hrs
            </span>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-medium flex-shrink-0"
            style={{ background: colors.dimBg, color: colors.hex }}>
            {initials(artist.name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-[15px] font-medium text-ink-primary">{artist.name}</span>
              <span className="font-mono text-[10px] text-ink-tertiary">{artist.handle}</span>
            </div>
            <div className="text-[12px] text-ink-secondary mb-3">
              {artist.location} · {artist.genre}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {artist.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0">
            <ScoreDisplay score={artist.score} verdict={artist.verdict} size="sm" />
          </div>
        </div>

        <div className="mt-3 pt-3 flex items-center justify-between gap-3"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <span className="font-mono text-[9px] text-ink-tertiary truncate">
            ◎ {artist.retroDate} — {artist.retroNote}
          </span>
          <span className="text-[11px] text-ink-tertiary group-hover:text-ink-secondary transition-colors flex-shrink-0">
            Deep dive →
          </span>
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </Link>
  );
}
