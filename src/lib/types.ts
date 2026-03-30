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
