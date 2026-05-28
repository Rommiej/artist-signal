"use client";
import { useState } from "react";

function renderMemo(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      elements.push(
        <div key={key++} style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", color: "#2B7FE8", textTransform: "uppercase", marginBottom: 4 }}>
          {line.replace("# ", "")}
        </div>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <div key={key++} style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginTop: 20, marginBottom: 8, paddingTop: 12, borderTop: "0.5px solid rgba(255,255,255,0.07)" }}>
          {line.replace("## ", "")}
        </div>
      );
    } else if (line.startsWith("---")) {
      // skip horizontal rules
    } else if (line.trim() === "") {
      elements.push(<div key={key++} style={{ height: 8 }} />);
    } else {
      // Parse inline bold **text**
      const parts = line.split(/\*\*(.+?)\*\*/g);
      const rendered = parts.map((part, idx) =>
        idx % 2 === 1
          ? <span key={idx} style={{ color: "#F0F4FF", fontWeight: 500 }}>{part}</span>
          : <span key={idx}>{part}</span>
      );
      elements.push(
        <p key={key++} style={{ fontSize: 13, color: "#7A8DAA", lineHeight: 1.8, margin: "0 0 4px" }}>
          {rendered}
        </p>
      );
    }
  }

  return elements;
}

export default function MemoGenerator({ prompt, artistName }: { prompt: string; artistName: string }) {
  const [loading, setLoading] = useState(false);
  const [memo, setMemo] = useState("");
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true); setMemo(""); setError("");
    try {
      const res = await fetch("/api/memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMemo(data.content);
      setGenerated(true);
    } catch {
      setError("Failed to generate memo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => navigator.clipboard.writeText(memo);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <p className="text-[12px] text-ink-secondary leading-relaxed">
          Generated live · Universal Music Asia publishing context · ready to send.
        </p>
        <div className="flex gap-2 flex-shrink-0">
          {generated && (
            <button onClick={copy} className="text-[12px]">Copy plain text</button>
          )}
          <button onClick={generate} disabled={loading} className="primary text-[13px]">
            {loading ? "Drafting..." : generated ? "Regenerate →" : `Generate ${artistName} memo →`}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2.5 py-6" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div className="w-[5px] h-[5px] rounded-full bg-sig-green" style={{ animation: "pulse 1.8s ease-in-out infinite" }} />
          <span className="text-[12px] text-ink-secondary">Drafting A&R intelligence memo for Universal Music Asia...</span>
        </div>
      )}

      {error && !loading && (
        <p className="text-[12px] text-sig-red pt-4" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>{error}</p>
      )}

      {memo && !loading && (
        <div className="pt-4" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div style={{ background: "#0A1528", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "20px 24px" }}>
            {renderMemo(memo)}
          </div>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}