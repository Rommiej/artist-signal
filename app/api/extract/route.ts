import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CATALOG_PROMPT = `You are extracting structured data from a music industry document to populate a catalog deal valuation model. The document may be an annual report, financial statement, data room document, licensing agreement, or any other industry document.

Extract every relevant field you can find. Return ONLY valid JSON — no markdown, no preamble, no explanation.

JSON structure:
{
  "document_summary": "1-2 sentences describing what this document is",
  "catalog_detected": "name of catalog or label if found",
  "fields": [
    {
      "key": "field_key",
      "label": "Human readable label",
      "value": <extracted value — string, number, or object>,
      "confidence": "high|medium|low",
      "behavior": "auto|review|confirm",
      "source": "brief note on where in the document (page, section, or quote)",
      "tag": "EXTRACTED|DERIVED|SUGGESTED",
      "unit": "USD|GBP|INR|%" 
    }
  ]
}

Field keys to extract (skip any not found):
catalog_name — Name of the music catalog or label
catalog_owner — Parent company or owner group
catalog_size — Number of songs/tracks/titles in catalog
rights_type — Whether master recordings, publishing rights, or both are included
annual_revenue_local — Total annual revenue in local currency (include currency code)
annual_revenue_usd — Total annual revenue converted to USD if exchange rate found
international_revenue_pct — International revenue as % of total
international_revenue_usd — International revenue in USD
music_licensing_pct — Music licensing as % of total revenue
estimated_nps — Estimated net publisher share from international territories (derive if possible)
age_profile — Age distribution of catalog content (e.g. pre-1990, 1990-2010, post-2010)
primary_language — Primary language(s) of content
seller_ask — Any stated asking price or valuation
territory_breakdown — Revenue or presence by territory if available (return as object: {territory: value})
yoy_growth — Year-over-year revenue growth rate
existing_agreements — Any existing sub-publishing, licensing, or distribution agreements mentioned
catalog_description — Any description of the catalog's content, heritage, or significance
financial_year — The financial year these figures relate to
rights_notes — Any notes about ownership structure, encumbrances, or existing deals

Confidence/behavior/tag rules:
- Exact number stated explicitly in document → confidence:high, behavior:auto, tag:EXTRACTED
- Number derived by one calculation from document data → confidence:medium, behavior:review, tag:DERIVED  
- Inferred from context but not stated → confidence:low, behavior:confirm, tag:SUGGESTED

Do NOT invent numbers. If a field is not found, omit it entirely. Better to return fewer accurate fields than many invented ones.`;

const ARTIST_PROMPT = `You are extracting structured artist data from a music industry document to populate an A&R intelligence profile. The document may be a management pitch deck, streaming report, Chartmetric export, press kit, biography, or any other artist document.

Extract every relevant field. Return ONLY valid JSON — no markdown, no preamble.

JSON structure:
{
  "document_summary": "1-2 sentences describing what this document is",
  "artist_detected": "name of artist if found",
  "fields": [
    {
      "key": "field_key",
      "label": "Human readable label",
      "value": <extracted value>,
      "confidence": "high|medium|low",
      "behavior": "auto|review|confirm",
      "source": "where in document",
      "tag": "EXTRACTED|DERIVED|SUGGESTED"
    }
  ]
}

Field keys to extract (skip any not found):
artist_name — Full artist name or act name
handle — Social media handle(s)
location — City, country
genre — Genre(s) and subgenre(s)
label — Current label or "Independent"
management — Management company if mentioned
monthly_listeners — Spotify monthly listeners (most recent)
total_streams — Total stream count across platforms
catalog_depth — Number of releases (EPs, albums, singles)
songwriting — Whether artist writes their own material
production — Whether artist self-produces
language — Primary language of output
platforms — Platform presence and relative strength
live_history — Live performance history, venues, tour history
visual_identity — Notes on visual brand and aesthetic
sync_history — Any known sync placements
chart_positions — Any notable chart positions
press — Any notable press coverage
social_following — Social media follower counts
streaming_velocity — Recent streaming growth trajectory
comparable_artists — Any comparable artists mentioned
signing_status — Current label/publishing status
key_tracks — Notable or viral tracks

Same confidence/behavior/tag rules as catalog extraction. Only extract what is actually in the document.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, fileType, module, fileName } = body;

    if (!content) return NextResponse.json({ error: "No content provided" }, { status: 400 });

    const systemPrompt = module === "catalog_deals" ? CATALOG_PROMPT : ARTIST_PROMPT;

    let messages: any[];

    if (fileType === "pdf") {
      // Send as native PDF document
      messages = [{
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: content },
          },
          {
            type: "text",
            text: `Extract all relevant fields from this document. File name: ${fileName || "document.pdf"}`,
          },
        ],
      }];
    } else {
      // Text content (extracted from DOCX or Excel/CSV)
      messages = [{
        role: "user",
        content: `Extract all relevant fields from this document content.\n\nFile: ${fileName || "document"}\nType: ${fileType}\n\n---\n${content}\n---`,
      }];
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: systemPrompt,
      messages,
    });

    const raw = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("").trim();

    // Strip any markdown code fences if present
    const clean = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      return NextResponse.json({ error: "Could not parse extraction response", raw }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
