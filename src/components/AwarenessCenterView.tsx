import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import {
  BookOpen,
  ShieldCheck,
  KeyRound,
  Smartphone,
  ShoppingBag,
  TrendingUp,
  Briefcase,
  FileWarning,
  Gift,
  Truck,
  UserCheck,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface AwarenessCenterViewProps {
  onTestScenarioInDetector: (sampleMessage: string) => void;
}

interface ScamAwarenessCardData {
  id: string;
  title: string;
  category: string;
  explanation: string;
  warningSigns: string[];
  preventionTips: string[];
  exampleScenario: string;
  accent: string;
  icon: React.ReactNode;
}

const SCAM_AWARENESS_CARDS: ScamAwarenessCardData[] = [
  {
    id: "phishing",
    title: "Phishing",
    category: "Credential Harvesting",
    explanation:
      "Attackers send deceptive emails or messages impersonating trusted brands to trick you into entering passwords, credit card numbers, or SSO tokens on fake login pages.",
    warningSigns: [
      "Lookalike sender domains (e.g., micr0soft-support.xyz)",
      "Urgent threats of account suspension within 24 hours",
      "Generic greetings and mismatched Reply-To headers",
    ],
    preventionTips: [
      "Always inspect the full sender address and SPF/DKIM status",
      "Never log in via links inside unexpected emails—use bookmarks",
      "Use hardware security keys or password managers that verify domain origin",
    ],
    exampleScenario:
      "URGENT: Your corporate workspace password expires in 2 hours. Verify your account at https://workspace-login-verify.xyz to prevent lockout.",
    accent: "border-cyan-500/30 hover:border-cyan-400",
    icon: <KeyRound className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: "otp-fraud",
    title: "OTP Fraud",
    category: "Account Takeover",
    explanation:
      "Scammers call or message posing as bank staff, courier agents, or buyers, inventing a pretext so you read aloud or forward a 6-digit One-Time Password.",
    warningSigns: [
      "Caller claims an OTP is needed to 'cancel' a charge or 'confirm' a delivery",
      "Message asks you to forward an SMS code to another number",
      "Unexpected OTP arrives right before a phone call from 'support'",
    ],
    preventionTips: [
      "Never share an OTP with anyone—even someone claiming to be bank security",
      "Read the full SMS text: legitimate OTPs state what transaction they authorize",
      "Hang up immediately and call the official number on the back of your card",
    ],
    exampleScenario:
      "Dear Customer, a debit of ₹28,000 is initiated. If not done by you, immediately share the 6-digit cancellation OTP sent to your mobile with our officer at +91 9811022334.",
    accent: "border-red-500/30 hover:border-red-400",
    icon: <Smartphone className="w-5 h-5 text-red-400" />,
  },
  {
    id: "upi-scam",
    title: "UPI Scam",
    category: "Payment Reversal Trick",
    explanation:
      "Fraudsters send a 'Collect Request' or QR code and falsely claim that approving it and entering your UPI PIN will credit cashback or buyer payment to your account.",
    warningSigns: [
      "Instructions to 'Enter UPI PIN to receive money or cashback'",
      "QR codes sent on WhatsApp claiming to be refund vouchers",
      "Fake payment screenshots followed by a request to 'refund extra money'",
    ],
    preventionTips: [
      "Remember the golden rule: Entering a UPI PIN ALWAYS deducts money, never receives it",
      "Verify credits in your actual bank statement, not via SMS screenshots",
      "Decline unknown collect requests inside GPay, PhonePe, or Paytm",
    ],
    exampleScenario:
      "Congratulations! You won ₹4,999 festival cashback on PhonePe. Click Approve and enter your 4-digit UPI PIN to receive ₹4,999 in your bank account: https://reward-claim-upi.xyz",
    accent: "border-amber-500/30 hover:border-amber-400",
    icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
  },
  {
    id: "fake-shopping",
    title: "Fake Shopping",
    category: "E-Commerce Fraud",
    explanation:
      "Cloned storefront websites and social media ads offering flagship electronics or luxury goods at 80–90% discounts that accept only prepaid UPI/bank transfers and never ship.",
    warningSigns: [
      "Unbelievable discounts (e.g., iPhone or MacBook for ₹3,999)",
      "Cash-on-Delivery (COD) is disabled or requires an upfront 'booking fee'",
      "Recently registered domain name (.shop, .store, .xyz) with no verified address",
    ],
    preventionTips: [
      "Research domain age and independent customer reviews before purchasing",
      "Avoid paying via direct UPI transfer to unknown web stores",
      "Use credit cards with chargeback protection on verified marketplaces",
    ],
    exampleScenario:
      "FLASH CLEARANCE SALE! Get Sony WH-1000XM5 Headphones for just ₹1,499 today (92% OFF)! Prepaid orders only, hurry before stock ends: https://mega-gadget-clearance.top",
    accent: "border-sky-500/30 hover:border-sky-400",
    icon: <ShoppingBag className="w-5 h-5 text-sky-400" />,
  },
  {
    id: "investment-scam",
    title: "Investment Scam",
    category: "Financial / Crypto Fraud",
    explanation:
      "Fake trading apps and WhatsApp/Telegram 'VIP stock/crypto signal groups' showing fabricated dashboard profits, then blocking withdrawals unless hefty 'tax fees' are paid.",
    warningSigns: [
      "Promises of guaranteed 200%–500% returns with zero risk",
      "Added to unsolicited WhatsApp groups filled with bots posting profit screenshots",
      "Directed to download an unlisted trading APK or deposit to personal accounts",
    ],
    preventionTips: [
      "Verify broker registration with official regulators (SEBI / SEC / FINRA)",
      "Never install investment apps via APK links or TestFlight invites from strangers",
      "Remember that legitimate brokers deduct taxes automatically—never via upfront fee demands",
    ],
    exampleScenario:
      "Join our VIP Institutional Crypto & Stock Signals group! Guaranteed 200% weekly profit with zero risk. Deposit ₹10,000 today and withdraw ₹30,000 tomorrow: https://vip-wealth-trade.xyz",
    accent: "border-emerald-500/30 hover:border-emerald-400",
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
  },
  {
    id: "fake-job-scam",
    title: "Fake Job Scam",
    category: "Task & Recruitment Fraud",
    explanation:
      "Recruiters on WhatsApp or Telegram offer easy 'work-from-home' tasks (liking YouTube videos, rating hotels), pay small initial rewards, and then trap victims in high-value 'prepaid task' deposits.",
    warningSigns: [
      "High daily pay (₹3,000–₹8,000/day) for trivial 5-minute clicking tasks",
      "Requests a 'security deposit', 'registration fee', or 'prepaid task top-up'",
      "Recruiter communicates strictly via Telegram handles with no corporate email",
    ],
    preventionTips: [
      "Legitimate employers pay you—they never ask you to deposit money to unlock work",
      "Verify recruitment offers on the company's official careers domain",
      "Stop immediately if a task platform asks you to top up funds to withdraw earnings",
    ],
    exampleScenario:
      "Hello! Part-time work from home opportunity: Earn ₹5,000 daily by liking YouTube videos and rating Google Maps hotels. Pay ₹1,000 VIP activation fee on Telegram: https://t.me/hr_task_payouts",
    accent: "border-cyan-500/30 hover:border-cyan-400",
    icon: <Briefcase className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: "kyc-scam",
    title: "KYC Scam",
    category: "Bank & Utility Impersonation",
    explanation:
      "Messages claiming your bank account, SIM card, FASTag, or electricity connection will be disconnected tonight unless you click a link or install a remote-access app.",
    warningSigns: [
      "Sent from a standard 10-digit personal mobile number instead of an official header",
      "Asks you to install screen-sharing apps (AnyDesk, TeamViewer, RustDesk) or APK files",
      "Threatens immediate account freeze or power cut at 9:30 PM tonight",
    ],
    preventionTips: [
      "Complete KYC only inside your official banking app or by visiting a physical branch",
      "Never install screen-sharing tools at the request of a support caller",
      "Check official utility portals directly using your consumer number",
    ],
    exampleScenario:
      "Dear Customer, Your SBI Account & PAN Card KYC has expired today. Your account will be blocked within 24 hours. Click http://bit.ly/sbi-kyc-fast-update immediately to update.",
    accent: "border-amber-500/30 hover:border-amber-400",
    icon: <FileWarning className="w-5 h-5 text-amber-400" />,
  },
  {
    id: "lottery-scam",
    title: "Lottery Scam",
    category: "Advance-Fee Fraud",
    explanation:
      "Notifications claiming your phone number or email won a massive lottery, car, or government grant, requiring you to pay 'customs clearance' or 'GST processing charges' first.",
    warningSigns: [
      "You won a lottery or lucky draw you never entered",
      "Demands an upfront 'processing fee' or 'tax transfer' before releasing the prize",
      "Uses forged celebrity or government emblems on WhatsApp audio/images",
    ],
    preventionTips: [
      "You cannot win a legitimate lottery without buying a ticket",
      "Never pay advance fees to claim a prize or reward",
      "Block numbers sending unsolicited lucky-draw voice notes",
    ],
    exampleScenario:
      "CONGRATULATIONS! Your mobile number won ₹25,00,000 in the KBC Mega Lucky Draw! Pay ₹4,500 GST processing charge via UPI to claim prize immediately: https://kbc-prize-claim.xyz",
    accent: "border-rose-500/30 hover:border-rose-400",
    icon: <Gift className="w-5 h-5 text-rose-400" />,
  },
  {
    id: "delivery-scam",
    title: "Delivery Scam",
    category: "Parcel & Customs Phishing",
    explanation:
      "SMS messages claiming a package from India Post, FedEx, or DHL is undeliverable due to an 'incomplete address', luring you to pay a small fee on a credit-card harvesting page.",
    warningSigns: [
      "Requests a nominal fee (₹25–₹99) on an unfamiliar domain (.top, .xyz, .live)",
      "Automated phone calls claiming customs seized an illegal parcel in your name",
      "Tracking link does not match the official courier website",
    ],
    preventionTips: [
      "Check order status directly inside the shopping app where you placed the order",
      "Law enforcement and customs never conduct interrogations over WhatsApp video calls",
      "Inspect the URL hostname carefully before entering card details",
    ],
    exampleScenario:
      "India Post: Your parcel #IN9928104 delivery failed due to incomplete street address. Update address and pay ₹49 redelivery fee within 12 hours: https://indiapost-track-parcel.top/pay",
    accent: "border-sky-500/30 hover:border-sky-400",
    icon: <Truck className="w-5 h-5 text-sky-400" />,
  },
  {
    id: "impersonation",
    title: "Impersonation",
    category: "Executive & Authority Spoofing",
    explanation:
      "Attackers pose as company executives (CEO/CFO), family members in distress, or cybercrime officials ('digital arrest' scams) to coerce urgent money transfers.",
    warningSigns: [
      "Demands strict secrecy ('Do not tell anyone or call me right now')",
      "Requests payment via gift cards, crypto, or an unfamiliar bank account",
      "Uses display-name spoofing with a free webmail address",
    ],
    preventionTips: [
      "Establish a family or corporate safe-word / out-of-band phone verification policy",
      "Know that police/CBI/RBI never place citizens under 'Digital Arrest' on Skype/WhatsApp",
      "Verify any executive financial request via a known internal directory phone number",
    ],
    exampleScenario:
      "Hi, this is the CEO. I am in an urgent meeting and need you to purchase 5 Apple Gift Cards of ₹5,000 each for a client presentation right now. Scratch and email me the codes within 20 minutes.",
    accent: "border-red-500/30 hover:border-red-400",
    icon: <UserCheck className="w-5 h-5 text-red-400" />,
  },
];

const CYBER_SAFETY_TIPS = [
  {
    id: "tip-1",
    title: "Never share OTPs",
    detail:
      "One-Time Passwords authorize logins and money debits. No legitimate bank, government desk, or courier agent will ever ask you to read or forward an OTP.",
  },
  {
    id: "tip-2",
    title: "Verify payment requests",
    detail:
      "Entering a UPI PIN strictly deducts funds from your account. Never enter your PIN or scan an unknown QR code when someone claims to be sending you money.",
  },
  {
    id: "tip-3",
    title: "Inspect suspicious URLs",
    detail:
      "Look closely at the actual domain name before clicking. Attackers use character substitutions (micr0soft.com) and cheap TLDs (.xyz, .top, .click) to mimic trusted portals.",
  },
  {
    id: "tip-4",
    title: "Verify unknown senders",
    detail:
      "Check the full email address and SPF/DKIM status, not just the display name. If an executive or friend requests money urgently, call them on a known phone number.",
  },
  {
    id: "tip-5",
    title: "Avoid urgent-pressure messages",
    detail:
      "Scammers manufacture panic ('Account blocked in 2 hours', 'Digital arrest warrant') to stop you from thinking critically. Pause and verify through official channels.",
  },
  {
    id: "tip-6",
    title: "Enable MFA",
    detail:
      "Use app-based Multi-Factor Authentication (Authenticator apps or hardware passkeys) on all email, banking, and social accounts to block credential stuffing.",
  },
  {
    id: "tip-7",
    title: "Keep software updated",
    detail:
      "Apply OS, browser, and mobile security patches promptly, and never sideload unknown .apk files sent over WhatsApp or Telegram.",
  },
  {
    id: "tip-8",
    title: "Report suspicious activity",
    detail:
      "Log forensic reports in CyberShield and report financial cyber fraud immediately to national cybercrime helplines (such as 1930 or cybercrime.gov.in).",
  },
];

export const AwarenessCenterView: React.FC<AwarenessCenterViewProps> = ({
  onTestScenarioInDetector,
}) => {
  const [selectedCard, setSelectedCard] = useState<ScamAwarenessCardData>(
    SCAM_AWARENESS_CARDS[0]
  );
  const [checkedTips, setCheckedTips] = useState<Record<string, boolean>>({
    "tip-1": true,
    "tip-2": true,
    "tip-6": true,
  });

  const toggleTip = (id: string) => {
    setCheckedTips((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedTips).filter(Boolean).length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>THREAT INTELLIGENCE ENCYCLOPEDIA & SAFETY PROTOCOLS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Scam Awareness Center & Cyber Safety Tips
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Interactive field guide to the 10 most prevalent digital scam vectors, warning signs,
            prevention playbooks, and live simulation testing.
          </p>
        </div>
      </div>

      {/* Interactive Spotlight + 10 Scam Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 10 Interactive Scam Category Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SCAM_AWARENESS_CARDS.map((card) => {
            const isSelected = selectedCard.id === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCard(card)}
                className={`group text-left p-5 rounded-xl border transition-all duration-150 hover:-translate-y-0.5 cursor-pointer ${
                  isSelected
                    ? "bg-slate-800/90 border-cyan-400 shadow-lg"
                    : `bg-slate-900/60 ${card.accent}`
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-white/10">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{card.category}</span>
                </div>
                <h3 className="text-base font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {card.explanation}
                </p>
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>Inspect Playbook & Example</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Deep-Dive Inspector for Selected Scam Vector */}
        <div className="lg:col-span-5 rounded-2xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur-md p-6 space-y-6 lg:sticky lg:top-6">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-white/10">
                {selectedCard.icon}
              </div>
              <div>
                <div className="text-xs font-mono text-cyan-400">{selectedCard.category}</div>
                <h2 className="text-xl font-bold font-display text-white">
                  {selectedCard.title}
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400">HOW THIS ATTACK WORKS</div>
            <p className="text-sm text-slate-200 leading-relaxed">{selectedCard.explanation}</p>
          </div>

          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>KEY WARNING SIGNS</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-200 list-disc list-inside">
              {selectedCard.warningSigns.map((sign, i) => (
                <li key={i}>{sign}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>PREVENTION & DEFENSE TIPS</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-200 list-disc list-inside">
              {selectedCard.preventionTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
            <div className="text-xs font-mono text-amber-400">REAL-WORLD EXAMPLE SCENARIO</div>
            <blockquote className="text-xs font-mono text-slate-300 bg-slate-900 p-3 rounded-lg border border-white/5 leading-relaxed">
              “{selectedCard.exampleScenario}”
            </blockquote>
            <button
              type="button"
              onClick={() => onTestScenarioInDetector(selectedCard.exampleScenario)}
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Test This Example in Scam Message Detector</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Requirement #9: Cyber Safety Tips Section */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/65 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 mb-1">
              ESSENTIAL PERSONAL & ENTERPRISE HYGIENE
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              8 Core Cyber Safety Tips & Readiness Checklist
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any card to mark it verified in your personal security readiness checklist
            </p>
          </div>
          <div className="text-xs font-mono text-cyan-300 bg-slate-950 px-3.5 py-2 rounded-lg border border-cyan-500/30 tabular-nums shrink-0">
            Readiness Score: {completedCount} / {CYBER_SAFETY_TIPS.length} Verified
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CYBER_SAFETY_TIPS.map((tip, index) => {
            const isDone = !!checkedTips[tip.id];
            return (
              <button
                key={tip.id}
                type="button"
                onClick={() => toggleTip(tip.id)}
                className={`text-left p-5 rounded-xl border transition-all duration-150 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between ${
                  isDone
                    ? "bg-emerald-950/20 border-emerald-500/40"
                    : "bg-slate-950/70 border-white/10 hover:border-cyan-500/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                    <span className="text-slate-400">0{index + 1}. PROTOCOL</span>
                    <span
                      className={
                        isDone ? "text-emerald-400 font-semibold" : "text-slate-500"
                      }
                    >
                      {isDone ? "✓ ACTIVE" : "VERIFY"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-display text-white">{tip.title}</h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">{tip.detail}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
