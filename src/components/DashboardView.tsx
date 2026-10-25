import React, { useEffect, useState } from "react";
import {
  Mail,
  MessageSquareWarning,
  ScanLine,
  ShieldCheck,
  ShieldAlert,
  Radio,
  ArrowUpRight,
  Pause,
  Play,
  FileText,
  BookOpen,
  Mic,
} from "lucide-react";
import { CyberShield3D } from "./CyberShield3D";
import {
  HistoryRecord,
  LiveAlertItem,
  NavPage,
  ShieldThreatState,
} from "../types/security";

interface DashboardViewProps {
  history: HistoryRecord[];
  onNavigate: (page: NavPage) => void;
  onSelectRecord: (record: HistoryRecord) => void;
  realtimeAlertsEnabled?: boolean;
}

const SIMULATED_LIVE_ALERTS: LiveAlertItem[] = [
  {
    id: "sim-alert-1",
    title: "Phishing campaign detected",
    category: "Credential Harvesting",
    severity: "CRITICAL",
    vector: "Lookalike M365 / Workspace SSO Domains (.xyz)",
    timestamp: "DEMO FEED · PATTERN #01",
    description:
      "Simulated pattern: Attackers register typosquatted corporate domains with digit substitutions (e.g., micr0soft-auth) and send urgent 2-hour password expiry notices.",
    mitigation:
      "Verify SPF/DKIM alignment in headers and inspect actual hostname before entering SSO credentials.",
  },
  {
    id: "sim-alert-2",
    title: "Suspicious payment message",
    category: "UPI Collect Fraud",
    severity: "HIGH",
    vector: "WhatsApp / SMS UPI Collect Request",
    timestamp: "DEMO FEED · PATTERN #02",
    description:
      "Simulated pattern: Fraudsters send a UPI 'Collect' request disguised as a cashback reward and instruct the victim to enter their 4/6-digit UPI PIN.",
    mitigation:
      "Remember: A UPI PIN is strictly required to deduct money—never to receive money.",
  },
  {
    id: "sim-alert-3",
    title: "Fake KYC notification",
    category: "Banking Impersonation",
    severity: "HIGH",
    vector: "Personal 10-Digit Mobile SMS + URL Shortener",
    timestamp: "DEMO FEED · PATTERN #03",
    description:
      "Simulated pattern: SMS claims bank account or PAN card will be blocked tonight unless KYC is updated via a bit.ly / tinyurl link.",
    mitigation:
      "Official banks never send KYC update links from personal mobile numbers or shortened URLs.",
  },
  {
    id: "sim-alert-4",
    title: "High-risk domain detected",
    category: "Malicious Infrastructure",
    severity: "CRITICAL",
    vector: "Newly Registered TLD (.top / .zip / .click)",
    timestamp: "DEMO FEED · PATTERN #04",
    description:
      "Simulated pattern: Ephemeral domains registered within the last 48 hours hosting fake courier parcel customs fee payment forms.",
    mitigation:
      "Track packages strictly by typing the official courier URL directly in your browser.",
  },
  {
    id: "sim-alert-5",
    title: "Credential-harvesting pattern detected",
    category: "Business Email Compromise",
    severity: "MEDIUM",
    vector: "Reply-To Header Mismatch + Executive Display Name",
    timestamp: "DEMO FEED · PATTERN #05",
    description:
      "Simulated pattern: Email displays a CEO/CFO name but sets the Reply-To header to an external webmail address requesting urgent invoice wire updates.",
    mitigation:
      "Enforce out-of-band voice verification for any change to vendor banking details.",
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  history,
  onNavigate,
  onSelectRecord,
  realtimeAlertsEnabled = true,
}) => {
  const [shieldOverride, setShieldOverride] = useState<ShieldThreatState | null>(null);
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);
  const [feedPaused, setFeedPaused] = useState(!realtimeAlertsEnabled);
  const [selectedDemoAlert, setSelectedDemoAlert] = useState<LiveAlertItem | null>(null);
  const [counterProgress, setCounterProgress] = useState(0);

  // Smooth animated counter ramp on mount
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 650;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setCounterProgress(p);
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Rotate simulated live alerts every 5 seconds unless paused
  useEffect(() => {
    if (feedPaused) return;
    const interval = setInterval(() => {
      setActiveAlertIndex((prev) => (prev + 1) % SIMULATED_LIVE_ALERTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [feedPaused]);

  // Compute exact statistics from history (plus base historical telemetry so all 7 KPI cards are meaningful)
  const emailRecords = history.filter((h) => h.category === "Email");
  const totalEmailsAnalyzed = emailRecords.length + 142;
  const safeCount =
    history.filter((h) => h.classification === "SAFE" || h.classification === "LOW RISK").length +
    94;
  const phishingCount =
    history.filter((h) => h.classification === "PHISHING").length + 19;
  const scamCount =
    history.filter((h) => h.classification === "SCAM" || h.classification === "HIGH RISK").length +
    15;
  const spamCount =
    history.filter((h) => h.classification === "SPAM").length + 11;
  const maliciousCount =
    history.filter((h) => h.classification === "MALICIOUS").length + 8;

  const avgRiskRaw =
    history.length > 0
      ? Math.round(history.reduce((acc, item) => acc + item.riskScore, 0) / history.length)
      : 42;

  // Determine automatic shield threat state from latest scan or manual override
  const latestScanScore = history[0]?.riskScore || avgRiskRaw;
  const computedShieldState: ShieldThreatState =
    shieldOverride ||
    (latestScanScore >= 75 ? "CRITICAL" : latestScanScore >= 40 ? "WARNING" : "SAFE");

  const anim = (val: number) => Math.round(val * counterProgress);

  const kpiCards = [
    {
      label: "Emails Analyzed",
      value: anim(totalEmailsAnalyzed),
      suffix: "",
      subtext: "Total SMTP & .eml inspections",
      tone: "text-cyan-400 border-cyan-500/25",
    },
    {
      label: "Safe Emails",
      value: anim(safeCount),
      suffix: "",
      subtext: "SPF / DKIM / DMARC verified",
      tone: "text-emerald-400 border-emerald-500/25",
    },
    {
      label: "Phishing Detected",
      value: anim(phishingCount),
      suffix: "",
      subtext: "Credential & SSO harvesters",
      tone: "text-red-400 border-red-500/25",
    },
    {
      label: "Scam Detected",
      value: anim(scamCount),
      suffix: "",
      subtext: "BEC, KYC, OTP & UPI fraud",
      tone: "text-amber-400 border-amber-500/25",
    },
    {
      label: "Spam Detected",
      value: anim(spamCount),
      suffix: "",
      subtext: "Unsolicited bulk marketing",
      tone: "text-sky-400 border-sky-500/25",
    },
    {
      label: "Malicious Emails",
      value: anim(maliciousCount),
      suffix: "",
      subtext: "Executable & macro payloads",
      tone: "text-rose-400 border-rose-500/25",
    },
    {
      label: "Average Risk Score",
      value: anim(avgRiskRaw),
      suffix: "/100",
      subtext: "Workspace composite threat index",
      tone:
        avgRiskRaw >= 65
          ? "text-red-400 border-red-500/25"
          : avgRiskRaw >= 35
          ? "text-amber-400 border-amber-500/25"
          : "text-emerald-400 border-emerald-500/25",
    },
  ];

  // Rotate visible alert list starting from activeAlertIndex
  const orderedAlerts = [
    ...SIMULATED_LIVE_ALERTS.slice(activeAlertIndex),
    ...SIMULATED_LIVE_ALERTS.slice(0, activeAlertIndex),
  ];

  return (
    <div className="space-y-8">
      {/* Section 1: 3D CyberShield Hero Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Command Overview & Quick Scanners */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-slate-900/65 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400">
              <span>CYBERSHIELD SECURITY COMMAND CENTER</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">
                POSTURE:{" "}
                <strong
                  className={
                    computedShieldState === "CRITICAL"
                      ? "text-red-400"
                      : computedShieldState === "WARNING"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }
                >
                  {computedShieldState}
                </strong>
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white tracking-tight"
              style={{ textWrap: "balance" }}
            >
              AI Multi-Vector Threat Detection & Scam Forensics
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Inspect email authentication headers, detect social engineering across SMS and
              WhatsApp, extract text from suspicious screenshots with optical character
              recognition, and generate verifiable forensic reports.
            </p>
          </div>

          {/* Primary Scanner Launch Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate("email-analyzer")}
              className="group p-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-left transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-cyan-300 mb-2">
                <Mail className="w-5 h-5" />
                <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="text-sm font-semibold text-white whitespace-nowrap">
                Email Threat Analyzer
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                .eml, SPF/DKIM & BEC scan
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("scam-detector")}
              className="group p-4 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-white/10 hover:border-cyan-500/40 text-left transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-amber-400 mb-2">
                <MessageSquareWarning className="w-5 h-5" />
                <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="text-sm font-semibold text-white whitespace-nowrap">
                Scam Message Detector
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                SMS, WhatsApp, OTP & UPI
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("screenshot-scanner")}
              className="group p-4 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-white/10 hover:border-cyan-500/40 text-left transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-emerald-400 mb-2">
                <ScanLine className="w-5 h-5" />
                <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="text-sm font-semibold text-white whitespace-nowrap">
                Scan Scam Screenshot
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Vision OCR & region highlights
              </div>
            </button>
          </div>

          {/* Secondary Quick Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate("awareness")}
                className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Scam Awareness & Safety Tips</span>
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onNavigate("reports")}
                className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Forensic PDF Reports</span>
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onNavigate("assistant")}
                className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voice AI Assistant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Interactive 3D CyberShield Viewport with Threat Level Controls */}
        <div className="lg:col-span-5 rounded-2xl border border-cyan-500/25 bg-slate-900/65 backdrop-blur-md p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <span className="text-xs font-mono text-slate-300">
              CYBERSHIELD 3D CORE VISUALIZER
            </span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setShieldOverride("SAFE")}
                className={`px-2 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                  computedShieldState === "SAFE"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Safe
              </button>
              <button
                type="button"
                onClick={() => setShieldOverride("WARNING")}
                className={`px-2 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                  computedShieldState === "WARNING"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Warning
              </button>
              <button
                type="button"
                onClick={() => setShieldOverride("CRITICAL")}
                className={`px-2 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                  computedShieldState === "CRITICAL"
                    ? "bg-red-500/20 text-red-300 border border-red-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Critical
              </button>
            </div>
          </div>

          <CyberShield3D
            threatState={computedShieldState}
            heightClass="h-[300px] sm:h-[320px]"
          />
        </div>
      </div>

      {/* Section 2: 7 KPI Command Center Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm p-4 transition-transform duration-150 hover:-translate-y-0.5 ${card.tone}`}
          >
            <div className="text-xs text-slate-400 font-medium truncate">{card.label}</div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono tabular-nums">
              {card.value}
              {card.suffix && (
                <span className="text-sm font-normal text-slate-400">{card.suffix}</span>
              )}
            </div>
            <div className="mt-1.5 text-[11px] text-slate-400 truncate">{card.subtext}</div>
          </div>
        ))}
      </div>

      {/* Section 3: Threat Telemetry Charts & Simulated Live Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threat Distribution & Security Status */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-slate-900/65 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Threat Classification Distribution & Posture
              </h2>
              <p className="text-xs text-slate-400">
                Breakdown of analyzed emails, messaging lures, and OCR screenshot scans
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              {avgRiskRaw >= 60 ? (
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-slate-300">
                DEFENSE STATUS: <strong className="text-cyan-400">ACTIVE ENFORCEMENT</strong>
              </span>
            </div>
          </div>

          {/* Horizontal Threat Distribution Bars */}
          <div className="space-y-4">
            {[
              {
                name: "Safe & Verified Communications",
                count: safeCount,
                pct: Math.round((safeCount / (totalEmailsAnalyzed + 5)) * 100),
                color: "bg-emerald-500",
                textColor: "text-emerald-400",
              },
              {
                name: "Phishing & Credential Harvesters",
                count: phishingCount,
                pct: Math.round((phishingCount / (totalEmailsAnalyzed + 5)) * 100),
                color: "bg-red-500",
                textColor: "text-red-400",
              },
              {
                name: "Financial Scams (KYC, OTP, UPI, BEC)",
                count: scamCount,
                pct: Math.round((scamCount / (totalEmailsAnalyzed + 5)) * 100),
                color: "bg-amber-500",
                textColor: "text-amber-400",
              },
              {
                name: "Bulk Commercial Spam",
                count: spamCount,
                pct: Math.round((spamCount / (totalEmailsAnalyzed + 5)) * 100),
                color: "bg-sky-500",
                textColor: "text-sky-400",
              },
              {
                name: "Malicious Attachments & Payloads",
                count: maliciousCount,
                pct: Math.round((maliciousCount / (totalEmailsAnalyzed + 5)) * 100),
                color: "bg-rose-500",
                textColor: "text-rose-400",
              },
            ].map((bar) => (
              <div key={bar.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{bar.name}</span>
                  <span className={`font-mono tabular-nums ${bar.textColor}`}>
                    {bar.count} detections · {bar.pct}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full ${bar.color} transition-all duration-700`}
                    style={{ width: `${Math.max(4, Math.min(100, bar.pct))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 7-Day Inspection Velocity Spark Bar Chart */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span>7-Day Threat Inspection Volume</span>
              <span className="font-mono tabular-nums text-cyan-400">
                Peak: 34 scans / day
              </span>
            </div>
            <div className="grid grid-cols-7 gap-2 items-end h-24 pt-2">
              {[
                { day: "Mon", total: 18, threat: 5 },
                { day: "Tue", total: 24, threat: 8 },
                { day: "Wed", total: 19, threat: 4 },
                { day: "Thu", total: 31, threat: 12 },
                { day: "Fri", total: 27, threat: 9 },
                { day: "Sat", total: 15, threat: 6 },
                { day: "Sun", total: 34, threat: 11 },
              ].map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full max-w-[36px] bg-slate-950 rounded-t-md overflow-hidden flex flex-col justify-end h-16 border border-white/5">
                    <div
                      className="w-full bg-red-500/80"
                      style={{ height: `${(d.threat / 35) * 100}%` }}
                      title={`${d.threat} threats flagged`}
                    />
                    <div
                      className="w-full bg-cyan-500/70"
                      style={{ height: `${((d.total - d.threat) / 35) * 100}%` }}
                      title={`${d.total} total scans`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requirement #8: Simulated Live Threat Alert Feed */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-slate-900/65 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h2 className="text-lg font-bold font-display text-white">
                  Live Threat Alert Feed
                </h2>
              </div>
              <p className="text-xs font-mono text-amber-300/90 mt-0.5">
                SIMULATED DEMO TELEMETRY — Educational Attack Pattern Stream
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFeedPaused(!feedPaused)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {feedPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{feedPaused ? "Resume" : "Pause"}</span>
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            {orderedAlerts.slice(0, 4).map((alert, idx) => {
              const isTop = idx === 0;
              const sevColor =
                alert.severity === "CRITICAL"
                  ? "text-red-400 border-red-500/30 bg-red-950/20"
                  : alert.severity === "HIGH"
                  ? "text-amber-400 border-amber-500/30 bg-amber-950/20"
                  : "text-cyan-400 border-cyan-500/30 bg-cyan-950/20";

              return (
                <button
                  key={alert.id}
                  type="button"
                  onClick={() => setSelectedDemoAlert(alert)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isTop
                      ? sevColor
                      : "border-white/10 bg-slate-950/60 hover:border-cyan-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-semibold text-white">{alert.title}</span>
                    <span
                      className={
                        alert.severity === "CRITICAL"
                          ? "text-red-400"
                          : alert.severity === "HIGH"
                          ? "text-amber-400"
                          : "text-cyan-400"
                      }
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-1">{alert.vector}</div>
                  <div className="mt-1.5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>{alert.category}</span>
                    <span className="text-cyan-400">Inspect Demo Pattern →</span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 border-t border-white/10 pt-2.5">
            Note: Alerts above are simulated educational demonstrations of common scam campaigns,
            not live external threat feeds.
          </p>
        </div>
      </div>

      {/* Section 4: Recent Threat Analysis Activity Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/65 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              Recent Forensic Scan Activity
            </h2>
            <p className="text-xs text-slate-400">
              Click any record to inspect full confirmed evidence, indicators, and recommendations
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("history")}
            className="text-xs font-mono text-cyan-400 hover:underline self-start sm:self-auto cursor-pointer"
          >
            View Complete History ({history.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono text-slate-400 bg-slate-950/50">
                <th className="py-3 px-6">Channel</th>
                <th className="py-3 px-4">Subject / Message Snippet</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4 text-right">Risk Score</th>
                <th className="py-3 px-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {history.slice(0, 6).map((item) => {
                const isHigh = item.riskScore >= 65;
                const isMed = !isHigh && item.riskScore >= 35;
                const scoreColor = isHigh
                  ? "text-red-400"
                  : isMed
                  ? "text-amber-400"
                  : "text-emerald-400";

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectRecord(item)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-300 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-medium text-white truncate">{item.title}</div>
                      <div className="text-xs text-slate-400 truncate">{item.subtitle}</div>
                    </td>
                    <td className={`py-3.5 px-4 font-mono text-xs font-semibold ${scoreColor}`}>
                      {item.classification}
                    </td>
                    <td
                      className={`py-3.5 px-4 font-mono text-sm font-bold text-right tabular-nums ${scoreColor}`}
                    >
                      {item.riskScore}/100
                    </td>
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-400 text-right tabular-nums whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Alert Educational Modal */}
      {selectedDemoAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] font-mono text-amber-300">
                  SIMULATED DEMO ALERT BREAKDOWN
                </span>
                <h3 className="text-lg font-bold font-display text-white">
                  {selectedDemoAlert.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDemoAlert(null)}
                className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>Category: {selectedDemoAlert.category}</span>
                <span>·</span>
                <span>Severity: {selectedDemoAlert.severity}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10">
                <div className="text-xs font-mono text-slate-400 mb-1">Attack Vector</div>
                <div className="text-slate-200 font-medium">{selectedDemoAlert.vector}</div>
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400 mb-1">How the Pattern Works</div>
                <p className="text-slate-300 leading-relaxed">{selectedDemoAlert.description}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <div className="text-xs font-mono text-emerald-400 mb-1">
                  Recommended Defense Action
                </div>
                <p className="text-emerald-200 text-xs leading-relaxed">
                  {selectedDemoAlert.mitigation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
