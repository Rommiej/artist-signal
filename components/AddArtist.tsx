"use client";
import { useState } from "react";
import { AnalysisResult } from "@/lib/types";
import { getVerdictColors } from "@/lib/artists";

const QUICK = ["Pamungkas","MILLI","Phum Viphurit","yung kai","Ylona Garcia","Rich Brian","Cup of Joe"];

function getAnalysisPrompt(name: string) {
  return `You are a senior A&R analyst at Universal Music Group Asia using the Signal platform. Based on your knowledge of publicly available data about the artist "${name}", produce a Signal scoring assessment.

Output EXACTLY in this format (no other text, no markdown, no backticks):

SIGNAL SCORE: [number 0-100]
VERDICT: [Priority Sign | Development Deal | Watch & Wait | Pass]
TIER SCORES: T1 [%] · T2 [%] · T3 [%]

ARTIST CONTEXT: [2-3 sentences]

KEY INDICATORS:
- [specific data point]
- [specific data point]
- [specific data point]
- [specific data point]

SCORING RATIONALE: [2-3 sentences]

PRIMARY RISK FLAG: [1 sentence]
PRIMARY GREEN LIGHT: [1 sentence]

PUBLISHING OPPORTUNITY: [1-2 sentences]`;
}

export default function AddArtist() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const analyse = async (name: string) => {
    if (!name.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 700,
          messages: [{ role: "user", content: getAnalysisPrompt(name.trim()) }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw = data.content?.[0]?.text || "";

      const getField = (label: string) => {
        const m = raw.match(new RegExp(`${label}:\\s*([\\s\\S]+?)(?=\\n[A-Z][A-Z ]+:|$)`));
        return m ? m[1].trim() : "";
      };
      const scoreMatch = raw.match(/SIGNAL SCORE:\s*(\d+)/);
      const verdictMatch = raw.match(/VERDICT:\s*(.+)/);
      const tierMatch = raw.match(/TIER SCORES:\s*(.+)/);
      const bulletsMatch = raw.match(/KEY INDICATORS:\s*([\s\S]+?)(?=\n[A-Z][A-Z ]+:|$)/);
      const indicators = bulletsMatch
        ? bulletsMatch[1].split("\n").map((l: string) => l.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean)
        : [];

      setResult({
        name,
        score: scoreMatch ? parseInt(scoreMatch[1]) : 50,
        verdict: (verdictMatch ? verdictMatch[1].trim() : "Watch & Wait") as any,
        tierScores: tierMatch ? tierMatch[1].trim() : "T1 —% · T2 —% · T3 —%",
        context: getField("ARTIST CONTEXT"),
        indicators,
        rationale: getField("SCORING RATIONALE"),
        riskFlag: getField("PRIMARY RISK FLAG"),
        greenLight: getField("PRIMARY GREEN LIGHT"),
        publishingOpportunity: getField("PUBLISHING OPPORTUNITY"),
      });
    } catch { setError("Analysis failed. Please try again."); }
    finally { setLoading(false); }
  };

  const colors = result ? getVerdictColors(result.verdict) : null;

  return (
    <div className="card p-5">
      <div className="section-label">Analyse an artist</div>
      <p className="text-[12px] text-ink-secondary mb-4 leading-relaxed">
        Enter any artist name. Signal uses AI analysis of publicly available data to generate a signal score and A&R recommendation. Validate against live API data before acting.
      </p>

      <div className="flex gap-2 mb-3">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyse(input)}
          placeholder="e.g. Pamungkas, MILLI, Phum Viphurit, yung kai..." className="flex-1"/>
        <button onClick={() => analyse(input)} disabled={loading || !input.trim()} className="primary flex-shrink-0 px-4">
          {loading ? "Analysing..." : "Analyse →"}
        </button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-mono text-[9px] text-ink-tertiary mr-1">Quick:</span>
        {QUICK.map((n) => (
          <button key={n} onClick={() => { setInput(n); analyse(n); }} disabled={loading}
            className="text-[11px] px-2.5 py-1">{n}</button>
        ))}
      </div>

      {error && <p className="text-[12px] text-sig-red mt-4">{error}</p>}

      {loading && (
        <div className="flex items-center gap-2.5 py-5 mt-4" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div className="w-[5px] h-[5px] rounded-full bg-sig-green" style={{ animation: "pulse 1.8s ease-in-out infinite" }}/>
          <span className="text-[12px] text-ink-secondary">Analysing {input}...</span>
        </div>
      )}

      {result && colors && !loading && (
        <div className="mt-5 pt-5" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-start gap-4 mb-4 flex-wrap">
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-ink-primary mb-1">{result.name}</h3>
              <p className="text-[12px] text-ink-secondary leading-relaxed">{result.context}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[34px] font-medium leading-none mb-1.5" style={{ color: colors.hex }}>{result.score}</div>
              <span className="verdict-pill" style={{ background: colors.dimBg, color: colors.hex, border: `0.5px solid ${colors.lineBorder}` }}>
                {result.verdict}
              </span>
              <div className="font-mono text-[9px] text-ink-tertiary mt-1.5">{result.tierScores}</div>
            </div>
          </div>

          {result.indicators.length > 0 && (
            <div className="mb-4 space-y-2">
              {result.indicators.map((ind, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-[5px] h-[5px] rounded-full bg-umg-blue mt-1.5 flex-shrink-0"/>
                  <span className="text-[12px] text-ink-secondary leading-relaxed">{ind}</span>
                </div>
              ))}
            </div>
          )}

          {result.rationale && (
            <div className="bg-bg-raised rounded-md px-3.5 py-3 mb-4">
              <p className="text-[12px] text-ink-secondary leading-relaxed">{result.rationale}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {result.greenLight && (
              <div className="rounded-md p-3" style={{ background: "rgba(0,199,118,0.07)", border: "0.5px solid rgba(0,199,118,0.18)" }}>
                <div className="font-mono text-[8px] text-sig-green tracking-widest uppercase mb-1.5">Green light</div>
                <p className="text-[11px] text-ink-primary leading-relaxed">{result.greenLight}</p>
              </div>
            )}
            {result.riskFlag && (
              <div className="rounded-md p-3" style={{ background: "rgba(224,72,72,0.07)", border: "0.5px solid rgba(224,72,72,0.18)" }}>
                <div className="font-mono text-[8px] text-sig-red tracking-widest uppercase mb-1.5">Risk flag</div>
                <p className="text-[11px] text-ink-primary leading-relaxed">{result.riskFlag}</p>
              </div>
            )}
          </div>

          {result.publishingOpportunity && (
            <div className="rounded-md p-3" style={{ border: "0.5px solid rgba(255,255,255,0.07)" }}>
              <div className="font-mono text-[8px] text-umg-blue tracking-widest uppercase mb-1.5">Publishing opportunity</div>
              <p className="text-[12px] text-ink-secondary leading-relaxed">{result.publishingOpportunity}</p>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}