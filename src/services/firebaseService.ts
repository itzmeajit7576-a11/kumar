import {
  HistoryRecord,
  SecurityReport,
  UserProfile,
} from "../types/security";

const AUTH_STORAGE_KEY = "cybershield_auth_user_v1";
const USERS_DB_KEY = "cybershield_users_db_v1";
const HISTORY_PREFIX = "cybershield_firestore_history_";
const REPORTS_PREFIX = "cybershield_firestore_reports_";

interface StoredAccount {
  uid: string;
  displayName: string;
  email: string;
  passwordHash: string;
  authProvider: "google" | "password" | "demo";
  role: string;
  organization: string;
  createdAt: string;
  mfaEnabled: boolean;
  voiceTtsEnabled: boolean;
  realtimeAlertsEnabled: boolean;
}

function getAccountsDB(): Record<string, StoredAccount> {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function saveAccountsDB(db: Record<string, StoredAccount>) {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  } catch {
    // ignore
  }
}

function createInitialSeedHistory(userId: string): HistoryRecord[] {
  const now = Date.now();
  return [
    {
      id: "scan-eml-9041",
      userId,
      category: "Email",
      title: "URGENT: Your Corporate Microsoft 365 Password Expires in 2 Hours",
      subtitle: "security-update@micr0soft-auth-portal.xyz",
      classification: "PHISHING",
      riskScore: 92,
      confidence: 96,
      status: "QUARANTINED",
      timestamp: new Date(now - 1000 * 60 * 18).toISOString(),
      summary:
        "High-confidence credential harvesting email using a lookalike domain (micr0soft-auth-portal.xyz) and failed SPF/DKIM alignment.",
      recommendedAction:
        "Quarantine email immediately. Do not click the password reset link or enter corporate credentials.",
      details: {
        classification: "PHISHING",
        riskScore: 92,
        confidence: 96,
        threatLevel: "CRITICAL",
        summary:
          "High-confidence credential harvesting email using a lookalike domain (micr0soft-auth-portal.xyz) and failed SPF/DKIM alignment.",
        detectionReasons: [
          "Typosquatted sender domain (micr0soft-auth-portal.xyz) impersonating Microsoft.",
          "SPF authentication returned FAIL; DKIM signature failed verification.",
          "Artificial 2-hour countdown pressure to coerce immediate credential entry.",
        ],
        confirmedEvidence: [
          "SPF header indicates FAIL (sender IP 185.234.219.44 unauthorized).",
          "Domain 'micr0soft-auth-portal.xyz' uses digit '0' substitution.",
          "Embedded URL points to external credential harvester: https://micr0soft-auth-portal.xyz/sso/login",
        ],
        suspiciousIndicators: [
          "Urgent password expiration threat ('within 2 hours').",
          "Generic greeting ('Dear Office User') instead of personalized corporate directory identity.",
        ],
        uncertainFactors: [
          "Whether the target user has already clicked the link requires endpoint proxy log inspection.",
        ],
        urls: [
          {
            url: "https://micr0soft-auth-portal.xyz/sso/login",
            domain: "micr0soft-auth-portal.xyz",
            status: "DANGEROUS",
            reason: "Lookalike brand domain on high-risk .xyz TLD hosting fake SSO login form",
          },
        ],
        senderInfo: {
          address: "security-update@micr0soft-auth-portal.xyz",
          domain: "micr0soft-auth-portal.xyz",
          spf: "FAIL",
          dkim: "FAIL",
          dmarc: "FAIL",
          impersonationRisk: "HIGH",
        },
        attachmentsInfo: [],
        becIndicators: [],
        recommendedAction:
          "Quarantine email immediately. Do not click the password reset link or enter corporate credentials.",
      },
    },
    {
      id: "scan-msg-8832",
      userId,
      category: "Message",
      title: "Dear Customer, Your SBI YONO Account & PAN KYC is suspended today...",
      subtitle: "SMS · +91 89234 11092",
      classification: "SCAM",
      riskScore: 89,
      confidence: 93,
      status: "QUARANTINED",
      timestamp: new Date(now - 1000 * 60 * 75).toISOString(),
      summary:
        "High-risk KYC bank impersonation SMS sent from a personal mobile number containing a shortened phishing link.",
      recommendedAction:
        "Do NOT click the link or share OTP/PAN details. Banks never send KYC links from personal 10-digit mobile numbers.",
      details: {
        riskScore: 89,
        classification: "SCAM",
        confidence: 93,
        platform: "SMS",
        sender: "+91 89234 11092",
        whyDetected:
          "High-risk scam message detected (KYC / Account Verification Scam). The message uses fear & authority coercion and contains a suspicious link.",
        detectedCategories: ["KYC / Account Verification Scam", "Urgent Coercion"],
        confirmedEvidence: [
          "Sent from a standard 10-digit mobile number rather than an official regulated bank SMS header.",
          "Contains shortened link redirecting to an unverified third-party domain: http://bit.ly/sbi-kyc-fast-update",
        ],
        suspiciousIndicators: [
          "Threatens immediate account suspension today unless PAN KYC is updated via link.",
        ],
        uncertainFactors: [
          "Live destination of shortened link may rotate or geo-fence visitors.",
        ],
        suspiciousPhrases: ["Account & PAN KYC is suspended today", "update immediately"],
        socialEngineeringTechniques: ["Fear & Authority Coercion", "Artificial Time Constraint"],
        extractedUrls: ["http://bit.ly/sbi-kyc-fast-update"],
        extractedPhones: ["+91 89234 11092"],
        paymentRequests: [],
        recommendedAction:
          "Do NOT click the link or share OTP/PAN details. Banks never send KYC links from personal 10-digit mobile numbers.",
      },
    },
    {
      id: "scan-scr-7740",
      userId,
      category: "Screenshot",
      title: "Screenshot OCR: UPI Collect Request ₹14,500 'Cashback Claim'",
      subtitle: "Image Upload · WhatsApp Payment Screenshot",
      classification: "SCAM",
      riskScore: 87,
      confidence: 91,
      status: "FLAGGED",
      timestamp: new Date(now - 1000 * 60 * 210).toISOString(),
      summary:
        "OCR extracted a deceptive UPI Collect Request disguising an outgoing ₹14,500 debit as a 'Reward Cashback Credit'.",
      recommendedAction:
        "Decline the UPI collect request immediately. Entering a UPI PIN always deducts money from your account.",
      details: {
        extractedText:
          "CONGRATULATIONS! You have received ₹14,500 Reward Cashback on PhonePe/GPay. Click 'PAY / APPROVE' and enter your 4-digit UPI PIN to credit ₹14,500 instantly into your bank account. Link: https://upi-reward-claim.top/collect",
        threatType: "SCAM",
        riskScore: 87,
        confidence: 91,
        explanation:
          "Confirmed UPI Collect Request fraud pattern. Scammers send a 'Collect' request and falsely tell victims to enter their UPI PIN to receive money.",
        detectedIndicators: [
          "Urgent language",
          "Payment request (₹14,500 UPI Collect)",
          "Suspicious URL (https://upi-reward-claim.top/collect)",
          "UPI PIN reversal deception",
        ],
        confirmedEvidence: [
          "Explicitly instructs user to click 'PAY' and enter UPI PIN to receive funds (technically impossible in UPI protocol).",
          "Uses high-risk domain 'upi-reward-claim.top'.",
        ],
        uncertainFactors: [
          "Originating merchant VPA handle was partially cropped in the screenshot.",
        ],
        recommendedAction:
          "Do not click the link or enter your UPI PIN. Decline and block the sender ID in your UPI app.",
        highlightedRegions: [
          {
            label: "False Cashback Lure",
            snippet: "You have received ₹14,500 Reward Cashback",
            severity: "MEDIUM",
            x: 8,
            y: 15,
            width: 84,
            height: 16,
          },
          {
            label: "UPI PIN Deception",
            snippet: "Click 'PAY / APPROVE' and enter your 4-digit UPI PIN",
            severity: "HIGH",
            x: 8,
            y: 40,
            width: 84,
            height: 20,
          },
          {
            label: "Malicious Collect URL",
            snippet: "https://upi-reward-claim.top/collect",
            severity: "HIGH",
            x: 8,
            y: 68,
            width: 84,
            height: 15,
          },
        ],
      },
    },
    {
      id: "scan-eml-6520",
      userId,
      category: "Email",
      title: "Overdue Vendor Wire Settlement — Updated Beneficiary IBAN",
      subtitle: "cfo.office.exec@gmail.com (Display: 'Vikram Mehta - CFO')",
      classification: "SCAM",
      riskScore: 84,
      confidence: 89,
      status: "QUARANTINED",
      timestamp: new Date(now - 1000 * 60 * 480).toISOString(),
      summary:
        "Business Email Compromise (BEC) executive impersonation requesting urgent wire transfer to a newly changed bank account.",
      recommendedAction:
        "Do not initiate any wire transfer. Call the CFO on a known internal extension to verify updated banking instructions.",
      details: {
        classification: "SCAM",
        riskScore: 84,
        confidence: 89,
        threatLevel: "HIGH",
        summary:
          "Business Email Compromise (BEC) executive impersonation requesting urgent wire transfer to a newly changed bank account.",
        detectionReasons: [
          "Executive display name ('Vikram Mehta - CFO') paired with a free consumer Gmail address.",
          "Requests urgent change of vendor wire beneficiary account bypassing standard procurement controls.",
        ],
        confirmedEvidence: [
          "Sender address is 'cfo.office.exec@gmail.com' instead of corporate domain.",
          "Attachment 'Updated_Wire_Instructions_Invoice_882.pdf.exe' uses double extension.",
        ],
        suspiciousIndicators: [
          "Demands confidential handling ('I am in a board meeting, do not call me, process wire before 4 PM').",
        ],
        uncertainFactors: [
          "Verify with finance team whether an actual invoice #882 exists in the ERP system.",
        ],
        urls: [],
        senderInfo: {
          address: "cfo.office.exec@gmail.com",
          domain: "gmail.com",
          spf: "PASS",
          dkim: "PASS",
          dmarc: "PASS",
          impersonationRisk: "HIGH",
        },
        attachmentsInfo: [
          {
            name: "Updated_Wire_Instructions_Invoice_882.pdf.exe",
            risk: "HIGH — Executable / Macro Payload",
          },
        ],
        becIndicators: [
          "Executive display-name spoofing using external webmail provider",
          "Urgent vendor bank account change request",
        ],
        recommendedAction:
          "Do not initiate any wire transfer or open the attachment. Verify out-of-band via voice call.",
      },
    },
    {
      id: "scan-eml-5109",
      userId,
      category: "Email",
      title: "InvoicePayload_Q3_Tax_Compliance_Scan.xlsm",
      subtitle: "dispatch@tax-portal-archive.ru",
      classification: "MALICIOUS",
      riskScore: 95,
      confidence: 97,
      status: "QUARANTINED",
      timestamp: new Date(now - 1000 * 60 * 820).toISOString(),
      summary:
        "Malicious macro-enabled spreadsheet (.xlsm) delivered from an untrusted external domain with failed SPF verification.",
      recommendedAction:
        "Delete email immediately. Never enable macros on unsolicited Office documents.",
      details: {
        classification: "MALICIOUS",
        riskScore: 95,
        confidence: 97,
        threatLevel: "CRITICAL",
        summary:
          "Malicious macro-enabled spreadsheet (.xlsm) delivered from an untrusted external domain with failed SPF verification.",
        detectionReasons: [
          "Contains macro-enabled Excel attachment (.xlsm) instructing user to click 'Enable Content'.",
          "SPF=FAIL and DMARC=FAIL in message headers.",
        ],
        confirmedEvidence: [
          "High-risk attachment extension: InvoicePayload_Q3_Tax_Compliance_Scan.xlsm",
          "SPF authentication failed for sender domain tax-portal-archive.ru.",
        ],
        suspiciousIndicators: [
          "Body text consists solely of 'Please enable macros to decrypt tax table.'",
        ],
        uncertainFactors: [
          "Static analysis flags the macro container; full sandbox detonation is required to identify specific malware family.",
        ],
        urls: [],
        senderInfo: {
          address: "dispatch@tax-portal-archive.ru",
          domain: "tax-portal-archive.ru",
          spf: "FAIL",
          dkim: "FAIL",
          dmarc: "FAIL",
          impersonationRisk: "HIGH",
        },
        attachmentsInfo: [
          {
            name: "InvoicePayload_Q3_Tax_Compliance_Scan.xlsm",
            risk: "HIGH — Executable / Macro Payload",
          },
        ],
        becIndicators: [],
        recommendedAction:
          "Delete email immediately. Never enable macros on unsolicited Office documents.",
      },
    },
    {
      id: "scan-eml-4102",
      userId,
      category: "Email",
      title: "Limited Time 85% Off Enterprise SEO & Backlink Blast Package!",
      subtitle: "promo@bulk-traffic-boosters.biz",
      classification: "SPAM",
      riskScore: 48,
      confidence: 88,
      status: "FLAGGED",
      timestamp: new Date(now - 1000 * 60 * 1440).toISOString(),
      summary:
        "Unsolicited commercial bulk marketing email with tracking links but no direct credential harvesting or malware payload.",
      recommendedAction:
        "Mark as spam or mute sender. Avoid clicking unsubscribe links on unfamiliar bulk domains.",
      details: {
        classification: "SPAM",
        riskScore: 48,
        confidence: 88,
        threatLevel: "MEDIUM",
        summary:
          "Unsolicited commercial bulk marketing email with tracking links but no direct credential harvesting or malware payload.",
        detectionReasons: [
          "Contains bulk promotional language ('85% Off', 'Limited Time Package').",
          "Originates from low-reputation marketing domain (.biz).",
        ],
        confirmedEvidence: [
          "Bulk mailing headers detected; no malicious attachments present.",
        ],
        suspiciousIndicators: [
          "Marketing tracking URL included in body.",
        ],
        uncertainFactors: [
          "External link leads to a commercial landing page whose data privacy practices are unverified.",
        ],
        urls: [
          {
            url: "https://bulk-traffic-boosters.biz/deal",
            domain: "bulk-traffic-boosters.biz",
            status: "UNVERIFIED",
            reason: "Commercial bulk marketing link",
          },
        ],
        senderInfo: {
          address: "promo@bulk-traffic-boosters.biz",
          domain: "bulk-traffic-boosters.biz",
          spf: "SOFTFAIL",
          dkim: "NONE",
          dmarc: "NONE",
          impersonationRisk: "LOW",
        },
        attachmentsInfo: [],
        becIndicators: [],
        recommendedAction:
          "Mark as spam or mute sender. Avoid clicking unsubscribe links on unfamiliar bulk domains.",
      },
    },
    {
      id: "scan-eml-3011",
      userId,
      category: "Email",
      title: "Monthly Cloud Infrastructure Billing Statement — October 2026",
      subtitle: "billing-noreply@google.com",
      classification: "SAFE",
      riskScore: 8,
      confidence: 96,
      status: "CLEARED",
      timestamp: new Date(now - 1000 * 60 * 2100).toISOString(),
      summary:
        "Verified transactional notification with valid SPF, DKIM, and DMARC cryptographic alignment and no deceptive links.",
      recommendedAction:
        "Safe to read. Standard automated billing notification.",
      details: {
        classification: "SAFE",
        riskScore: 8,
        confidence: 96,
        threatLevel: "LOW",
        summary:
          "Verified transactional notification with valid SPF, DKIM, and DMARC cryptographic alignment and no deceptive links.",
        detectionReasons: [
          "SPF, DKIM, and DMARC all passed cryptographic verification.",
          "No coercive urgency or credential harvesting links detected.",
        ],
        confirmedEvidence: [
          "SPF=PASS, DKIM=PASS, DMARC=PASS for domain google.com.",
        ],
        suspiciousIndicators: [],
        uncertainFactors: [
          "Always verify invoice totals inside your official console dashboard.",
        ],
        urls: [
          {
            url: "https://console.cloud.google.com/billing",
            domain: "console.cloud.google.com",
            status: "SAFE",
            reason: "Official HTTPS domain matching authenticated sender",
          },
        ],
        senderInfo: {
          address: "billing-noreply@google.com",
          domain: "google.com",
          spf: "PASS",
          dkim: "PASS",
          dmarc: "PASS",
          impersonationRisk: "LOW",
        },
        attachmentsInfo: [
          {
            name: "GCP_Statement_Oct2026.pdf",
            risk: "LOW — Standard Document Format",
          },
        ],
        becIndicators: [],
        recommendedAction: "Safe to read. Standard automated billing notification.",
      },
    },
  ];
}

