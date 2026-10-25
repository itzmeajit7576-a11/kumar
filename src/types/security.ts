export type NavPage =
  | "dashboard"
  | "email-analyzer"
  | "scam-detector"
  | "screenshot-scanner"
  | "history"
  | "reports"
  | "awareness"
  | "assistant"
  | "settings";

export type ShieldThreatState = "SAFE" | "WARNING" | "CRITICAL";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  authProvider: "google" | "password" | "demo";
  role: string;
  organization: string;
  createdAt: string;
  mfaEnabled: boolean;
  voiceTtsEnabled: boolean;
  realtimeAlertsEnabled: boolean;
}

export interface EmailUrlAnalysis {
  url: string;
  domain: string;
  status: "DANGEROUS" | "UNVERIFIED" | "SAFE";
  reason: string;
}

export interface EmailAnalysisResult {
  classification: "SAFE" | "SUSPICIOUS" | "PHISHING" | "SCAM" | "SPAM" | "MALICIOUS";
  riskScore: number;
  confidence: number;
  threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  summary: string;
  detectionReasons: string[];
  confirmedEvidence: string[];
  suspiciousIndicators: string[];
  uncertainFactors: string[];
  urls: EmailUrlAnalysis[];
  senderInfo: {
    address: string;
    domain: string;
    spf: "PASS" | "FAIL" | "SOFTFAIL" | "NONE";
    dkim: "PASS" | "FAIL" | "NONE";
    dmarc: "PASS" | "FAIL" | "NONE";
    impersonationRisk: "LOW" | "MODERATE" | "HIGH";
  };
  attachmentsInfo: {
    name: string;
    risk: string;
  }[];
  becIndicators: string[];
  recommendedAction: string;
}

export interface MessageAnalysisResult {
  riskScore: number;
  classification: "SAFE" | "LOW RISK" | "SUSPICIOUS" | "HIGH RISK" | "SCAM";
  confidence: number;
  platform: string;
  sender: string;
  whyDetected: string;
  detectedCategories: string[];
  confirmedEvidence: string[];
  suspiciousIndicators: string[];
  uncertainFactors: string[];
  suspiciousPhrases: string[];
  socialEngineeringTechniques: string[];
  extractedUrls: string[];
  extractedPhones: string[];
  paymentRequests: string[];
  recommendedAction: string;
}

export interface HighlightedRegion {
  label: string;
  snippet: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScreenshotAnalysisResult {
  extractedText: string;
  threatType: "SCAM" | "PHISHING" | "SPAM" | "SUSPICIOUS" | "SAFE";
  riskScore: number;
  confidence: number;
  explanation: string;
  detectedIndicators: string[];
  confirmedEvidence: string[];
  uncertainFactors: string[];
  recommendedAction: string;
  highlightedRegions: HighlightedRegion[];
  imagePreviewUrl?: string;
}

export interface HistoryRecord {
  id: string;
  userId: string;
  category: "Email" | "Message" | "Screenshot";
  title: string;
  subtitle: string;
  classification: string;
  riskScore: number;
  confidence: number;
  status: "QUARANTINED" | "FLAGGED" | "CLEARED" | "REVIEWED";
  timestamp: string;
  summary: string;
  recommendedAction: string;
  details: EmailAnalysisResult | MessageAnalysisResult | ScreenshotAnalysisResult;
}

export interface SecurityReport {
  id: string;
  userId: string;
  timestamp: string;
  inputType: "Email Analysis" | "Scam Message Analysis" | "Screenshot Analysis" | "Incident Report";
  title: string;
  classification: string;
  riskScore: number;
  confidence: number;
  detectionReasons: string[];
  suspiciousUrls: string[];
  extractedIndicators: string[];
  confirmedEvidence: string[];
  uncertainFactors: string[];
  recommendedAction: string;
  notes?: string;
}

export interface LiveAlertItem {
  id: string;
  title: string;
  category: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  vector: string;
  timestamp: string;
  description: string;
  mitigation: string;
}

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  actionExecuted?: string;
}
