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

export interface ReportData {
  slug: string;
  companyName: string;
  scanResult: ScanResult;
  agentTest?: AgentTestResult;
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
}

export interface AgentSubstep {
  label: string;
  status: AgentStepStatus;
  detail?: string;
}

export interface AgentTestResult {
  url: string;
  task: string;
  steps: AgentStepResult[];
  verdict: AgentStepStatus;
  verdictSummary: string;
  totalDurationMs: number;
  testedAt: string;
}