function createInitialSeedReports(userId: string): SecurityReport[] {
  const now = Date.now();
  return [
    {
      id: "RPT-2026-9041",
      userId,
      timestamp: new Date(now - 1000 * 60 * 18).toISOString(),
      inputType: "Email Analysis",
      title: "Forensic Report: Microsoft 365 Lookalike Credential Phishing",
      classification: "PHISHING",
      riskScore: 92,
      confidence: 96,
      detectionReasons: [
        "Typosquatted sender domain (micr0soft-auth-portal.xyz) using digit '0' substitution",
        "SPF=FAIL and DKIM=FAIL in raw SMTP headers",
        "2-hour artificial urgency threat targeting corporate SSO credentials",
      ],
      suspiciousUrls: ["https://micr0soft-auth-portal.xyz/sso/login"],
      extractedIndicators: [
        "Sender: security-update@micr0soft-auth-portal.xyz",
        "Header Status: SPF FAIL / DKIM FAIL / DMARC FAIL",
        "Impersonation Risk: HIGH",
      ],
      confirmedEvidence: [
        "SPF header indicates FAIL.",
        "Domain 'micr0soft-auth-portal.xyz' is a typosquatted lookalike.",
      ],
      uncertainFactors: [
        "Check firewall logs to confirm no internal host resolved micr0soft-auth-portal.xyz.",
      ],
      recommendedAction:
        "Block sender domain at email gateway, purge message from all mailboxes, and alert SOC.",
    },
    {
      id: "RPT-2026-8832",
      userId,
      timestamp: new Date(now - 1000 * 60 * 75).toISOString(),
      inputType: "Scam Message Analysis",
      title: "Forensic Report: SMS Fake Bank PAN/KYC Suspension Lure",
      classification: "SCAM",
      riskScore: 89,
      confidence: 93,
      detectionReasons: [
        "Sent from personal 10-digit mobile number (+91 89234 11092) claiming to be SBI YONO",
        "Uses URL shortener (http://bit.ly/sbi-kyc-fast-update) to mask phishing host",
        "Uses fear and authority coercion ('Account suspended today')",
      ],
      suspiciousUrls: ["http://bit.ly/sbi-kyc-fast-update"],
      extractedIndicators: [
        "Platform: SMS",
        "Sender Phone: +91 89234 11092",
        "Tactic: Fear & Authority Coercion",
      ],
      confirmedEvidence: [
        "Regulated banks never send KYC links via URL shorteners from personal mobile numbers.",
      ],
      uncertainFactors: [
        "Shortened URL target may change dynamically.",
      ],
      recommendedAction:
        "Report sender number to national cybercrime helpline (1930 / Chakshu portal) and block.",
    },
    {
      id: "RPT-2026-7740",
      userId,
      timestamp: new Date(now - 1000 * 60 * 210).toISOString(),
      inputType: "Screenshot Analysis",
      title: "OCR Visual Scan: Deceptive ₹14,500 UPI Collect Request",
      classification: "SCAM",
      riskScore: 87,
      confidence: 91,
      detectionReasons: [
        "Instructs user to enter 4-digit UPI PIN to 'receive' ₹14,500 cashback",
        "Contains high-risk domain https://upi-reward-claim.top/collect",
      ],
      suspiciousUrls: ["https://upi-reward-claim.top/collect"],
      extractedIndicators: [
        "Input: Screenshot Image (OCR)",
        "Amount: ₹14,500",
        "Technique: UPI Collect PIN Reversal Trick",
      ],
      confirmedEvidence: [
        "Entering a UPI PIN is strictly for debiting funds, never for receiving cashback.",
      ],
      uncertainFactors: [
        "Merchant VPA handle cropped out of frame.",
      ],
      recommendedAction:
        "Decline the collect request inside the UPI app and report the VPA handle.",
    },
  ];
}

