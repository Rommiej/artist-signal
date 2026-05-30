import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { catalog, params, results, territories, sellerVsBase, sellerVsOptimistic, reqGrowthForSellerAsk } = body;

    const tList = territories.map((t: any) =>
      `  ${t.name}: ${t.share}% share · ${t.growth}% annual growth · ${t.collection}% collection efficiency`
    ).join("\n");

    const yBase = results.base.years.map((y: any, i: number) =>
      `  Y${i+1}: Gross $${(y.gross/1e6).toFixed(3)}M → Owner share $${(y.ownerShare/1e6).toFixed(3)}M → PV $${(y.pv/1e6).toFixed(3)}M → Cumulative PV $${(y.cumPV/1e6).toFixed(3)}M`
    ).join("\n");

    const prompt = `You are a senior music publishing M&A specialist at Universal Music Group Asia. Write a comprehensive catalog deal intelligence memo for the Head of Publishing. Be specific, analytical, and commercially direct. Every claim must reference the actual data provided.

═══════════════════════════════════════
CATALOG: ${catalog.name}
OWNER: ${catalog.owner}
CATALOG: ${(catalog.catalogSize/1000).toFixed(0)}K songs · ${catalog.ageProfile} · ${catalog.primaryLanguage}
RIGHTS: ${catalog.rightsType === "master_publishing" ? "Master Recording + Publishing Rights" : catalog.rightsType === "publishing_only" ? "Publishing Rights Only" : "Sync Rights Only"}

VERIFIED FINANCIAL DATA:
Current annual ex-India publishing NPS: $${(catalog.baseNPS/1e6).toFixed(2)}M (confirmed by Saregama team)
Status quo 3-year gross: $${(catalog.baseNPS*params.termYears/1e6).toFixed(1)}M
Seller asking price: $${(params.sellerAsk/1e6).toFixed(1)}M

DEAL STRUCTURE:
Term: ${params.termYears} years · Territory: Ex-India worldwide
Split: ${params.ownerSplit}% Saregama / ${100-params.ownerSplit}% UMG admin fee
Discount rate: ${params.discountRate}% · Recoupment factor: ${Math.round(params.recoupment*100)}%
UMG uplift assumption: +${params.upliftPct}%/yr additional growth (base/optimistic scenarios)

TERRITORY BREAKDOWN:
${tList}

DCF RESULTS:
Conservative (no UMG uplift):
  NPV: $${(results.conservative.npv/1e6).toFixed(2)}M · Recommended advance: $${(results.conservative.advance/1e6).toFixed(2)}M · UMG fee income: $${(results.conservative.umgFeeIncome/1e6).toFixed(2)}M

Base case (market growth + ${params.upliftPct}% UMG uplift):
  NPV: $${(results.base.npv/1e6).toFixed(2)}M · Recommended advance: $${(results.base.advance/1e6).toFixed(2)}M · UMG fee income: $${(results.base.umgFeeIncome/1e6).toFixed(2)}M

Optimistic (full sub-pub + sync + 1.5× uplift):
  NPV: $${(results.optimistic.npv/1e6).toFixed(2)}M · Recommended advance: $${(results.optimistic.advance/1e6).toFixed(2)}M · UMG fee income: $${(results.optimistic.umgFeeIncome/1e6).toFixed(2)}M

YEAR-BY-YEAR BASE CASE:
${yBase}

SELLER ASK ANALYSIS:
Seller ask ($${(params.sellerAsk/1e6).toFixed(1)}M) vs base case: +${sellerVsBase}% over UMG valuation
Seller ask vs optimistic case: ${sellerVsOptimistic > 0 ? '+' : ''}${sellerVsOptimistic}%
Growth required in annual NPS to recoup $${(params.sellerAsk/1e6).toFixed(1)}M over ${params.termYears} years: ${reqGrowthForSellerAsk}% increase
Required annual NPS to recoup: $${((params.sellerAsk/params.termYears)/(params.ownerSplit/100)/1e6).toFixed(2)}M (vs current $${(catalog.baseNPS/1e6).toFixed(2)}M)
═══════════════════════════════════════

Write the following sections. Use the exact numbers provided. Be specific about what each number means commercially.

## EXECUTIVE SUMMARY
What is being evaluated, what is the headline recommendation, and the single most important number the Head of Publishing needs to know. Max 4 sentences.

## CATALOG INTELLIGENCE
What makes this catalog commercially interesting and what are its structural limitations. Address: heritage vs contemporary weighting and what that means for streaming growth; language concentration (Hindi + 13 regional languages) and diaspora market dynamics; the significance of owning both master and publishing rights; why $${(catalog.baseNPS/1e6).toFixed(1)}M current NPS is dramatically below theoretical potential for a 1.3M song catalog.

## FINANCIAL ANALYSIS — DCF METHODOLOGY
Explain the model precisely. What the ${params.discountRate}% discount rate reflects for this specific catalog type. Why the ${Math.round(params.recoupment*100)}% recoupment comfort factor was chosen. Walk through the year-by-year base case numbers. Explain what the three scenarios represent and what assumptions underpin each. Calculate and state the implied NPS multiple (advance ÷ annual NPS) for each scenario.

## SELLER ASK ASSESSMENT
Saregama is asking $${(params.sellerAsk/1e6).toFixed(1)}M. Analyse this precisely:
- Current 3-year status quo value to Saregama: $${(catalog.baseNPS*params.termYears/1e6).toFixed(1)}M gross · $${(catalog.baseNPS*params.termYears*(params.ownerSplit/100)/1e6).toFixed(1)}M at ${params.ownerSplit}% split
- What premium the $${(params.sellerAsk/1e6).toFixed(1)}M represents over current earnings
- The ${reqGrowthForSellerAsk}% growth required to recoup — is this achievable and in what timeframe
- Whether Saregama is pricing in UMG's own uplift value (and why that is commercially unreasonable)
- Recommended counter-offer range with specific rationale

## TERRITORY-BY-TERRITORY ANALYSIS
For each of the 6 key territories (UK, USA, UAE/Gulf, Canada, Australia, Singapore): current revenue share, diaspora market driver, collection efficiency and why it is at that level, what UMG can specifically do that Saregama currently cannot, and year-3 projected revenue in that territory under the base case.

## UMG VALUE-ADD QUANTIFICATION
Quantify the specific value UMG brings. For each lever, provide a specific dollar estimate:
1. Collection society registration uplift (how many songs are likely unregistered; estimate additional annual royalties from proper PRS/ASCAP/BMI registration)
2. Editorial playlist placement (Spotify editorial for Bollywood/South Asian; estimated stream uplift and royalty value)
3. Sync placement (estimate 2-3 realistic placements per year; average sync fees for heritage Indian catalog in Western markets)
4. Legal enforcement and anti-piracy (reduced leakage in diaspora markets)
Total these to show the UMG uplift is real, quantifiable, and justifies the advance above the conservative case.

## RISK ASSESSMENT
Top 5 risks ranked by financial impact. For each: specific description, probability (H/M/L), estimated financial impact in dollars, and specific mitigation measure UMG should require in the contract.

## DEAL STRUCTURE RECOMMENDATION
Specific terms with commercial rationale for each:
- Advance: exact recommended figure (not a range) with why
- Royalty split: ${params.ownerSplit}/${100-params.ownerSplit} — is this appropriate given the risk profile, or should UMG push for a different split?
- Term: ${params.termYears} years — rationale, and whether an option period is warranted
- Minimum guarantee provisions — should there be a floor protecting UMG if collections underperform?
- Profit share kicker — structure a bonus payment if NPS exceeds a threshold (this aligns Saregama's incentive with UMG's investment)
- Territory carve-outs to consider
- Audit rights structure
- Key contractual protections

## NEGOTIATION STRATEGY
Saregama's likely opening negotiating position. Where they will push. Where UMG has leverage. The specific counter-offer to make and how to frame it. What to concede vs what to hold firm on. Walk-away conditions. Whether any other major publishers (Sony Music Publishing, Warner Chappell) are likely in this process and how that affects timing.

## NEXT 30 DAYS — ACTION ITEMS
Specific chronological actions, each with an owner and deadline.

TONE: This is a document the Head of Publishing will use in a board-level deal committee meeting. Every sentence must have information value. No qualifications without substance. Heavy on specific numbers. Write for someone who has structured 50+ catalog deals and will immediately challenge any unsubstantiated claim.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
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
