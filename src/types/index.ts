// AccessNX Type Definitions

export type Severity = 'critical' | 'moderate' | 'minor';

export type ScoreCategory = 'excellent' | 'good' | 'needs-improvement' | 'poor';

export interface AccessibilityIssue {
  id: string;
  title: string;
  wcagRule: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  explanation: string;
  affectedGroups: string[];
  suggestedFix: string[];
  codeSnippet: string;
  severity: Severity;
}

export interface ScanResult {
  url: string;
  score: number;
  category: ScoreCategory;
  issues: AccessibilityIssue[];
  complianceBadges: ComplianceBadge[];
  scanDate: string;
  techStack: string;
}

export interface ComplianceBadge {
  id: string;
  label: string;
  description: string;
  type: 'success' | 'warning' | 'info';
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ScanState {
  isScanning: boolean;
  error: string | null;
  result: ScanResult | null;
}
