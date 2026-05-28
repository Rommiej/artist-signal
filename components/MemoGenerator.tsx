"use client";
import { useState } from "react";

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
    } catch (e) {
      setError("Failed to generate memo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <p className="text-[12px] text-ink-secondary leading-relaxed">
          Generated live · Universal Music Asia publishing context · ready to send.
        </p>
        <div className="flex gap-2 flex-shrink-0">
          {generated && (
            <button onClick={() => navigator.clipboard.writeText(memo)} className="text-[12px]">
              Copy
            </button>
          )}
          <button onClick={generate} disabled={loading} className="primary text-[13px]">
            {loading ? "Drafting..." : generated ? "Regenerate →" : `Generate ${artistName} memo →`}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2.5 py-6" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div className="w-[5px] h-[5px] rounded-full bg-sig-green" style={{ animation: "pulse 1.8s ease-in-out infinite" }}/>
          <span className="text-[12px] text-ink-secondary">Drafting A&R intelligence memo for Universal Music Asia...</span>
        </div>
      )}

      {error && !loading && (
        <p className="text-[12px] text-sig-red pt-4" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>{error}</p>
      )}

      {memo && !loading && (
        <div className="pt-4" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div className="bg-bg-raised rounded-lg p-4">
            <pre className="text-[12px] text-ink-secondary leading-[1.85] whitespace-pre-wrap font-sans">{memo}</pre>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}