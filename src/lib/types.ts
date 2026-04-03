export interface CheckResult {
  name: string;
  score: number;
  maxScore: number;
  status: "pass" | "partial" | "fail";
  details: string;
  recommendation?: string;
  /** Translation key for details — used by frontend i18n */
  detailKey?: string;
  /** Translation key for recommendation — used by frontend i18n */
  recommendationKey?: string;
  /** Dynamic parameters for interpolation (e.g. {count}, {bots}, {ms}) */
  params?: Record<string, string | number>;
}

export interface ScanResult {
  url: string;
  totalScore: number;
  maxPossibleScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  checks: CheckResult[];
  scannedAt: string;
}

export interface CompetitorData {
  url: string;
  companyName: string;
  agentTest: AgentTestResult;
}

export interface ReportData {
  slug: string;
  companyName: string;
  scanResult: ScanResult;
  agentTest?: AgentTestResult;
  competitor?: CompetitorData;
}

// --- Agentic Test Types ---

export type AgentStepStatus = "pass" | "partial" | "fail";

export interface AgentStepResult {
  step: string;
  action: string;
  status: AgentStepStatus;
  details: string;
  durationMs: number;
  substeps?: AgentSubstep[];
  /** Translation key for details — used by frontend i18n */
  detailKey?: string;
  /** Translation key for recommendation — used by frontend i18n */
  recommendationKey?: string;
  /** Dynamic parameters for interpolation */
  params?: Record<string, string | number>;
}

export interface AgentSubstep {
  label: string;
  status: AgentStepStatus;
  detail?: string;
  /** Translation key for label — used by frontend i18n */
  labelKey?: string;
  /** Translation key for detail — used by frontend i18n */
  detailKey?: string;
  /** Dynamic parameters for interpolation */
  params?: Record<string, string | number>;
}

export interface BusinessComprehension {
  services: string[];
  locations: string[];
  audiences: string[];
  prices: string[];
  description: string;
  headingSample: string[];
}

export interface AgentTestResult {
  url: string;
  task: string;
  steps: AgentStepResult[];
  verdict: AgentStepStatus;
  verdictSummary: string;
  comprehension?: BusinessComprehension;
  totalDurationMs: number;
  testedAt: string;
}
