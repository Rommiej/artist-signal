import { ARTISTS } from "@/lib/artists";
import Header from "@/components/Header";
import ArtistCard from "@/components/ArtistCard";
import AddArtist from "@/components/AddArtist";

const STATS = [
  { label: "Artists monitored", value: "847", sub: "across 12 Asia markets" },
  { label: "Flagged this week", value: "23", sub: "↑ 8 from last week" },
  { label: "Priority signals", value: "3", sub: "act within 48 hrs", green: true },
  { label: "Viral-to-flag", value: "4.2h", sub: "avg response window" },
];

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-bg-deep">
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8">

        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
            <div>
              <h1 className="text-[22px] font-medium text-ink-primary leading-tight">
                Asia-Pacific Discovery Feed
              </h1>
              <p className="text-[12px] text-ink-secondary mt-1">
                Retrospective validation mode · Real artists · Scored at first viral signal
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[10px] font-medium px-2.5 py-1 rounded-full font-mono"
                style={{ background: "rgba(43,127,232,0.1)", color: "#2B7FE8", border: "0.5px solid rgba(43,127,232,0.25)" }}>
                Real artist data
              </span>
              <span className="text-[10px] font-medium px-2.5 py-1 rounded-full font-mono"
                style={{ background: "rgba(240,160,0,0.08)", color: "#F0A000", border: "0.5px solid rgba(240,160,0,0.2)" }}>
                Retrospective
              </span>
            </div>
          </div>

          <div className="rounded-lg px-4 py-3"
            style={{ background: "rgba(43,127,232,0.06)", border: "0.5px solid rgba(43,127,232,0.18)" }}>
            <p className="text-[12px] text-ink-secondary leading-relaxed">
              <span className="text-umg-blue font-medium">Validation mode.</span>{" "}
              These are real artists scored at the moment of their first major viral signal — before label contact or international breakthrough.
              Outcomes are verified against what actually happened. This is what Signal would have told you then.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2.5 mb-6">
          {STATS.map((s) => (
            <div key={s.label} className="bg-bg-card border rounded-lg p-3"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <p className="font-mono text-[9px] text-ink-tertiary mb-2 tracking-wide">{s.label}</p>
              <p className={`text-[21px] font-medium leading-none ${s.green ? "text-sig-green" : "text-ink-primary"}`}>
                {s.value}
              </p>
              <p className="font-mono text-[9px] text-ink-tertiary mt-1.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="section-label">Scored artists</div>
        <div className="space-y-2.5 mb-8">
          {ARTISTS.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>

        <p className="font-mono text-[9px] text-ink-tertiary mb-6 flex items-center justify-between flex-wrap gap-2">
          <span>Data: Spotify · Wikipedia · MusicMetricsVault · Billboard Philippines · IMP Concerts · public record</span>
          <span>Signal monitors PH · ID · MY · TH · VN · KR · JP · TW · SG</span>
        </p>

        <div className="section-label">Analyse an artist</div>
        <AddArtist />

        <div className="mt-10 pt-6 flex items-center justify-between flex-wrap gap-4"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="6" stroke="#2B7FE8" strokeWidth="0.7" fill="none" opacity="0.5"/>
              <circle cx="7" cy="7" r="3" stroke="#2B7FE8" strokeWidth="0.7" fill="none" opacity="0.6"/>
              <circle cx="7" cy="7" r="1.4" fill="#2B7FE8"/>
            </svg>
            <span className="font-mono text-[9px] text-ink-tertiary">SIGNAL · A Universal Music Initiative · Publishing Intelligence v1.0</span>
          </div>
        </div>

      </main>
    </div>
  );
}
