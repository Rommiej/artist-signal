"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import Header from "@/components/Header";

const C = {
  page: "#EEF2F9", card: "#FFFFFF", raised: "#F4F7FC", border: "#D0D8EE",
  ink1: "#0D1633", ink2: "#5A6A99", ink3: "#8E9BBF", ink4: "#C4CEEA",
  blue: "#2B5FD9", blueLt: "#EEF3FE", blueMd: "#D0DEFA",
  green: "#157A52", greenLt: "#E6F5EE", greenMd: "#B8E5D0",
  amber: "#A05C0A", ambLt: "#FEF3E2", ambMd: "#FAD898",
  red: "#C0392B", redLt: "#FDECEA", redMd: "#F5B8B3",
};

const SAREGAMA = {
  name: "Saregama India Limited",
  owner: "RP-Sanjiv Goenka Group (BSE: 532163)",
  description: "India's oldest music label — founded 1901 as The Gramophone Company of India. Catalog of 1.3M+ songs spanning Hindi film music (1930s–present), regional language content across 14 Indian languages, ghazals, Hindustani and Carnatic classical, and devotional music. Unlike most international labels, Saregama owns both master recording and publishing rights across its catalog. FY2025 revenue ₹1,171 crore (46% YoY growth). International revenue: 30.11% of total (~$42M USD). Music licensing: 51.61% of total turnover. Subsidiaries in UK, USA, and Dubai.",
  catalogSize: 1300000,
  rightsType: "master_publishing" as const,
  ageProfile: "Heritage-weighted — 60% pre-1990, 25% 1990–2010, 15% post-2010",
  primaryLanguage: "Hindi (primary) + 13 regional languages",
  baseNPS: 20000000,
};

const SAREGAMA_TERRITORIES = [
  { code: "GB", name: "United Kingdom",   share: 28, growth: 4,  collection: 85, lat: 51.5,  lng: -0.1  },
  { code: "US", name: "United States",    share: 22, growth: 6,  collection: 75, lat: 38.9,  lng: -77.0 },
  { code: "AE", name: "UAE / Gulf",       share: 20, growth: 8,  collection: 42, lat: 25.2,  lng: 55.3  },
  { code: "CA", name: "Canada",           share: 12, growth: 5,  collection: 78, lat: 45.4,  lng: -75.7 },
  { code: "AU", name: "Australia",        share:  8, growth: 5,  collection: 80, lat: -33.9, lng: 151.2 },
  { code: "SG", name: "Singapore",        share:  6, growth: 7,  collection: 70, lat: 1.35,  lng: 103.8 },
  { code: "ROW", name: "Rest of World",   share:  4, growth: 3,  collection: 25, lat: 20.0,  lng: 10.0  },
];

type RightsType = "master_publishing" | "publishing_only" | "sync_only";
type Scenario = "conservative" | "base" | "optimistic";

interface Territory { code: string; name: string; share: number; growth: number; collection: number; lat: number; lng: number; }
interface YearResult { year: number; gross: number; ownerShare: number; pv: number; cumPV: number; }
interface ScenarioResult { npv: number; advance: number; umgFeeIncome: number; years: YearResult[]; growthRate: number; discountRate: number; }
interface Results { conservative: ScenarioResult; base: ScenarioResult; optimistic: ScenarioResult; }

