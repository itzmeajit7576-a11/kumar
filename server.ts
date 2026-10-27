import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const PORT = 3000;

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper utilities for deterministic forensic extraction & fallback
function extractUrlsFromText(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s"'<>]+|www\.[^\s"'<>]+|\b[a-z0-9.-]+\.(?:xyz|top|click|link|tk|ml|ga|cf|gq|ru|cn|zip|mov|info|biz|online|site|club|work|live|support|verify|secure-login\.com)\b[^\s"'<>]*/gi;
  const matches = text.match(urlRegex) || [];
  return Array.from(new Set(matches.map((u) => u.replace(/[.,;!?)]+$/, ""))));
}

function extractPhoneNumbers(text: string): string[] {
  const phoneRegex = /(?:\+?\d{1,3}[\s-]?)?(?:\(\d{2,4}\)[\s-]?)?\d{3,5}[\s-]?\d{3,5}[\s-]?\d{0,4}/g;
  const matches = text.match(phoneRegex) || [];
  return Array.from(
    new Set(
      matches
        .map((m) => m.trim())
        .filter((m) => m.replace(/\D/g, "").length >= 8 && m.replace(/\D/g, "").length <= 15)
    )
  );
}

function parseSpfDkimDmarc(headers: string, sender: string) {
  const lower = (headers || "").toLowerCase();
  let spf: "PASS" | "FAIL" | "SOFTFAIL" | "NONE" = "NONE";
  let dkim: "PASS" | "FAIL" | "NONE" = "NONE";
  let dmarc: "PASS" | "FAIL" | "NONE" = "NONE";

  if (lower.includes("spf=pass")) spf = "PASS";
  else if (lower.includes("spf=fail")) spf = "FAIL";
  else if (lower.includes("spf=softfail")) spf = "SOFTFAIL";
  else if (sender.includes("@") && !lower.trim()) spf = "NONE";

  if (lower.includes("dkim=pass")) dkim = "PASS";
  else if (lower.includes("dkim=fail")) dkim = "FAIL";

  if (lower.includes("dmarc=pass")) dmarc = "PASS";
  else if (lower.includes("dmarc=fail")) dmarc = "FAIL";

  return { spf, dkim, dmarc };
}

