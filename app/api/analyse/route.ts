import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "No artist name provided" }, { status: 400 });
    }

    const prompt = `You are a senior A&R analyst at Universal Music Group Asia using the Signal platform. Based on your knowledge of publicly available data about the artist "${name}", produce a Signal scoring assessment.

Output EXACTLY in this format (no other text, no markdown, no backticks — just these sections separated by newlines):

SIGNAL SCORE: [number 0-100]
VERDICT: [Priority Sign | Development Deal | Watch & Wait | Pass]
TIER SCORES: T1 [%] · T2 [%] · T3 [%]

ARTIST CONTEXT: [2-3 sentences: who they are, where from, what known for, current status]

KEY INDICATORS:
• [specific real data point — catalog, platform, streaming, live history]
• [specific real data point]
• [specific real data point]
• [specific real data point]

SCORING RATIONALE: [2-3 sentences explaining why this score, referencing Signal's 14 factors: catalog depth, songwriting, multi-platform, production, song nature, engagement quality, live performance, visual identity, narrative depth, genre positioning, language strategy, platform signal, ecosystem]

PRIMARY RISK FLAG: [single most important concern in 1 sentence]
PRIMARY GREEN LIGHT: [single strongest positive signal in 1 sentence]

PUBLISHING OPPORTUNITY: [1-2 sentences on what the specific publishing rights opportunity is for Universal Music Asia]

If you have limited knowledge of this artist, note that in the Artist Context section and score conservatively. Always output the complete format.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 700,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n")
      .trim();

    const getField = (label: string) => {
      const m = raw.match(new RegExp(`${label}:\\s*([\\s\\S]+?)(?=\\n[A-Z][A-Z ]+:|$)`));
      return m ? m[1].trim() : "";
    };

    const scoreMatch = raw.match(/SIGNAL SCORE:\s*(\d+)/);
    const verdictMatch = raw.match(/VERDICT:\s*(.+)/);
    const tierMatch = raw.match(/TIER SCORES:\s*(.+)/);
    const bulletsMatch = raw.match(/KEY INDICATORS:\s*([\s\S]+?)(?=\n[A-Z][A-Z ]+:|$)/);

    const indicators = bulletsMatch
      ? bulletsMatch[1]
          .split("\n")
          .map((l) => l.replace(/^[•\-*]\s*/, "").trim())
          .filter(Boolean)
      : [];

    return NextResponse.json({
      name,
      score: scoreMatch ? parseInt(scoreMatch[1]) : 50,
      verdict: verdictMatch ? verdictMatch[1].trim() : "Watch & Wait",
      tierScores: tierMatch ? tierMatch[1].trim() : "T1 —% · T2 —% · T3 —%",
      context: getField("ARTIST CONTEXT"),
      indicators,
      rationale: getField("SCORING RATIONALE"),
      riskFlag: getField("PRIMARY RISK FLAG"),
      greenLight: getField("PRIMARY GREEN LIGHT"),
      publishingOpportunity: getField("PUBLISHING OPPORTUNITY"),
    });
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