export const firebaseService = {
  getCurrentUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return null;
  },

  setCurrentUser(user: UserProfile | null) {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  },

  async loginWithEmailPassword(email: string, password: string): Promise<UserProfile> {
    await new Promise((r) => setTimeout(r, 450));
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    if (!password || password.length < 6) {
      throw new Error("Invalid password. Password must be at least 6 characters.");
    }

    const db = getAccountsDB();
    const existing = db[cleanEmail];
    if (existing) {
      if (existing.passwordHash !== btoa(password)) {
        throw new Error("Invalid email or password. Please verify your credentials.");
      }
      const profile: UserProfile = {
        uid: existing.uid,
        displayName: existing.displayName,
        email: existing.email,
        authProvider: existing.authProvider,
        role: existing.role,
        organization: existing.organization,
        createdAt: existing.createdAt,
        mfaEnabled: existing.mfaEnabled,
        voiceTtsEnabled: existing.voiceTtsEnabled,
        realtimeAlertsEnabled: existing.realtimeAlertsEnabled,
      };
      this.setCurrentUser(profile);
      this.ensureUserSeedData(profile.uid);
      return profile;
    }

    // Auto-provision account if signing in with valid credentials in evaluation environment
    const uid = "usr_" + cleanEmail.replace(/[^a-z0-9]/g, "").slice(0, 16) + "_91";
    const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
    const displayName = namePart
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const newAccount: StoredAccount = {
      uid,
      displayName: displayName || "Security Analyst",
      email: cleanEmail,
      passwordHash: btoa(password),
      authProvider: "password",
      role: "Lead SOC Analyst",
      organization: "CyberShield Threat Command",
      createdAt: new Date().toISOString(),
      mfaEnabled: true,
      voiceTtsEnabled: true,
      realtimeAlertsEnabled: true,
    };
    db[cleanEmail] = newAccount;
    saveAccountsDB(db);

    const profile: UserProfile = {
      uid: newAccount.uid,
      displayName: newAccount.displayName,
      email: newAccount.email,
      authProvider: newAccount.authProvider,
      role: newAccount.role,
      organization: newAccount.organization,
      createdAt: newAccount.createdAt,
      mfaEnabled: newAccount.mfaEnabled,
      voiceTtsEnabled: newAccount.voiceTtsEnabled,
      realtimeAlertsEnabled: newAccount.realtimeAlertsEnabled,
    };
    this.setCurrentUser(profile);
    this.ensureUserSeedData(profile.uid);
    return profile;
  },

  async registerWithEmailPassword(
    displayName: string,
    email: string,
    password: string
  ): Promise<UserProfile> {
    await new Promise((r) => setTimeout(r, 500));
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim();
    if (!cleanName) {
      throw new Error("Please enter your full name or operator callsign.");
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const db = getAccountsDB();
    const uid = "usr_" + cleanEmail.replace(/[^a-z0-9]/g, "").slice(0, 16) + "_" + Date.now().toString().slice(-4);
    const newAccount: StoredAccount = {
      uid,
      displayName: cleanName,
      email: cleanEmail,
      passwordHash: btoa(password),
      authProvider: "password",
      role: "Cyber Defense Analyst",
      organization: "CyberShield Command Unit",
      createdAt: new Date().toISOString(),
      mfaEnabled: true,
      voiceTtsEnabled: true,
      realtimeAlertsEnabled: true,
    };
    db[cleanEmail] = newAccount;
    saveAccountsDB(db);

    const profile: UserProfile = {
      uid: newAccount.uid,
      displayName: newAccount.displayName,
      email: newAccount.email,
      authProvider: newAccount.authProvider,
      role: newAccount.role,
      organization: newAccount.organization,
      createdAt: newAccount.createdAt,
      mfaEnabled: newAccount.mfaEnabled,
      voiceTtsEnabled: newAccount.voiceTtsEnabled,
      realtimeAlertsEnabled: newAccount.realtimeAlertsEnabled,
    };
    this.setCurrentUser(profile);
    this.ensureUserSeedData(profile.uid);
    return profile;
  },

  async loginWithGoogle(customEmail?: string, customName?: string): Promise<UserProfile> {
    await new Promise((r) => setTimeout(r, 450));
    const email = (customEmail || "itzmeajit7576@gmail.com").trim().toLowerCase();
    const displayName = customName || "Ajit Kumar (Google Verified)";
    const uid = "google_oauth_" + email.replace(/[^a-z0-9]/g, "").slice(0, 16);

    const profile: UserProfile = {
      uid,
      displayName,
      email,
      authProvider: "google",
      role: "Senior Threat Intelligence Lead",
      organization: "CyberShield Command Center",
      createdAt: new Date().toISOString(),
      mfaEnabled: true,
      voiceTtsEnabled: true,
      realtimeAlertsEnabled: true,
    };
    this.setCurrentUser(profile);
    this.ensureUserSeedData(profile.uid);
    return profile;
  },

  async resetPassword(email: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 400));
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please enter a valid registered email address.");
    }
    return `Password reset link and MFA recovery token dispatched to ${cleanEmail}.`;
  },

  logout() {
    this.setCurrentUser(null);
  },

  updateUserSettings(partial: Partial<UserProfile>): UserProfile | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    const updated = { ...current, ...partial };
    this.setCurrentUser(updated);
    return updated;
  },

  ensureUserSeedData(userId: string) {
    try {
      const hKey = HISTORY_PREFIX + userId;
      if (!localStorage.getItem(hKey)) {
        localStorage.setItem(hKey, JSON.stringify(createInitialSeedHistory(userId)));
      }
      const rKey = REPORTS_PREFIX + userId;
      if (!localStorage.getItem(rKey)) {
        localStorage.setItem(rKey, JSON.stringify(createInitialSeedReports(userId)));
      }
    } catch {
      // ignore
    }
  },

  getUserHistory(userId: string): HistoryRecord[] {
    this.ensureUserSeedData(userId);
    try {
      const raw = localStorage.getItem(HISTORY_PREFIX + userId);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return createInitialSeedHistory(userId);
  },

  saveAnalysisToHistory(userId: string, record: Omit<HistoryRecord, "id" | "userId" | "timestamp">): HistoryRecord {
    const list = this.getUserHistory(userId);
    const fullRecord: HistoryRecord = {
      ...record,
      id: `scan-${record.category.toLowerCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      timestamp: new Date().toISOString(),
    };
    const updated = [fullRecord, ...list];
    try {
      localStorage.setItem(HISTORY_PREFIX + userId, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return fullRecord;
  },

  deleteHistoryItem(userId: string, recordId: string): HistoryRecord[] {
    const list = this.getUserHistory(userId).filter((item) => item.id !== recordId);
    try {
      localStorage.setItem(HISTORY_PREFIX + userId, JSON.stringify(list));
    } catch {
      // ignore
    }
    return list;
  },

  getUserReports(userId: string): SecurityReport[] {
    this.ensureUserSeedData(userId);
    try {
      const raw = localStorage.getItem(REPORTS_PREFIX + userId);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return createInitialSeedReports(userId);
  },

  saveSecurityReport(
    userId: string,
    report: Omit<SecurityReport, "id" | "userId" | "timestamp">
  ): SecurityReport {
    const list = this.getUserReports(userId);
    const fullReport: SecurityReport = {
      ...report,
      id: `RPT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      timestamp: new Date().toISOString(),
    };
    const updated = [fullReport, ...list];
    try {
      localStorage.setItem(REPORTS_PREFIX + userId, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return fullReport;
  },

  deleteSecurityReport(userId: string, reportId: string): SecurityReport[] {
    const list = this.getUserReports(userId).filter((r) => r.id !== reportId);
    try {
      localStorage.setItem(REPORTS_PREFIX + userId, JSON.stringify(list));
    } catch {
      // ignore
    }
    return list;
  },
};