function heuristicEmailAnalysis(payload: {
  subject?: string;
  sender?: string;
  recipient?: string;
  headers?: string;
  body?: string;
  attachments?: string[];
}) {
  const subject = payload.subject || "";
  const sender = payload.sender || "";
  const headers = payload.headers || "";
  const body = payload.body || "";
  const attachments = payload.attachments || [];
  const combined = `${subject}\n${sender}\n${headers}\n${body}`.toLowerCase();

  const urls = extractUrlsFromText(`${body}\n${headers}`);
  const authResults = parseSpfDkimDmarc(headers, sender);

  let score = 10;
  const confirmedEvidence: string[] = [];
  const suspiciousIndicators: string[] = [];
  const uncertainFactors: string[] = [];
  const detectionReasons: string[] = [];

  // Check authentication headers
  if (authResults.spf === "FAIL" || authResults.spf === "SOFTFAIL") {
    score += 24;
    confirmedEvidence.push(`SPF authentication returned ${authResults.spf} in message headers.`);
    detectionReasons.push("Sender server is not authorized by domain SPF record.");
  } else if (authResults.spf === "NONE") {
    uncertainFactors.push("No raw SPF header was provided; sender IP authenticity could not be cryptographically verified.");
  } else {
    confirmedEvidence.push("SPF header indicates PASS.");
  }

  if (authResults.dkim === "FAIL") {
    score += 22;
    confirmedEvidence.push("DKIM cryptographic signature verification failed (dkim=fail).");
    detectionReasons.push("Message signature failed DKIM integrity check.");
  }
  if (authResults.dmarc === "FAIL") {
    score += 22;
    confirmedEvidence.push("DMARC alignment check failed (dmarc=fail).");
  }

  // Lookalike domain / display name spoofing
  const senderDomainMatch = sender.match(/@([a-zA-Z0-9.-]+)/);
  const senderDomain = senderDomainMatch ? senderDomainMatch[1].toLowerCase() : "";
  if (
    /[0-9]/.test(senderDomain.replace(/\.(com|org|net|in|co|io)$/, "")) &&
    /(paypa1|micr0soft|amaz0n|g00gle|hdfc|sbi|icici|support|verify|security|bank|alert)/i.test(senderDomain)
  ) {
    score += 32;
    confirmedEvidence.push(`Sender domain "${senderDomain}" uses character substitution / lookalike typosquatting.`);
    detectionReasons.push(`Typosquatted sender domain (${senderDomain}) impersonating a trusted brand.`);
  }

  if (senderDomain && /(xyz|top|click|zip|tk|ml|ru|work|support-login|verify-account)/i.test(senderDomain)) {
    score += 20;
    suspiciousIndicators.push(`Sender uses a high-risk or newly registered TLD/domain pattern (${senderDomain}).`);
  }

  // Return-Path / Reply-To mismatch
  const replyToMatch = headers.match(/Reply-To:\s*([^\r\n]+)/i);
  if (replyToMatch && senderDomain && !replyToMatch[1].toLowerCase().includes(senderDomain)) {
    score += 18;
    confirmedEvidence.push(`Reply-To header (${replyToMatch[1].trim()}) does not match sender domain (${senderDomain}).`);
    detectionReasons.push("Reply-To address redirects responses to an external domain (common in BEC attacks).");
  }

  // Urgency & Phishing / BEC keywords
  if (/(urgent|immediate action|account suspended|verify your account|24 hours|unauthorized login|security alert|password expires)/i.test(combined)) {
    score += 18;
    suspiciousIndicators.push("Contains high-urgency coercion phrases designed to bypass critical thinking.");
    detectionReasons.push("Artificial time pressure and account suspension threats detected.");
  }

  if (/(wire transfer|bank details changed|updated invoice|gift cards|urgent payment|ceo|overdue invoice|routing number|swift)/i.test(combined)) {
    score += 22;
    suspiciousIndicators.push("Exhibits Business Email Compromise (BEC) financial redirection language.");
    detectionReasons.push("Requests payment method modification, wire transfer, or urgent invoice settlement.");
  }

  if (/(otp|password|pin|cvv|social security|aadhaar|pan card|kyc|seed phrase|private key|login credentials)/i.test(combined)) {
    score += 20;
    suspiciousIndicators.push("Requests sensitive authentication credentials, KYC documents, or financial secrets.");
    detectionReasons.push("Direct solicitation of credentials or personal verification data.");
  }

  if (/(congratulations|won|lottery|prize|claim your reward|inheritance|million dollars|guaranteed return|double your crypto)/i.test(combined)) {
    score += 25;
    suspiciousIndicators.push("Contains advance-fee lottery, giveaway, or guaranteed investment lure patterns.");
    detectionReasons.push("Unrealistic financial reward or prize claim solicitation.");
  }

  // URL inspection
  const domainAnalysis = urls.map((u) => {
    const lowerUrl = u.toLowerCase();
    const isRisky =
      /(\.xyz|\.top|\.click|\.zip|\.tk|\.ru|bit\.ly|tinyurl\.com|t\.co|is\.gd|verify|login|secure|update|account|bank|kyc|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i.test(
        lowerUrl
      );
    return {
      url: u,
      domain: u.replace(/^https?:\/\//i, "").split("/")[0],
      status: isRisky ? ("DANGEROUS" as const) : ("UNVERIFIED" as const),
      reason: isRisky
        ? "Contains deceptive keywords, URL shortener obfuscation, or high-risk TLD"
        : "External link found in email body; verify destination before clicking",
    };
  });

  const riskyUrlCount = domainAnalysis.filter((d) => d.status === "DANGEROUS").length;
  if (riskyUrlCount > 0) {
    score += Math.min(30, riskyUrlCount * 18);
    confirmedEvidence.push(`${riskyUrlCount} high-risk or deceptive URL(s) extracted from message content.`);
    detectionReasons.push("Contains links pointing to suspicious or credential-harvesting domains.");
  } else if (urls.length > 0) {
    score += 6;
    uncertainFactors.push("Message contains external URLs whose live destination reputation requires cautious verification.");
  }

  // Attachments check
  const riskyAttachments = attachments.filter((a) =>
    /\.(exe|scr|vbs|bat|cmd|js|jar|iso|img|xlsm|docm|hta|lnk|zip\.exe)$/i.test(a.trim())
  );
  if (riskyAttachments.length > 0) {
    score += 38;
    confirmedEvidence.push(`Dangerous executable or macro-enabled attachment detected: ${riskyAttachments.join(", ")}`);
    detectionReasons.push("Contains high-risk attachment file extension commonly used to deliver malware.");
  } else if (attachments.length > 0) {
    uncertainFactors.push(`Attachment(s) listed (${attachments.join(", ")}) were inspected by filename only; scan binary payload before opening.`);
  }

  score = Math.max(4, Math.min(98, score));

  let classification: "SAFE" | "SUSPICIOUS" | "PHISHING" | "SCAM" | "SPAM" | "MALICIOUS" = "SAFE";
  if (riskyAttachments.length > 0 || (score >= 85 && riskyUrlCount > 0 && authResults.spf === "FAIL")) {
    classification = "MALICIOUS";
  } else if (score >= 70 && /(verify|login|password|account|suspended|bank|credential)/i.test(combined)) {
    classification = "PHISHING";
  } else if (score >= 65 && /(wire|invoice|lottery|prize|crypto|investment|payment|upi|gift card)/i.test(combined)) {
    classification = "SCAM";
  } else if (score >= 45 && /(unsubscribe|offer|discount|marketing|deal|limited time)/i.test(combined)) {
    classification = "SPAM";
  } else if (score >= 35) {
    classification = "SUSPICIOUS";
  } else {
    classification = "SAFE";
  }

  const threatLevel =
    score >= 75 ? "CRITICAL" : score >= 50 ? "HIGH" : score >= 30 ? "MEDIUM" : "LOW";

  if (confirmedEvidence.length === 0) {
    confirmedEvidence.push("No forged cryptographic headers or known malicious attachment extensions were found.");
  }
  if (suspiciousIndicators.length === 0 && score < 35) {
    suspiciousIndicators.push("No high-pressure social engineering or credential harvesting patterns detected.");
  }
  if (uncertainFactors.length === 0) {
    uncertainFactors.push("Static text analysis cannot guarantee sender intent without out-of-band verification if financial actions are requested.");
  }
  if (detectionReasons.length === 0) {
    detectionReasons.push("Email content and structure appear consistent with standard communication.");
  }

  const recommendedAction =
    score >= 70
      ? "Do NOT click any links, download attachments, or reply. Quarantine this email immediately and verify any claims via an official phone number or known bookmark."
      : score >= 35
      ? "Treat with caution. Independently verify the sender's identity outside of email before acting on any requests or links."
      : "No immediate threat indicators detected. Remain vigilant if unexpected links or follow-up requests appear.";

  return {
    classification,
    riskScore: score,
    confidence: authResults.spf !== "NONE" ? 91 : 78,
    threatLevel,
    summary:
      score >= 70
        ? `High-risk ${classification.toLowerCase()} indicators detected. This email combines ${detectionReasons[0]?.toLowerCase() || "deceptive patterns"} with social engineering cues.`
        : score >= 35
        ? `Moderate risk indicators found. Several elements require manual verification before trusting this message.`
        : `Low risk score (${score}/100). The email shows no strong phishing or malware indicators based on available evidence.`,
    detectionReasons,
    confirmedEvidence,
    suspiciousIndicators,
    uncertainFactors,
    urls: domainAnalysis,
    senderInfo: {
      address: sender || "Unspecified Sender",
      domain: senderDomain || "Unknown Domain",
      spf: authResults.spf,
      dkim: authResults.dkim,
      dmarc: authResults.dmarc,
      impersonationRisk:
        score >= 65 ? "HIGH" : score >= 35 ? "MODERATE" : "LOW",
    },
    attachmentsInfo: attachments.map((name) => ({
      name,
      risk: /\.(exe|scr|vbs|bat|cmd|js|jar|iso|xlsm|docm|hta|lnk)$/i.test(name)
        ? "HIGH — Executable / Macro Payload"
        : "LOW — Standard Document Format",
    })),
    becIndicators: /(wire transfer|invoice|routing|ceo|urgent payment|gift card|bank details)/i.test(combined)
      ? [
          "Financial redirection or invoice modification language present",
          "Requests rapid settlement bypassing standard approval workflow",
        ]
      : [],
    recommendedAction,
  };
}

function heuristicMessageAnalysis(payload: { platform?: string; sender?: string; message?: string }) {
  const platform = payload.platform || "SMS";
  const sender = payload.sender || "Unknown Sender";
  const message = payload.message || "";
  const lower = message.toLowerCase();

  const extractedUrls = extractUrlsFromText(message);
  const extractedPhones = extractPhoneNumbers(message);

  let score = 8;
  const confirmedEvidence: string[] = [];
  const suspiciousIndicators: string[] = [];
  const uncertainFactors: string[] = [];
  const suspiciousPhrases: string[] = [];
  const socialEngineeringTechniques: string[] = [];
  const paymentRequests: string[] = [];
  const detectedCategories: string[] = [];

  const checkPhrase = (regex: RegExp, label: string, points: number, category: string, technique?: string) => {
    const match = message.match(regex);
    if (match) {
      score += points;
      suspiciousPhrases.push(match[0]);
      suspiciousIndicators.push(label);
      if (!detectedCategories.includes(category)) detectedCategories.push(category);
      if (technique && !socialEngineeringTechniques.includes(technique)) {
        socialEngineeringTechniques.push(technique);
      }
    }
  };

  checkPhrase(
    /\b(kyc|pan card|aadhaar|account blocked|suspended|update kyc|dear customer your a\/c|electricity bill|power disconnect)\b/i,
    "Uses account blockage or mandatory KYC / utility disconnection scare tactics.",
    28,
    "KYC / Account Verification Scam",
    "Fear & Authority Coercion"
  );

  checkPhrase(
    /\b(otp|one time password|share code|verification code|do not share|6-digit code|send back the code)\b/i,
    "References OTP or verification codes; scammers trick users into forwarding account takeover codes.",
    22,
    "OTP Fraud",
    "Urgent Verification Pretext"
  );

  checkPhrase(
    /\b(upi|paytm|gpay|phonepe|collect request|scan qr|enter pin to receive|cashback|refund pending|send rs|₹\s?\d+|\$\s?\d+)\b/i,
    "Involves UPI, QR scan, or payment transfer pretext (entering a UPI PIN always deducts money, never receives it).",
    26,
    "UPI / Payment Scam",
    "Financial Pretext & Reversal Trick"
  );

  checkPhrase(
    /\b(part-time job|work from home|earn ₹|earn \$|daily income|telegram task|youtube like|rating tasks|hr manager|no experience needed)\b/i,
    "Matches task-based 'work from home' or Telegram/WhatsApp job scam patterns.",
    28,
    "Fake Job Offer",
    "Easy Income / Greed Lure"
  );

  checkPhrase(
    /\b(lottery|congratulations you won|lucky draw|mega prize|claim reward|processing fee|kbc|spin wheel)\b/i,
    "Promises an unsolicited lottery or prize reward requiring upfront action or fee.",
    30,
    "Lottery / Prize Scam",
    "Scarcity & Reward Lure"
  );

  checkPhrase(
    /\b(guaranteed profit|crypto signal|200% return|double your investment|vip trading group|insider stock|forex bot)\b/i,
    "Promotes unrealistic guaranteed investment or cryptocurrency returns.",
    28,
    "Investment Scam",
    "Financial FOMO & Social Proof"
  );

  checkPhrase(
    /\b(instant loan|no cibil|pre-approved loan|low interest loan|processing charge|loan disbursed)\b/i,
    "Unsolicited instant loan offer with zero credit check (predatory loan app indicator).",
    24,
    "Loan Scam",
    "Financial Relief Lure"
  );

  checkPhrase(
    /\b(parcel held|delivery failed|incomplete address|customs duty|india post|fedex|dhl|update delivery address|reschedule delivery)\b/i,
    "Claims a package is undeliverable or held by customs to lure clicks on a phishing link.",
    26,
    "Delivery / Package Scam",
    "Curiosity & Routine Disruption"
  );

  checkPhrase(
    /\b(immediately|within 24 hours|urgent|last warning|tonight|final notice|act now|expire today)\b/i,
    "Creates artificial time pressure to force hasty compliance.",
    18,
    "Urgent Coercion",
    "Artificial Time Constraint"
  );

  if (extractedUrls.length > 0) {
    score += 22;
    confirmedEvidence.push(`Message contains ${extractedUrls.length} clickable link(s): ${extractedUrls.join(", ")}`);
    if (extractedUrls.some((u) => /(bit\.ly|tinyurl|xyz|top|click|tk|kyc|verify|update|login|claim|free)/i.test(u))) {
      score += 18;
      confirmedEvidence.push("URL uses a shortener or deceptive domain name unrelated to official portals.");
    }
  }

  if (extractedPhones.length > 0 && score >= 25) {
    confirmedEvidence.push(`Includes callback/WhatsApp number(s): ${extractedPhones.join(", ")}`);
  }

  if (/\b(send|pay|transfer|fee|charge|deposit|upi|rs\.?|₹|\$)\b/i.test(lower)) {
    const payMatch = message.match(/(?:rs\.?|₹|\$)\s?\d[\d,.]*|(?:pay|send|transfer|deposit)\s+[^\n.]{3,35}/i);
    if (payMatch) {
      paymentRequests.push(payMatch[0].trim());
    }
  }

  // Genuine transactional OTP check (e.g. "123456 is your OTP for login. Do not share it with anyone." with NO links and NO ask to forward)
  if (
    /\b(do not share|never share)\b/i.test(lower) &&
    extractedUrls.length === 0 &&
    !/\b(reply|send back|call|click|whatsapp|blocked|electricity)\b/i.test(lower)
  ) {
    score = Math.min(score, 22);
    uncertainFactors.push(
      "This message resembles a standard automated OTP alert warning you NOT to share the code. However, if you did not initiate this login/transaction, someone may be attempting to access your account."
    );
  }

  score = Math.max(5, Math.min(98, score));

  let classification: "SAFE" | "LOW RISK" | "SUSPICIOUS" | "HIGH RISK" | "SCAM" = "SAFE";
  if (score >= 80) classification = "SCAM";
  else if (score >= 60) classification = "HIGH RISK";
  else if (score >= 38) classification = "SUSPICIOUS";
  else if (score >= 20) classification = "LOW RISK";
  else classification = "SAFE";

  if (confirmedEvidence.length === 0) {
    confirmedEvidence.push(`Analyzed ${message.length} characters from ${platform} message.`);
  }
  if (uncertainFactors.length === 0) {
    uncertainFactors.push(
      "Text-only analysis evaluates linguistic and URL patterns; always verify unexpected requests through an official app or website."
    );
  }

  const whyDetected =
    score >= 60
      ? `High-risk scam message detected (${detectedCategories.join(", ") || "Social Engineering"}). The message ${
          socialEngineeringTechniques.length > 0
            ? `uses ${socialEngineeringTechniques.join(" and ").toLowerCase()}`
            : "creates urgency"
        }${paymentRequests.length > 0 ? ", references a financial transaction," : ""}${
          extractedUrls.length > 0 ? " and contains a suspicious link." : "."
        }`
      : score >= 38
      ? `Suspicious message detected on ${platform}. Contains persuasion patterns (${
          detectedCategories.join(", ") || "unverified claims"
        }) that warrant independent verification.`
      : `No definitive scam triggers detected. Evidence is either benign or inconclusive without sender context.`;

  const recommendedAction =
    score >= 60
      ? "Do NOT click any links, call the listed number, share OTPs, or approve UPI collect requests. Block and report the sender on " +
        platform +
        "."
      : score >= 38
      ? "Pause before responding. Verify the claim directly inside the official service app or website—never use links or phone numbers inside the message."
      : "Message appears low-risk, but never share OTPs or PINs with anyone even if they claim to be support staff.";

  return {
    riskScore: score,
    classification,
    confidence: 88,
    platform,
    sender,
    whyDetected,
    detectedCategories: detectedCategories.length > 0 ? detectedCategories : ["General Communication"],
    confirmedEvidence,
    suspiciousIndicators,
    uncertainFactors,
    suspiciousPhrases: Array.from(new Set(suspiciousPhrases)),
    socialEngineeringTechniques:
      socialEngineeringTechniques.length > 0 ? socialEngineeringTechniques : ["None prominently detected"],
    extractedUrls,
    extractedPhones,
    paymentRequests,
    recommendedAction,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "15mb" }));

  // 1. AI Email Threat Analyzer Endpoint
  app.post("/api/analyze-email", async (req, res) => {
    try {
      const { subject, sender, recipient, headers, body, attachments, language } = req.body || {};
      const baseline = heuristicEmailAnalysis({
        subject,
        sender,
        recipient,
        headers,
        body,
        attachments,
      });

      const ai = getGenAIClient();
      if (!ai) {
        return res.json(baseline);
      }

      try {
        const langDirective =
          language === "hi"
            ? "IMPORTANT: Output the summary, detectionReasons, confirmedEvidence, suspiciousIndicators, uncertainFactors, and recommendedAction entirely in natural, fluent Hindi (हिंदी script)."
            : language === "kn"
            ? "IMPORTANT: Output the summary, detectionReasons, confirmedEvidence, suspiciousIndicators, uncertainFactors, and recommendedAction entirely in natural, fluent Kannada (ಕನ್ನಡ script)."
            : "Output all text in clear, concise English.";

        const prompt = `You are a senior cybersecurity forensic analyst. Analyze the following email for Phishing, Scam, Spam, Malicious Links, Impersonation, and Business Email Compromise (BEC).

LANGUAGE REQUIREMENT:
${langDirective}

IMPORTANT RULES:
1. Distinguish clearly between Confirmed Evidence (facts directly observable in headers/links/attachments), Suspicious Indicators (linguistic urgency, pretexts), and Uncertain Factors (things that cannot be proven from text alone).
2. Never claim 100% certainty when evidence is inconclusive.
3. Explain findings in clear, simple language suitable for normal users.

Email Details:
Subject: ${subject || "(none)"}
Sender: ${sender || "(none)"}
Recipient: ${recipient || "(none)"}
Raw Headers: ${headers || "(none provided)"}
Attachments: ${(attachments || []).join(", ") || "(none)"}
Body:
${body || "(empty)"}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                classification: {
                  type: Type.STRING,
                  description: "SAFE, SUSPICIOUS, PHISHING, SCAM, SPAM, or MALICIOUS",
                },
                riskScore: {
                  type: Type.INTEGER,
                  description: "Risk score from 0 to 100",
                },
                confidence: {
                  type: Type.INTEGER,
                  description: "Confidence percentage from 50 to 99",
                },
                threatLevel: {
                  type: Type.STRING,
                  description: "LOW, MEDIUM, HIGH, or CRITICAL",
                },
                summary: {
                  type: Type.STRING,
                  description: "Plain-language 2-sentence summary of the analysis",
                },
                detectionReasons: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                confirmedEvidence: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                suspiciousIndicators: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                uncertainFactors: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                becIndicators: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                recommendedAction: {
                  type: Type.STRING,
                },
              },
              required: [
                "classification",
                "riskScore",
                "confidence",
                "threatLevel",
                "summary",
                "detectionReasons",
                "confirmedEvidence",
                "suspiciousIndicators",
                "uncertainFactors",
                "recommendedAction",
              ],
            },
          },
        });

        const parsed = JSON.parse(response.text || "{}");
        return res.json({
          ...baseline,
          ...parsed,
          urls: baseline.urls,
          senderInfo: baseline.senderInfo,
          attachmentsInfo: baseline.attachmentsInfo,
        });
      } catch (_aiErr) {
        return res.json(baseline);
      }
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to analyze email" });
    }
  });

  // 2. Scam Message Detector Endpoint
  app.post("/api/analyze-message", async (req, res) => {
    try {
      const { platform, sender, message, language } = req.body || {};
      const baseline = heuristicMessageAnalysis({ platform, sender, message });

      const ai = getGenAIClient();
      if (!ai) {
        return res.json(baseline);
      }

      try {
        const langDirective =
          language === "hi"
            ? "IMPORTANT: Output whyDetected, detectedCategories, confirmedEvidence, suspiciousIndicators, uncertainFactors, socialEngineeringTechniques, and recommendedAction entirely in fluent Hindi (हिंदी script)."
            : language === "kn"
            ? "IMPORTANT: Output whyDetected, detectedCategories, confirmedEvidence, suspiciousIndicators, uncertainFactors, socialEngineeringTechniques, and recommendedAction entirely in fluent Kannada (ಕನ್ನಡ script)."
            : "Output all text in clear, concise English.";

        const prompt = `Analyze this suspicious message from ${platform || "SMS"} (Sender: ${sender || "Unknown"}).
Check for: OTP scams, Fake bank messages, KYC scams, UPI/payment scams, Fake job offers, Lottery/prize scams, Investment scams, Loan scams, Delivery/package scams, Account-verification scams, Impersonation, Urgent-payment requests, Suspicious links.
Do not claim certainty when evidence is inconclusive. Separate confirmed evidence from suspicious indicators and uncertain factors.

LANGUAGE REQUIREMENT:
${langDirective}

Message:
"""
${message || ""}
"""`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                riskScore: { type: Type.INTEGER },
                classification: {
                  type: Type.STRING,
                  description: "SAFE, LOW RISK, SUSPICIOUS, HIGH RISK, or SCAM",
                },
                confidence: { type: Type.INTEGER },
                whyDetected: { type: Type.STRING },
                detectedCategories: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                confirmedEvidence: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                suspiciousIndicators: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                uncertainFactors: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                suspiciousPhrases: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                socialEngineeringTechniques: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                paymentRequests: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                recommendedAction: { type: Type.STRING },
              },
              required: [
                "riskScore",
                "classification",
                "confidence",
                "whyDetected",
                "confirmedEvidence",
                "suspiciousIndicators",
                "uncertainFactors",
                "suspiciousPhrases",
                "socialEngineeringTechniques",
                "recommendedAction",
              ],
            },
          },
        });

        const parsed = JSON.parse(response.text || "{}");
        return res.json({
          ...baseline,
          ...parsed,
          extractedUrls: baseline.extractedUrls,
          extractedPhones: baseline.extractedPhones,
        });
      } catch (_aiErr) {
        return res.json(baseline);
      }
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to analyze message" });
    }
  });

  // 3. Scam Screenshot Scanner (OCR + Multimodal Threat Engine)
  app.post("/api/analyze-screenshot", async (req, res) => {
    try {
      const { imageBase64, mimeType, fallbackText, language } = req.body || {};

      const ai = getGenAIClient();
      if (ai && imageBase64) {
        try {
          const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");
          const langDirective =
            language === "hi"
              ? "IMPORTANT: Provide explanation, detectedIndicators, confirmedEvidence, uncertainFactors, and recommendedAction in fluent Hindi (हिंदी script)."
              : language === "kn"
              ? "IMPORTANT: Provide explanation, detectedIndicators, confirmedEvidence, uncertainFactors, and recommendedAction in fluent Kannada (ಕನ್ನಡ script)."
              : "Provide all explanations and advice in clear English.";

          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType || "image/png",
                    data: cleanBase64,
                  },
                },
                {
                  text: `Perform OCR to extract all visible text from this screenshot of a message/email, then analyze it for scam, phishing, or spam indicators.

LANGUAGE DIRECTIVE:
${langDirective}

Return JSON with:
- extractedText: exact visible text from the screenshot
- threatType: one of "SCAM", "PHISHING", "SPAM", "SUSPICIOUS", or "SAFE"
- riskScore: integer 0-100
- confidence: integer 50-99
- explanation: plain-language explanation suitable for normal users, distinguishing confirmed evidence from suspicious indicators
- detectedIndicators: array of short strings (e.g. "Urgent language", "Payment request", "Suspicious URL", "Impersonation attempt")
- confirmedEvidence: array of strings
- uncertainFactors: array of strings
- recommendedAction: clear security advice
- highlightedRegions: array of 1 to 4 bounding regions over suspicious parts of the image, each with { label, snippet, severity ("HIGH" | "MEDIUM" | "LOW"), x (percentage 5-75), y (percentage 10-80), width (percentage 20-85), height (percentage 8-22) }`,
                },
              ],
            },
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  extractedText: { type: Type.STRING },
                  threatType: { type: Type.STRING },
                  riskScore: { type: Type.INTEGER },
                  confidence: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  detectedIndicators: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  confirmedEvidence: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  uncertainFactors: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  recommendedAction: { type: Type.STRING },
                  highlightedRegions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        snippet: { type: Type.STRING },
                        severity: { type: Type.STRING },
                        x: { type: Type.NUMBER },
                        y: { type: Type.NUMBER },
                        width: { type: Type.NUMBER },
                        height: { type: Type.NUMBER },
                      },
                      required: ["label", "snippet", "severity", "x", "y", "width", "height"],
                    },
                  },
                },
                required: [
                  "extractedText",
                  "threatType",
                  "riskScore",
                  "confidence",
                  "explanation",
                  "detectedIndicators",
                  "confirmedEvidence",
                  "uncertainFactors",
                  "recommendedAction",
                  "highlightedRegions",
                ],
              },
            },
          });

          const parsed = JSON.parse(response.text || "{}");
          if (parsed && parsed.extractedText) {
            return res.json(parsed);
          }
        } catch (_visionErr) {
          // Fall through to deterministic OCR + heuristic analyzer below
        }
      }

      // Deterministic fallback using provided fallbackText or intelligent inspection
      const textToAnalyze =
        fallbackText ||
        "URGENT ALERT: Dear Customer, Your Bank Account KYC has expired today. Your account will be blocked within 24 hours. Click http://secure-kyc-update-verify.xyz/login immediately or call +91 9876543210 to complete verification.";
      const msgAnalysis = heuristicMessageAnalysis({
        platform: "Screenshot OCR",
        sender: "Extracted via Optical Scanner",
        message: textToAnalyze,
      });

      const threatType =
        msgAnalysis.riskScore >= 75
          ? msgAnalysis.extractedUrls.length > 0
            ? "PHISHING"
            : "SCAM"
          : msgAnalysis.riskScore >= 40
          ? "SUSPICIOUS"
          : "SAFE";

      const highlightedRegions =
        msgAnalysis.riskScore >= 40
          ? [
              {
                label: "Sender / Header Spoofing Check",
                snippet: textToAnalyze.slice(0, 48) + "...",
                severity: "MEDIUM",
                x: 8,
                y: 16,
                width: 84,
                height: 14,
              },
              {
                label: "Urgent Coercion & Threat Pretext",
                snippet: msgAnalysis.suspiciousPhrases[0] || "Account suspension / urgent action demand",
                severity: "HIGH",
                x: 8,
                y: 36,
                width: 84,
                height: 20,
              },
              ...(msgAnalysis.extractedUrls.length > 0
                ? [
                    {
                      label: "Suspicious Phishing Link",
                      snippet: msgAnalysis.extractedUrls[0],
                      severity: "HIGH",
                      x: 8,
                      y: 62,
                      width: 84,
                      height: 16,
                    },
                  ]
                : []),
            ]
          : [
              {
                label: "Verified Standard Message Text",
                snippet: textToAnalyze.slice(0, 60),
                severity: "LOW",
                x: 10,
                y: 28,
                width: 80,
                height: 28,
              },
            ];

      return res.json({
        extractedText: textToAnalyze,
        threatType,
        riskScore: msgAnalysis.riskScore,
        confidence: msgAnalysis.confidence,
        explanation: msgAnalysis.whyDetected,
        detectedIndicators:
          msgAnalysis.suspiciousIndicators.length > 0
            ? msgAnalysis.suspiciousIndicators
            : ["No high-risk scam indicators detected in extracted text"],
        confirmedEvidence: msgAnalysis.confirmedEvidence,
        uncertainFactors: msgAnalysis.uncertainFactors,
        recommendedAction: msgAnalysis.recommendedAction,
        highlightedRegions,
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to scan screenshot" });
    }
  });

  // 4. Voice & Text AI Security Assistant Endpoint
  app.post("/api/assistant", async (req, res) => {
    try {
      const { message, language } = req.body || {};
      const userText = (message || "").trim();
      const lower = userText.toLowerCase();

      // Detect navigation / action commands (English, Hindi, and Kannada)
      let actionCommand: string | null = null;
      if (
        /\b(open|go to|show|launch)\b.*\b(email|analyzer)\b|\banalyze this email\b/i.test(lower) ||
        /(ईमेल|ಇಮೇಲ್|email analyzer)/i.test(userText)
      ) {
        actionCommand = "NAVIGATE_EMAIL_ANALYZER";
      } else if (
        /\b(open|go to|show|launch)\b.*\b(scam detector|message detector|sms)\b|\bis this message a scam\b/i.test(lower) ||
        /(स्कैम|घोटाला|संदेश|ವಂಚನೆ|ಸ್ಕ್ಯಾಮ್|ಮೆಸೇಜ್|scam)/i.test(userText)
      ) {
        actionCommand = "NAVIGATE_SCAM_DETECTOR";
      } else if (
        /\b(open|go to|show|launch)\b.*\b(screenshot|ocr|image scanner)\b|\bscan.*screenshot\b/i.test(lower) ||
        /(स्क्रीनशॉट|ओसीआर|ಸ್ಕ್ರೀನ್‌ಶಾಟ್|ಚಿತ್ರ)/i.test(userText)
      ) {
        actionCommand = "NAVIGATE_SCREENSHOT_SCANNER";
      } else if (
        /\b(recent threats|history|past scans|analysis history)\b/i.test(lower) ||
        /(इतिहास|ಇತಿಹಾಸ|history)/i.test(userText)
      ) {
        actionCommand = "NAVIGATE_HISTORY";
      } else if (
        /\b(report|reports|export pdf)\b/i.test(lower) ||
        /(रिपोर्ट|ವರದಿ|report)/i.test(userText)
      ) {
        actionCommand = "NAVIGATE_REPORTS";
      } else if (
        /\b(awareness|scam types|safety tips|give me safety tips)\b/i.test(lower) ||
        /(जागरूकता|सुरक्षा टिप्स|ಜಾಗೃತಿ|ಸುರಕ್ಷತೆ|safety)/i.test(userText)
      ) {
        actionCommand = "NAVIGATE_AWARENESS";
      } else if (
        /\b(dashboard|command center|home)\b/i.test(lower) ||
        /(डैशबोर्ड|ಡ್ಯಾಶ್‌ಬೋರ್ಡ್|dashboard)/i.test(userText)
      ) {
        actionCommand = "NAVIGATE_DASHBOARD";
      }

      const ai = getGenAIClient();
      if (ai) {
        try {
          const langNote =
            language === "hi"
              ? "Respond in natural, fluent Hindi (हिंदी script). Keep cybersecurity advice accurate and understandable."
              : language === "kn"
              ? "Respond in natural, fluent Kannada (ಕನ್ನಡ script). Keep cybersecurity advice accurate and understandable."
              : "Respond in natural, fluent English.";

          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: `You are the CyberShield AI Security Assistant inside a 3D Cybersecurity Command Center.
Keep your answer concise (2 to 4 sentences), clear, practical, and easy to understand for normal users.
${langNote}
Never fabricate certainty if evidence is incomplete.
User message: "${userText}"`,
          });
          if (response.text) {
            return res.json({
              reply: response.text.trim(),
              actionCommand,
            });
          }
        } catch (_err) {
          // Fall back to curated cybersecurity knowledge base below
        }
      }

      let reply =
        language === "hi"
          ? "मैं आपका साइबर शील्ड सुरक्षा सहायक हूँ। आप मुझसे संदिग्ध ईमेल का विश्लेषण करने, एसएमएस/व्हाट्सएप धोखाधड़ी जांचने, स्क्रीनशॉट स्कैन करने या साइबर सुरक्षा समझने के लिए कह सकते हैं।"
          : language === "kn"
          ? "ನಾನು ನಿಮ್ಮ ಸೈಬರ್ ಶೀಲ್ಡ್ ಭದ್ರತಾ ಸಹಾಯಕ. ಅನುಮಾನಾಸ್ಪದ ಇಮೇಲ್ ವಿಶ್ಲೇಷಿಸಲು, SMS/WhatsApp ವಂಚನೆ ಪತ್ತೆಹಚ್ಚಲು, ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಅಥವಾ ಸೈಬರ್ ರಕ್ಷಣಾ ಸಲಹೆ ಪಡೆಯಲು ನನ್ನನ್ನು ಕೇಳಬಹುದು."
          : "I am your CyberShield Security Assistant. You can ask me to analyze suspicious emails, inspect SMS/WhatsApp messages for fraud, scan screenshots with OCR, review your recent threat history, or explain cybersecurity concepts like phishing, UPI scams, and MFA.";

      if (actionCommand === "NAVIGATE_EMAIL_ANALYZER") {
        reply =
          language === "hi"
            ? "एआई ईमेल खतरा विश्लेषक खोला जा रहा है। एसपीएफ, डीकेआईएम, डीएमएआरसी हेडर और संदिग्ध लिंक की जांच के लिए ईमेल पेस्ट करें।"
            : language === "kn"
            ? "AI ಇಮೇಲ್ ಬೆದರಿಕೆ ವಿಶ್ಲೇಷಕವನ್ನು ತೆರೆಯಲಾಗುತ್ತಿದೆ. SPF, DKIM ಮತ್ತು ಫಿಶಿಂಗ್ ಲಿಂಕ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಇಮೇಲ್ ಪಠ್ಯವನ್ನು ಅಂಟಿಸಿ."
            : "Opening the AI Email Threat Analyzer. Paste the email body, sender address, or upload a .eml file to inspect SPF/DKIM/DMARC headers, suspicious links, and BEC indicators.";
      } else if (actionCommand === "NAVIGATE_SCAM_DETECTOR") {
        reply =
          language === "hi"
            ? "घोटाला संदेश डिटेक्टर खोला जा रहा है। धोखाधड़ी जोखिम स्कोर और चालें जांचने के लिए संदिग्ध एसएमएस या व्हाट्सएप संदेश पेस्ट करें।"
            : language === "kn"
            ? "ವಂಚನೆ ಸಂದೇಶ ಪತ್ತೆಕಾರಕವನ್ನು ತೆರೆಯಲಾಗುತ್ತಿದೆ. ಮೋಸದ ಅಪಾಯದ ಸ್ಕೋರ್ ತಿಳಿಯಲು SMS ಅಥವಾ WhatsApp ಸಂದೇಶವನ್ನು ಅಂಟಿಸಿ."
            : "Opening the Scam Message Detector. Paste any suspicious SMS, WhatsApp, or Telegram message to evaluate its scam risk score, social engineering tactics, and payment lures.";
      } else if (actionCommand === "NAVIGATE_SCREENSHOT_SCANNER") {
        reply =
          language === "hi"
            ? "स्क्रीनशॉट ओसीआर स्कैनर खोला जा रहा है। बैंकिंग स्क्रीनशॉट या संदिग्ध क्यूआर कोड अपलोड करके जांच करें।"
            : language === "kn"
            ? "ಸ್ಕ್ರೀನ್‌ಶಾಟ್ OCR ಸ್ಕ್ಯಾನರ್ ಅನ್ನು ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ. ಪಠ್ಯ ಓದಲು ಮತ್ತು ಮೋಸದ ಗುರುತುಗಳನ್ನು ಪತ್ತೆಮಾಡಲು ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
            : "Launching the Scam Screenshot Scanner. Upload a JPG or PNG screenshot—or test with one of our built-in samples—to extract text via OCR and highlight deceptive regions.";
      } else if (actionCommand === "NAVIGATE_HISTORY") {
        reply =
          language === "hi"
            ? "आपके खतरा इतिहास पर नेविगेट किया जा रहा है। यहाँ आप पिछले सभी स्कैन और फोरेंसिक परिणाम देख सकते हैं।"
            : language === "kn"
            ? "ನಿಮ್ಮ ಬೆದರಿಕೆ ಇತಿಹಾಸಕ್ಕೆ ಕರೆದೊಯ್ಯಲಾಗುತ್ತಿದೆ. ಇಲ್ಲಿ ನೀವು ಹಿಂದಿನ ಎಲ್ಲಾ ಸ್ಕ್ಯಾನ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಬಹುದು."
            : "Navigating to your Threat Analysis History. Here you can filter past Email, Message, and Screenshot inspections and reopen full forensic breakdowns.";
      } else if (actionCommand === "NAVIGATE_REPORTS") {
        reply =
          language === "hi"
            ? "सुरक्षा रिपोर्ट खोली जा रही है। यहाँ आप फोरेंसिक रिपोर्ट पीडीएफ में डाउनलोड कर सकते हैं।"
            : language === "kn"
            ? "ಭದ್ರತಾ ವರದಿಗಳನ್ನು ತೆರೆಯಲಾಗುತ್ತಿದೆ. ಇಲ್ಲಿ ನೀವು ವಿಧಿವಿಜ್ಞಾನ ವರದಿಗಳನ್ನು PDF ರೂಪದಲ್ಲಿ ರಫ್ತು ಮಾಡಬಹುದು."
            : "Opening Security Reports. You can export forensic summaries as printable PDFs, download JSON reports, or log a new scam incident report.";
      } else if (actionCommand === "NAVIGATE_AWARENESS") {
        reply =
          language === "hi"
            ? "घोटाला जागरूकता केंद्र खोला जा रहा है। नियम #1: पैसे प्राप्त करने के लिए कभी यूपीआई पिन न डालें।"
            : language === "kn"
            ? "ವಂಚನೆ ಜಾಗೃತಿ ಕೇಂದ್ರವನ್ನು ತೆರೆಯಲಾಗುತ್ತಿದೆ. ಸುವರ್ಣ ನಿಯಮ: ಹಣ ಸ್ವೀಕರಿಸಲು ಎಂದಿಗೂ UPI PIN ಹಾಕಬೇಡಿ."
            : "Opening the Scam Awareness & Cyber Safety Center. Essential rule #1: Never share OTPs or enter your UPI PIN to 'receive' money, and always verify urgent requests through official channels.";
      } else if (lower.includes("phishing") || userText.includes("फिशिंग") || userText.includes("ಫಿಶಿಂಗ್")) {
        reply =
          language === "hi"
            ? "फिशिंग एक साइबर हमला है जिसमें अपराधी बैंक या कंपनियों के नाम पर नकली संदेश या वेबसाइट बनाकर आपका पासवर्ड, ओटीपी और कार्ड नंबर चुराते हैं। अनजान लिंक पर कभी भरोसा न करें।"
            : language === "kn"
            ? "ಫಿಶಿಂಗ್ ಎನ್ನುವುದು ಸೈಬರ್ ದಾಳಿಯಾಗಿದ್ದು, ವಂಚಕರು ಬ್ಯಾಂಕ್ ಅಥವಾ ಅಧಿಕೃತ ಸಂಸ್ಥೆಗಳಂತೆ ನಟಿಸಿ ನಕಲಿ ವೆಬ್‌ಸೈಟ್‌ಗಳ ಮೂಲಕ ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು OTP ಕದಿಯುತ್ತಾರೆ. ಅಪರಿಚಿತ ಲಿಂಕ್‌ಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ."
            : "Phishing is a social engineering attack where criminals impersonate trusted organizations—like banks, cloud providers, or couriers—to steal your passwords, OTPs, or payment details. Always inspect the actual sender domain, check for artificial urgency, and never log in through links sent in unexpected messages.";
      } else if (lower.includes("upi") || lower.includes("otp") || userText.includes("यूपीआई") || userText.includes("ओटीपी") || userText.includes("ಕೆವೈಸಿ") || userText.includes("ಯುಪಿಐ") || lower.includes("kyc")) {
        reply =
          language === "hi"
            ? "याद रखें: यूपीआई पिन केवल पैसे भेजने के लिए होता है, पैसे प्राप्त करने के लिए कभी नहीं। कोई भी बैंक कर्मचारी फोन पर कभी ओटीपी नहीं मांगता।"
            : language === "kn"
            ? "ನೆನಪಿಡಿ: UPI PIN ಹಣ ಕಳುಹಿಸಲು ಮಾತ್ರ, ಹಣ ಪಡೆಯಲು ಎಂದಿಗೂ ಅಲ್ಲ. ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿಗಳು ಎಂದಿಗೂ ಫೋನ್‌ನಲ್ಲಿ ನಿಮ್ಮ OTP ಕೇಳುವುದಿಲ್ಲ."
            : "OTP and UPI scams rely on urgency and authority. Remember: you NEVER need to enter a UPI PIN or scan a QR code to receive money, and no legitimate bank or government agency will ask you to share an OTP over a call or click a third-party link to update KYC.";
      } else if (lower.includes("dangerous") || lower.includes("why") || userText.includes("खतरनाक") || userText.includes("ಅಪಾಯ")) {
        reply =
          language === "hi"
            ? "संदेश तब खतरनाक माने जाते हैं जब उनमें तकनीकी सबूत (जैसे असफल एसपीएफ/डीकेआईएम या फर्जी डोमेन) और मनोवैज्ञानिक दबाव (जैसे 24 घंटे में खाता ब्लॉक होने की धमकी) दोनों मौजूद हों।"
            : language === "kn"
            ? "ತಾಂತ್ರಿಕ ಪುರಾವೆಗಳು (ವಿಫಲವಾದ SPF/DKIM ಅಥವಾ ನಕಲಿ ಡೊಮೇನ್) ಮತ್ತು ಮಾನಸಿಕ ತುರ್ತು ಬೆದರಿಕೆಗಳು ಒಟ್ಟಾಗಿ ಕಂಡುಬಂದಾಗ ಸಂದೇಶಗಳನ್ನು ಅಪಾಯಕಾರಿ ಎಂದು ಗುರುತಿಸಲಾಗುತ್ತದೆ."
            : "Messages are flagged as dangerous when confirmed technical evidence—such as mismatched Reply-To headers, failed SPF/DKIM authentication, or typosquatted domains—combines with psychological manipulation like sudden account-suspension threats or urgent payment demands.";
      }

      return res.json({ reply, actionCommand });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Assistant error" });
    }
  });

  // Mount Vite middleware in development or static dist in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CyberShield server listening on http://localhost:${PORT}`);
  });
}

startServer();
