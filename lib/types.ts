export type Verdict = "Priority Sign" | "Development Deal" | "Watch & Wait" | "Pass";

export interface Factor {
  label: string;
  score: number;
  max: number;
  confidence: "AUTO" | "INFER" | "MANUAL";
}

export interface Platform {
  name: string;
  audience: string;
  signal: string;
  signalType: "success" | "warning" | "neutral";
  relativeWidth: number;
}

export interface Metric {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}

export interface Validation {
  outcome: string;
  detail: string;
}

export interface Artist {
  id: string;
  name: string;
  handle: string;
  location: string;
  genre: string;
  label: string;
  score: number;
  verdict: Verdict;
  t1: number;
  t2: number;
  t3: number;
  retroDate: string;
  retroNote: string;
  tags: string[];
  metrics: Metric[];
  infrastructure: [string, string][];
  platforms: Platform[];
  factors: Factor[];
  greenLights: string[];
  riskFlags: string[];
  validation: Validation;
  memoPrompt: string;
  velocityData: number[];
  velocityNote: string;
}

export interface AnalysisResult {
  name: string;
  score: number;
  verdict: Verdict;
  tierScores: string;
  context: string;
  indicators: string[];
  rationale: string;
  riskFlag: string;
  greenLight: string;
  publishingOpportunity: string;
}
