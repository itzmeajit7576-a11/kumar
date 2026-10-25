import React, { useEffect, useState } from "react";
import {
  MessageSquareWarning,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Phone,
  Link2,
  IndianRupee,
  FileText,
  RotateCcw,
} from "lucide-react";
import { MessageAnalysisResult } from "../types/security";
import { HolographicGauge } from "./HolographicGauge";

interface ScamMessageDetectorViewProps {
  initialPrefillMessage?: string;
  onAnalysisComplete: (
    title: string,
    subtitle: string,
    result: MessageAnalysisResult
  ) => void;
  onExportReport: (title: string, result: MessageAnalysisResult) => void;
}

const PLATFORMS = ["SMS", "WhatsApp", "Telegram", "Instagram", "Facebook", "Other"];

const MESSAGE_PRESETS = [
  {
    id: "kyc-bank",
    label: "KYC Bank Block SMS",
    platform: "SMS",
    sender: "+91 89234 11092",
    message:
      "Dear Customer, Your SBI YONO Account & PAN Card KYC has expired today. Your bank account will be blocked within 24 hours. Click http://bit.ly/sbi-kyc-fast-update immediately or call +91 8923411092 to verify OTP.",
  },
  {
    id: "upi-collect",
    label: "UPI Cashback PIN Trick",
    platform: "WhatsApp",
    sender: "+91 91234 55678",
    message:
      "Congratulations! You won ₹4,999 festival cashback on Google Pay / PhonePe. Approve the UPI collect request and enter your 4-digit UPI PIN now to receive ₹4,999 directly in your bank account: https://reward-gpay-claim.xyz",
  },
  {
    id: "job-telegram",
    label: "WhatsApp / Telegram Job Scam",
    platform: "Telegram",
    sender: "@HR_Global_Recruiter_Mia",
    message:
      "Hello! We are hiring for Part-Time Work From Home rating tasks. Earn ₹3,500 to ₹8,000 daily income just by liking YouTube videos! No experience needed. Deposit ₹1,000 registration fee to unlock VIP task group: https://t.me/vip_earning_tasks_2026",
  },
  {
    id: "parcel-customs",
    label: "Delivery / Customs Hold SMS",
    platform: "SMS",
    sender: "IND-POST-ALERT",
    message:
      "India Post: Your parcel #IN9928104 delivery failed due to incomplete address. Pay ₹49 rescheduling fee within 12 hours or parcel will be returned: https://indiapost-track-parcel.top/pay",
  },
  {
    id: "legit-otp",
    label: "Safe: Standard Login OTP",
    platform: "SMS",
    sender: "VM-HDFCBK",
    message:
      "482910 is your SECRET One Time Password (OTP) for NetBanking login. Do not share this OTP with anyone. Bank employees never ask for OTP.",
  },
];

