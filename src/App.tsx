/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Mail,
  MessageSquareWarning,
  ScanLine,
  History,
  FileText,
  BookOpen,
  Bot,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import {
  EmailAnalysisResult,
  HistoryRecord,
  MessageAnalysisResult,
  NavPage,
  ScreenshotAnalysisResult,
  SecurityReport,
  UserProfile,
} from "./types/security";
import { firebaseService } from "./services/firebaseService";
import { AuthScreen } from "./components/AuthScreen";
import { DashboardView } from "./components/DashboardView";
import { EmailAnalyzerView } from "./components/EmailAnalyzerView";
import { ScamMessageDetectorView } from "./components/ScamMessageDetectorView";
import { ScreenshotScannerView } from "./components/ScreenshotScannerView";
import { AwarenessCenterView } from "./components/AwarenessCenterView";
import { HistoryView } from "./components/HistoryView";
import { ReportsView } from "./components/ReportsView";
import { VoiceAssistantWidget } from "./components/VoiceAssistantWidget";
import { SettingsView } from "./components/SettingsView";
import { HolographicGauge } from "./components/HolographicGauge";

const SIDEBAR_ITEMS: {
  id: NavPage;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: "email-analyzer",
    label: "Email Analyzer",
    icon: <Mail className="w-4 h-4" />,
  },
  {
    id: "scam-detector",
    label: "Scam Message Detector",
    icon: <MessageSquareWarning className="w-4 h-4" />,
  },
  {
    id: "screenshot-scanner",
    label: "Screenshot Scanner",
    icon: <ScanLine className="w-4 h-4" />,
  },
  {
    id: "history",
    label: "Threat History",
    icon: <History className="w-4 h-4" />,
  },
  {
    id: "reports",
    label: "Security Reports",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "awareness",
    label: "Scam Awareness",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: "assistant",
    label: "AI Assistant",
    icon: <Bot className="w-4 h-4" />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
  },
];

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() =>
    firebaseService.getCurrentUser()
  );
  const [activePage, setActivePage] = useState<NavPage>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [selectedHistoryRecord, setSelectedHistoryRecord] =
    useState<HistoryRecord | null>(null);
  const [prefillScamMessage, setPrefillScamMessage] = useState<string | undefined>(
    undefined
  );

  // Sync user-scoped Firestore history & reports when user authenticates
  useEffect(() => {
    if (user) {
      setHistory(firebaseService.getUserHistory(user.uid));
      setReports(firebaseService.getUserReports(user.uid));
    } else {
      setHistory([]);
      setReports([]);
    }
  }, [user]);

  const handleLogout = () => {
    firebaseService.logout();
    setUser(null);
    setActivePage("dashboard");
  };

  // Save new Email Analysis to History
  const handleEmailAnalysisComplete = (
    title: string,
    subtitle: string,
    result: EmailAnalysisResult
  ) => {
    if (!user) return;
    const saved = firebaseService.saveAnalysisToHistory(user.uid, {
      category: "Email",
      title,
      subtitle,
      classification: result.classification,
      riskScore: result.riskScore,
      confidence: result.confidence,
      status:
        result.riskScore >= 65
          ? "QUARANTINED"
          : result.riskScore >= 35
          ? "FLAGGED"
          : "CLEARED",
      summary: result.summary,
      recommendedAction: result.recommendedAction,
      details: result,
    });
    setHistory((prev) => [saved, ...prev]);
  };

  // Save new Scam Message Analysis to History
  const handleMessageAnalysisComplete = (
    title: string,
    subtitle: string,
    result: MessageAnalysisResult
  ) => {
    if (!user) return;
    const saved = firebaseService.saveAnalysisToHistory(user.uid, {
      category: "Message",
      title,
      subtitle,
      classification: result.classification,
      riskScore: result.riskScore,
      confidence: result.confidence,
      status:
        result.riskScore >= 60
          ? "QUARANTINED"
          : result.riskScore >= 35
          ? "FLAGGED"
          : "CLEARED",
      summary: result.whyDetected,
      recommendedAction: result.recommendedAction,
      details: result,
    });
    setHistory((prev) => [saved, ...prev]);
  };

  // Save new Screenshot OCR Analysis to History
  const handleScreenshotAnalysisComplete = (
    title: string,
    subtitle: string,
    result: ScreenshotAnalysisResult
  ) => {
    if (!user) return;
    const saved = firebaseService.saveAnalysisToHistory(user.uid, {
      category: "Screenshot",
      title,
      subtitle,
      classification: result.threatType,
      riskScore: result.riskScore,
      confidence: result.confidence,
      status:
        result.riskScore >= 60
          ? "QUARANTINED"
          : result.riskScore >= 35
          ? "FLAGGED"
          : "CLEARED",
      summary: result.explanation,
      recommendedAction: result.recommendedAction,
      details: result,
    });
    setHistory((prev) => [saved, ...prev]);
  };

  // Export Email / Message / Screenshot Result to Security Reports
  const handleExportEmailReport = (title: string, res: EmailAnalysisResult) => {
    if (!user) return;
    const rpt = firebaseService.saveSecurityReport(user.uid, {
      inputType: "Email Analysis",
      title: `Forensic Email Report: ${title}`,
      classification: res.classification,
      riskScore: res.riskScore,
      confidence: res.confidence,
      detectionReasons: res.detectionReasons,
      suspiciousUrls: res.urls.map((u) => u.url),
      extractedIndicators: [
        `Sender: ${res.senderInfo.address}`,
        `SPF: ${res.senderInfo.spf} / DKIM: ${res.senderInfo.dkim} / DMARC: ${res.senderInfo.dmarc}`,
        `Impersonation Risk: ${res.senderInfo.impersonationRisk}`,
      ],
      confirmedEvidence: res.confirmedEvidence,
      uncertainFactors: res.uncertainFactors,
      recommendedAction: res.recommendedAction,
    });
    setReports((prev) => [rpt, ...prev]);
  };

  const handleExportMessageReport = (title: string, res: MessageAnalysisResult) => {
    if (!user) return;
    const rpt = firebaseService.saveSecurityReport(user.uid, {
      inputType: "Scam Message Analysis",
      title: `Forensic Message Report: ${title}`,
      classification: res.classification,
      riskScore: res.riskScore,
      confidence: res.confidence,
      detectionReasons: [res.whyDetected, ...res.suspiciousIndicators],
      suspiciousUrls: res.extractedUrls,
      extractedIndicators: [
        `Platform: ${res.platform}`,
        `Sender: ${res.sender}`,
        `Tactics: ${res.socialEngineeringTechniques.join(", ")}`,
      ],
      confirmedEvidence: res.confirmedEvidence,
      uncertainFactors: res.uncertainFactors,
      recommendedAction: res.recommendedAction,
    });
    setReports((prev) => [rpt, ...prev]);
  };

  const handleExportScreenshotReport = (
    title: string,
    res: ScreenshotAnalysisResult
  ) => {
    if (!user) return;
    const rpt = firebaseService.saveSecurityReport(user.uid, {
      inputType: "Screenshot Analysis",
      title,
      classification: res.threatType,
      riskScore: res.riskScore,
      confidence: res.confidence,
      detectionReasons: res.detectedIndicators,
      suspiciousUrls: [],
      extractedIndicators: [
        `OCR Snippet: "${res.extractedText.slice(0, 90)}..."`,
        `Bounding Overlays: ${res.highlightedRegions?.length || 0} regions flagged`,
      ],
      confirmedEvidence: res.confirmedEvidence,
      uncertainFactors: res.uncertainFactors,
      recommendedAction: res.recommendedAction,
    });
    setReports((prev) => [rpt, ...prev]);
  };

  // Requirement #1: Protected Dashboard Routes — show Authentication First Page if not signed in
  if (!user) {
    return <AuthScreen onAuthenticated={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className="min-h-screen w-full bg-[#050A14] text-slate-100 cyber-grid-bg cyber-scanlines flex">
      {/* Desktop Sidebar Navigation (260px) */}
      <aside className="hidden lg:flex flex-col justify-between w-64 shrink-0 border-r border-white/10 bg-slate-950/85 backdrop-blur-xl p-5 no-print">
        <div className="space-y-6">
          {/* Sidebar Brand Header */}
          <div className="px-2 pt-1">
            <button
              type="button"
              onClick={() => setActivePage("dashboard")}
              className="text-xl font-bold font-display tracking-wider text-white hover:text-cyan-400 transition-colors cursor-pointer"
            >
              CyberShield
            </button>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              AI Security Command Center
            </div>
          </div>

          {/* Primary Navigation Items */}
          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/35 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/70 border border-transparent"
                  }`}
                >
                  <span className={isActive ? "text-cyan-400" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Operator Identity & Logout */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="px-2">
            <div className="text-xs font-semibold text-white truncate">
              {user.displayName}
            </div>
            <div className="text-[11px] font-mono text-slate-400 truncate">
              {user.email}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-xs font-medium text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean 3-Zone Top Bar Contract */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80 backdrop-blur-md no-print">
          {/* Zone 1: Single Text Brand / Active Section */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault();
                setActivePage("dashboard");
              }}
              className="text-base font-bold font-display tracking-wide text-white whitespace-nowrap"
            >
              CyberShield Command
            </a>
          </div>

          {/* Zone 2: 5 Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <button
              type="button"
              onClick={() => setActivePage("dashboard")}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activePage === "dashboard" ? "text-cyan-400" : ""
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActivePage("email-analyzer")}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activePage === "email-analyzer" ? "text-cyan-400" : ""
              }`}
            >
              Email Analyzer
            </button>
            <button
              type="button"
              onClick={() => setActivePage("scam-detector")}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activePage === "scam-detector" ? "text-cyan-400" : ""
              }`}
            >
              Scam Detector
            </button>
            <button
              type="button"
              onClick={() => setActivePage("screenshot-scanner")}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activePage === "screenshot-scanner" ? "text-cyan-400" : ""
              }`}
            >
              OCR Scanner
            </button>
            <button
              type="button"
              onClick={() => setActivePage("awareness")}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activePage === "awareness" ? "text-cyan-400" : ""
              }`}
            >
              Awareness
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActivePage("scam-detector")}
              className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              + New Threat Scan
            </button>
          </div>
        </header>

        {/* Mobile Drawer Navigation */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-white/10 p-4 space-y-1 no-print">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActivePage(item.id);
                  setMobileNavOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium ${
                  activePage === item.id
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Active Viewport Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activePage === "dashboard" && (
            <DashboardView
              history={history}
              onNavigate={(page) => setActivePage(page)}
              onSelectRecord={(rec) => setSelectedHistoryRecord(rec)}
              realtimeAlertsEnabled={user.realtimeAlertsEnabled}
            />
          )}

          {activePage === "email-analyzer" && (
            <EmailAnalyzerView
              onAnalysisComplete={handleEmailAnalysisComplete}
              onExportReport={handleExportEmailReport}
            />
          )}

          {activePage === "scam-detector" && (
            <ScamMessageDetectorView
              initialPrefillMessage={prefillScamMessage}
              onAnalysisComplete={handleMessageAnalysisComplete}
              onExportReport={handleExportMessageReport}
            />
          )}

          {activePage === "screenshot-scanner" && (
            <ScreenshotScannerView
              onAnalysisComplete={handleScreenshotAnalysisComplete}
              onExportReport={handleExportScreenshotReport}
            />
          )}

          {activePage === "history" && (
            <HistoryView
              history={history}
              onSelectRecord={(rec) => setSelectedHistoryRecord(rec)}
              onDeleteRecord={(id) => {
                const updated = firebaseService.deleteHistoryItem(user.uid, id);
                setHistory(updated);
              }}
            />
          )}

          {activePage === "reports" && (
            <ReportsView
              reports={reports}
              onCreateIncidentReport={(newRpt) => {
                const saved = firebaseService.saveSecurityReport(user.uid, newRpt);
                setReports((prev) => [saved, ...prev]);
              }}
              onDeleteReport={(id) => {
                const updated = firebaseService.deleteSecurityReport(user.uid, id);
                setReports(updated);
              }}
            />
          )}

          {activePage === "awareness" && (
            <AwarenessCenterView
              onTestScenarioInDetector={(sampleMsg) => {
                setPrefillScamMessage(sampleMsg);
                setActivePage("scam-detector");
              }}
            />
          )}

          {activePage === "assistant" && (
            <VoiceAssistantWidget
              mode="page"
              onNavigate={(page) => setActivePage(page)}
              defaultTtsEnabled={user.voiceTtsEnabled}
            />
          )}

          {activePage === "settings" && (
            <SettingsView
              user={user}
              onUpdateUser={(partial) => {
                const updated = firebaseService.updateUserSettings(partial);
                if (updated) setUser(updated);
              }}
            />
          )}
        </main>
      </div>

      {/* Persistent Floating Voice AI Assistant Widget on all pages except dedicated assistant page */}
      {activePage !== "assistant" && (
        <VoiceAssistantWidget
          mode="floating"
          onNavigate={(page) => setActivePage(page)}
          defaultTtsEnabled={user.voiceTtsEnabled}
        />
      )}

      {/* Modal for Opening Complete Forensic Result from History or Dashboard */}
      {selectedHistoryRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-cyan-500/35 p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="text-xs font-mono text-cyan-400">
                  FORENSIC RECORD · {selectedHistoryRecord.category.toUpperCase()} ·{" "}
                  {selectedHistoryRecord.id}
                </div>
                <h3 className="text-lg font-bold font-display text-white mt-0.5">
                  {selectedHistoryRecord.title}
                </h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  {selectedHistoryRecord.subtitle} ·{" "}
                  {new Date(selectedHistoryRecord.timestamp).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHistoryRecord(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>

            <HolographicGauge
              score={selectedHistoryRecord.riskScore}
              classification={selectedHistoryRecord.classification}
              confidence={selectedHistoryRecord.confidence}
              subtitle={`Status: ${selectedHistoryRecord.status}`}
            />

            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-1.5">
              <div className="text-xs font-mono text-cyan-400">ANALYSIS SUMMARY</div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedHistoryRecord.summary}
              </p>
            </div>

            {"confirmedEvidence" in selectedHistoryRecord.details && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>CONFIRMED EVIDENCE</span>
                  </div>
                  <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                    {selectedHistoryRecord.details.confirmedEvidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-sky-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>UNCERTAIN FACTORS</span>
                  </div>
                  <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                    {selectedHistoryRecord.details.uncertainFactors.map((unc, i) => (
                      <li key={i}>{unc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300">
                <AlertTriangle className="w-4 h-4" />
                <span>RECOMMENDED ACTION</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedHistoryRecord.recommendedAction}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