function calcScenario(baseNPS: number, territories: Territory[], termYears: number, ownerSplit: number, baseDiscount: number, recoupment: number, scenarioType: Scenario): ScenarioResult {
  const growthMod = scenarioType === "conservative" ? 0.5 : scenarioType === "base" ? 1.0 : 1.5;
  const discountMod = scenarioType === "conservative" ? 2 : scenarioType === "base" ? 0 : -2;
  const uplift = scenarioType === "optimistic" ? 0.03 : 0;
  const recoupMod = scenarioType === "conservative" ? -0.05 : scenarioType === "optimistic" ? 0.08 : 0;
  const dr = (baseDiscount + discountMod) / 100;
  const ownerPct = ownerSplit / 100;
  const umgPct = 1 - ownerPct;

  let npv = 0, umgFee = 0, cumPV = 0;
  const years: YearResult[] = [];

  for (let y = 1; y <= termYears; y++) {
    let gross = 0;
    for (const t of territories) {
      const tBase = baseNPS * (t.share / 100) * (t.collection / 100);
      const g = (t.growth / 100) * growthMod + uplift;
      gross += tBase * Math.pow(1 + g, y - 1);
    }
    const ownerShare = gross * ownerPct;
    const pv = ownerShare / Math.pow(1 + dr, y);
    const umgPV = (gross * umgPct) / Math.pow(1 + dr, y);
    cumPV += pv;
    npv += pv;
    umgFee += umgPV;
    years.push({ year: y, gross: Math.round(gross), ownerShare: Math.round(ownerShare), pv: Math.round(pv), cumPV: Math.round(cumPV) });
  }

  const effRecoupment = recoupment + recoupMod;
  return {
    npv: Math.round(npv),
    advance: Math.round(npv * Math.min(Math.max(effRecoupment, 0.6), 0.95)),
    umgFeeIncome: Math.round(umgFee),
    years,
    growthRate: territories.reduce((a, t) => a + t.growth * t.share / 100, 0) * growthMod,
    discountRate: baseDiscount + discountMod,
  };
}

function fmt(n: number, decimals = 1): string {
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(decimals)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
}

function pct(n: number) { return `${Math.round(n)}%`; }