export const ScamMessageDetectorView: React.FC<ScamMessageDetectorViewProps> = ({
  initialPrefillMessage,
  onAnalysisComplete,
  onExportReport,
}) => {
  const [platform, setPlatform] = useState("SMS");
  const [sender, setSender] = useState(MESSAGE_PRESETS[0].sender);
  const [message, setMessage] = useState(
    initialPrefillMessage || MESSAGE_PRESETS[0].message
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MessageAnalysisResult | null>(null);
  const [reportExported, setReportExported] = useState(false);

  useEffect(() => {
    if (initialPrefillMessage) {
      setMessage(initialPrefillMessage);
      setResult(null);
    }
  }, [initialPrefillMessage]);

  const handleLoadPreset = (preset: (typeof MESSAGE_PRESETS)[0]) => {
    setPlatform(preset.platform);
    setSender(preset.sender);
    setMessage(preset.message);
    setResult(null);
    setReportExported(false);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setReportExported(false);

    try {
      const response = await fetch("/api/analyze-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, sender, message }),
      });
      const data: MessageAnalysisResult = await response.json();
      setResult(data);
      onAnalysisComplete(
        message.slice(0, 72) + (message.length > 72 ? "..." : ""),
        `${platform} · ${sender || "Unknown Sender"}`,
        data
      );
    } catch (err) {
      console.error("Failed to analyze message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <MessageSquareWarning className="w-4 h-4" />
            <span>MULTI-PLATFORM MESSAGING FRAUD ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Scam Message Detector
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Detect OTP fraud, fake bank/KYC alerts, UPI payment lures, job scams, lottery offers,
            and delivery phishing across SMS and social apps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {MESSAGE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleLoadPreset(p)}
              className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Message Input Panel */}
        <form
          onSubmit={handleAnalyze}
          className="lg:col-span-6 rounded-2xl border border-white/10 bg-slate-900/65 p-6 space-y-5"
        >
          {/* Platform Segmented Controls */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Source Messaging Platform
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-slate-950 rounded-xl border border-white/10">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`py-2 px-2.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    platform === p
                      ? "bg-cyan-500 text-slate-950 font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Sender Phone Number / Handle / Header ID
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g., +91 98765 43210, @telegram_handle, or VM-BANKID"
              className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-950 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Suspicious Message Content
              </label>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                {message.length} chars
              </span>
            </div>
            <textarea
              rows={7}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste the SMS, WhatsApp, Telegram, or Instagram message here..."
              className="w-full px-3.5 py-3 text-sm bg-slate-950 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Inspecting Scam Patterns..." : "Analyze Message Risk"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMessage("");
                setSender("");
                setResult(null);
              }}
              className="py-2.5 px-3.5 bg-slate-950 hover:bg-slate-800 border border-white/10 rounded-lg text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </form>

        {/* Right: Scam Analysis Output */}
        <div className="lg:col-span-6 space-y-5">
          {loading ? (
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-10 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <div className="text-base font-display font-bold text-white">
                Scanning for Social Engineering & Payment Lures...
              </div>
              <p className="text-xs font-mono text-slate-400">
                Checking KYC/OTP patterns · Extracting URLs & phone numbers · Scoring urgency
              </p>
            </div>
          ) : result ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-6">
              {/* Scam Risk Score 0-100 & Classification */}
              <HolographicGauge
                score={result.riskScore}
                classification={result.classification}
                confidence={result.confidence}
                subtitle={`Scam Risk Score: ${result.riskScore}/100 · ${result.platform}`}
              />

              {/* Why It Was Detected */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-white/10 space-y-1.5">
                <div className="text-xs font-mono text-cyan-400">WHY IT WAS DETECTED</div>
                <p className="text-sm text-slate-200 leading-relaxed">{result.whyDetected}</p>
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Categories:</span>
                  <span className="text-amber-300">{result.detectedCategories.join(" · ")}</span>
                </div>
              </div>

              {/* Suspicious Phrases & Social Engineering Tactics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                  <div className="text-xs font-mono text-red-400">
                    SUSPICIOUS PHRASES FLAGGED
                  </div>
                  {result.suspiciousPhrases.length > 0 ? (
                    <ul className="space-y-1 text-xs font-mono text-red-200 list-disc list-inside">
                      {result.suspiciousPhrases.map((phrase, i) => (
                        <li key={i}>“{phrase}”</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">No high-risk coercion phrases found.</p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                  <div className="text-xs font-mono text-amber-400">
                    SOCIAL-ENGINEERING TECHNIQUES
                  </div>
                  <ul className="space-y-1 text-xs text-slate-200 list-disc list-inside">
                    {result.socialEngineeringTechniques.map((tech, i) => (
                      <li key={i}>{tech}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Extracted URLs, Phone Numbers, Payment Requests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>URLs ({result.extractedUrls.length})</span>
                  </div>
                  {result.extractedUrls.length > 0 ? (
                    <div className="space-y-1">
                      {result.extractedUrls.map((u, i) => (
                        <div key={i} className="text-xs font-mono text-red-300 truncate" title={u}>
                          {u}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">None detected</div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Phones ({result.extractedPhones.length})</span>
                  </div>
                  {result.extractedPhones.length > 0 ? (
                    <div className="space-y-1">
                      {result.extractedPhones.map((ph, i) => (
                        <div key={i} className="text-xs font-mono text-amber-300 truncate">
                          {ph}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">None detected</div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Payment Requests</span>
                  </div>
                  {result.paymentRequests.length > 0 ? (
                    <div className="space-y-1">
                      {result.paymentRequests.map((pr, i) => (
                        <div key={i} className="text-xs font-mono text-red-300 truncate">
                          {pr}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">None explicit</div>
                  )}
                </div>
              </div>

              {/* Epistemic Evidence Separation */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>CONFIRMED EVIDENCE</span>
                  </div>
                  <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5">
                    {result.confirmedEvidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>SUSPICIOUS INDICATORS</span>
                  </div>
                  <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5">
                    {result.suspiciousIndicators.length > 0 ? (
                      result.suspiciousIndicators.map((ind, i) => <li key={i}>{ind}</li>)
                    ) : (
                      <li>No overt manipulation triggers detected.</li>
                    )}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-sky-400 mb-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>UNCERTAIN / CONTEXTUAL ANALYSIS</span>
                  </div>
                  <ul className="text-xs text-slate-400 list-disc list-inside space-y-0.5">
                    {result.uncertainFactors.map((unc, i) => (
                      <li key={i}>{unc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                <div className="text-xs font-mono text-cyan-300">RECOMMENDED ACTION</div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {result.recommendedAction}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    Saved to user Firestore History
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onExportReport(`${platform} Scam Inspection`, result);
                      setReportExported(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>
                      {reportExported ? "Saved to Security Reports ✓" : "Export Security Report"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-10 text-center space-y-3">
              <MessageSquareWarning className="w-10 h-10 text-amber-400 mx-auto opacity-80" />
              <h3 className="text-lg font-bold font-display text-white">
                Ready to Inspect Messaging Scams
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Choose a platform, load one of the real-world scam presets above or paste your own
                message, and click <strong className="text-slate-200">Analyze Message Risk</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
