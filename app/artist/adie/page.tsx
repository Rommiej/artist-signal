import { notFound } from "next/navigation";
import Link from "next/link";
import { getArtistById, getVerdictColors, ARTISTS } from "@/lib/artists";
import Header from "@/components/Header";
import ScoreDisplay from "@/components/ScoreDisplay";
import VelocityChart from "@/components/VelocityChart";
import MemoGenerator from "@/components/MemoGenerator";

export function generateStaticParams() {
  return ARTISTS.map((a) => ({ id: a.id }));
}

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const CONF_CLASS: Record<string, string> = {
  AUTO: "conf-auto", INFER: "conf-infer", MANUAL: "conf-manual",
};

const SIGNAL_COLORS = {
  success: "#00C776", warning: "#F0A000", neutral: "rgba(255,255,255,0.2)",
};

export default function ArtistPage({ params }: { params: { id: string } }) {
  const artist = getArtistById(params.id);
  if (!artist) notFound();
  const colors = getVerdictColors(artist.verdict);

  return (
    <div className="min-h-screen bg-bg-deep">
      <Header />
      <main className="max-w-4xl mx-auto px-5 py-8">

        <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] text-ink-tertiary hover:text-ink-secondary transition-colors mb-5 no-underline">
          ← Back to discovery feed
        </Link>

        <div className="font-mono text-[9px] text-ink-tertiary tracking-[0.06em] rounded-md px-3.5 py-2 mb-4"
          style={{ background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)" }}>
          ◎ RETROSPECTIVE · {artist.retroDate.toUpperCase()} · {artist.retroNote}
        </div>

        {/* HERO */}
        <div className="p-6 mb-4" style={{
          background: "#0A1528",
          border: `0.5px solid ${artist.verdict === "Priority Sign" ? "rgba(0,199,118,0.22)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 10,
        }}>
          {artist.verdict === "Priority Sign" && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-[5px] h-[5px] rounded-full bg-sig-green"
                style={{ animation: "pulse 2s ease-in-out infinite" }}/>
              <span className="font-mono text-[9px] text-sig-green tracking-[0.1em] uppercase">Priority signal</span>
            </div>
          )}
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[15px] font-medium flex-shrink-0"
              style={{ background: colors.dimBg, color: colors.hex, border: `0.5px solid ${colors.lineBorder}` }}>
              {initials(artist.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="text-[21px] font-medium text-ink-primary leading-tight">{artist.name}</h1>
                <span className="font-mono text-[11px] text-ink-tertiary">{artist.handle}</span>
              </div>
              <p className="text-[12px] text-ink-secondary mb-3">
                {artist.location} · {artist.genre} · {artist.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {artist.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div className="flex-shrink-0">
              <ScoreDisplay score={artist.score} verdict={artist.verdict} size="lg"/>
              <div className="font-mono text-[9px] text-ink-tertiary text-center mt-2">
                T1 {artist.t1}% · T2 {artist.t2}% · T3 {artist.t3}%
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-4 pt-4" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
            <button className="primary text-[12px]"
              onClick={() => {}}>Generate A&R memo →</button>
            <button className="text-[12px]">Deal structure →</button>
            <button className="text-[12px]">Next 14 days →</button>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          {artist.metrics.map((m) => (
            <div key={m.label} className="bg-bg-card border rounded-lg p-3.5"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <p className="font-mono text-[9px] text-ink-tertiary mb-1.5 tracking-wide">{m.label}</p>
              <p className={`text-[21px] font-medium leading-none ${m.highlight ? "text-sig-green" : "text-ink-primary"}`}>
                {m.value}
              </p>
              <p className="font-mono text-[9px] text-ink-tertiary mt-1.5">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* VELOCITY */}
        <div className="card p-5 mb-4">
          <div className="section-label">Streaming velocity — viral song weekly Spotify streams</div>
          <VelocityChart data={artist.velocityData} color={colors.hex}/>
          <p className="text-[11px] text-ink-secondary mt-3 pt-3 leading-relaxed"
            style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
            {artist.velocityNote}
          </p>
        </div>

        {/* INFRA + PLATFORMS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="card p-5">
            <div className="section-label">Career infrastructure</div>
            {artist.infrastructure.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-2" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[11px] text-ink-secondary flex-shrink-0">{k}</span>
                <span className="text-[11px] text-ink-primary text-right">{v}</span>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <div className="section-label">Platform intelligence</div>
            {artist.platforms.map((p) => (
              <div key={p.name} className="flex items-center gap-2.5 py-2" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[12px] font-medium text-ink-primary w-20 flex-shrink-0">{p.name}</span>
                <div className="flex-1 h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="h-full rounded-full" style={{ width: `${p.relativeWidth}%`, background: SIGNAL_COLORS[p.signalType] }}/>
                </div>
                <span className="text-[10px] text-ink-secondary w-20 text-right">{p.audience}</span>
                <span className="text-[10px] font-medium w-24 text-right"
                  style={{ color: SIGNAL_COLORS[p.signalType] }}>{p.signal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FACTOR BREAKDOWN */}
        <div className="card p-5 mb-4">
          <div className="section-label">14-factor score breakdown</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {artist.factors.map((f) => {
              const pct = Math.round((f.score / f.max) * 100);
              const barColor = pct >= 75 ? "#00C776" : pct >= 50 ? "#2B7FE8" : "#E04848";
              const textColor = pct >= 75 ? "text-sig-green" : pct >= 50 ? "text-umg-blue" : "text-sig-red";
              return (
                <div key={f.label} className="flex items-center gap-2 py-[5px]"
                  style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                  <span className="text-[11px] text-ink-secondary w-36 flex-shrink-0">{f.label}</span>
                  <div className="flex-1 h-[4px] rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }}/>
                  </div>
                  <span className={`font-mono text-[11px] font-medium w-9 text-right ${textColor}`}>
                    {f.score}/{f.max}
                  </span>
                  <span className={CONF_CLASS[f.confidence]}>{f.confidence}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}>
            <span className="flex items-center gap-1.5 text-[10px] text-sig-green"><span className="conf-auto">AUTO</span>from live API</span>
            <span className="flex items-center gap-1.5 text-[10px] text-umg-blue"><span className="conf-infer">INFER</span>AI analysis</span>
            <span className="flex items-center gap-1.5 text-[10px] text-sig-amber"><span className="conf-manual">MANUAL</span>human review</span>
          </div>
        </div>

        {/* GREEN + RISK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="card p-5">
            <div className="section-label" style={{ color: "#00C776" }}>Green lights</div>
            {artist.greenLights.map((g, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-3 last:mb-0">
                <div className="w-[5px] h-[5px] rounded-full bg-sig-green mt-1.5 flex-shrink-0"/>
                <p className="text-[12px] text-ink-secondary leading-relaxed">{g}</p>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <div className="section-label" style={{ color: "#E04848" }}>Risk flags</div>
            {artist.riskFlags.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-3 last:mb-0">
                <div className="w-[5px] h-[5px] rounded-full bg-sig-red mt-1.5 flex-shrink-0"/>
                <p className="text-[12px] text-ink-secondary leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* VALIDATION */}
        <div className="card p-5 mb-4">
          <div className="section-label">Validation — what actually happened</div>
          <span className="inline-block text-[10px] font-medium px-2.5 py-1 rounded-full mb-3"
            style={{ background: "rgba(0,199,118,0.1)", color: "#00C776", border: "0.5px solid rgba(0,199,118,0.22)" }}>
            {artist.validation.outcome}
          </span>
          <p className="text-[12px] text-ink-secondary leading-relaxed">{artist.validation.detail}</p>
        </div>

        {/* MEMO */}
        <div className="card p-5">
          <div className="section-label">A&R intelligence memo</div>
          <MemoGenerator prompt={artist.memoPrompt} artistName={artist.name}/>
        </div>

        <div className="mt-8 pt-5 flex items-center justify-between flex-wrap gap-3"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="5.5" stroke="#2B7FE8" strokeWidth="0.7" fill="none" opacity="0.5"/>
              <circle cx="6.5" cy="6.5" r="2.8" stroke="#2B7FE8" strokeWidth="0.7" fill="none" opacity="0.6"/>
              <circle cx="6.5" cy="6.5" r="1.3" fill="#2B7FE8"/>
            </svg>
            <span className="font-mono text-[9px] text-ink-tertiary">SIGNAL · A Universal Music Initiative</span>
          </div>
          <span className="font-mono text-[9px] text-ink-tertiary">
            Data: Spotify · Wikipedia · MusicMetricsVault · IMP Concerts
          </span>
        </div>

      </main>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}