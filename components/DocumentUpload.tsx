"use client";
import { useState, useRef, useCallback } from "react";

const C = {
  page: "#EEF2F9", card: "#FFFFFF", raised: "#F4F7FC", border: "#D0D8EE",
  ink1: "#0D1633", ink2: "#5A6A99", ink3: "#8E9BBF", ink4: "#C4CEEA",
  blue: "#2B5FD9", blueLt: "#EEF3FE", blueMd: "#D0DEFA",
  green: "#157A52", greenLt: "#E6F5EE", greenMd: "#B8E5D0",
  amber: "#A05C0A", ambLt: "#FEF3E2", ambMd: "#FAD898",
  red: "#C0392B", redLt: "#FDECEA", redMd: "#F5B8B3",
};

export interface ExtractedField {
  key: string;
  label: string;
  value: any;
  confidence: "high" | "medium" | "low";
  behavior: "auto" | "review" | "confirm";
  source: string;
  tag: "EXTRACTED" | "DERIVED" | "SUGGESTED";
  unit?: string;
  applied?: boolean;
  rejected?: boolean;
}

interface ExtractionResult {
  document_summary: string;
  catalog_detected?: string;
  artist_detected?: string;
  fields: ExtractedField[];
}

interface DocumentUploadProps {
  module: "catalog_deals" | "artist_discovery";
  onFieldsApplied: (fields: Record<string, any>) => void;
}

const ACCEPTED = [".pdf", ".docx", ".doc", ".xlsx", ".xls", ".csv"];
const ACCEPT_MIME = "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv";

const BEHAVIOR_CONFIG = {
  auto:    { label: "Auto-applied", color: C.green,  bg: C.greenLt, border: C.greenMd, tag: "EXTRACTED" as const },
  review:  { label: "Review before applying", color: C.blue,  bg: C.blueLt,  border: C.blueMd,  tag: "DERIVED" as const },
  confirm: { label: "Confirm each field", color: C.amber, bg: C.ambLt,   border: C.ambMd,   tag: "SUGGESTED" as const },
};

function TagChip({ tag, behavior }: { tag: string; behavior: string }) {
  const cfg = behavior === "auto" ? { bg: C.greenLt, color: C.green, border: C.greenMd }
    : behavior === "review" ? { bg: C.blueLt, color: C.blue, border: C.blueMd }
    : { bg: C.ambLt, color: C.amber, border: C.ambMd };
  return (
    <span style={{ fontFamily: "monospace", fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: cfg.bg, color: cfg.color, border: `0.5px solid ${cfg.border}`, whiteSpace: "nowrap" as const }}>
      {tag}
    </span>
  );
}