const SECTION = { borderTop: `0.5px solid ${C.border}`, marginTop: 10, paddingTop: 12 };
const CARD = { background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", boxShadow: "0 1px 3px rgba(13,22,51,0.04)" };

function renderMemo(text: string) {
  const lines = text.split("\n");
  const els: React.ReactNode[] = [];
  let k = 0;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      els.push(<div key={k++} style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.08em", color: C.ink2, textTransform: "uppercase" as const, fontWeight: 700, marginTop: 22, marginBottom: 8, paddingTop: 14, borderTop: `0.5px solid ${C.border}` }}>{line.replace("## ", "")}</div>);
    } else if (line.startsWith("# ")) {
      els.push(<div key={k++} style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", color: C.blue, textTransform: "uppercase" as const, marginBottom: 4 }}>{line.replace("# ", "")}</div>);
    } else if (line.startsWith("---") || line.trim() === "") {
      els.push(<div key={k++} style={{ height: 5 }} />);
    } else {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      const rendered = parts.map((p, i) => i % 2 === 1 ? <span key={i} style={{ color: C.ink1, fontWeight: 600 }}>{p}</span> : <span key={i}>{p}</span>);
      els.push(<p key={k++} style={{ fontSize: 13, color: C.ink2, lineHeight: 1.8, margin: "0 0 3px" }}>{rendered}</p>);
    }
  }
  return els;
}

function WorldMap({ territories }: { territories: Territory[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 620, H = 300;
  const [worldPaths, setWorldPaths] = useState<string[]>([]);
  const maxShare = Math.max(...territories.map(t => t.share));

  function project(lat: number, lng: number): [number, number] {
    const x = (lng + 180) * (W / 360);
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = H / 2 - (H * mercN) / (2 * Math.PI);
    return [Math.round(x), Math.round(Math.max(10, Math.min(H - 10, y)))];
  }

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then(world => {
        if (typeof window === "undefined") return;
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js";
        script.onload = () => {
          const topoScript = document.createElement("script");
          topoScript.src = "https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js";
          topoScript.onload = () => {
            const d3 = (window as any).d3;
            const topojson = (window as any).topojson;
            if (!d3 || !topojson) return;
            const projection = d3.geoNaturalEarth1().scale(95).translate([W / 2, H / 2]);
            const pathGen = d3.geoPath(projection);
            const countries = topojson.feature(world, world.objects.countries);
            const paths: string[] = [];
            for (const f of countries.features) {
              const d = pathGen(f);
              if (d) paths.push(d);
            }
            setWorldPaths(paths);
          };
          document.head.appendChild(topoScript);
        };
        document.head.appendChild(script);
      }).catch(() => {});
  }, []);

  const nonROW = territories.filter(t => t.code !== "ROW");

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", background: C.raised, borderRadius: 8 }} aria-label="World map showing territory revenue contribution">
      {worldPaths.map((d, i) => (
        <path key={i} d={d} fill={C.border} stroke={C.card} strokeWidth="0.4" />
      ))}
      {worldPaths.length === 0 && (
        <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="12" fill={C.ink3} fontFamily="monospace">Loading map...</text>
      )}
      {nonROW.map(t => {
        const [x, y] = project(t.lat, t.lng);
        const r = Math.max(8, Math.round(Math.sqrt(t.share / maxShare) * 28));
        return (
          <g key={t.code}>
            <circle cx={x} cy={y} r={r} fill={C.blue} fillOpacity={0.15} stroke={C.blue} strokeWidth="1.5" />
            <circle cx={x} cy={y} r={Math.round(r * 0.45)} fill={C.blue} fillOpacity={0.7} />
            <text x={x} y={y + r + 11} textAnchor="middle" fontSize="9" fill={C.ink2} fontFamily="monospace" fontWeight="600">{t.share}%</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function DealsPage() {
  const [catalog, setCatalog] = useState({ ...SAREGAMA });
  const [territories, setTerritories] = useState<Territory[]>(SAREGAMA_TERRITORIES.map(t => ({ ...t })));
  const [termYears, setTermYears] = useState(3);
  const [ownerSplit, setOwnerSplit] = useState(75);
  const [discountRate, setDiscountRate] = useState(12);
  const [recoupment, setRecoupment] = useState(0.80);
  const [activeScenario, setActiveScenario] = useState<Scenario>("base");
  const [memo, setMemo] = useState("");
  const [memoLoading, setMemoLoading] = useState(false);
  const [memoError, setMemoError] = useState("");
  const [memoGenerated, setMemoGenerated] = useState(false);
  const [showCatalogEdit, setShowCatalogEdit] = useState(false);

  const results: Results = useMemo(() => ({
    conservative: calcScenario(catalog.baseNPS, territories, termYears, ownerSplit, discountRate, recoupment, "conservative"),
    base: calcScenario(catalog.baseNPS, territories, termYears, ownerSplit, discountRate, recoupment, "base"),
    optimistic: calcScenario(catalog.baseNPS, territories, termYears, ownerSplit, discountRate, recoupment, "optimistic"),
  }), [catalog.baseNPS, territories, termYears, ownerSplit, discountRate, recoupment]);

  const active = results[activeScenario];

  const sensitivityData = useMemo(() => {
    const terms = [2, 3, 5, 7];
    const growthMods = [0.5, 1.0, 1.5];
    return terms.map(t => ({
      term: t,
      values: growthMods.map(gm => {
        let npv = 0;
        const dr = discountRate / 100;
        for (let y = 1; y <= t; y++) {
          let gross = 0;
          for (const terr of territories) {
            const tBase = catalog.baseNPS * (terr.share / 100) * (terr.collection / 100);
            gross += tBase * Math.pow(1 + (terr.growth / 100) * gm, y - 1);
          }
          npv += (gross * ownerSplit / 100) / Math.pow(1 + dr, y);
        }
        return Math.round(npv * recoupment / 1e6 * 10) / 10;
      }),
    }));
  }, [catalog.baseNPS, territories, ownerSplit, discountRate, recoupment]);

  function updateTerritory(i: number, field: keyof Territory, val: number) {
    const newT = [...territories];
    newT[i] = { ...newT[i], [field]: val };
    setTerritories(newT);
  }

  async function generateMemo() {
    setMemoLoading(true); setMemo(""); setMemoError("");
    try {
      const res = await fetch("/api/deal-memo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalog, params: { termYears, ownerSplit, discountRate, recoupment, baseNPS: catalog.baseNPS }, results, territories }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMemo(data.content); setMemoGenerated(true);
    } catch { setMemoError("Failed to generate memo. Please try again."); }
    finally { setMemoLoading(false); }
  }

  function resetSaregama() {
    setCatalog({ ...SAREGAMA });
    setTerritories(SAREGAMA_TERRITORIES.map(t => ({ ...t })));
    setTermYears(3); setOwnerSplit(75); setDiscountRate(12); setRecoupment(0.80);
    setMemo(""); setMemoGenerated(false);
  }

  const verdictColor = active.advance > 40e6 ? C.green : active.advance > 20e6 ? C.blue : C.amber;

  return (
    <div style={{ minHeight: "100vh", background: C.page }}>
      <Header />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink1, margin: 0 }}>Catalog Deal Valuation</h1>
            <p style={{ fontSize: 12, color: C.ink2, marginTop: 4 }}>Fixed-term sub-publishing deal workbench · Ex-territory rights · NPV-based advance calculator</p>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 100, fontFamily: "monospace", background: C.blueLt, color: C.blue, border: `0.5px solid ${C.blueMd}` }}>Demo: Saregama</span>
            <button onClick={resetSaregama} style={{ fontSize: 11 }}>Reset to Saregama</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 16, alignItems: "start" }}>

          {/* LEFT: Inputs */}
          <div>

            {/* Catalog profile */}
            <div style={{ ...CARD, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.ink3 }}>Catalog profile</div>
                <button onClick={() => setShowCatalogEdit(!showCatalogEdit)} style={{ fontSize: 11, padding: "3px 8px" }}>{showCatalogEdit ? "Done" : "Edit"}</button>
              </div>
              {showCatalogEdit ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[["Catalog name", "name"], ["Owner", "owner"], ["Catalog size (songs)", "catalogSize"]].map(([label, key]) => (
                    <div key={key}>
                      <div style={{ fontSize: 11, color: C.ink3, marginBottom: 3 }}>{label}</div>
                      <input type={key === "catalogSize" ? "number" : "text"} value={(catalog as any)[key]}
                        onChange={e => setCatalog(p => ({ ...p, [key]: key === "catalogSize" ? parseInt(e.target.value) || 0 : e.target.value }))}
                        style={{ fontSize: 12, padding: "6px 10px", width: "100%" }} />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 11, color: C.ink3, marginBottom: 3 }}>Rights type</div>
                    <select value={catalog.rightsType} onChange={e => setCatalog(p => ({ ...p, rightsType: e.target.value as RightsType }))} style={{ fontSize: 12, padding: "6px 10px" }}>
                      <option value="master_publishing">Master + Publishing Rights</option>
                      <option value="publishing_only">Publishing Rights Only</option>
                      <option value="sync_only">Sync Rights Only</option>
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: C.ink3, marginBottom: 3 }}>Current annual intl. NPS (USD)</div>
                    <input type="number" value={catalog.baseNPS}
                      onChange={e => setCatalog(p => ({ ...p, baseNPS: parseInt(e.target.value) || 0 }))}
                      style={{ fontSize: 12, padding: "6px 10px", width: "100%" }} />
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.ink1, marginBottom: 2 }}>{catalog.name}</div>
                  <div style={{ fontSize: 11, color: C.ink2, marginBottom: 8 }}>{catalog.owner}</div>
                  {[
                    ["Catalog size", `${(catalog.catalogSize / 1000).toFixed(0)}K songs`],
                    ["Rights type", catalog.rightsType === "master_publishing" ? "Master + Publishing" : catalog.rightsType === "publishing_only" ? "Publishing only" : "Sync only"],
                    ["Age profile", catalog.ageProfile],
                    ["Language", catalog.primaryLanguage],
                    ["Current intl. NPS", `${fmt(catalog.baseNPS)}/yr`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `0.5px solid ${C.border}` }}>
                      <span style={{ fontSize: 11, color: C.ink3 }}>{k}</span>
                      <span style={{ fontSize: 11, color: C.ink1, fontWeight: 500, textAlign: "right", maxWidth: 160 }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Deal parameters */}
            <div style={{ ...CARD, marginBottom: 12 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.ink3, marginBottom: 12 }}>Deal parameters</div>

              {[
                { label: "Term length", value: termYears, min: 1, max: 10, step: 1, unit: `${termYears} yr${termYears > 1 ? "s" : ""}`, set: setTermYears },
                { label: "Catalog owner royalty split", value: ownerSplit, min: 50, max: 90, step: 5, unit: `${ownerSplit}% / ${100 - ownerSplit}%`, set: setOwnerSplit },
                { label: "Discount rate", value: discountRate, min: 6, max: 20, step: 0.5, unit: `${discountRate}%`, set: setDiscountRate },
                { label: "Recoupment comfort factor", value: Math.round(recoupment * 100), min: 60, max: 95, step: 5, unit: `${Math.round(recoupment * 100)}%`, set: (v: number) => setRecoupment(v / 100) },
              ].map(p => (
                <div key={p.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: C.ink2 }}>{p.label}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: C.ink1 }}>{p.unit}</span>
                  </div>
                  <input type="range" min={p.min} max={p.max} step={p.step} value={p.value}
                    onChange={e => p.set(parseFloat(e.target.value))} style={{ width: "100%" }} />
                </div>
              ))}

              <div style={{ background: C.raised, borderRadius: 7, padding: "8px 12px", marginTop: 4 }}>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: C.ink3, marginBottom: 4 }}>Deal formula</div>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: C.ink2, lineHeight: 1.7 }}>
                  Advance = NPV(owner royalties, {termYears}yr, {discountRate}%) × {Math.round(recoupment * 100)}%<br />
                  UMG fee = NPS × {100 - ownerSplit}% admin retained
                </div>
              </div>
            </div>

            {/* Territory inputs */}
            <div style={{ ...CARD }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.ink3, marginBottom: 10 }}>Territory assumptions</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 52px 52px 52px", gap: "2px 8px", marginBottom: 6 }}>
                <span style={{ fontSize: 9, fontFamily: "monospace", color: C.ink4 }}>Territory</span>
                <span style={{ fontSize: 9, fontFamily: "monospace", color: C.ink4, textAlign: "center" }}>Share</span>
                <span style={{ fontSize: 9, fontFamily: "monospace", color: C.ink4, textAlign: "center" }}>Growth</span>
                <span style={{ fontSize: 9, fontFamily: "monospace", color: C.ink4, textAlign: "center" }}>Collect</span>
              </div>
              {territories.map((t, i) => (
                <div key={t.code} style={{ display: "grid", gridTemplateColumns: "1fr 52px 52px 52px", gap: "4px 8px", padding: "4px 0", borderBottom: `0.5px solid ${C.border}` }}>
                  <span style={{ fontSize: 11, color: C.ink1, display: "flex", alignItems: "center" }}>{t.name}</span>
                  {(["share", "growth", "collection"] as const).map(field => (
                    <input key={field} type="number" min={0} max={field === "collection" ? 100 : field === "share" ? 100 : 20}
                      value={t[field]}
                      onChange={e => updateTerritory(i, field, parseFloat(e.target.value) || 0)}
                      style={{ fontSize: 11, padding: "3px 6px", textAlign: "center", width: "100%" }} />
                  ))}
                </div>
              ))}
              <div style={{ fontSize: 10, color: C.ink3, marginTop: 8, fontFamily: "monospace" }}>
                Share: % of intl revenue · Growth: % pa · Collect: efficiency %
              </div>
            </div>
          </div>

          {/* RIGHT: Outputs */}
          <div>

            {/* Three scenario cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
              {(["conservative", "base", "optimistic"] as Scenario[]).map(sc => {
                const r = results[sc];
                const isActive = sc === activeScenario;
                const colors = { conservative: { c: C.red, lt: C.redLt, md: C.redMd }, base: { c: C.blue, lt: C.blueLt, md: C.blueMd }, optimistic: { c: C.green, lt: C.greenLt, md: C.greenMd } };
                const { c, lt, md } = colors[sc];
                const labels = { conservative: "Conservative", base: "Base case", optimistic: "Optimistic" };
                const subtitles = { conservative: "Low growth · high risk", base: "Market assumptions", optimistic: "Active sub-pub + UMG uplift" };
                return (
                  <div key={sc} onClick={() => setActiveScenario(sc)} style={{ background: isActive ? lt : C.card, border: `${isActive ? "1.5px" : "0.5px"} solid ${isActive ? md : C.border}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s", boxShadow: isActive ? `0 2px 8px rgba(13,22,51,0.08)` : "none" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: c, marginBottom: 6 }}>{labels[sc]}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: c, lineHeight: 1, marginBottom: 4 }}>{fmt(r.advance)}</div>
                    <div style={{ fontSize: 10, color: C.ink2, marginBottom: 8 }}>Recommended advance</div>
                    <div style={{ fontSize: 10, color: C.ink2, paddingTop: 6, borderTop: `0.5px solid ${C.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span>Term NPV</span><span style={{ fontWeight: 600, color: C.ink1 }}>{fmt(r.npv)}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}><span>UMG fee income</span><span style={{ fontWeight: 600, color: C.ink1 }}>{fmt(r.umgFeeIncome)}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}><span>Discount rate</span><span style={{ fontWeight: 600, color: C.ink1 }}>{r.discountRate}%</span></div>
                    </div>
                    <div style={{ fontSize: 9, fontFamily: "monospace", color: c, marginTop: 8 }}>{subtitles[sc]}</div>
                  </div>
                );
              })}
            </div>

            {/* Year-by-year DCF */}
            <div style={{ ...CARD, marginBottom: 12 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.ink3, marginBottom: 10 }}>
                {activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1)} case — year-by-year DCF · {ownerSplit}/{100 - ownerSplit} split · {active.discountRate}% discount
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr 1fr", gap: "0 12px", marginBottom: 6 }}>
                {["Year", "Gross royalties", `Owner share (${ownerSplit}%)`, "Present value", "Cumulative PV"].map(h => (
                  <div key={h} style={{ fontFamily: "monospace", fontSize: 9, color: C.ink4, paddingBottom: 4, borderBottom: `0.5px solid ${C.border}` }}>{h}</div>
                ))}
              </div>

              {active.years.map(y => {
                const isLast = y.year === termYears;
                return (
                  <div key={y.year} style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr 1fr", gap: "0 12px", padding: "5px 0", background: isLast ? C.raised : "transparent", borderRadius: isLast ? 6 : 0 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 11, color: C.ink2, fontWeight: isLast ? 700 : 400 }}>Y{y.year}</div>
                    <div style={{ fontSize: 11, color: C.ink1 }}>{fmt(y.gross)}</div>
                    <div style={{ fontSize: 11, color: C.ink1, fontWeight: isLast ? 600 : 400 }}>{fmt(y.ownerShare)}</div>
                    <div style={{ fontSize: 11, color: C.blue }}>{fmt(y.pv)}</div>
                    <div style={{ fontSize: 11, color: C.green, fontWeight: isLast ? 700 : 400 }}>{fmt(y.cumPV)}</div>
                  </div>
                );
              })}

              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr 1fr", gap: "0 12px", padding: "6px 0", borderTop: `1px solid ${C.border}`, marginTop: 4 }}>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: C.ink3 }}>Total</div>
                <div style={{ fontSize: 11, color: C.ink1, fontWeight: 600 }}>{fmt(active.years.reduce((a, y) => a + y.gross, 0))}</div>
                <div style={{ fontSize: 11, color: C.ink1, fontWeight: 600 }}>{fmt(active.years.reduce((a, y) => a + y.ownerShare, 0))}</div>
                <div style={{ fontSize: 11, color: C.blue, fontWeight: 700 }}>{fmt(active.npv)}</div>
                <div style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>= NPV</div>
              </div>
            </div>

            {/* Territory map + breakdown */}
            <div style={{ ...CARD, marginBottom: 12 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.ink3, marginBottom: 10 }}>Territory revenue contribution — base case year 1</div>

              <WorldMap territories={territories} />

              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
                {territories.map(t => {
                  const annualNPS = catalog.baseNPS * (t.share / 100) * (t.collection / 100);
                  const ownerAmt = annualNPS * ownerSplit / 100;
                  const pctOfTotal = catalog.baseNPS > 0 ? (annualNPS / (catalog.baseNPS * territories.reduce((a, tt) => a + tt.share * tt.collection / 10000, 0))) * 100 : 0;
                  return (
                    <div key={t.code} style={{ display: "grid", gridTemplateColumns: "130px 1fr 70px 70px", gap: "0 10px", alignItems: "center", padding: "5px 0", borderBottom: `0.5px solid ${C.border}` }}>
                      <span style={{ fontSize: 11, color: C.ink1, fontWeight: 500 }}>{t.name}</span>
                      <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min(100, Math.round(pctOfTotal))}%`, background: C.blue, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 10, color: C.ink2, textAlign: "right" }}>{fmt(annualNPS)}</span>
                      <span style={{ fontSize: 10, color: C.green, textAlign: "right", fontWeight: 600 }}>{fmt(ownerAmt)}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 10, color: C.ink3, fontFamily: "monospace" }}>
                <span>Gross NPS per territory</span><span style={{ color: C.green }}>→ Catalog owner share</span>
              </div>
            </div>

            {/* Sensitivity table */}
            <div style={{ ...CARD, marginBottom: 12 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.ink3, marginBottom: 10 }}>Advance sensitivity — term length × growth scenario (recommended advance $M)</div>

              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr", gap: "0 8px" }}>
                <div style={{ fontSize: 9, fontFamily: "monospace", color: C.ink4 }}>Term</div>
                {["Low growth (×0.5)", "Base growth (×1.0)", "High growth (×1.5)"].map(h => (
                  <div key={h} style={{ fontSize: 9, fontFamily: "monospace", color: C.ink4, textAlign: "center", paddingBottom: 4, borderBottom: `0.5px solid ${C.border}` }}>{h}</div>
                ))}
                {sensitivityData.map(row => (
                  <>
                    <div key={`t${row.term}`} style={{ fontFamily: "monospace", fontSize: 11, color: C.ink2, padding: "5px 0", fontWeight: row.term === termYears ? 700 : 400 }}>{row.term} years</div>
                    {row.values.map((v, i) => {
                      const isActive = row.term === termYears && i === 1;
                      return (
                        <div key={i} style={{ fontSize: 11, textAlign: "center", padding: "5px 0", fontWeight: isActive ? 700 : 400, color: isActive ? C.blue : C.ink1, background: isActive ? C.blueLt : "transparent", borderRadius: isActive ? 5 : 0 }}>
                          ${v}M
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
              <div style={{ fontSize: 10, color: C.ink3, marginTop: 8, fontFamily: "monospace" }}>
                Highlighted cell = current base case. Discount rate: {discountRate}% · Owner split: {ownerSplit}%
              </div>
            </div>

            {/* Deal memo */}
            <div style={{ ...CARD }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.ink3, marginBottom: 10 }}>Deal intelligence memo — generated by Signal AI</div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                <p style={{ fontSize: 12, color: C.ink2, margin: 0, lineHeight: 1.5 }}>
                  Comprehensive deal analysis including financial methodology, territory deep-dives, UMG value-add quantification, risk flags, and specific deal structure recommendation. Generated live from all model inputs above.
                </p>
                <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                  {memoGenerated && <button onClick={() => navigator.clipboard.writeText(memo)} style={{ fontSize: 12 }}>Copy</button>}
                  <button onClick={generateMemo} disabled={memoLoading} style={{ fontSize: 13, background: C.blueLt, border: `0.5px solid ${C.blueMd}`, color: C.blue, borderRadius: 7, padding: "7px 14px", cursor: memoLoading ? "not-allowed" : "pointer", opacity: memoLoading ? 0.6 : 1 }}>
                    {memoLoading ? "Drafting..." : memoGenerated ? "Regenerate →" : "Generate deal memo →"}
                  </button>
                </div>
              </div>

              {memoLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0", borderTop: `0.5px solid ${C.border}` }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "pulse 1.8s ease-in-out infinite" }} />
                  <span style={{ fontSize: 12, color: C.ink2 }}>Drafting comprehensive deal intelligence memo — financial analysis, territory breakdown, deal structure recommendation...</span>
                </div>
              )}

              {memoError && !memoLoading && (
                <p style={{ fontSize: 12, color: C.red, paddingTop: 12, borderTop: `0.5px solid ${C.border}` }}>{memoError}</p>
              )}

              {memo && !memoLoading && (
                <div style={{ paddingTop: 14, borderTop: `0.5px solid ${C.border}` }}>
                  <div style={{ background: C.raised, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: "20px 24px" }}>
                    {renderMemo(memo)}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <div style={{ marginTop: 28, paddingTop: 14, borderTop: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="5.5" stroke="#2B5FD9" strokeWidth="0.7" fill="none" opacity="0.4"/>
              <circle cx="6.5" cy="6.5" r="2.8" stroke="#2B5FD9" strokeWidth="0.7" fill="none" opacity="0.5"/>
              <circle cx="6.5" cy="6.5" r="1.3" fill="#2B5FD9"/>
            </svg>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: C.ink3 }}>SIGNAL · Catalog Deal Intelligence · A Universal Music Initiative</span>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: C.ink3 }}>Financial estimates for indicative purposes — legal and financial advisory validation required</span>
        </div>

      </main>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}
