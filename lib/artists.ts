import { Artist } from "./types";

export const ARTISTS: Artist[] = [
  {
    id: "wave-to-earth",
    name: "wave to earth",
    handle: "@wavetoearth",
    location: "Seoul, South Korea",
    genre: "K-indie / Dream Pop / Lo-fi Jazz",
    label: "Wavy (indie) — signed Nov 2021",
    score: 82,
    verdict: "Priority Sign",
    t1: 88, t2: 80, t3: 72,
    retroDate: "May 2023",
    retroNote: '"bad" reaches #1 on Spotify Viral 50 Global. Debut album "0.1 Flaws and All" just released.',
    tags: ["3-member band", "All Self-Made", "English output", "K-indie", "Touring band"],
    metrics: [
      { label: "Spotify at scoring", value: "~1.2M", sub: "monthly listeners" },
      { label: "Spotify today", value: "7.1M", sub: "+490% since scored", highlight: true },
      { label: '"seasons" streams', value: "500M+", sub: "total to date", highlight: true },
      { label: "Live shows 2024–25", value: "100+", sub: "3-continent tour" },
    ],
    infrastructure: [
      ["Label at scoring", "Wavy (indie), Seoul — signed Nov 2021"],
      ["Catalog pre-viral", "2 EPs (2020), 3 singles (2021–22), full debut album Apr 2023"],
      ["Self-produced", "Yes — produce, mix, master, art direction all internal"],
      ["Songwriting", "100% self-written — Daniel Kim principal writer"],
      ["Language", "English primarily — structurally exceptional for KR indie"],
      ["Live capability", "Active touring band, sold-out domestic shows"],
      ["Visual identity", "Fully formed — artwork, fashion, video cohesive"],
      ["Management", "Wavy label infrastructure"],
    ],
    platforms: [
      { name: "Spotify", audience: "7.1M today", signal: "#1 non-idol KR", signalType: "success", relativeWidth: 100 },
      { name: "YouTube", audience: "Strong", signal: "Full live sets", signalType: "success", relativeWidth: 55 },
      { name: "Instagram", audience: "Active", signal: "Aesthetic consistent", signalType: "success", relativeWidth: 40 },
      { name: "TikTok", audience: "Growing", signal: "Heavy fan UGC", signalType: "neutral", relativeWidth: 30 },
    ],
    factors: [
      { label: "Catalog depth", score: 15, max: 20, confidence: "AUTO" },
      { label: "Songwriting ownership", score: 13, max: 15, confidence: "INFER" },
      { label: "Multi-platform footprint", score: 8, max: 10, confidence: "AUTO" },
      { label: "Production self-sufficiency", score: 10, max: 10, confidence: "INFER" },
      { label: "Nature of viral song", score: 5, max: 5, confidence: "INFER" },
      { label: "Engagement quality", score: 7, max: 8, confidence: "AUTO" },
      { label: "Live performance", score: 6, max: 7, confidence: "AUTO" },
      { label: "Visual identity", score: 6, max: 7, confidence: "INFER" },
      { label: "Narrative depth", score: 4, max: 5, confidence: "INFER" },
      { label: "Genre positioning", score: 3, max: 3, confidence: "AUTO" },
      { label: "Language strategy", score: 4, max: 4, confidence: "AUTO" },
      { label: "Platform signal value", score: 3, max: 3, confidence: "AUTO" },
      { label: "Ecosystem membership", score: 2, max: 3, confidence: "AUTO" },
    ],
    greenLights: [
      "All Self-Made ethos: produce, mix, master, and art direct entirely in-house. No creative dependency — the label acquires a complete engine.",
      "English-language output from a Korean act is structurally rare and commercially extraordinary. Global playlist algorithmic reach without language friction.",
      "Catalog depth: 2 EPs + multiple singles + full debut album at point of scoring. Immediate publishing catalog to register and monetise.",
      "Live band infrastructure already established. World tour sold out 100+ shows across 3 continents within 18 months of this scoring moment.",
      "Daniel Kim holds all songwriting rights. Clean publishing acquisition target — one conversation, one deal.",
    ],
    riskFlags: [
      "Signed to Wavy (indie) — any publishing deal requires negotiating around existing label structure. Not a straightforward greenfield acquisition.",
      "K-indie acts have historically struggled to convert streaming virality into western radio or sync without a major label distribution partner.",
      "No prior sync placement history — publishing commercial case depends on label activating placements proactively post-signing.",
    ],
    validation: {
      outcome: "CONFIRMED — Priority Sign was correct.",
      detail: "Signal scored wave to earth 82 in May 2023. Within 18 months: 7.1M Spotify monthly listeners, 500M+ streams on \"seasons\", sold-out Lollapalooza appearances on 3 continents (Chicago, Chile, India), Singapore Indoor Stadium. The All Self-Made production ethos and English-language output were the two factors that made this a global career rather than a domestic K-indie one. Any publisher who acted on a Priority Sign recommendation in May 2023 would today hold a catalog valued at multiples of the advance.",
    },
    velocityData: [80, 95, 110, 140, 180, 240, 420, 2100, 3800, 3200, 2800, 2400, 2100, 1900, 1700, 1600],
    velocityNote: "Velocity sustained — no decay pattern detected. Floor at 7× pre-viral baseline after 8 weeks. Pattern matches early NIKI \"Indigo\" trajectory. Comparable acts at this curve stage went on to sustain for 24+ months.",
    memoPrompt: `You are a senior A&R analyst at Universal Music Group Asia. Write a professional A&R intelligence memo (380–420 words) for the Head of Publishing at Universal Music Asia on wave to earth, scored retrospectively in May 2023.

ARTIST: wave to earth (band: Kim Daniel, Shin Donggyu, Cha Soonjong) | Seoul, South Korea
SIGNAL SCORE: 82/100 — Priority Sign
SCORING MOMENT: May 2023 — "bad" reaches #1 Spotify Viral 50 Global. Debut album "0.1 Flaws and All" just released.
CATALOG: 2 EPs (Jan 2020), multiple singles 2021–2022, full debut album April 2023. ALL SELF-WRITTEN by Daniel Kim.
PRODUCTION: "All Self-Made" — produce, mix, master, art direction all internal. Zero third-party dependency.
LANGUAGE: English-language output — structurally exceptional for a Korean indie act.
LABEL: Wavy (indie, Seoul) — signed November 2021 under Colde's label.
STREAMING AT SCORING: ~1.2M Spotify monthly listeners and climbing steeply.
OUTCOME: Today — 7.1M Spotify monthly, 500M+ streams on "seasons", sold-out Lollapalooza Chicago/Chile/India, 100+ shows on 2024–25 world tour.
KEY PUBLISHING OPPORTUNITY: Daniel Kim holds all songwriting rights. Clean acquisition target. English-language catalog has exceptional sync placement potential (Netflix, Apple TV+, global advertising).

Sections: Executive Summary | Why This Scores 82 | Publishing Rights Case | What A Deal Should Have Looked Like In May 2023 | Validation — What Actually Happened.
Tone: Analytical, authoritative. Retrospective validation case — be honest about what the data said and what acting on it would have meant.`,
  },
  {
    id: "arthur-nery",
    name: "Arthur Nery",
    handle: "@arthurnery",
    location: "Cagayan de Oro, Philippines",
    genre: "OPM R&B / Soul",
    label: "O/C Records + Viva Records — since 2019",
    score: 67,
    verdict: "Development Deal",
    t1: 72, t2: 65, t3: 52,
    retroDate: "May 2021",
    retroNote: '"Pagsamo" becomes the first OPM song to breach 500,000 daily Spotify streams for 4 consecutive days.',
    tags: ["Self-written", "Debut album 2019", "Filipino language", "O/C Records", "Domestic ceiling"],
    metrics: [
      { label: "Spotify at scoring", value: "~2.5M", sub: '"Pagsamo" in full velocity' },
      { label: "Spotify today", value: "9.3M", sub: "#1 OPM male artist", highlight: true },
      { label: "Total streams", value: "2B+", sub: '"Isa Lang" 400M+', highlight: true },
      { label: "Live milestone", value: "Araneta", sub: "Sold out 2024" },
    ],
    infrastructure: [
      ["Label at scoring", "O/C Records (Kean Cipriano) + Viva Records, since 2019"],
      ["Catalog pre-viral", 'Full debut album "Letters Never Sent" (2019) + singles: "Higa," "Binhi," "Cotton Candy"'],
      ["Self-produced", "No — external production (Viva/O/C network)"],
      ["Songwriting", "Self-written — confirmed on all originals"],
      ["Language", "Filipino (Tagalog) exclusively — critical international ceiling factor"],
      ["Live capability", "Limited at scoring; sold-out Araneta Coliseum came 3 years later"],
      ["Visual identity", "Modest at scoring — grew with label support"],
      ["Management", "O/C Records / Viva Records infrastructure"],
    ],
    platforms: [
      { name: "Spotify PH", audience: "2.5M/mo (2021)", signal: "#1 local chart", signalType: "success", relativeWidth: 100 },
      { name: "YouTube", audience: '"Pagsamo" 70M views', signal: "Strong domestic", signalType: "success", relativeWidth: 60 },
      { name: "TikTok PH", audience: "Viral domestically", signal: "PH-only signal", signalType: "warning", relativeWidth: 50 },
      { name: "International", audience: "Minimal", signal: "No intl. signal", signalType: "warning", relativeWidth: 8 },
    ],
    factors: [
      { label: "Catalog depth", score: 13, max: 20, confidence: "AUTO" },
      { label: "Songwriting ownership", score: 11, max: 15, confidence: "INFER" },
      { label: "Multi-platform footprint", score: 6, max: 10, confidence: "AUTO" },
      { label: "Production self-sufficiency", score: 5, max: 10, confidence: "INFER" },
      { label: "Nature of viral song", score: 4, max: 5, confidence: "INFER" },
      { label: "Engagement quality", score: 6, max: 8, confidence: "AUTO" },
      { label: "Live performance", score: 3, max: 7, confidence: "AUTO" },
      { label: "Visual identity", score: 4, max: 7, confidence: "INFER" },
      { label: "Narrative depth", score: 4, max: 5, confidence: "INFER" },
      { label: "Genre positioning", score: 2, max: 3, confidence: "AUTO" },
      { label: "Language strategy", score: 1, max: 4, confidence: "AUTO" },
      { label: "Platform signal value", score: 1, max: 3, confidence: "AUTO" },
      { label: "Ecosystem membership", score: 2, max: 3, confidence: "AUTO" },
    ],
    greenLights: [
      "Full debut album pre-dating the viral moment. Label had catalog depth to work with immediately post-signing.",
      '100% self-written. "Pagsamo" songwriting rights represent significant publishing value even at domestic scale.',
      "Emotional specificity of the music is high — artist-defining, not a trend song.",
      "O/C Records / Viva Records infrastructure already in place — not an unmanaged independent entering a negotiation blind.",
    ],
    riskFlags: [
      "Filipino language exclusively. International publishing opportunities severely limited without a language strategy. This single factor caps the global commercial ceiling.",
      "TikTok virality was domestic Philippines only — no international signal detected at scoring moment.",
      "Production dependency on external collaborators — every new release requires fresh A&R investment.",
      "Live capability unproven at scoring. Sold-out Araneta Coliseum came 3 years later.",
    ],
    validation: {
      outcome: "PARTIALLY CONFIRMED — Development Deal for international context was accurate.",
      detail: "Signal scored Arthur Nery 67 in May 2021. He became one of the biggest domestic artists in Philippine music history (2B+ streams, sold-out Smart Araneta Coliseum 2024), but the language ceiling prediction held — he has not meaningfully crossed internationally. A publisher acting on a Development Deal recommendation in 2021 would have excellent domestic catalog returns but limited global sync and international performance revenue. The 67 score accurately predicted the shape of his career.",
    },
    velocityData: [140, 160, 190, 220, 260, 300, 580, 2800, 4200, 3500, 2900, 2400, 2000, 1800, 1600, 1500],
    velocityNote: "Pagsamo velocity peaked sharply — domestic-platform pattern. Floor at 5× pre-viral baseline. Strong domestic OPM signal. International streaming presence remains minimal — confirms the Filipino-language ceiling hypothesis.",
    memoPrompt: `You are a senior A&R analyst at Universal Music Group Asia. Write a concise A&R memo (340–380 words) for the Head of Publishing at Universal Music Asia on Arthur Nery, scored retrospectively in May 2021.

ARTIST: Arthur Nery | @arthurnery | Born 1997 | Cagayan de Oro, Philippines
SIGNAL SCORE: 67/100 — Development Deal
SCORING MOMENT: May 2021 — "Pagsamo" becomes first OPM song to breach 500,000 Spotify daily streams for 4 consecutive days. Already signed to O/C Records / Viva Records since 2019.
CATALOG: Debut album "Letters Never Sent" (2019), multiple pre-viral singles including "Higa" and "Binhi". All self-written.
CRITICAL GAP: Filipino language exclusively. No international platform signal. TikTok virality Philippines-only.
STRENGTHS: Deep pre-viral catalog, self-written, O/C/Viva infrastructure, emotionally specific songwriting.
OUTCOME: 9.3M Spotify monthly today, 2B+ total streams, sold-out Araneta Coliseum 2024 — but no international crossover.

Sections: Summary | Why 67 Not Higher | The Language Ceiling Analysis | What Deal Structure Made Sense | Validation.
Tone: Commercially honest. The language gap was the defining variable. Be direct about how one factor shapes the entire commercial case.`,
  },
  {
    id: "adie",
    name: "Adie",
    handle: "@adadieee",
    location: "Biñan, Laguna, Philippines",
    genre: "OPM Pop / Indie Pop / Alternative",
    label: "O/C Records — signed 2020",
    score: 44,
    verdict: "Watch & Wait",
    t1: 48, t2: 50, t3: 38,
    retroDate: "June 2021",
    retroNote: '"Paraluman" hits #1 on Spotify Philippines Viral 50. His second-ever released song. MV reaches 1.8M YouTube views in 7 days.',
    tags: ['Only 2nd song', "Filipino language", "O/C Records", "Self-written", "Zero live history"],
    metrics: [
      { label: "Spotify at scoring", value: "~1M", sub: '"Paraluman" in velocity' },
      { label: '"Paraluman" streams', value: "100M+", sub: "Spotify total", highlight: true },
      { label: "Catalog pre-viral", value: "1 song", sub: '"Luha" (2020) only prior' },
      { label: "Subsequent hits", value: "3+", sub: "Debut album 2024" },
    ],
    infrastructure: [
      ["Label at scoring", "O/C Records — signed 2020 via Callalily contest"],
      ["Catalog pre-viral", '1 prior single: "Luha" (2020). "Paraluman" was only his 2nd release.'],
      ["Self-produced", "No — external production"],
      ["Songwriting", 'Self-written — confirmed on "Paraluman"'],
      ["Language", "Filipino (Tagalog) exclusively"],
      ["Live capability", "Essentially none — no gig history at scoring date"],
      ["Visual identity", "Minimal — 1.8M YouTube views was the MV, not artist identity"],
      ["Management", "O/C Records / Kean Cipriano infrastructure only"],
    ],
    platforms: [
      { name: "Spotify PH", audience: "~1M/mo (Jun 2021)", signal: "#1 PH Viral 50", signalType: "success", relativeWidth: 100 },
      { name: "YouTube", audience: '"Paraluman" MV', signal: "1.8M in 7 days", signalType: "neutral", relativeWidth: 40 },
      { name: "TikTok", audience: "Domestic viral", signal: "PH-only signal", signalType: "warning", relativeWidth: 35 },
      { name: "International", audience: "Minimal", signal: "No intl. signal", signalType: "warning", relativeWidth: 5 },
    ],
    factors: [
      { label: "Catalog depth", score: 2, max: 20, confidence: "AUTO" },
      { label: "Songwriting ownership", score: 7, max: 15, confidence: "INFER" },
      { label: "Multi-platform footprint", score: 5, max: 10, confidence: "AUTO" },
      { label: "Production self-sufficiency", score: 4, max: 10, confidence: "INFER" },
      { label: "Nature of viral song", score: 4, max: 5, confidence: "INFER" },
      { label: "Engagement quality", score: 5, max: 8, confidence: "AUTO" },
      { label: "Live performance", score: 1, max: 7, confidence: "AUTO" },
      { label: "Visual identity", score: 3, max: 7, confidence: "INFER" },
      { label: "Narrative depth", score: 2, max: 5, confidence: "INFER" },
      { label: "Genre positioning", score: 2, max: 3, confidence: "AUTO" },
      { label: "Language strategy", score: 1, max: 4, confidence: "AUTO" },
      { label: "Platform signal value", score: 1, max: 3, confidence: "AUTO" },
      { label: "Ecosystem membership", score: 2, max: 3, confidence: "AUTO" },
    ],
    greenLights: [
      '"Paraluman" is genuinely artist-defining — emotionally specific, not a novelty track. Comparable emotional weight to early Olivia Rodrigo.',
      "Self-written songwriting confirmed on only 2 releases — suggests natural composition ability that may develop significantly.",
      "O/C Records backing (Kean Cipriano) provides industry access and development infrastructure immediately.",
    ],
    riskFlags: [
      'Only 1 prior song before "Paraluman." Textbook thin-catalog Watch & Wait risk — no evidence yet of consistent output.',
      "Zero live performance history. Touring ROI is completely unpriced — a significant gap in any advance calculation.",
      "Filipino language only, domestic TikTok signal only. International commercial ceiling is low.",
      "Signed and released quickly — Paraluman may be ahead of the artist's readiness for major publishing investment.",
    ],
    validation: {
      outcome: "CONFIRMED — Watch & Wait was correct. Patience was the right call.",
      detail: 'Signal scored Adie 44 in June 2021 — Watch & Wait. This was correct: the thin catalog was a real risk. It took 3 more years and multiple subsequent singles before a debut album arrived in 2024. He did NOT have the infrastructure for a major publishing investment in June 2021. However, the emotional quality of "Paraluman" was real — "Tahanan" and "Mahika" confirmed songwriting ability. The correct action was: watch, set a 12-month re-evaluation trigger, and revisit when catalog depth developed.',
    },
    velocityData: [60, 70, 85, 100, 130, 160, 980, 2400, 1600, 900, 540, 380, 300, 270, 250, 240],
    velocityNote: "Steep decay — streams returning toward pre-viral baseline by week 10. Confirms viral moment was MV launch + domestic TikTok driven, not organic fan-conversion. 12-month re-evaluation recommended when catalog depth develops.",
    memoPrompt: `You are a senior A&R analyst at Universal Music Group Asia. Write a brief A&R intelligence note (280–320 words) for the Head of Publishing at Universal Music Asia on Adie, scored retrospectively in June 2021.

ARTIST: Adie (Adrian Garcia Eugenio) | @adadieee | Born 2001 | Philippines
SIGNAL SCORE: 44/100 — Watch & Wait
SCORING MOMENT: June 2021 — "Paraluman" hits #1 Spotify Philippines Viral 50. His SECOND ever released song.
CRITICAL FACT: Only 1 prior release ("Luha," 2020) before "Paraluman."
OTHER GAPS: Zero live history, Filipino-only, no international signal, external production only.
OUTCOME: "Paraluman" 100M+ Spotify. "Tahanan" (2021), "Mahika" (2022), debut album Senaryo (2024). Remained domestic OPM artist.

Sections: Why 44 · The Thin Catalog Risk · What "Watch & Wait" Meant In Practice · 12-Month Re-evaluation Triggers · Validation.
Tone: Precise and instructive. Classic viral moment ahead of artist readiness. Explain why patience was correct.`,
  },
];

export function getArtistById(id: string) {
  return ARTISTS.find((a) => a.id === id);
}

export function getVerdictColors(verdict: string) {
  switch (verdict) {
    case "Priority Sign":
      return { text: "text-sig-green", hex: "#00C776", dimBg: "rgba(0,199,118,0.1)", lineBorder: "rgba(0,199,118,0.25)" };
    case "Development Deal":
      return { text: "text-umg-blue", hex: "#2B7FE8", dimBg: "rgba(43,127,232,0.12)", lineBorder: "rgba(43,127,232,0.3)" };
    case "Watch & Wait":
      return { text: "text-sig-amber", hex: "#F0A000", dimBg: "rgba(240,160,0,0.1)", lineBorder: "rgba(240,160,0,0.25)" };
    case "Pass":
      return { text: "text-sig-red", hex: "#E04848", dimBg: "rgba(224,72,72,0.1)", lineBorder: "rgba(224,72,72,0.25)" };
    default:
      return { text: "text-ink-secondary", hex: "#7A8DAA", dimBg: "rgba(122,141,170,0.1)", lineBorder: "rgba(122,141,170,0.2)" };
  }
}
