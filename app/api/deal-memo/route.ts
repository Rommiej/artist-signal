import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { catalog, params, results, territories } = body;

    const territoryList = territories.map((t: any) =>
      `${t.name}: ${t.share}% of intl revenue, ${t.growth}% annual growth, ${t.collection}% collection efficiency`
    ).join("\n");

    const scenarioSummary = `
Conservative: $${(results.conservative.advance / 1e6).toFixed(1)}M advance — Term NPV $${(results.conservative.npv / 1e6).toFixed(1)}M
Base case:    $${(results.base.advance / 1e6).toFixed(1)}M advance — Term NPV $${(results.base.npv / 1e6).toFixed(1)}M  
Optimistic:   $${(results.optimistic.advance / 1e6).toFixed(1)}M advance — Term NPV $${(results.optimistic.npv / 1e6).toFixed(1)}M`;

    const yearBreakdown = results.base.years.map((y: any, i: number) =>
      `Year ${i+1}: Gross $${(y.gross/1e6).toFixed(2)}M → Catalog owner share $${(y.ownerShare/1e6).toFixed(2)}M → PV $${(y.pv/1e6).toFixed(2)}M`
    ).join("\n");

    const prompt = `You are a senior music publishing executive and deal structuring specialist at Universal Music Group Asia. Write a comprehensive catalog deal intelligence memo for the Head of Publishing.

CATALOG: ${catalog.name}
OWNER: ${catalog.owner}
DESCRIPTION: ${catalog.description}
CATALOG SIZE: ${catalog.catalogSize.toLocaleString()} songs
RIGHTS TYPE: ${catalog.rightsType === "master_publishing" ? "Master Recording + Publishing Rights" : catalog.rightsType === "publishing_only" ? "Publishing Rights Only" : "Sync Rights Only"}
AGE PROFILE: ${catalog.ageProfile}
PRIMARY LANGUAGE: ${catalog.primaryLanguage}

DEAL PARAMETERS:
- Term length: ${params.termYears} years
- Territory scope: Ex-India (${territories.map((t: any) => t.name).join(", ")})
- Royalty split: ${params.ownerSplit}% to catalog owner / ${100 - params.ownerSplit}% UMG admin fee
- Current annual international NPS (estimated): $${(params.baseNPS / 1e6).toFixed(1)}M USD
- Discount rate applied: ${params.discountRate}%
- Recoupment comfort factor: ${(params.recoupment * 100).toFixed(0)}%

TERRITORY BREAKDOWN:
${territoryList}

VALUATION SCENARIOS:
${scenarioSummary}

YEAR-BY-YEAR BASE CASE DCF:
${yearBreakdown}

Total base case term NPV: $${(results.base.npv / 1e6).toFixed(1)}M
Recommended advance (base): $${(results.base.advance / 1e6).toFixed(1)}M
UMG projected admin fee income over term: $${(results.base.umgFeeIncome / 1e6).toFixed(1)}M

Write a detailed, structured memo with the following sections. Be specific with numbers. Every claim should reference the data above.

## EXECUTIVE SUMMARY
2-3 sentences. What is being evaluated, what does Signal recommend, and what is the key commercial logic.

## CATALOG INTELLIGENCE
Detailed analysis of the catalog. What makes it commercially valuable or risky. Heritage vs contemporary weighting implications. Language and diaspora market dynamics. Rights type implications for revenue streams available.

## FINANCIAL ANALYSIS — DEAL VALUATION
Full explanation of the DCF methodology used. Why each assumption was made. What the three scenarios represent and what would need to be true for each. Walk through the year-by-year base case. Explain what the discount rate reflects. Explain the recoupment comfort factor.

## TERRITORY-BY-TERRITORY ANALYSIS  
For each territory: current revenue share, growth driver (diaspora size, streaming penetration, subscription migration), collection efficiency and why it is what it is, and what UMG can do that the current owner cannot.

## UMG VALUE-ADD ANALYSIS
Quantify what UMG brings that justifies the advance:
1. Collection infrastructure improvement — estimate additional collections in undercollected territories
2. Sync placement — estimate placement probability and fees for heritage Indian catalog in Western markets
3. Streaming algorithmic promotion — estimated streams uplift from editorial playlist placement
4. Legal enforcement — reduced piracy in diaspora markets with proper legal infrastructure

## RISK ASSESSMENT
Flag the top 5 risks. For each: probability (H/M/L), financial impact, and specific mitigation.

## DEAL STRUCTURE RECOMMENDATION
Specific terms: advance amount (justify the exact number, not just the range), royalty split rationale, term length rationale, option period structure, audit rights, minimum guarantee provisions, territory carve-outs to consider.

## NEGOTIATION INTELLIGENCE
Saregama's likely position. What they will push for. Where there is room to move. Walk-away conditions for UMG. First-mover considerations — who else might be looking at this catalog.

## NEXT STEPS — 30 DAYS
Specific action items in chronological order.

Tone: This is a C-suite document. Every sentence earns its place. No filler. Heavy on specific numbers, light on adjectives. The Head of Publishing has seen 200 deals — write for someone who will immediately challenge any unsubstantiated claim.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n").trim();

    return NextResponse.json({ content });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
