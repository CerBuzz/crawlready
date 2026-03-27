export interface CheckResult {
  name: string;
  score: number;
  maxScore: number;
  status: "pass" | "partial" | "fail";
  details: string;
  recommendation?: string;
}

export interface ScanResult {
  url: string;
  totalScore: number;
  maxPossibleScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  checks: CheckResult[];
  scannedAt: string;
}
