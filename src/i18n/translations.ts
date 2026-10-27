import { SupportedLanguage } from "../types/security";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  speechCode: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    speechCode: "en-IN",
    flag: "🌐",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    speechCode: "hi-IN",
    flag: "🇮🇳",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    speechCode: "kn-IN",
    flag: "🟡🔴",
  },
];

export interface ScamAwarenessItem {
  id: string;
  title: string;
  category: string;
  explanation: string;
  warningSigns: string[];
  preventionTips: string[];
  exampleScenario: string;
}

export interface PresetMessageItem {
  id: string;
  label: string;
  platform: string;
  sender: string;
  message: string;
}

export interface Translations {
  common: {
    brandName: string;
    brandSubtitle: string;
    commandCenter: string;
    newScan: string;
    logout: string;
    close: string;
    clear: string;
    loading: string;
    save: string;
    copy: string;
    copied: string;
    status: string;
    riskScore: string;
    confidence: string;
    threatLevel: string;
    language: string;
    switchLanguage: string;
    verified: string;
    dangerous: string;
    suspicious: string;
    safe: string;
    quarantined: string;
    flagged: string;
    cleared: string;
  };
  nav: {
    dashboard: string;
    emailAnalyzer: string;
    scamDetector: string;
    screenshotScanner: string;
    threatHistory: string;
    securityReports: string;
    scamAwareness: string;
    aiAssistant: string;
    settings: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    shieldStatusSecure: string;
    shieldStatusElevated: string;
    shieldStatusCritical: string;
    totalScanned: string;
    threatsBlocked: string;
    cleanSafe: string;
    avgRiskScore: string;
    quickTools: string;
    emailToolTitle: string;
    emailToolDesc: string;
    messageToolTitle: string;
    messageToolDesc: string;
    screenshotToolTitle: string;
    screenshotToolDesc: string;
    assistantToolTitle: string;
    assistantToolDesc: string;
    liveAlertsFeed: string;
    recentScans: string;
    viewHistory: string;
    noScansYet: string;
    mitigation: string;
  };
  emailAnalyzer: {
    title: string;
    subtitle: string;
    presetsLabel: string;
    senderLabel: string;
    senderPlaceholder: string;
    recipientLabel: string;
    recipientPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    headersLabel: string;
    headersPlaceholder: string;
    bodyLabel: string;
    bodyPlaceholder: string;
    analyzeBtn: string;
    analyzingBtn: string;
    exportReportBtn: string;
    summaryTab: string;
    urlsTab: string;
    headersTab: string;
    recommendationsTab: string;
    evidenceFound: string;
    uncertainFactors: string;
  };
  scamDetector: {
    title: string;
    subtitle: string;
    presetsLabel: string;
    platformLabel: string;
    senderLabel: string;
    senderPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    analyzeBtn: string;
    analyzingBtn: string;
    exportReportBtn: string;
    whyDetected: string;
    tacticsDetected: string;
    paymentRequests: string;
    suspiciousUrls: string;
    recommendedAction: string;
  };
  screenshotScanner: {
    title: string;
    subtitle: string;
    dropzoneText: string;
    dropzoneSubtext: string;
    presetsLabel: string;
    extractedText: string;
    detectedIndicators: string;
    explanation: string;
    scanBtn: string;
    scanningBtn: string;
    exportReportBtn: string;
  };
  awarenessCenter: {
    title: string;
    subtitle: string;
    ruleTitle: string;
    ruleText: string;
    warningSigns: string;
    preventionTips: string;
    testInDetector: string;
  };
  assistant: {
    welcome: string;
    inputPlaceholder: string;
    listening: string;
    clickToSpeak: string;
    ttsToggle: string;
    tryAsking: string;
    suggestions: string[];
  };
  settings: {
    title: string;
    subtitle: string;
    languageHeader: string;
    languageSubtext: string;
    profileHeader: string;
    displayName: string;
    role: string;
    organization: string;
    saveProfile: string;
    profileSaved: string;
    securityControls: string;
    mfaTitle: string;
    mfaDesc: string;
    ttsTitle: string;
    ttsDesc: string;
    alertsTitle: string;
    alertsDesc: string;
    enabled: string;
    disabled: string;
  };
  messagePresets: PresetMessageItem[];
  scamCards: ScamAwarenessItem[];
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    common: {
      brandName: "CyberShield",
      brandSubtitle: "AI Security Command Center",
      commandCenter: "CyberShield Command",
      newScan: "+ New Threat Scan",
      logout: "Logout Session",
      close: "Close",
      clear: "Clear",
      loading: "Processing...",
      save: "Save",
      copy: "Copy",
      copied: "Copied!",
      status: "Status",
      riskScore: "Risk Score",
      confidence: "Confidence",
      threatLevel: "Threat Level",
      language: "Language",
      switchLanguage: "Change Language",
      verified: "VERIFIED",
      dangerous: "DANGEROUS",
      suspicious: "SUSPICIOUS",
      safe: "SAFE",
      quarantined: "QUARANTINED",
      flagged: "FLAGGED",
      cleared: "CLEARED",
    },
    nav: {
      dashboard: "Dashboard",
      emailAnalyzer: "Email Analyzer",
      scamDetector: "Scam Message Detector",
      screenshotScanner: "Screenshot Scanner",
      threatHistory: "Threat History",
      securityReports: "Security Reports",
      scamAwareness: "Scam Awareness",
      aiAssistant: "AI Assistant",
      settings: "Settings",
    },
    dashboard: {
      title: "Security Command Center",
      subtitle: "Unified real-time defense against phishing, fraudulent SMS, UPI scams, and OCR visual threats.",
      shieldStatusSecure: "SECURE DEFENSE POSTURE",
      shieldStatusElevated: "ELEVATED RISK DETECTED",
      shieldStatusCritical: "ACTIVE THREATS QUARANTINED",
      totalScanned: "Total Scans",
      threatsBlocked: "Threats Quarantined",
      cleanSafe: "Verified Safe",
      avgRiskScore: "Avg Threat Index",
      quickTools: "Threat Diagnostic Modules",
      emailToolTitle: "Email Threat Analyzer",
      emailToolDesc: "Inspect SPF, DKIM, DMARC, lookalike typosquatting domains, and credential phishing links.",
      messageToolTitle: "Scam Message Detector",
      messageToolDesc: "Analyze SMS, WhatsApp, and Telegram messages for fake UPI lures and urgent coercion.",
      screenshotToolTitle: "OCR Screenshot Scanner",
      screenshotToolDesc: "Extract visual text and pinpoint fraudulent banking screens or malicious QR codes.",
      assistantToolTitle: "Voice AI Security Assistant",
      assistantToolDesc: "Hands-free voice diagnostics and intelligent cyber threat recommendations.",
      liveAlertsFeed: "Live Threat Intelligence Stream",
      recentScans: "Recent Forensic Inspections",
      viewHistory: "View Full History",
      noScansYet: "No threat inspections recorded yet. Start by running an email or message scan above.",
      mitigation: "Mitigation",
    },
    emailAnalyzer: {
      title: "AI Email Threat Analyzer",
      subtitle: "Forensic inspection of email headers, SPF/DKIM/DMARC authentication, sender domain typosquatting, and deceptive URLs.",
      presetsLabel: "Test Sample Scenarios:",
      senderLabel: "Sender Address",
      senderPlaceholder: "e.g. support@micr0soft-security.xyz",
      recipientLabel: "Recipient Address",
      recipientPlaceholder: "e.g. employee@company.com",
      subjectLabel: "Subject Line",
      subjectPlaceholder: "e.g. URGENT: Your account access expires in 2 hours",
      headersLabel: "Raw Email Headers (Optional)",
      headersPlaceholder: "Paste Received:, Authentication-Results:, SPF, DKIM headers...",
      bodyLabel: "Email Body Text",
      bodyPlaceholder: "Paste the complete email content or message body here...",
      analyzeBtn: "Run AI Threat Analysis",
      analyzingBtn: "Analyzing Threat Vector...",
      exportReportBtn: "Export Forensic Report",
      summaryTab: "Forensic Breakdown",
      urlsTab: "URL & Domain Audit",
      headersTab: "Cryptographic Headers",
      recommendationsTab: "Recommended Action",
      evidenceFound: "CONFIRMED EVIDENCE",
      uncertainFactors: "UNCERTAIN FACTORS",
    },
    scamDetector: {
      title: "Scam Message Detector",
      subtitle: "Inspect suspicious SMS, WhatsApp, or Telegram messages for social engineering, fake UPI requests, and advance-fee fraud.",
      presetsLabel: "Try Realistic Threat Samples:",
      platformLabel: "Source Platform",
      senderLabel: "Sender Name / Mobile Number",
      senderPlaceholder: "e.g. +91 98765 43210 or IND-ALERT",
      messageLabel: "Message Content",
      messagePlaceholder: "Paste suspicious SMS or WhatsApp message text here...",
      analyzeBtn: "Detect Scam Indicators",
      analyzingBtn: "Scanning Message Tactics...",
      exportReportBtn: "Export Message Report",
      whyDetected: "Detection Assessment",
      tacticsDetected: "Social Engineering Tactics",
      paymentRequests: "Suspicious Payment / UPI Lures",
      suspiciousUrls: "Extracted Suspicious Links",
      recommendedAction: "Recommended Action",
    },
    screenshotScanner: {
      title: "Scam Screenshot OCR Scanner",
      subtitle: "Extract visual text from screenshots to identify fraudulent banking alerts, fake payment slips, and credential login scams.",
      dropzoneText: "Drag & drop screenshot here, or click to browse",
      dropzoneSubtext: "Supports JPG, PNG up to 10MB. Text is analyzed with privacy-preserving OCR.",
      presetsLabel: "Or inspect a realistic sample:",
      extractedText: "Extracted Text (OCR)",
      detectedIndicators: "Identified Threat Indicators",
      explanation: "Forensic Analysis",
      scanBtn: "Run Forensic OCR Analysis",
      scanningBtn: "Extracting Visual Indicators...",
      exportReportBtn: "Export Screenshot Report",
    },
    awarenessCenter: {
      title: "Scam Awareness & Cyber Safety Center",
      subtitle: "Understand real-world cyber fraud vectors, warning signs, and defensive best practices.",
      ruleTitle: "The Golden Rule of Digital Safety",
      ruleText: "A UPI PIN is strictly required to SEND money, never to RECEIVE money. Legitimate banks and government officials never demand immediate payment through personal UPI or gift cards.",
      warningSigns: "Warning Signs",
      preventionTips: "Defensive Tips",
      testInDetector: "Test This Scenario in Scam Detector",
    },
    assistant: {
      welcome: "Hello! I am your CyberShield AI Security Assistant. Speak in English, Hindi (हिंदी), or Kannada (ಕನ್ನಡ)—or type below—to analyze threats or navigate.",
      inputPlaceholder: "Ask a cybersecurity question or give a command...",
      listening: "Listening... Speak now",
      clickToSpeak: "Click to speak voice command",
      ttsToggle: "Voice Audio (TTS)",
      tryAsking: "Try asking:",
      suggestions: [
        "Is this message a scam?",
        "Analyze this email",
        "Explain what phishing is",
        "Give me safety tips for UPI",
        "Open scam detector",
        "Scan a screenshot",
      ],
    },
    settings: {
      title: "Command Center Settings",
      subtitle: "Configure regional languages, operator callsign, voice synthesis, and zero-trust controls.",
      languageHeader: "Language & Regional Preferences",
      languageSubtext: "Select your preferred language. All views, threat forensics, and voice assistant will adapt.",
      profileHeader: "Operator Profile & Callsign",
      displayName: "Display Name",
      role: "Role / Designation",
      organization: "Organization / Division",
      saveProfile: "Save Profile Preferences",
      profileSaved: "Preferences updated and synced successfully.",
      securityControls: "Security & Interface Controls",
      mfaTitle: "Multi-Factor Authentication (MFA)",
      mfaDesc: "Enforce MFA validation on sensitive account actions.",
      ttsTitle: "Voice Assistant Audio (TTS)",
      ttsDesc: "Read AI threat analysis aloud using speech synthesis.",
      alertsTitle: "Simulated Threat Demo Feed",
      alertsDesc: "Auto-stream educational threat notifications on the dashboard.",
      enabled: "ENABLED",
      disabled: "DISABLED",
    },
    messagePresets: [
      {
        id: "kyc-bank-en",
        label: "KYC Bank Block SMS",
        platform: "SMS",
        sender: "+91 89234 11092",
        message: "Dear Customer, Your SBI YONO Account & PAN Card KYC has expired today. Your bank account will be blocked within 24 hours. Click http://bit.ly/sbi-kyc-fast-update immediately or call +91 8923411092 to verify OTP.",
      },
      {
        id: "upi-collect-en",
        label: "UPI Cashback PIN Scam",
        platform: "WhatsApp",
        sender: "+91 91234 55678",
        message: "Congratulations! You won ₹4,999 festival cashback on Google Pay / PhonePe. Approve the UPI collect request and enter your 4-digit UPI PIN now to receive ₹4,999 directly in your bank account: https://reward-gpay-claim.xyz",
      },
      {
        id: "job-telegram-en",
        label: "Work From Home Job Offer",
        platform: "Telegram",
        sender: "@HR_Global_Recruiter",
        message: "Hello! We are hiring for Part-Time Work From Home rating tasks. Earn ₹3,500 to ₹8,000 daily income just by liking YouTube videos! No experience needed. Deposit ₹1,000 registration fee to unlock VIP task group: https://t.me/vip_tasks_2026",
      },
      {
        id: "parcel-customs-en",
        label: "India Post Delivery Hold",
        platform: "SMS",
        sender: "IND-POST-ALERT",
        message: "India Post: Your parcel #IN9928104 delivery failed due to incomplete address. Pay ₹49 rescheduling fee within 12 hours or parcel will be returned: https://indiapost-track-parcel.top/pay",
      },
      {
        id: "legit-otp-en",
        label: "Safe: Official Bank OTP",
        platform: "SMS",
        sender: "VM-HDFCBK",
        message: "482910 is your SECRET One Time Password (OTP) for NetBanking login. Do not share this OTP with anyone. Bank employees never ask for OTP.",
      },
    ],
    scamCards: [
      {
        id: "phishing",
        title: "Phishing",
        category: "Credential Harvesting",
        explanation: "Attackers send deceptive emails or messages impersonating trusted brands to trick you into entering passwords, credit card numbers, or SSO tokens on fake login pages.",
        warningSigns: [
          "Lookalike sender domains (e.g., micr0soft-support.xyz)",
          "Urgent threats of account suspension within 24 hours",
          "Generic greetings and mismatched Reply-To headers",
        ],
        preventionTips: [
          "Never click login links directly from unexpected emails.",
          "Check the actual domain in browser address bar before typing passwords.",
          "Enable Multi-Factor Authentication (MFA) with an authenticator app.",
        ],
        exampleScenario: "URGENT: Your Corporate M365 account expires today. Verify password immediately: http://login-micr0soft.click",
      },
      {
        id: "upi-fraud",
        title: "UPI / Payment Fraud",
        category: "Financial Scam",
        explanation: "Fraudsters send a UPI 'Collect' payment request disguised as a refund or prize, claiming you must enter your UPI PIN to receive the money.",
        warningSigns: [
          "Asking you to enter your UPI PIN to 'receive' cashback or lottery money.",
          "Sending a QR code and saying 'scan this to get money in your account'.",
          "Urgent phone calls claiming accidental money transfer.",
        ],
        preventionTips: [
          "Remember: UPI PIN is strictly to PAY or SEND money, never to receive.",
          "Never scan a stranger's QR code to receive a payment.",
          "Report fraudulent UPI IDs immediately on the National Cyber Crime Portal (1930).",
        ],
        exampleScenario: "Congratulations! You have received ₹5,000 cashback. Enter UPI PIN to claim: https://upi-reward.xyz",
      },
      {
        id: "work-from-home",
        title: "Work From Home / YouTube Job",
        category: "Advance Fee Scam",
        explanation: "Scammers promise high daily earnings for liking videos or rating hotels, pay a small initial incentive, then demand thousands of rupees in 'task deposits'.",
        warningSigns: [
          "Unrealistic pay (₹3,000 - ₹8,000 per day for simple 5-minute tasks).",
          "Communication strictly via Telegram or WhatsApp unknown numbers.",
          "Demanding a 'security deposit' or 'cryptocurrency top-up' to release earnings.",
        ],
        preventionTips: [
          "Legitimate employers never ask you to pay money to get a job.",
          "Avoid anonymous Telegram groups offering guaranteed daily trading profits.",
          "Block unknown international numbers (+92, +84, +62) messaging about job offers.",
        ],
        exampleScenario: "Part time online job! Earn ₹500 per video like. Deposit ₹2,000 to upgrade to Gold VIP level.",
      },
      {
        id: "electricity-bill",
        title: "Electricity Bill Disconnect Scam",
        category: "Urgent Impersonation",
        explanation: "Fake SMS messages claim your electricity power will be disconnected at 9:30 PM due to an unpaid bill, directing you to call a scammer's phone number.",
        warningSigns: [
          "Sent from a random 10-digit mobile number instead of an official utility SMS header (like BESCOM or UPPCL).",
          "Threatens power disconnection within a few hours.",
          "Instructs you to call an individual mobile number or download an APK / remote support app.",
        ],
        preventionTips: [
          "Check electricity bill status only on the official government utility portal or trusted app.",
          "Never install AnyDesk, TeamViewer, or unknown APK files sent via WhatsApp.",
          "Ignore disconnection threats received from normal personal mobile numbers.",
        ],
        exampleScenario: "Dear Customer, Your electricity power will be disconnected tonight at 9:30 PM because previous month bill was not updated. Call electricity officer at 9876543210 immediately.",
      },
    ],
  },
  hi: {
    common: {
      brandName: "साइबर शील्ड",
      brandSubtitle: "एआई साइबर सुरक्षा कमांड सेंटर",
      commandCenter: "साइबर शील्ड कमांड",
      newScan: "+ नया खतरा स्कैन",
      logout: "लॉगआउट करें",
      close: "बंद करें",
      clear: "साफ़ करें",
      loading: "जांच जारी है...",
      save: "सहेजें",
      copy: "कॉपी करें",
      copied: "कॉपी हो गया!",
      status: "स्थिति",
      riskScore: "जोखिम स्कोर",
      confidence: "सटीकता",
      threatLevel: "खतरे का स्तर",
      language: "भाषा",
      switchLanguage: "भाषा बदलें",
      verified: "सत्यापित",
      dangerous: "खतरनाक",
      suspicious: "संदिग्ध",
      safe: "सुरक्षित",
      quarantined: "अलग किया गया",
      flagged: "चिह्नित",
      cleared: "सुरक्षित माना गया",
    },
    nav: {
      dashboard: "डैशबोर्ड",
      emailAnalyzer: "ईमेल विश्लेषक",
      scamDetector: "घोटाला संदेश डिटेक्टर",
      screenshotScanner: "स्क्रीनशॉट स्कैनर",
      threatHistory: "खतरा इतिहास",
      securityReports: "सुरक्षा रिपोर्ट",
      scamAwareness: "घोटाला जागरूकता",
      aiAssistant: "एआई सहायक",
      settings: "सेटिंग्स",
    },
    dashboard: {
      title: "सुरक्षा कमांड सेंटर",
      subtitle: "फिशिंग, फर्जी एसएमएस, यूपीआई धोखाधड़ी और स्क्रीनशॉट खतरों के खिलाफ एकीकृत एआई रक्षा प्रणाली।",
      shieldStatusSecure: "सुरक्षित रक्षा स्थिति",
      shieldStatusElevated: "उच्च जोखिम पाया गया",
      shieldStatusCritical: "सक्रिय खतरे अलग किए गए",
      totalScanned: "कुल स्कैन",
      threatsBlocked: "रोके गए खतरे",
      cleanSafe: "सुरक्षित वस्तुएं",
      avgRiskScore: "औसत खतरा सूचकांक",
      quickTools: "खतरा जांच मॉड्यूल",
      emailToolTitle: "ईमेल खतरा विश्लेषक",
      emailToolDesc: "एसपीएफ, डीकेआईएम, डीएमएआरसी और फर्जी डोमेन का फोरेंसिक विश्लेषण करें।",
      messageToolTitle: "घोटाला संदेश डिटेक्टर",
      messageToolDesc: "एसएमएस, व्हाट्सएप व टेलीग्राम संदेशों में यूपीआई फ्रॉड और दबाव पहचानें।",
      screenshotToolTitle: "ओसीआर स्क्रीनशॉट स्कैनर",
      screenshotToolDesc: "स्क्रीनशॉट से टेक्स्ट निकालें और फर्जी बैंकिंग स्क्रीन या क्यूआर कोड पकड़ें।",
      assistantToolTitle: "वॉयस एआई सुरक्षा सहायक",
      assistantToolDesc: "बोलकर सुरक्षा सवाल पूछें और तुरंत हिंदी में सलाह व मार्गदर्शन पाएं।",
      liveAlertsFeed: "लाइव साइबर खतरा अलर्ट फीड",
      recentScans: "हालिया फोरेंसिक स्कैन",
      viewHistory: "पूरा इतिहास देखें",
      noScansYet: "अभी तक कोई स्कैन दर्ज नहीं है। ऊपर दिए गए टूल से पहला स्कैन शुरू करें।",
      mitigation: "बचाव का उपाय",
    },
    emailAnalyzer: {
      title: "एआई ईमेल खतरा विश्लेषक",
      subtitle: "ईमेल हेडर, एसपीएफ/डीकेआईएम/डीएमएआरसी प्रमाणीकरण, फर्जी प्रेषक डोमेन और फिशिंग लिंक की गहरी जांच।",
      presetsLabel: "परीक्षण नमूने चुनें:",
      senderLabel: "प्रेषक का ईमेल पता",
      senderPlaceholder: "उदा. support@micr0soft-security.xyz",
      recipientLabel: "प्राप्तकर्ता का ईमेल",
      recipientPlaceholder: "उदा. employee@company.com",
      subjectLabel: "ईमेल का विषय",
      subjectPlaceholder: "उदा. आवश्यक: आपका खाता 2 घंटे में बंद हो जाएगा",
      headersLabel: "कच्चा ईमेल हेडर (वैकल्पिक)",
      headersPlaceholder: "Received:, Authentication-Results:, SPF, DKIM हेडर पेस्ट करें...",
      bodyLabel: "ईमेल की मुख्य सामग्री",
      bodyPlaceholder: "यहां ईमेल का पूरा टेक्स्ट या संदेश पेस्ट करें...",
      analyzeBtn: "एआई खतरा विश्लेषण चलाएं",
      analyzingBtn: "खतरे का विश्लेषण जारी है...",
      exportReportBtn: "फोरेंसिक रिपोर्ट सहेजें",
      summaryTab: "फोरेंसिक सारांश",
      urlsTab: "यूआरएल व डोमेन जांच",
      headersTab: "क्रिप्टोग्राफिक हेडर",
      recommendationsTab: "अनुशंसित कार्रवाई",
      evidenceFound: "पुष्ट साक्ष्य",
      uncertainFactors: "अनिश्चित कारक",
    },
    scamDetector: {
      title: "घोटाला संदेश डिटेक्टर",
      subtitle: "एसएमएस, व्हाट्सएप या टेलीग्राम पर फर्जी यूपीआई ऑफर, बिजली बिल धमकी व लॉटरी धोखाधड़ी की जांच करें।",
      presetsLabel: "वास्तविक धोखाधड़ी के नमूने आजमाएं:",
      platformLabel: "संदेश का स्रोत (प्लेटफॉर्म)",
      senderLabel: "प्रेषक का नाम या मोबाइल नंबर",
      senderPlaceholder: "उदा. +91 98765 43210 या IND-ALERT",
      messageLabel: "संदेश की सामग्री",
      messagePlaceholder: "संदिग्ध एसएमएस या व्हाट्सएप संदेश यहां पेस्ट करें...",
      analyzeBtn: "घोटाले के संकेत पहचानें",
      analyzingBtn: "संदेश की चालें स्कैन की जा रही हैं...",
      exportReportBtn: "संदेश रिपोर्ट सहेजें",
      whyDetected: "पहचान का मुख्य कारण",
      tacticsDetected: "धोखाधड़ी के मनोवैज्ञानिक तरीके",
      paymentRequests: "संदिग्ध भुगतान या यूपीआई अनुरोध",
      suspiciousUrls: "निकाले गए संदिग्ध लिंक",
      recommendedAction: "अनुशंसित सुरक्षा कदम",
    },
    screenshotScanner: {
      title: "स्क्रीनशॉट ओसीआर स्कैनर",
      subtitle: "स्क्रीनशॉट से टेक्स्ट पढ़कर फर्जी बैंकिंग सूचनाएं, नकली पेमेंट रसीदें और फर्जी लॉगिन पेज पहचानें।",
      dropzoneText: "स्क्रीनशॉट यहां खींचें या अपलोड करने के लिए क्लिक करें",
      dropzoneSubtext: "JPG, PNG 10MB तक समर्थित। टेक्स्ट सुरक्षित रूप से ओसीआर द्वारा पढ़ा जाता है।",
      presetsLabel: "या किसी नमूने से परीक्षण करें:",
      extractedText: "निकाला गया टेक्स्ट (OCR)",
      detectedIndicators: "पहचाने गए खतरे के संकेत",
      explanation: "फोरेंसिक विश्लेषण",
      scanBtn: "फोरेंसिक ओसीआर विश्लेषण करें",
      scanningBtn: "दृश्य संकेत पहचाने जा रहे हैं...",
      exportReportBtn: "स्क्रीनशॉट रिपोर्ट सहेजें",
    },
    awarenessCenter: {
      title: "घोटाला जागरूकता व साइबर सुरक्षा केंद्र",
      subtitle: "वास्तविक दुनिया के साइबर अपराधों, धोखाधड़ी के तरीकों और सुरक्षा नियमों को समझें।",
      ruleTitle: "डिजिटल सुरक्षा का सुनहरा नियम",
      ruleText: "यूपीआई पिन केवल पैसे भेजने के लिए होता है, पैसे प्राप्त करने के लिए कभी नहीं। कोई भी बैंक या सरकारी अधिकारी फोन पर कभी ओटीपी या व्यक्तिगत यूपीआई में पैसे नहीं मांगता।",
      warningSigns: "चेतावनी के संकेत",
      preventionTips: "बचाव की युक्तियां",
      testInDetector: "इस स्थिति को स्कैम डिटेक्टर में परखें",
    },
    assistant: {
      welcome: "नमस्ते! मैं आपका साइबर शील्ड एआई सुरक्षा सहायक हूँ। अंग्रेजी, हिंदी या कन्नड़ में बोलकर या लिखकर सवाल पूछें—मैं तुरंत सहायता करूंगा।",
      inputPlaceholder: "साइबर सुरक्षा से जुड़ा सवाल पूछें या संदेश पेस्ट करें...",
      listening: "सुन रहा हूँ... अब बोलें",
      clickToSpeak: "बोलने के लिए माइक दबाएं",
      ttsToggle: "आवाज में उत्तर (TTS)",
      tryAsking: "पूछ कर देखें:",
      suggestions: [
        "क्या यह संदेश एक फ्रॉड है?",
        "इस ईमेल की जांच करें",
        "फिशिंग क्या होता है?",
        "यूपीआई सुरक्षा के नियम बताएं",
        "स्कैम डिटेक्टर खोलें",
        "स्क्रीनशॉट स्कैनर खोलें",
      ],
    },
    settings: {
      title: "कमांड सेंटर सेटिंग्स",
      subtitle: "भाषा, ऑपरेटर प्रोफाइल, वॉयस असिस्टेंट और सुरक्षा नियंत्रण प्रबंधित करें।",
      languageHeader: "भाषा और क्षेत्रीय प्राथमिकताएं",
      languageSubtext: "अपनी पसंदीदा भाषा चुनें। पूरी प्रणाली, विश्लेषण और वॉयस असिस्टेंट तुरंत उसी भाषा में कार्य करेंगे।",
      profileHeader: "ऑपरेटर प्रोफाइल व पदनाम",
      displayName: "प्रदर्शित नाम",
      role: "पद / पदनाम",
      organization: "संगठन / विभाग",
      saveProfile: "प्रोफाइल प्राथमिकताएं सहेजें",
      profileSaved: "प्राथमिकताएं सफलतापूर्वक अपडेट हो गईं।",
      securityControls: "सुरक्षा एवं इंटरफ़ेस नियंत्रण",
      mfaTitle: "मल्टी-फैक्टर ऑथेंटिकेशन (MFA)",
      mfaDesc: "संवेदनशील कार्यों पर अतिरिक्त सुरक्षा सत्यापन लागू करें।",
      ttsTitle: "वॉयस असिस्टेंट आवाज (TTS)",
      ttsDesc: "सुरक्षा विश्लेषण को बोलकर सुनाने के लिए आवाज चालू रखें।",
      alertsTitle: "लाइव खतरा डेमो फीड",
      alertsDesc: "डैशबोर्ड पर शैक्षिक साइबर अपराध चेतावनी लगातार दिखाएं।",
      enabled: "सक्रिय",
      disabled: "निष्क्रिय",
    },
    messagePresets: [
      {
        id: "bijli-bill-hi",
        label: "बिजली बिल कटने का एसएमएस",
        platform: "SMS",
        sender: "+91 98765 43210",
        message: "प्रिय ग्राहक, आपका बिजली कनेक्शन आज रात 9:30 बजे काट दिया जाएगा क्योंकि पिछले महीने का बिल अपडेट नहीं हुआ है। तुरंत बिजली अधिकारी 9876543210 पर संपर्क करें या बिल अपडेट करें: http://bit.ly/bijli-bill-pay",
      },
      {
        id: "upi-cashback-hi",
        label: "यूपीआई कैशबैक पिन फ्रॉड",
        platform: "WhatsApp",
        sender: "+91 91234 55678",
        message: "बधाई हो! आपको Google Pay / PhonePe पर ₹4,999 का उत्सव कैशबैक मिला है। तुरंत अपने खाते में पैसे पाने के लिए यूपीआई कलेक्ट अनुरोध स्वीकारें और अपना 4-अंकों का यूपीआई पिन दर्ज करें: https://reward-gpay-claim.xyz",
      },
      {
        id: "job-wfh-hi",
        label: "वर्क फ्रॉम होम यूट्यूब जॉब",
        platform: "Telegram",
        sender: "@HR_Global_Recruiter",
        message: "नमस्ते! पार्ट-टाइम घर बैठे यूट्यूब वीडियो लाइक करने का काम। प्रतिदिन ₹3,000 से ₹8,000 कमाएं। किसी अनुभव की जरूरत नहीं। वीआईपी टास्क ग्रुप शुरू करने के लिए ₹1,000 रजिस्ट्रेशन शुल्क जमा करें: https://t.me/vip_tasks_2026",
      },
      {
        id: "bank-kyc-hi",
        label: "बैंक खाता केवाईसी ब्लॉक SMS",
        platform: "SMS",
        sender: "+91 89234 11092",
        message: "प्रिय खाताधारक, आपका बैंक खाता और पैन कार्ड केवाईसी आज समाप्त हो गया है। आपका खाता 24 घंटे में ब्लॉक हो जाएगा। तुरंत http://bit.ly/sbi-kyc-fast-update पर क्लिक करके ओटीपी सत्यापित करें।",
      },
      {
        id: "legit-otp-hi",
        label: "सुरक्षित: आधिकारिक बैंक ओटीपी",
        platform: "SMS",
        sender: "VM-HDFCBK",
        message: "482910 नेटबैंकिंग लॉगिन के लिए आपका गुप्त वन टाइम पासवर्ड (OTP) है। इसे किसी के साथ साझा न करें। बैंक कर्मचारी कभी भी ओटीपी नहीं मांगते हैं।",
      },
    ],
    scamCards: [
      {
        id: "phishing",
        title: "फिशिंग (Phishing)",
        category: "पासवर्ड व पहचान चोरी",
        explanation: "धोखेबाज असली जैसी दिखने वाली नकली वेबसाइटों के लिंक भेजते हैं ताकि आप अपना पासवर्ड, क्रेडिट कार्ड या बैंकिंग विवरण दर्ज कर दें।",
        warningSigns: [
          "असली से मिलते-जुलते नकली डोमेन (उदा. micr0soft-support.xyz)",
          "खाता 24 घंटे में बंद होने की झूठी चेतावनी",
          "ईमेल में सामान्य अभिवादन और संदिग्ध प्रेषक पता",
        ],
        preventionTips: [
          "अनजान ईमेल या संदेश में दिए लिंक पर कभी क्लिक न करें।",
          "पासवर्ड दर्ज करने से पहले ब्राउज़र के एड्रेस बार में वेबसाइट का सही पता जांचें।",
          "ऑथेंटिकेटर ऐप के साथ टू-फैक्टर ऑथेंटिकेशन (2FA) अवश्य चालू रखें।",
        ],
        exampleScenario: "अति आवश्यक: आपका खाता आज समाप्त हो रहा है। तुरंत पासवर्ड सत्यापित करें: http://login-micr0soft.click",
      },
      {
        id: "upi-fraud",
        title: "यूपीआई व भुगतान धोखाधड़ी",
        category: "वित्तीय धोखाधड़ी",
        explanation: "धोखेबाज कैशबैक या रिफंड का झांसा देकर यूपीआई 'कलेक्ट रिक्वेस्ट' भेजते हैं और कहते हैं कि पैसे प्राप्त करने के लिए अपना यूपीआई पिन डालें।",
        warningSigns: [
          "पैसे 'प्राप्त' करने के लिए यूपीआई पिन डालने को कहना।",
          "क्यूआर कोड भेजकर कहना कि इसे स्कैन करने पर आपके खाते में पैसे आएंगे।",
          "गलती से पैसे ट्रांसफर होने का झूठा फोन कॉल आना।",
        ],
        preventionTips: [
          "याद रखें: यूपीआई पिन केवल पैसे भेजने या काटने के लिए होता है, पैसे पाने के लिए कभी नहीं।",
          "अजनबियों द्वारा भेजा गया क्यूआर कोड कभी स्कैन न करें।",
          "धोखाधड़ी होने पर तुरंत राष्ट्रीय साइबर हेल्पलाइन 1930 पर शिकायत दर्ज करें।",
        ],
        exampleScenario: "बधाई हो! आपको ₹5,000 कैशबैक मिला है। पैसे पाने के लिए यूपीआई पिन डालें: https://upi-reward.xyz",
      },
      {
        id: "work-from-home",
        title: "वर्क फ्रॉम होम / यूट्यूब जॉब स्कैम",
        category: "अग्रिम शुल्क धोखाधड़ी",
        explanation: "यूट्यूब वीडियो लाइक करने या होटल रेटिंग के बदले हजारों रुपये रोजाना देने का लालच देकर शुरुआत में ₹100-200 देते हैं, फिर लाखों रुपये जमा करवा लेते हैं।",
        warningSigns: [
          "5 मिनट के काम के लिए ₹3,000 से ₹8,000 प्रतिदिन का अवास्तविक वादा।",
          "टेलीग्राम या अज्ञात व्हाट्सएप नंबरों पर बातचीत।",
          "कमाई निकालने के लिए 'सुरक्षा जमा' या 'क्रिप्टो रिचार्ज' की मांग करना।",
        ],
        preventionTips: [
          "कोई भी असली कंपनी नौकरी देने के लिए आपसे पैसे नहीं मांगती।",
          "गारंटीशुदा दैनिक लाभ का वादा करने वाले टेलीग्राम ग्रुप्स से बचें।",
          "अज्ञात विदेशी नंबरों (+92, +84, +62) से आने वाले जॉब मैसेज तुरंत ब्लॉक करें।",
        ],
        exampleScenario: "घर बैठे यूट्यूब वीडियो लाइक करें और ₹5,000 रोज कमाएं। वीआईपी बनने के लिए ₹2,000 जमा करें।",
      },
      {
        id: "electricity-bill",
        title: "बिजली बिल काटने की धमकी",
        category: "अति-आवश्यकता का डर",
        explanation: "फर्जी एसएमएस भेजा जाता है कि आपका बिजली बिल बकाया है और आज रात 9:30 बजे बिजली काट दी जाएगी, फिर एक मोबाइल नंबर पर कॉल करने को कहा जाता है।",
        warningSigns: [
          "आधिकारिक बिजली कंपनी के बजाय साधारण 10-अंकों के मोबाइल नंबर से एसएमएस आना।",
          "कुछ ही घंटों में बिजली काटने की धमकी देना।",
          "अज्ञात नंबर पर कॉल करने या AnyDesk/TeamViewer डाउनलोड करने को कहना।",
        ],
        preventionTips: [
          "बिजली बिल की स्थिति हमेशा बिजली विभाग की आधिकारिक वेबसाइट या अधिकृत ऐप पर ही जांचें।",
          "व्हाट्सएप पर भेजी गई किसी भी अज्ञात ऐप (APK) को कभी इंस्टॉल न करें।",
          "व्यक्तिगत नंबरों से आने वाली बिजली काटने की धमकियों को पूरी तरह नजरअंदाज करें।",
        ],
        exampleScenario: "प्रिय उपभोक्ता, पिछले महीने का बिल जमा न होने के कारण आज रात 9:30 बजे बिजली काट दी जाएगी। तुरंत 9876543210 पर संपर्क करें।",
      },
    ],
  },
  kn: {
    common: {
      brandName: "ಸೈಬರ್ ಶೀಲ್ಡ್",
      brandSubtitle: "AI ಸೈಬರ್ ಭದ್ರತಾ ಕಮಾಂಡ್ ಸೆಂಟರ್",
      commandCenter: "ಸೈಬರ್ ಶೀಲ್ಡ್ ಕಮಾಂಡ್",
      newScan: "+ ಹೊಸ ಬೆದರಿಕೆ ಸ್ಕ್ಯಾನ್",
      logout: "ಲಾಗೌಟ್ ಮಾಡಿ",
      close: "ಮುಚ್ಚಿ",
      clear: "ತೆರವುಗೊಳಿಸಿ",
      loading: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
      save: "ಉಳಿಸಿ",
      copy: "ನಕಲಿಸಿ",
      copied: "ನಕಲಿಸಲಾಗಿದೆ!",
      status: "ಸ್ಥಿತಿ",
      riskScore: "ಅಪಾಯದ ಸ್ಕೋರ್",
      confidence: "ಖಚಿತತೆ",
      threatLevel: "ಬೆದರಿಕೆ ಮಟ್ಟ",
      language: "ಭಾಷೆ",
      switchLanguage: "ಭಾಷೆ ಬದಲಾಯಿಸಿ",
      verified: "ದೃಢೀಕೃತ",
      dangerous: "ಅಪಾಯಕಾರಿ",
      suspicious: "ಅನುಮಾನಾಸ್ಪದ",
      safe: "ಸುರಕ್ಷಿತ",
      quarantined: "ಪ್ರತ್ಯೇಕಿಸಲಾಗಿದೆ",
      flagged: "ಗುರುತಿಸಲಾಗಿದೆ",
      cleared: "ಸುರಕ್ಷಿತವೆಂದು ದೃಢಪಟ್ಟಿದೆ",
    },
    nav: {
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      emailAnalyzer: "ಇಮೇಲ್ ವಿಶ್ಲೇಷಕ",
      scamDetector: "ವಂಚನೆ ಸಂದೇಶ ಪತ್ತೆಕಾರಕ",
      screenshotScanner: "ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಸ್ಕ್ಯಾನರ್",
      threatHistory: "ಬೆದರಿಕೆ ಇತಿಹಾಸ",
      securityReports: "ಭದ್ರತಾ ವರದಿಗಳು",
      scamAwareness: "ವಂಚನೆ ಜಾಗೃತಿ",
      aiAssistant: "AI ಸಹಾಯಕ",
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    },
    dashboard: {
      title: "ಭದ್ರತಾ ಕಮಾಂಡ್ ಸೆಂಟರ್",
      subtitle: "ಫಿಶಿಂಗ್, ವಂಚನೆಯ SMS, UPI ಮೋಸ ಮತ್ತು ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಬೆದರಿಕೆಗಳ ವಿರುದ್ಧ ಸಮಗ್ರ AI ರಕ್ಷಣಾ ವ್ಯವಸ್ಥೆ.",
      shieldStatusSecure: "ಸುರಕ್ಷಿತ ರಕ್ಷಣಾ ಸ್ಥಿತಿ",
      shieldStatusElevated: "ಹೆಚ್ಚಿನ ಅಪಾಯ ಪತ್ತೆಯಾಗಿದೆ",
      shieldStatusCritical: "ಸಕ್ರಿಯ ಬೆದರಿಕೆಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸಲಾಗಿದೆ",
      totalScanned: "ಒಟ್ಟು ಸ್ಕ್ಯಾನ್‌ಗಳು",
      threatsBlocked: "ತಡೆಗಟ್ಟಲಾದ ಬೆದರಿಕೆಗಳು",
      cleanSafe: "ಸುರಕ್ಷಿತ ಅಂಶಗಳು",
      avgRiskScore: "ಸರಾಸರಿ ಅಪಾಯದ ಸೂಚ್ಯಂಕ",
      quickTools: "ಬೆದರಿಕೆ ತಪಾಸಣಾ ಮಾಡ್ಯೂಲ್‌ಗಳು",
      emailToolTitle: "ಇಮೇಲ್ ಬೆದರಿಕೆ ವಿಶ್ಲೇಷಕ",
      emailToolDesc: "SPF, DKIM, DMARC ಮತ್ತು ನಕಲಿ ಇಮೇಲ್ ವಿಳಾಸಗಳ ವಿಧಿವಿಜ್ಞಾನ ಪರೀಕ್ಷೆ ನಡೆಸಿ.",
      messageToolTitle: "ವಂಚನೆ ಸಂದೇಶ ಪತ್ತೆಕಾರಕ",
      messageToolDesc: "SMS, WhatsApp ಮತ್ತು Telegram ಸಂದೇಶಗಳಲ್ಲಿ ನಕಲಿ UPI ವಿನಂತಿಗಳು ಮತ್ತು ಬೆದರಿಕೆಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ.",
      screenshotToolTitle: "OCR ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಸ್ಕ್ಯಾನರ್",
      screenshotToolDesc: "ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ಗಳಿಂದ ಪಠ್ಯವನ್ನು ಹೊರತೆಗೆದು ನಕಲಿ ಬ್ಯಾಂಕಿಂಗ್ ಪರದೆಗಳು ಅಥವಾ QR ಕೋಡ್‌ಗಳನ್ನು ಗುರುತಿಸಿ.",
      assistantToolTitle: "ಧ್ವನಿ AI ಭದ್ರತಾ ಸಹಾಯಕ",
      assistantToolDesc: "ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಭದ್ರತಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ಮತ್ತು ತಕ್ಷಣ ಪರಿಹಾರ ಪಡೆಯಿರಿ.",
      liveAlertsFeed: "ಲೈವ್ ಸೈಬರ್ ಬೆದರಿಕೆ ಎಚ್ಚರಿಕೆ ಫೀಡ್",
      recentScans: "ಇತ್ತೀಚಿನ ವಿಧಿವಿಜ್ಞಾನ ಸ್ಕ್ಯಾನ್‌ಗಳು",
      viewHistory: "ಸಂಪೂರ್ಣ ಇತಿಹಾಸ ವೀಕ್ಷಿಸಿ",
      noScansYet: "ಇನ್ನೂ ಯಾವುದೇ ಸ್ಕ್ಯಾನ್ ದಾಖಲಾಗಿಲ್ಲ. ಮೇಲೆ ನೀಡಿರುವ ಟೂಲ್‌ಗಳ ಮೂಲಕ ಮೊದಲ ಸ್ಕ್ಯಾನ್ ಪ್ರಾರಂಭಿಸಿ.",
      mitigation: "ಪರಿಹಾರ ಕ್ರಮ",
    },
    emailAnalyzer: {
      title: "AI ಇಮೇಲ್ ಬೆದರಿಕೆ ವಿಶ್ಲೇಷಕ",
      subtitle: "ಇಮೇಲ್ ಹೆಡರ್‌ಗಳು, SPF/DKIM/DMARC ದೃಢೀಕರಣ, ನಕಲಿ ಕಳುಹಿಸುವವರ ಡೊಮೇನ್ ಮತ್ತು ಫಿಶಿಂಗ್ ಲಿಂಕ್‌ಗಳ ತನಿಖೆ.",
      presetsLabel: "ಪರೀಕ್ಷಾ ಮಾದರಿಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
      senderLabel: "ಕಳುಹಿಸುವವರ ಇಮೇಲ್ ವಿಳಾಸ",
      senderPlaceholder: "ಉದಾ. support@micr0soft-security.xyz",
      recipientLabel: "ಸ್ವೀಕರಿಸುವವರ ಇಮೇಲ್",
      recipientPlaceholder: "ಉದಾ. employee@company.com",
      subjectLabel: "ಇಮೇಲ್ ವಿಷಯ",
      subjectPlaceholder: "ಉದಾ. ತುರ್ತು: ನಿಮ್ಮ ಖಾತೆ 2 ಗಂಟೆಗಳಲ್ಲಿ ರದ್ದಾಗಲಿದೆ",
      headersLabel: "ಕಚ್ಚಾ ಇಮೇಲ್ ಹೆಡರ್ (ಐಚ್ಛಿಕ)",
      headersPlaceholder: "Received:, Authentication-Results:, SPF, DKIM ಹೆಡರ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ...",
      bodyLabel: "ಇಮೇಲ್ ಮುಖ್ಯ ವಿಷಯ",
      bodyPlaceholder: "ಇಮೇಲ್‌ನ ಪೂರ್ಣ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ...",
      analyzeBtn: "AI ಬೆದರಿಕೆ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ",
      analyzingBtn: "ಬೆದರಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
      exportReportBtn: "ವರದಿಯನ್ನು ರಫ್ತು ಮಾಡಿ",
      summaryTab: "ವಿಧಿವಿಜ್ಞಾನ ಸಾರಾಂಶ",
      urlsTab: "URL ಮತ್ತು ಡೊಮೇನ್ ತಪಾಸಣೆ",
      headersTab: "ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಹೆಡರ್‌ಗಳು",
      recommendationsTab: "ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ",
      evidenceFound: "ದೃಢಪಟ್ಟ ಪುರಾವೆಗಳು",
      uncertainFactors: "ಅನಿಶ್ಚಿತ ಅಂಶಗಳು",
    },
    scamDetector: {
      title: "ವಂಚನೆ ಸಂದೇಶ ಪತ್ತೆಕಾರಕ",
      subtitle: "SMS, WhatsApp ಅಥವಾ Telegram ನಲ್ಲಿ ಬರುವ ನಕಲಿ UPI ವಿನಂತಿಗಳು, ವಿದ್ಯುತ್ ಬಿಲ್ ಬೆದರಿಕೆ ಮತ್ತು ಲಾಟರಿ ವಂಚನೆಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ.",
      presetsLabel: "ನೈಜ ವಂಚನೆ ಮಾದರಿಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ:",
      platformLabel: "ಸಂದೇಶದ ಮೂಲ (ಪ್ಲಾಟ್‌ಫಾರ್ಮ್)",
      senderLabel: "ಕಳುಹಿಸುವವರ ಹೆಸರು ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      senderPlaceholder: "ಉದಾ. +91 98765 43210 ಅಥವಾ IND-ALERT",
      messageLabel: "ಸಂದೇಶದ ವಿಷಯ",
      messagePlaceholder: "ಅನುಮಾನಾಸ್ಪದ SMS ಅಥವಾ WhatsApp ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ...",
      analyzeBtn: "ವಂಚನೆಯ ಲಕ್ಷಣಗಳನ್ನು ಪತ್ತೆಮಾಡಿ",
      analyzingBtn: "ತಂತ್ರಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
      exportReportBtn: "ವರದಿಯನ್ನು ರಫ್ತು ಮಾಡಿ",
      whyDetected: "ಪತ್ತೆಯಾಗಲು ಪ್ರಮುಖ ಕಾರಣ",
      tacticsDetected: "ಸಾಮಾಜಿಕ ಎಂಜಿನಿಯರಿಂಗ್ ತಂತ್ರಗಳು",
      paymentRequests: "ಅನುಮಾನಾಸ್ಪದ ಪಾವತಿ / UPI ವಿನಂತಿಗಳು",
      suspiciousUrls: "ಪತ್ತೆಯಾದ ಅಪಾಯಕಾರಿ ಲಿಂಕ್‌ಗಳು",
      recommendedAction: "ಶಿಫಾರಸು ಮಾಡಿದ ರಕ್ಷಣಾ ಕ್ರಮ",
    },
    screenshotScanner: {
      title: "ಸ್ಕ್ರೀನ್‌ಶಾಟ್ OCR ಸ್ಕ್ಯಾನರ್",
      subtitle: "ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ನಲ್ಲಿರುವ ಪಠ್ಯವನ್ನು ಓದಿ ನಕಲಿ ಬ್ಯಾಂಕ್ ಸಂದೇಶಗಳು, ನಕಲಿ ಪಾವತಿ ರಸೀದಿಗಳು ಮತ್ತು ಲಾಗಿನ್ ವಂಚನೆಗಳನ್ನು ಪತ್ತೆಮಾಡಿ.",
      dropzoneText: "ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಇಲ್ಲಿ ಎಳೆಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
      dropzoneSubtext: "JPG, PNG 10MB ವರೆಗೆ ಬೆಂಬಲಿತವಾಗಿದೆ. ಪಠ್ಯವನ್ನು ಗೌಪ್ಯತೆ-ರಕ್ಷಿತ OCR ಮೂಲಕ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತದೆ.",
      presetsLabel: "ಅಥವಾ ಮಾದರಿಯೊಂದಿಗೆ ಪರೀಕ್ಷಿಸಿ:",
      extractedText: "ಹೊರತೆಗೆದ ಪಠ್ಯ (OCR)",
      detectedIndicators: "ಗುರುತಿಸಲಾದ ಬೆದರಿಕೆ ಸೂಚಕಗಳು",
      explanation: "ವಿಧಿವಿಜ್ಞಾನ ವಿಶ್ಲೇಷಣೆ",
      scanBtn: "ವಿಧಿವಿಜ್ಞಾನ OCR ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ",
      scanningBtn: "ದೃಶ್ಯ ಸೂಚಕಗಳನ್ನು ಹೊರತೆಗೆಯಲಾಗುತ್ತಿದೆ...",
      exportReportBtn: "ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ವರದಿ ರಫ್ತು ಮಾಡಿ",
    },
    awarenessCenter: {
      title: "ವಂಚನೆ ಜಾಗೃತಿ ಮತ್ತು ಸೈಬರ್ ಭದ್ರತಾ ಕೇಂದ್ರ",
      subtitle: "ನೈಜ ಜಗತ್ತಿನ ಸೈಬರ್ ವಂಚನೆಗಳು, ಎಚ್ಚರಿಕೆ ಚಿಹ್ನೆಗಳು ಮತ್ತು ರಕ್ಷಣಾ ನಿಯಮಗಳನ್ನು ತಿಳಿದುಕೊಳ್ಳಿ.",
      ruleTitle: "ಡಿಜಿಟಲ್ ಭದ್ರತೆಯ ಸುವರ್ಣ ನಿಯಮ",
      ruleText: "UPI PIN ಕೇವಲ ಹಣ ಕಳುಹಿಸಲು ಮಾತ್ರ ಬೇಕು, ಹಣ ಪಡೆಯಲು ಎಂದಿಗೂ ಅಗತ್ಯವಿಲ್ಲ. ಯಾವುದೇ ಬ್ಯಾಂಕ್ ಅಥವಾ ಸರ್ಕಾರಿ ಅಧಿಕಾರಿಗಳು ಫೋನ್‌ನಲ್ಲಿ OTP ಕೇಳುವುದಿಲ್ಲ ಅಥವಾ ವೈಯಕ್ತಿಕ UPI ಖಾತೆಗೆ ಹಣ ಕೇಳುವುದಿಲ್ಲ.",
      warningSigns: "ಎಚ್ಚರಿಕೆ ಚಿಹ್ನೆಗಳು",
      preventionTips: "ರಕ್ಷಣಾ ಸಲಹೆಗಳು",
      testInDetector: "ಈ ಸನ್ನಿವೇಶವನ್ನು ಸ್ಕ್ಯಾಮ್ ಡಿಟೆಕ್ಟರ್‌ನಲ್ಲಿ ಪರೀಕ್ಷಿಸಿ",
    },
    assistant: {
      welcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸೈಬರ್ ಶೀಲ್ಡ್ AI ಭದ್ರತಾ ಸಹಾಯಕ. ಕನ್ನಡ, ಹಿಂದಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ—ನಾನು ನಿಮಗೆ ರಕ್ಷಣಾ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇನೆ.",
      inputPlaceholder: "ಸೈಬರ್ ಭದ್ರತಾ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ ಅಥವಾ ಸಂದೇಶ ಅಂಟಿಸಿ...",
      listening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ... ಈಗ ಮಾತನಾಡಿ",
      clickToSpeak: "ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ",
      ttsToggle: "ಧ್ವನಿಯಲ್ಲಿ ಉತ್ತರ (TTS)",
      tryAsking: "ಕೇಳಿ ನೋಡಿ:",
      suggestions: [
        "ಈ ಸಂದೇಶ ವಂಚನೆಯೇ?",
        "ಈ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ",
        "ಫಿಶಿಂಗ್ ಎಂದರೇನು?",
        "UPI ಸುರಕ್ಷತೆಯ ನಿಯಮಗಳು ತಿಳಿಸಿ",
        "ಸ್ಕ್ಯಾಮ್ ಡಿಟೆಕ್ಟರ್ ತೆರೆಯಿರಿ",
        "ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಸ್ಕ್ಯಾನರ್ ತೆರೆಯಿರಿ",
      ],
    },
    settings: {
      title: "ಕಮಾಂಡ್ ಸೆಂಟರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      subtitle: "ಭಾಷೆ, ಆಪರೇಟರ್ ಪ್ರೊಫೈಲ್, ಧ್ವನಿ ಸಹಾಯಕ ಮತ್ತು ಭದ್ರತಾ ನಿಯಂತ್ರಣಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
      languageHeader: "ಭಾಷೆ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಆದ್ಯತೆಗಳು",
      languageSubtext: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಇಡೀ ಅಪ್ಲಿಕೇಶನ್, ಬೆದರಿಕೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಧ್ವನಿ ಸಹಾಯಕ ಆ ಭಾಷೆಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತವೆ.",
      profileHeader: "ಆಪರೇಟರ್ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಹುದ್ದೆ",
      displayName: "ಪ್ರದರ್ಶನದ ಹೆಸರು",
      role: "ಹುದ್ದೆ / ಜವಾಬ್ದಾರಿ",
      organization: "ಸಂಸ್ಥೆ / ವಿಭಾಗ",
      saveProfile: "ಪ್ರೊಫೈಲ್ ವಿವರ ಉಳಿಸಿ",
      profileSaved: "ವಿವರಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ.",
      securityControls: "ಭದ್ರತೆ ಮತ್ತು ಇಂಟರ್ಫೇಸ್ ನಿಯಂತ್ರಣಗಳು",
      mfaTitle: "ಮಲ್ಟಿ-ಫ್ಯಾಕ್ಟರ್ ದೃಢೀಕರಣ (MFA)",
      mfaDesc: "ಖಾತೆಯ ಪ್ರಮುಖ ಕಾರ್ಯಗಳಿಗೆ ಹೆಚ್ಚುವರಿ ದೃಢೀಕರಣ ಜಾರಿಗೊಳಿಸಿ.",
      ttsTitle: "ಧ್ವನಿ ಸಹಾಯಕ ಧ್ವನಿ (TTS)",
      ttsDesc: "AI ವಿಶ್ಲೇಷಣೆಯನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಲು ಆನ್ ಮಾಡಿ.",
      alertsTitle: "ಲೈವ್ ಬೆದರಿಕೆ ಡೆಮೊ ಫೀಡ್",
      alertsDesc: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಶೈಕ್ಷಣಿಕ ಸೈಬರ್ ಬೆದರಿಕೆ ಎಚ್ಚರಿಕೆಗಳನ್ನು ನಿರಂತರವಾಗಿ ತೋರಿಸಿ.",
      enabled: "ಸಕ್ರಿಯ",
      disabled: "ನಿಷ್ಕ್ರಿಯ",
    },
    messagePresets: [
      {
        id: "bescom-bill-kn",
        label: "ವಿದ್ಯುತ್ ಬಿಲ್ ಕಡಿತ ವಂಚನೆ SMS",
        platform: "SMS",
        sender: "+91 98765 43210",
        message: "ಆತ್ಮೀಯ ಗ್ರಾಹಕರೇ, ನಿಮ್ಮ ವಿದ್ಯುತ್ ಬಿಲ್ ಬಾಕಿ ಇರುವುದರಿಂದ ಇಂದು ರಾತ್ರಿ 9:30 ಕ್ಕೆ ನಿಮ್ಮ ವಿದ್ಯುತ್ ಸಂಪರ್ಕವನ್ನು ಕಡಿತಗೊಳಿಸಲಾಗುವುದು. ದಯವಿಟ್ಟು ತಕ್ಷಣ ನಮ್ಮ ಅಧಿಕಾರಿಗೆ 9876543210 ಕರೆ ಮಾಡಿ ಅಥವಾ ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ: http://bit.ly/bescom-bill-update",
      },
      {
        id: "upi-reward-kn",
        label: "UPI ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್ ಪಿನ್ ಮೋಸ",
        platform: "WhatsApp",
        sender: "+91 91234 55678",
        message: "ಅಭಿನಂದನೆಗಳು! PhonePe / Google Pay ನಲ್ಲಿ ನಿಮಗೆ ₹4,500 ಹಬ್ಬದ ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್ ಬಂದಿದೆ. ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹಣ ಪಡೆಯಲು ನಿಮ್ಮ 4-ಅಂಕಿಯ UPI PIN ಅನ್ನು ನಮೂದಿಸಿ: https://cashback-upi-claim.xyz",
      },
      {
        id: "job-offer-kn",
        label: "ಪಾರ್ಟ್ ಟೈಮ್ ಉದ್ಯೋಗ ವಂಚನೆ",
        platform: "Telegram",
        sender: "@HR_Global_Recruiter",
        message: "ನಮಸ್ಕಾರ! ಪ್ರತಿದಿನ ಯೂಟ್ಯೂಬ್ ವೀಡಿಯೊಗಳನ್ನು ಲೈಕ್ ಮಾಡುವ ಮೂಲಕ ಮನೆಯಿಂದಲೇ ₹3,000 ರಿಂದ ₹7,000 ಗಳಿಸಿ. ಯಾವುದೇ ಅನುಭವ ಅಗತ್ಯವಿಲ್ಲ. ನಮ್ಮ ಟೆಲಿಗ್ರಾಮ್ ಗುಂಪಿಗೆ ಸೇರಿ VIP ಟಾಸ್ಕ್ ಪಡೆಯಲು ₹1,000 ನೋಂದಣಿ ಶುಲ್ಕ ಪಾವತಿಸಿ: https://t.me/kannada_job_offers",
      },
      {
        id: "bank-kyc-kn",
        label: "ಬ್ಯಾಂಕ್ ಕೆವೈಸಿ ಅಪ್‌ಡೇಟ್ SMS",
        platform: "SMS",
        sender: "+91 89234 11092",
        message: "ಗ್ರಾಹಕರೇ, ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಯ KYC ಅವಧಿ ಮುಗಿದಿದೆ. ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಇಂದು ನಿರ್ಬಂಧಿಸಲಾಗುವುದು. ತಕ್ಷಣ ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಪರಿಶೀಲಿಸಿ: http://bit.ly/kannada-bank-kyc",
      },
      {
        id: "legit-otp-kn",
        label: "ಸುರಕ್ಷಿತ: ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ OTP",
        platform: "SMS",
        sender: "VM-HDFCBK",
        message: "782104 ನಿಮ್ಮ ನೆಟ್‌ಬ್ಯಾಂಕಿಂಗ್ ಲಾಗಿನ್‌ಗಾಗಿ ರಹಸ್ಯ OTP ಆಗಿದೆ. ಈ ರಹಸ್ಯ ಸಂಖ್ಯೆಯನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ. ಬ್ಯಾಂಕ್ ಸಿಬ್ಬಂದಿ ಎಂದಿಗೂ OTP ಕೇಳುವುದಿಲ್ಲ.",
      },
    ],
    scamCards: [
      {
        id: "phishing",
        title: "ಫಿಶಿಂಗ್ (Phishing)",
        category: "ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು ಐಡೆಂಟಿಟಿ ಕಳ್ಳತನ",
        explanation: "ಮೋಸಗಾರರು ಅಧಿಕೃತ ಸಂಸ್ಥೆಗಳಂತೆ ನಟಿಸಿ ನಕಲಿ ವೆಬ್‌ಸೈಟ್‌ಗಳ ಲಿಂಕ್ ಕಳುಹಿಸುತ್ತಾರೆ, ಇದರಿಂದ ನೀವು ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ ಬ್ಯಾಂಕಿಂಗ್ ವಿವರಗಳನ್ನು ನಮೂದಿಸುವಂತೆ ಮಾಡುತ್ತಾರೆ.",
        warningSigns: [
          "ನೈಜ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಹೋಲುವ ನಕಲಿ ಡೊಮೇನ್‌ಗಳು (ಉದಾ. micr0soft-support.xyz)",
          "ಖಾತೆಯನ್ನು 24 ಗಂಟೆಗಳಲ್ಲಿ ರದ್ದುಗೊಳಿಸುವ ತುರ್ತು ಬೆದರಿಕೆಗಳು",
          "ಅಪರಿಚಿತ ಇಮೇಲ್ ವಿಳಾಸಗಳು ಮತ್ತು ಅನುಮಾನಾಸ್ಪದ ಹೆಡರ್‌ಗಳು",
        ],
        preventionTips: [
          "ಅಪರಿಚಿತ ಇಮೇಲ್‌ಗಳಲ್ಲಿ ಬರುವ ಲಿಂಕ್‌ಗಳನ್ನು ಎಂದಿಗೂ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ.",
          "ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸುವ ಮುನ್ನ ಬ್ರೌಸರ್ ವಿಳಾಸ ಪಟ್ಟಿಯಲ್ಲಿ ವೆಬ್‌ಸೈಟ್ ಡೊಮೇನ್ ಸರಿಯಾಗಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ.",
          "ಅಧಿಕೃತ ಆಪ್ ಬಳಸಿ ಟು-ಫ್ಯಾಕ್ಟರ್ ದೃಢೀಕರಣ (2FA) ಸಕ್ರಿಯಗೊಳಿಸಿ.",
        ],
        exampleScenario: "ತುರ್ತು ಸೂಚನೆ: ನಿಮ್ಮ ಖಾತೆ ಇಂದು ನಿಷ್ಕ್ರಿಯಗೊಳ್ಳುತ್ತದೆ. ತಕ್ಷಣ ಪಾಸ್‌ವರ್ಡ್ ಪರಿಶೀಲಿಸಿ: http://login-micr0soft.click",
      },
      {
        id: "upi-fraud",
        title: "UPI ಮತ್ತು ಡಿಜಿಟಲ್ ಪಾವತಿ ವಂಚನೆ",
        category: "ಹಣಕಾಸು ವಂಚನೆ",
        explanation: "ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್ ಅಥವಾ ಬಹುಮಾನ ನೀಡುವ ನೆಪದಲ್ಲಿ UPI 'Collect' ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸಿ, ಹಣ ಪಡೆಯಲು UPI PIN ನಮೂದಿಸುವಂತೆ ವಂಚಕರು ನಂಬಿಸುತ್ತಾರೆ.",
        warningSigns: [
          "ಹಣ 'ಪಡೆಯಲು' UPI PIN ನಮೂದಿಸುವಂತೆ ಕೇಳುವುದು.",
          "QR ಕೋಡ್ ಕಳುಹಿಸಿ 'ಇದನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿದರೆ ನಿಮ್ಮ ಖಾತೆಗೆ ಹಣ ಬರುತ್ತದೆ' ಎಂದು ಹೇಳುವುದು.",
          "ತಪ್ಪಾಗಿ ಹಣ ವರ್ಗಾವಣೆಯಾಗಿದೆ ಎಂದು ನಕಲಿ ಕರೆಗಳನ್ನು ಮಾಡುವುದು.",
        ],
        preventionTips: [
          "ನೆನಪಿಡಿ: UPI PIN ಹಣ ಕಳುಹಿಸಲು ಅಥವಾ ಕಡಿತಗೊಳಿಸಲು ಮಾತ್ರ, ಹಣ ಸ್ವೀಕರಿಸಲು ಎಂದಿಗೂ ಅಲ್ಲ.",
          "ಅಪರಿಚಿತರು ಕಳುಹಿಸಿದ QR ಕೋಡ್‌ಗಳನ್ನು ಹಣ ಪಡೆಯಲು ಎಂದಿಗೂ ಸ್ಕ್ಯಾನ್ ಮಾಡಬೇಡಿ.",
          "ವಂಚನೆ ನಡೆದರೆ ತಕ್ಷಣವೇ ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಹೆಲ್ಪ್‌ಲೈನ್ 1930 ಗೆ ದೂರು ನೀಡಿ.",
        ],
        exampleScenario: "ಅಭಿನಂದನೆಗಳು! ನಿಮಗೆ ₹5,000 ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್ ಬಂದಿದೆ. ಹಣ ಪಡೆಯಲು ನಿಮ್ಮ UPI PIN ಹಾಕಿ: https://upi-reward.xyz",
      },
      {
        id: "work-from-home",
        title: "ಮನೆಯಿಂದ ಕೆಲಸ ಮಾಡುವ ಉದ್ಯೋಗ ವಂಚನೆ",
        category: "ಮುಂಗಡ ಶುಲ್ಕ ವಂಚನೆ",
        explanation: "ಯೂಟ್ಯೂಬ್ ವೀಡಿಯೊ ಲೈಕ್ ಮಾಡಲು ಅಥವಾ ರೇಟಿಂಗ್ ನೀಡಲು ದಿನಕ್ಕೆ ಸಾವಿರಾರು ರೂಪಾಯಿ ನೀಡುವುದಾಗಿ ಆಮಿಷವೊಡ್ಡಿ, ನಂತರ ಹೆಚ್ಚಿನ ಠೇವಣಿ ಹಣ ಕೇಳಿ ವಂಚಿಸುತ್ತಾರೆ.",
        warningSigns: [
          "ಕೇವಲ 5 ನಿಮಿಷಗಳ ಕೆಲಸಕ್ಕೆ ದಿನಕ್ಕೆ ₹3,000 ರಿಂದ ₹8,000 ಅಸಾಧ್ಯ ಆದಾಯದ ಭರವಸೆ.",
          "ಕೇವಲ ಟೆಲಿಗ್ರಾಮ್ ಅಥವಾ ಅಪರಿಚಿತ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಮಾತ್ರ ಸಂಭಾಷಣೆ.",
          "ಗಳಿಸಿದ ಹಣವನ್ನು ಹಿಂಪಡೆಯಲು 'ಭದ್ರತಾ ಠೇವಣಿ' ಅಥವಾ 'ಕ್ರಿಪ್ಟೋ ರಿಚಾರ್ಜ್' ಕೇಳುವುದು.",
        ],
        preventionTips: [
          "ಯಾವುದೇ ಅಧಿಕೃತ ಕಂಪನಿಯು ಉದ್ಯೋಗ ನೀಡಲು ನಿಮ್ಮಿಂದ ಹಣ ಕೇಳುವುದಿಲ್ಲ.",
          "ದಿನನಿತ್ಯದ ಭಾರಿ ಲಾಭದ ಭರವಸೆ ನೀಡುವ ಟೆಲಿಗ್ರಾಮ್ ಗುಂಪುಗಳಿಂದ ದೂರವಿರಿ.",
          "ಅಪರಿಚಿತ ವಿದೇಶಿ ಸಂಖ್ಯೆಗಳಿಂದ (+92, +84, +62) ಬರುವ ಜಾಬ್ ಆಫರ್ ಸಂದೇಶಗಳನ್ನು ತಕ್ಷಣ ನಿರ್ಬಂಧಿಸಿ (Block).",
        ],
        exampleScenario: "ಮನೆಯಿಂದಲೇ ಯೂಟ್ಯೂಬ್ ವೀಡಿಯೊ ಲೈಕ್ ಮಾಡಿ ದಿನಕ್ಕೆ ₹5,000 ಗಳಿಸಿ. ವಿಐಪಿ ಗ್ರೂಪ್ ಸೇರಲು ₹2,000 ಪಾವತಿಸಿ.",
      },
      {
        id: "electricity-bill",
        title: "ವಿದ್ಯುತ್ ಬಿಲ್ ಕಡಿತ ಬೆದರಿಕೆ ವಂಚನೆ",
        category: "ತುರ್ತು ಭಯದ ವಂಚನೆ",
        explanation: "ನಿಮ್ಮ ವಿದ್ಯುತ್ ಬಿಲ್ ಬಾಕಿ ಇದೆ, ಇಂದು ರಾತ್ರಿ 9:30 ಕ್ಕೆ ವಿದ್ಯುತ್ ಸಂಪರ್ಕ ಕಡಿತಗೊಳಿಸಲಾಗುವುದು ಎಂದು ನಕಲಿ SMS ಕಳುಹಿಸಿ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಲು ಒತ್ತಾಯಿಸುತ್ತಾರೆ.",
        warningSigns: [
          "ಅಧಿಕೃತ ಬೆಸ್ಕಾಂ (BESCOM) ಅಥವಾ ಮೆಸ್ಕಾಂ ಹೆಡರ್ ಬದಲು ಸಾಮಾನ್ಯ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯಿಂದ SMS ಬರುವುದು.",
          "ಕೆಲವೇ ಗಂಟೆಗಳಲ್ಲಿ ವಿದ್ಯುತ್ ಕಡಿತ ಮಾಡುವ ತುರ್ತು ಬೆದರಿಕೆ ಹಾಕುವುದು.",
          "ಅಪರಿಚಿತ ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಲು ಅಥವಾ AnyDesk / TeamViewer ಆಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಹೇಳುವುದು.",
        ],
        preventionTips: [
          "ವಿದ್ಯುತ್ ಬಿಲ್ ಸ್ಥಿತಿಯನ್ನು ಕೇವಲ ಅಧಿಕೃತ ಬೆಸ್ಕಾಂ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಆಪ್‌ನಲ್ಲಿ ಮಾತ್ರ ಪರಿಶೀಲಿಸಿ.",
          "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಯಾರಾದರೂ ಕಳುಹಿಸಿದ APK ಆಪ್‌ಗಳನ್ನು ಎಂದಿಗೂ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಬೇಡಿ.",
          "ವೈಯಕ್ತಿಕ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗಳಿಂದ ಬರುವ ವಿದ್ಯುತ್ ಕಡಿತದ ಬೆದರಿಕೆಗಳನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ನಿರ್ಲಕ್ಷಿಸಿ.",
        ],
        exampleScenario: "ಗ್ರಾಹಕರೇ, ನಿಮ್ಮ ವಿದ್ಯುತ್ ಬಿಲ್ ಪಾವತಿಯಾಗದ ಕಾರಣ ಇಂದು ರಾತ್ರಿ 9:30 ಕ್ಕೆ ವಿದ್ಯುತ್ ಕಡಿತವಾಗಲಿದೆ. ತಕ್ಷಣ 9876543210 ಗೆ ಸಂಪರ್ಕಿಸಿ.",
      },
    ],
  },
};
