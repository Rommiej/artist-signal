"use client";
import { useState } from "react";
import { ARTISTS, getVerdictColors } from "@/lib/artists";
import { Artist } from "@/lib/types";
import Header from "@/components/Header";
import ScoreDisplay from "@/components/ScoreDisplay";
import VelocityChart from "@/components/VelocityChart";
import MemoGenerator from "@/components/MemoGenerator";
import AddArtist from "@/components/AddArtist";

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const CONF_CLASS: Record<string, string> = {
  AUTO: "conf-auto", INFER: "conf-infer", MANUAL: "conf-manual",
};

const SIGNAL_COLORS = {
  success: "#00C776", warning: "#F0A000", neutral: "rgba(255,255,255,0.2)",
};

const STATS = [
  { label: "Artists monitored", value: "847", sub: "across 12 Asia markets" },
  { label: "Flagged this week", value: "23", sub: "↑ 8 from last week" },
  { label: "Priority signals", value: "3", sub: "act within 48 hrs", green: true },
  { label: "Viral-to-flag", value: "4.2h", sub: "avg response window" },
];

function ArtistCard({ artist, onClick }: { artist: Artist; onClick: () => void }) {
  const colors = getVerdictColors(artist.verdict);
  const isPriority = artist.verdict === "Priority Sign";
  return (
    <div onClick={onClick} className="cursor-pointer group"
      style={{ borderRadius: 10, background: "#0A1528",
        border: `0.5px solid ${isPriority ? "rgba(0,199,118,0.22)" : "rgba(255,255,255,0.07)"}`,
        padding: "20px", marginBottom: "10px", transition: "background 0.15s" }}>
      {isPriority && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00C776", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#00C776", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Priority signal · act within 48 hrs
          </span>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: colors.dimBg,
          color: colors.hex, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
          {initials(artist.name)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: "#F0F4FF" }}>{artist.name}</span>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{artist.handle}</span>
          </div>
          <div style={{ fontSize: 12, color: "#7A8DAA", marginBottom: 10 }}>
            {artist.location} · {artist.genre}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {artist.tags.map(t => (
              <span key={t} style={{ fontSize: 10, color: "#7A8DAA", background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: 100 }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <ScoreDisplay score={artist.score} verdict={artist.verdict} size="sm" />
        </div>
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "0.5px solid rgba(255,255,255,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          ◎ {artist.retroDate} — {artist.retroNote}
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", flexShrink: 0, marginLeft: 8 }}>Deep dive →</span>
      </div>
    </div>
  );
}

function ArtistProfile({ artist, onBack }: { artist: Artist; onBack: () => void }) {
  const colors = getVerdictColors(artist.verdict);
  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#7A8DAA",
        fontSize: 12, cursor: "pointer", padding: "0 0 20px 0", display: "flex", alignItems: "center", gap: 6 }}>
        ← Back to discovery feed
      </button>

      <div style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.3)",
        background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 7,
        padding: "8px 14px", marginBottom: 16, letterSpacing: "0.06em" }}>
        ◎ RETROSPECTIVE · {artist.retroDate.toUpperCase()} · {artist.retroNote}
      </div>

      {/* HERO */}
      <div style={{ background: "#0A1528", border: `0.5px solid ${artist.verdict === "Priority Sign" ? "rgba(0,199,118,0.22)" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: "20px 22px", marginBottom: 10 }}>
        {artist.verdict === "Priority Sign" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00C776", animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "#00C776", letterSpacing: "0.1em", textTransform: "uppercase" }}>Priority signal</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: colors.dimBg,
            color: colors.hex, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 500, flexShrink: 0, border: `0.5px solid ${colors.lineBorder}` }}>
            {initials(artist.name)}
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontSize: 21, fontWeight: 500, color: "#F0F4FF" }}>{artist.name}</span>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.28)" }}>{artist.handle}</span>
            </div>
            <div style={{ fontSize: 12, color: "#7A8DAA", marginBottom: 10 }}>
              {artist.location} · {artist.genre} · {artist.label}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {artist.tags.map(t => (
                <span key={t} style={{ fontSize: 10, color: "#7A8DAA", background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: 100 }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <ScoreDisplay score={artist.score} verdict={artist.verdict} size="lg" />
            <div style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.22)", marginTop: 6 }}>
              T1 {artist.t1}% · T2 {artist.t2}% · T3 {artist.t3}%
            </div>
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
        {artist.metrics.map(m => (
          <div key={m.label} style={{ background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: 14 }}>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 21, fontWeight: 500, color: m.highlight ? "#00C776" : "#F0F4FF", lineHeight: 1.1 }}>{m.value}</div>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* VELOCITY */}
      <div style={{ background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px", marginBottom: 10 }}>
        <div className="section-label">Streaming velocity — viral song weekly Spotify streams</div>
        <VelocityChart data={artist.velocityData} color={colors.hex} />
        <p style={{ fontSize: 11, color: "#7A8DAA", marginTop: 10, paddingTop: 10, borderTop: "0.5px solid rgba(255,255,255,0.06)", lineHeight: 1.6 }}>
          {artist.velocityNote}
        </p>
      </div>

      {/* INFRA + PLATFORMS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={{ background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px" }}>
          <div className="section-label">Career infrastructure</div>
          {artist.infrastructure.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 11, color: "#7A8DAA", flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: 11, color: "#F0F4FF", textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px" }}>
          <div className="section-label">Platform intelligence</div>
          {artist.platforms.map(p => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#F0F4FF", width: 80, flexShrink: 0 }}>{p.name}</span>
              <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2 }}>
                <div style={{ width: `${p.relativeWidth}%`, height: "100%", background: SIGNAL_COLORS[p.signalType], borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 10, color: "#7A8DAA", width: 72, textAlign: "right" }}>{p.audience}</span>
              <span style={{ fontSize: 10, fontWeight: 500, width: 80, textAlign: "right", color: SIGNAL_COLORS[p.signalType] }}>{p.signal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FACTORS */}
      <div style={{ background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px", marginBottom: 10 }}>
        <div className="section-label">14-factor score breakdown</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }}>
          {artist.factors.map(f => {
            const pct = Math.round((f.score / f.max) * 100);
            const barColor = pct >= 75 ? "#00C776" : pct >= 50 ? "#2B7FE8" : "#E04848";
            const textColor = pct >= 75 ? "#00C776" : pct >= 50 ? "#2B7FE8" : "#E04848";
            return (
              <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 11, color: "#7A8DAA", width: 148, flexShrink: 0 }}>{f.label}</span>
                <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 2 }} />
                </div>
                <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 500, width: 34, textAlign: "right", color: textColor }}>{f.score}/{f.max}</span>
                <span className={CONF_CLASS[f.confidence]}>{f.confidence}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10, paddingTop: 10, borderTop: "0.5px solid rgba(255,255,255,0.05)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#00C776" }}><span className="conf-auto">AUTO</span>from live API</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#2B7FE8" }}><span className="conf-infer">INFER</span>AI analysis</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#F0A000" }}><span className="conf-manual">MANUAL</span>human review</span>
        </div>
      </div>

      {/* GREEN + RISK */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={{ background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px" }}>
          <div className="section-label" style={{ color: "#00C776" }}>Green lights</div>
          {artist.greenLights.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00C776", flexShrink: 0, marginTop: 4 }} />
              <p style={{ fontSize: 12, color: "#7A8DAA", lineHeight: 1.6, margin: 0 }}>{g}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px" }}>
          <div className="section-label" style={{ color: "#E04848" }}>Risk flags</div>
          {artist.riskFlags.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#E04848", flexShrink: 0, marginTop: 4 }} />
              <p style={{ fontSize: 12, color: "#7A8DAA", lineHeight: 1.6, margin: 0 }}>{r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* VALIDATION */}
      <div style={{ background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px", marginBottom: 10 }}>
        <div className="section-label">Validation — what actually happened</div>
        <span style={{ display: "inline-block", fontSize: 10, fontWeight: 500, padding: "3px 10px", borderRadius: 100,
          background: "rgba(0,199,118,0.1)", color: "#00C776", border: "0.5px solid rgba(0,199,118,0.22)", marginBottom: 10 }}>
          {artist.validation.outcome}
        </span>
        <p style={{ fontSize: 12, color: "#7A8DAA", lineHeight: 1.7, margin: 0 }}>{artist.validation.detail}</p>
      </div>

      {/* MEMO */}
      <div style={{ background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px" }}>
        <div className="section-label">A&R intelligence memo</div>
        <MemoGenerator prompt={artist.memoPrompt} artistName={artist.name} />
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState<Artist | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#060D1C" }}>
      <Header />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px" }}>
        {selected ? (
          <ArtistProfile artist={selected} onBack={() => setSelected(null)} />
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 500, color: "#F0F4FF", margin: 0 }}>Asia-Pacific Discovery Feed</h1>
                  <p style={{ fontSize: 12, color: "#7A8DAA", marginTop: 4 }}>Retrospective validation mode · Real artists · Scored at first viral signal</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 500, padding: "3px 10px", borderRadius: 100, fontFamily: "monospace",
                    background: "rgba(43,127,232,0.1)", color: "#2B7FE8", border: "0.5px solid rgba(43,127,232,0.25)" }}>Real artist data</span>
                  <span style={{ fontSize: 10, fontWeight: 500, padding: "3px 10px", borderRadius: 100, fontFamily: "monospace",
                    background: "rgba(240,160,0,0.08)", color: "#F0A000", border: "0.5px solid rgba(240,160,0,0.2)" }}>Retrospective</span>
                </div>
              </div>
              <div style={{ borderRadius: 8, padding: "10px 14px", background: "rgba(43,127,232,0.06)", border: "0.5px solid rgba(43,127,232,0.18)" }}>
                <p style={{ fontSize: 12, color: "#7A8DAA", margin: 0, lineHeight: 1.6 }}>
                  <span style={{ color: "#2B7FE8", fontWeight: 500 }}>Validation mode.</span>{" "}
                  These are real artists scored at the moment of their first major viral signal — before label contact or international breakthrough. Outcomes are verified against what actually happened.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 24 }}>
              {STATS.map(s => (
                <div key={s.label} style={{ background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: 12 }}>
                  <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", margin: "0 0 6px" }}>{s.label}</p>
                  <p style={{ fontSize: 21, fontWeight: 500, color: s.green ? "#00C776" : "#F0F4FF", margin: 0, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", margin: "4px 0 0" }}>{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="section-label">Scored artists</div>
            {ARTISTS.map(artist => (
              <ArtistCard key={artist.id} artist={artist} onClick={() => setSelected(artist)} />
            ))}

            <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", marginBottom: 24 }}>
              Data: Spotify · Wikipedia · MusicMetricsVault · Billboard Philippines · IMP Concerts · public record
            </p>

            <div className="section-label">Analyse an artist</div>
            <AddArtist />
          </>
        )}
      </main>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}
