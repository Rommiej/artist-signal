"use client";
import { useState } from "react";
import { ARTISTS, getVerdictColors } from "@/lib/artists";
import { Artist } from "@/lib/types";
import Header from "@/components/Header";
import ScoreDisplay from "@/components/ScoreDisplay";
import VelocityChart from "@/components/VelocityChart";
import MemoGenerator from "@/components/MemoGenerator";
import AddArtist from "@/components/AddArtist";
import DocumentUpload from "@/components/DocumentUpload";

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const CONF_CLASS: Record<string, string> = {
  AUTO: "conf-auto", INFER: "conf-infer", MANUAL: "conf-manual",
};

const SIGNAL_COLORS: Record<string, string> = {
  success: "#157A52", warning: "#A05C0A", neutral: "#8E9BBF",
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
    <div onClick={onClick} style={{
      background: "#FFFFFF",
      border: isPriority ? `1px solid ${colors.lineBorder}` : "0.5px solid #D0D8EE",
      borderRadius: 10, padding: 20, marginBottom: 10, cursor: "pointer",
      transition: "box-shadow 0.15s, border-color 0.15s",
      boxShadow: "0 1px 3px rgba(13,22,51,0.04)",
    }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(13,22,51,0.09)")}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(13,22,51,0.04)")}>
      {isPriority && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#157A52" }} />
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#157A52", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
            Priority signal · act within 48 hrs
          </span>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: colors.dimBg, color: colors.hex, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, border: `0.5px solid ${colors.lineBorder}` }}>
          {initials(artist.name)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" as const }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#0D1633" }}>{artist.name}</span>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "#8E9BBF" }}>{artist.handle}</span>
          </div>
          <div style={{ fontSize: 12, color: "#5A6A99", marginBottom: 8 }}>{artist.location} · {artist.genre}</div>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
            {artist.tags.map(t => (
              <span key={t} style={{ fontSize: 10, color: "#5A6A99", background: "#F4F7FC", border: "0.5px solid #D0D8EE", padding: "2px 8px", borderRadius: 100 }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <ScoreDisplay score={artist.score} verdict={artist.verdict} size="sm" />
        </div>
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "0.5px solid #E8ECF4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: "#8E9BBF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
          ◎ {artist.retroDate} — {artist.retroNote}
        </span>
        <span style={{ fontSize: 11, color: "#8E9BBF", flexShrink: 0, marginLeft: 8 }}>Deep dive →</span>
      </div>
    </div>
  );
}

function ArtistProfile({ artist, onBack }: { artist: Artist; onBack: () => void }) {
  const colors = getVerdictColors(artist.verdict);

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#5A6A99", fontSize: 12, cursor: "pointer", padding: "0 0 20px 0" }}>
        ← Back to discovery feed
      </button>

      <div style={{ fontFamily: "monospace", fontSize: 9, color: "#8E9BBF", background: "#F4F7FC", border: "0.5px solid #D0D8EE", borderRadius: 7, padding: "8px 14px", marginBottom: 14, letterSpacing: "0.06em" }}>
        ◎ RETROSPECTIVE · {artist.retroDate.toUpperCase()} · {artist.retroNote}
      </div>

      {/* HERO */}
      <div style={{ background: "#FFFFFF", border: `${artist.verdict === "Priority Sign" ? "1px" : "0.5px"} solid ${artist.verdict === "Priority Sign" ? colors.lineBorder : "#D0D8EE"}`, borderRadius: 10, padding: "20px 22px", marginBottom: 10, boxShadow: "0 1px 4px rgba(13,22,51,0.05)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" as const }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: colors.dimBg, color: colors.hex, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0, border: `1px solid ${colors.lineBorder}` }}>
            {initials(artist.name)}
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const, marginBottom: 3 }}>
              <span style={{ fontSize: 21, fontWeight: 700, color: "#0D1633" }}>{artist.name}</span>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "#8E9BBF" }}>{artist.handle}</span>
            </div>
            <p style={{ fontSize: 12, color: "#5A6A99", marginBottom: 10 }}>{artist.location} · {artist.genre} · {artist.label}</p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5 }}>
              {artist.tags.map(t => <span key={t} style={{ fontSize: 10, color: "#5A6A99", background: "#F4F7FC", border: "0.5px solid #D0D8EE", padding: "2px 8px", borderRadius: 100 }}>{t}</span>)}
            </div>
          </div>
          <div style={{ flexShrink: 0, textAlign: "right" as const }}>
            <ScoreDisplay score={artist.score} verdict={artist.verdict} size="lg" />
            <div style={{ fontFamily: "monospace", fontSize: 9, color: "#8E9BBF", marginTop: 5 }}>T1 {artist.t1}% · T2 {artist.t2}% · T3 {artist.t3}%</div>
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
        {artist.metrics.map(m => (
          <div key={m.label} style={{ background: "#FFFFFF", border: "0.5px solid #D0D8EE", borderRadius: 9, padding: 14, boxShadow: "0 1px 3px rgba(13,22,51,0.04)" }}>
            <p style={{ fontFamily: "monospace", fontSize: 9, color: "#8E9BBF", margin: "0 0 6px" }}>{m.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: m.highlight ? "#157A52" : "#0D1633", margin: 0, lineHeight: 1.1 }}>{m.value}</p>
            <p style={{ fontFamily: "monospace", fontSize: 9, color: "#8E9BBF", margin: "4px 0 0" }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* VELOCITY */}
      <div style={{ background: "#FFFFFF", border: "0.5px solid #D0D8EE", borderRadius: 10, padding: "18px 20px", marginBottom: 10, boxShadow: "0 1px 3px rgba(13,22,51,0.04)" }}>
        <div className="section-label">Streaming velocity — viral song weekly Spotify streams</div>
        <VelocityChart data={artist.velocityData} color={colors.hex} />
        <p style={{ fontSize: 11, color: "#5A6A99", marginTop: 10, paddingTop: 10, borderTop: "0.5px solid #E8ECF4", lineHeight: 1.6 }}>{artist.velocityNote}</p>
      </div>

      {/* INFRA + PLATFORMS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={{ background: "#FFFFFF", border: "0.5px solid #D0D8EE", borderRadius: 10, padding: "18px 20px", boxShadow: "0 1px 3px rgba(13,22,51,0.04)" }}>
          <div className="section-label">Career infrastructure</div>
          {artist.infrastructure.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderBottom: "0.5px solid #E8ECF4" }}>
              <span style={{ fontSize: 11, color: "#8E9BBF", flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: 11, color: "#0D1633", textAlign: "right" as const }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#FFFFFF", border: "0.5px solid #D0D8EE", borderRadius: 10, padding: "18px 20px", boxShadow: "0 1px 3px rgba(13,22,51,0.04)" }}>
          <div className="section-label">Platform intelligence</div>
          {artist.platforms.map(p => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "0.5px solid #E8ECF4" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0D1633", width: 88, flexShrink: 0 }}>{p.name}</span>
              <div style={{ flex: 1, height: 4, background: "#E8ECF4", borderRadius: 2 }}>
                <div style={{ width: `${p.relativeWidth}%`, height: "100%", background: SIGNAL_COLORS[p.signalType], borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 10, color: "#5A6A99", width: 72, textAlign: "right" as const }}>{p.audience}</span>
              <span style={{ fontSize: 10, fontWeight: 600, width: 88, textAlign: "right" as const, color: SIGNAL_COLORS[p.signalType] }}>{p.signal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FACTORS */}
      <div style={{ background: "#FFFFFF", border: "0.5px solid #D0D8EE", borderRadius: 10, padding: "18px 20px", marginBottom: 10, boxShadow: "0 1px 3px rgba(13,22,51,0.04)" }}>
        <div className="section-label">14-factor score breakdown</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }}>
          {artist.factors.map(f => {
            const pct = Math.round((f.score / f.max) * 100);
            const barColor = pct >= 75 ? "#157A52" : pct >= 50 ? "#2B5FD9" : "#C0392B";
            const textColor = pct >= 75 ? "#157A52" : pct >= 50 ? "#2B5FD9" : "#C0392B";
            return (
              <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: "0.5px solid #E8ECF4" }}>
                <span style={{ fontSize: 11, color: "#5A6A99", width: 148, flexShrink: 0 }}>{f.label}</span>
                <div style={{ flex: 1, height: 4, background: "#E8ECF4", borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 2 }} />
                </div>
                <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, width: 34, textAlign: "right" as const, color: textColor }}>{f.score}/{f.max}</span>
                <span className={CONF_CLASS[f.confidence]}>{f.confidence}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10, paddingTop: 10, borderTop: "0.5px solid #E8ECF4" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#157A52" }}><span className="conf-auto">AUTO</span>from live API</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#2B5FD9" }}><span className="conf-infer">INFER</span>AI analysis</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#A05C0A" }}><span className="conf-manual">MANUAL</span>human review</span>
        </div>
      </div>

      {/* GREEN + RISK */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={{ background: "#FFFFFF", border: "0.5px solid #D0D8EE", borderRadius: 10, padding: "18px 20px", boxShadow: "0 1px 3px rgba(13,22,51,0.04)" }}>
          <div className="section-label" style={{ color: "#157A52" }}>Green lights</div>
          {artist.greenLights.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#157A52", flexShrink: 0, marginTop: 4 }} />
              <p style={{ fontSize: 12, color: "#5A6A99", lineHeight: 1.6, margin: 0 }}>{g}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "#FFFFFF", border: "0.5px solid #D0D8EE", borderRadius: 10, padding: "18px 20px", boxShadow: "0 1px 3px rgba(13,22,51,0.04)" }}>
          <div className="section-label" style={{ color: "#C0392B" }}>Risk flags</div>
          {artist.riskFlags.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C0392B", flexShrink: 0, marginTop: 4 }} />
              <p style={{ fontSize: 12, color: "#5A6A99", lineHeight: 1.6, margin: 0 }}>{r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* VALIDATION */}
      <div style={{ background: "#FFFFFF", border: "0.5px solid #D0D8EE", borderRadius: 10, padding: "18px 20px", marginBottom: 10, boxShadow: "0 1px 3px rgba(13,22,51,0.04)" }}>
        <div className="section-label">Validation — what actually happened</div>
        <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#E6F5EE", color: "#157A52", border: "0.5px solid #B8E5D0", marginBottom: 10 }}>
          {artist.validation.outcome}
        </span>
        <p style={{ fontSize: 12, color: "#5A6A99", lineHeight: 1.7, margin: 0 }}>{artist.validation.detail}</p>
      </div>

      {/* MEMO */}
      <div style={{ background: "#FFFFFF", border: "0.5px solid #D0D8EE", borderRadius: 10, padding: "18px 20px", boxShadow: "0 1px 3px rgba(13,22,51,0.04)" }}>
        <div className="section-label">A&R intelligence memo</div>
        <MemoGenerator prompt={artist.memoPrompt} artistName={artist.name} />
      </div>

      <div style={{ marginTop: 28, paddingTop: 16, borderTop: "0.5px solid #D0D8EE", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="5.5" stroke="#2B5FD9" strokeWidth="0.7" fill="none" opacity="0.4"/>
            <circle cx="6.5" cy="6.5" r="2.8" stroke="#2B5FD9" strokeWidth="0.7" fill="none" opacity="0.5"/>
            <circle cx="6.5" cy="6.5" r="1.3" fill="#2B5FD9"/>
          </svg>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#8E9BBF" }}>SIGNAL · A Universal Music Initiative</span>
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: "#8E9BBF" }}>Data: Spotify · Wikipedia · MusicMetricsVault · IMP Concerts</span>
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState<Artist | null>(null);
  const [uploadedArtistData, setUploadedArtistData] = useState<Record<string, any> | null>(null);

  function handleArtistDocumentFields(extracted: Record<string, any>) {
    setUploadedArtistData(extracted);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#EEF2F9" }}>
      <Header />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {selected ? (
          <ArtistProfile artist={selected} onBack={() => setSelected(null)} />
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 12, marginBottom: 12 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0D1633", margin: 0 }}>Asia-Pacific Discovery Feed</h1>
                  <p style={{ fontSize: 12, color: "#5A6A99", marginTop: 4 }}>Retrospective validation mode · Real artists · Scored at first viral signal</p>
                </div>
                <div style={{ display: "flex", gap: 7 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 100, fontFamily: "monospace", background: "#EEF3FE", color: "#2B5FD9", border: "0.5px solid #D0DEFA" }}>Real artist data</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 100, fontFamily: "monospace", background: "#FEF3E2", color: "#A05C0A", border: "0.5px solid #FAD898" }}>Retrospective</span>
                </div>
              </div>
              <div style={{ borderRadius: 8, padding: "10px 14px", background: "#EEF3FE", border: "0.5px solid #D0DEFA" }}>
                <p style={{ fontSize: 12, color: "#5A6A99", margin: 0, lineHeight: 1.6 }}>
                  <span style={{ color: "#2B5FD9", fontWeight: 600 }}>Validation mode.</span>{" "}
                  These are real artists scored at the moment of their first major viral signal — before label contact or international breakthrough. Outcomes are verified against what actually happened.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 24 }}>
              {STATS.map(s => (
                <div key={s.label} style={{ background: "#FFFFFF", border: "0.5px solid #D0D8EE", borderRadius: 9, padding: 14, boxShadow: "0 1px 3px rgba(13,22,51,0.04)" }}>
                  <p style={{ fontFamily: "monospace", fontSize: 9, color: "#8E9BBF", margin: "0 0 6px" }}>{s.label}</p>
                  <p style={{ fontSize: 22, fontWeight: 700, color: s.green ? "#157A52" : "#0D1633", margin: 0, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontFamily: "monospace", fontSize: 9, color: "#8E9BBF", margin: "4px 0 0" }}>{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="section-label">Scored artists</div>
            {ARTISTS.map(artist => (
              <ArtistCard key={artist.id} artist={artist} onClick={() => setSelected(artist)} />
            ))}

            <p style={{ fontFamily: "monospace", fontSize: 9, color: "#8E9BBF", marginBottom: 24 }}>
              Data: Spotify · Wikipedia · MusicMetricsVault · Billboard Philippines · IMP Concerts · public record
            </p>

            <div className="section-label">Upload artist document</div>
            <DocumentUpload module="artist_discovery" onFieldsApplied={handleArtistDocumentFields} />

            <div className="section-label">Analyse an artist</div>
            <AddArtist />

            <div style={{ marginTop: 32, paddingTop: 16, borderTop: "0.5px solid #D0D8EE", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="6" stroke="#2B5FD9" strokeWidth="0.7" fill="none" opacity="0.4"/>
                  <circle cx="7" cy="7" r="3" stroke="#2B5FD9" strokeWidth="0.7" fill="none" opacity="0.5"/>
                  <circle cx="7" cy="7" r="1.4" fill="#2B5FD9"/>
                </svg>
                <span style={{ fontFamily: "monospace", fontSize: 9, color: "#8E9BBF" }}>SIGNAL · A Universal Music Initiative · Publishing Intelligence v1.0</span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