function formatValue(value: any, unit?: string): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value).slice(0, 60) + (JSON.stringify(value).length > 60 ? "…" : "");
  if (typeof value === "number") {
    if (unit === "USD" || unit === "GBP" || unit === "INR") {
      if (value >= 1e6) return `${unit === "USD" ? "$" : unit === "GBP" ? "£" : "₹"}${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `${unit === "USD" ? "$" : unit === "GBP" ? "£" : "₹"}${(value / 1e3).toFixed(0)}K`;
    }
    if (unit === "%") return `${value}%`;
    return value.toLocaleString();
  }
  return String(value);
}

export default function DocumentUpload({ module, onFieldsApplied }: DocumentUploadProps) {
  const [stage, setStage] = useState<"idle" | "processing" | "staging" | "done">("idle");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [fields, setFields] = useState<ExtractedField[]>([]);
  const [expanded, setExpanded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setError(""); setStage("processing"); setFileName(file.name);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      let content = "";
      let fileType = ext;

      if (ext === "pdf") {
        // Base64 encode PDF
        const buf = await file.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = "";
        bytes.forEach(b => binary += String.fromCharCode(b));
        content = btoa(binary);
        fileType = "pdf";
      } else if (ext === "docx" || ext === "doc") {
        // Extract text via mammoth.js
        if (!(window as any).mammoth) {
          await new Promise<void>((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
            s.onload = () => res();
            s.onerror = () => rej(new Error("Failed to load mammoth.js"));
            document.head.appendChild(s);
          });
        }
        const buf = await file.arrayBuffer();
        const result = await (window as any).mammoth.extractRawText({ arrayBuffer: buf });
        content = result.value;
        fileType = "docx";
      } else if (ext === "xlsx" || ext === "xls") {
        // Extract via SheetJS
        if (!(window as any).XLSX) {
          await new Promise<void>((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
            s.onload = () => res();
            s.onerror = () => rej(new Error("Failed to load xlsx.js"));
            document.head.appendChild(s);
          });
        }
        const buf = await file.arrayBuffer();
        const wb = (window as any).XLSX.read(buf, { type: "array" });
        const sheets = wb.SheetNames.map((name: string) => {
          const ws = wb.Sheets[name];
          return `Sheet: ${name}\n${(window as any).XLSX.utils.sheet_to_csv(ws)}`;
        });
        content = sheets.join("\n\n");
        fileType = "excel";
      } else if (ext === "csv") {
        content = await file.text();
        fileType = "csv";
      } else {
        throw new Error(`Unsupported file type: .${ext}`);
      }

      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, fileType, module, fileName: file.name }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Mark auto fields as already applied
      const processedFields: ExtractedField[] = (data.fields || []).map((f: ExtractedField) => ({
        ...f,
        applied: f.behavior === "auto",
        rejected: false,
      }));

      setResult(data);
      setFields(processedFields);
      setStage("staging");

      // Auto-apply high confidence fields immediately
      const autoFields: Record<string, any> = {};
      processedFields.filter(f => f.behavior === "auto").forEach(f => {
        autoFields[f.key] = f.value;
      });
      if (Object.keys(autoFields).length > 0) {
        onFieldsApplied(autoFields);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed");
      setStage("idle");
    }
  }, [module, onFieldsApplied]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  function toggleField(key: string, applied: boolean) {
    setFields(prev => prev.map(f => f.key === key ? { ...f, applied, rejected: !applied } : f));
  }

  function applySelected() {
    const toApply: Record<string, any> = {};
    fields.filter(f => f.applied && f.behavior !== "auto").forEach(f => {
      toApply[f.key] = f.value;
    });
    onFieldsApplied(toApply);
    setStage("done");
  }

  function applyAll(behavior: "review" | "confirm") {
    setFields(prev => prev.map(f => f.behavior === behavior ? { ...f, applied: true, rejected: false } : f));
  }

  const grouped = {
    auto: fields.filter(f => f.behavior === "auto"),
    review: fields.filter(f => f.behavior === "review"),
    confirm: fields.filter(f => f.behavior === "confirm"),
  };

  const pendingCount = fields.filter(f => (f.behavior === "review" || f.behavior === "confirm") && !f.applied && !f.rejected).length;

  if (!expanded && stage === "idle") {
    return (
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setExpanded(true)} style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: C.blueLt, border: `0.5px solid ${C.blueMd}`, color: C.blue, borderRadius: 7 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1v8M3.5 5L7 1l3.5 4M1 10v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="#2B5FD9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Upload document to enrich data
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 12, boxShadow: "0 1px 3px rgba(13,22,51,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.ink3 }}>
          Document upload — data extraction
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {stage !== "idle" && stage !== "processing" && (
            <span style={{ fontFamily: "monospace", fontSize: 9, color: C.ink3 }}>{fileName}</span>
          )}
          <button onClick={() => { setExpanded(false); setStage("idle"); setResult(null); setFields([]); setError(""); }} style={{ fontSize: 11, padding: "3px 8px" }}>
            {stage === "done" ? "Done" : "×"}
          </button>
        </div>
      </div>

      {/* Idle — drag drop zone */}
      {stage === "idle" && (
        <>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{ border: `1.5px dashed ${dragging ? C.blue : C.border}`, borderRadius: 8, padding: "24px 16px", textAlign: "center" as const, cursor: "pointer", background: dragging ? C.blueLt : C.raised, transition: "all 0.15s" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 8px", display: "block" }} aria-hidden="true">
              <path d="M12 2v12M8 6l4-4 4 4" stroke={dragging ? C.blue : C.ink3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 14v5a1 1 0 001 1h14a1 1 0 001-1v-5" stroke={dragging ? C.blue : C.ink3} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize: 13, color: dragging ? C.blue : C.ink1, fontWeight: 500, margin: "0 0 4px" }}>
              {dragging ? "Drop to extract" : "Drop a document or click to browse"}
            </p>
            <p style={{ fontSize: 11, color: C.ink3, margin: 0 }}>PDF · Word (.docx) · Excel (.xlsx) · CSV</p>
          </div>
          <input ref={fileRef} type="file" accept={ACCEPT_MIME} onChange={handleFile} style={{ display: "none" }} />
          {error && <p style={{ fontSize: 12, color: C.red, marginTop: 8 }}>{error}</p>}
          <div style={{ marginTop: 10, fontSize: 11, color: C.ink3, lineHeight: 1.5 }}>
            Upload any relevant document — annual report, financial statement, data room file, pitch deck, streaming report, or contract. Claude will extract all relevant fields and let you review before applying to the model.
          </div>
        </>
      )}

      {/* Processing */}
      {stage === "processing" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, animation: "pulse 1.5s ease-in-out infinite" }} />
          <div>
            <p style={{ fontSize: 13, color: C.ink1, margin: 0, fontWeight: 500 }}>Extracting data from {fileName}...</p>
            <p style={{ fontSize: 11, color: C.ink2, margin: "2px 0 0" }}>Claude is reading the document and identifying relevant fields</p>
          </div>
        </div>
      )}

      {/* Staging */}
      {(stage === "staging" || stage === "done") && result && (
        <>
          <div style={{ background: C.raised, borderRadius: 7, padding: "8px 12px", marginBottom: 12, display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" as const }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: C.ink3, marginBottom: 2 }}>DOCUMENT</div>
              <div style={{ fontSize: 12, color: C.ink1, fontWeight: 500 }}>{result.catalog_detected || result.artist_detected || fileName}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: C.ink3, marginBottom: 2 }}>SUMMARY</div>
              <div style={{ fontSize: 11, color: C.ink2, lineHeight: 1.5 }}>{result.document_summary}</div>
            </div>
            <div style={{ textAlign: "right" as const }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: C.ink3, marginBottom: 2 }}>FIELDS FOUND</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.ink1 }}>{fields.length}</div>
            </div>
          </div>

          {/* Auto-applied */}
          {grouped.auto.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
                <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: C.green, letterSpacing: "0.08em" }}>AUTO-APPLIED — {grouped.auto.length} fields applied immediately</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {grouped.auto.map(f => (
                  <div key={f.key} style={{ background: C.greenLt, border: `0.5px solid ${C.greenMd}`, borderRadius: 6, padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: C.ink2 }}>{f.label}</div>
                      <div style={{ fontSize: 12, color: C.ink1, fontWeight: 600 }}>{formatValue(f.value, f.unit)}</div>
                    </div>
                    <TagChip tag={f.tag} behavior={f.behavior} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review fields */}
          {grouped.review.length > 0 && stage === "staging" && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.blue }} />
                  <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: C.blue, letterSpacing: "0.08em" }}>REVIEW BEFORE APPLYING — {grouped.review.length} derived fields</span>
                </div>
                <button onClick={() => applyAll("review")} style={{ fontSize: 11, padding: "3px 8px", background: C.blueLt, border: `0.5px solid ${C.blueMd}`, color: C.blue, borderRadius: 6 }}>Apply all</button>
              </div>
              {grouped.review.map(f => (
                <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: f.applied ? C.greenLt : f.rejected ? C.redLt : C.blueLt, border: `0.5px solid ${f.applied ? C.greenMd : f.rejected ? C.redMd : C.blueMd}`, borderRadius: 6, marginBottom: 4 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 1 }}>
                      <span style={{ fontSize: 11, color: C.ink1, fontWeight: 500 }}>{f.label}</span>
                      <TagChip tag={f.tag} behavior={f.behavior} />
                    </div>
                    <div style={{ fontSize: 12, color: C.ink1, fontWeight: 600 }}>{formatValue(f.value, f.unit)}</div>
                    <div style={{ fontSize: 10, color: C.ink3, marginTop: 1 }}>{f.source}</div>
                  </div>
                  {!f.applied && !f.rejected ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => toggleField(f.key, true)} style={{ fontSize: 11, padding: "3px 8px", background: C.greenLt, border: `0.5px solid ${C.greenMd}`, color: C.green, borderRadius: 5 }}>Apply</button>
                      <button onClick={() => toggleField(f.key, false)} style={{ fontSize: 11, padding: "3px 8px", color: C.ink3, borderRadius: 5 }}>Skip</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 10, color: f.applied ? C.green : C.ink3, fontFamily: "monospace", fontWeight: 600 }}>{f.applied ? "✓ Applied" : "Skipped"}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Confirm fields */}
          {grouped.confirm.length > 0 && stage === "staging" && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.amber }} />
                  <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: C.amber, letterSpacing: "0.08em" }}>CONFIRM EACH FIELD — {grouped.confirm.length} suggested fields</span>
                </div>
                <button onClick={() => applyAll("confirm")} style={{ fontSize: 11, padding: "3px 8px", background: C.ambLt, border: `0.5px solid ${C.ambMd}`, color: C.amber, borderRadius: 6 }}>Apply all</button>
              </div>
              {grouped.confirm.map(f => (
                <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: f.applied ? C.greenLt : f.rejected ? C.redLt : C.ambLt, border: `0.5px solid ${f.applied ? C.greenMd : f.rejected ? C.redMd : C.ambMd}`, borderRadius: 6, marginBottom: 4 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 1 }}>
                      <span style={{ fontSize: 11, color: C.ink1, fontWeight: 500 }}>{f.label}</span>
                      <TagChip tag={f.tag} behavior={f.behavior} />
                    </div>
                    <div style={{ fontSize: 12, color: C.ink1, fontWeight: 600 }}>{formatValue(f.value, f.unit)}</div>
                    <div style={{ fontSize: 10, color: C.ink3, marginTop: 1 }}>{f.source}</div>
                  </div>
                  {!f.applied && !f.rejected ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => toggleField(f.key, true)} style={{ fontSize: 11, padding: "3px 8px", background: C.greenLt, border: `0.5px solid ${C.greenMd}`, color: C.green, borderRadius: 5 }}>Apply</button>
                      <button onClick={() => toggleField(f.key, false)} style={{ fontSize: 11, padding: "3px 8px", color: C.ink3, borderRadius: 5 }}>Skip</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 10, color: f.applied ? C.green : C.ink3, fontFamily: "monospace", fontWeight: 600 }}>{f.applied ? "✓ Applied" : "Skipped"}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Apply button */}
          {stage === "staging" && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 8, borderTop: `0.5px solid ${C.border}` }}>
              <button onClick={applySelected} style={{ fontSize: 13, padding: "7px 16px", background: C.blueLt, border: `0.5px solid ${C.blueMd}`, color: C.blue, borderRadius: 7, fontWeight: 500 }}>
                Apply {fields.filter(f => f.applied && f.behavior !== "auto").length + grouped.auto.length} fields to model →
              </button>
              {pendingCount > 0 && (
                <span style={{ fontSize: 11, color: C.ink3 }}>{pendingCount} fields pending your review above</span>
              )}
            </div>
          )}

          {stage === "done" && (
            <div style={{ background: C.greenLt, border: `0.5px solid ${C.greenMd}`, borderRadius: 7, padding: "8px 12px", fontSize: 12, color: C.green, fontWeight: 500 }}>
              ✓ {fields.filter(f => f.applied).length} fields applied to model. Tags updated from ESTIMATED to EXTRACTED/DERIVED where applicable.
            </div>
          )}
        </>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}
