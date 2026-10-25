import React, { useState } from "react";
import {
  FileText,
  Download,
  Printer,
  PlusCircle,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  Link2,
} from "lucide-react";
import { SecurityReport } from "../types/security";

interface ReportsViewProps {
  reports: SecurityReport[];
  onCreateIncidentReport: (
    report: Omit<SecurityReport, "id" | "userId" | "timestamp">
  ) => void;
  onDeleteReport: (id: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  onCreateIncidentReport,
  onDeleteReport,
}) => {
  const [selectedReport, setSelectedReport] = useState<SecurityReport | null>(
    reports[0] || null
  );
  const [filterType, setFilterType] = useState<string>("ALL");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Incident Report Submission Form state
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentChannel, setIncidentChannel] = useState<
    "Email Analysis" | "Scam Message Analysis" | "Screenshot Analysis" | "Incident Report"
  >("Incident Report");
  const [incidentClassification, setIncidentClassification] = useState("SCAM");
  const [incidentRiskScore, setIncidentRiskScore] = useState(85);
  const [incidentUrls, setIncidentUrls] = useState("");
  const [incidentIndicators, setIncidentIndicators] = useState("");
  const [incidentReason, setIncidentReason] = useState("");
  const [incidentAction, setIncidentAction] = useState(
    "Blocked sender, preserved forensic evidence, and escalated to cyber response desk."
  );

  const filteredReports = reports.filter((r) =>
    filterType === "ALL" ? true : r.inputType === filterType
  );

  const handleDownloadJson = (report: SecurityReport) => {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.id}_CyberShield_Forensic_Report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTextSummary = (report: SecurityReport) => {
    const lines = [
      "=================================================================",
      "          CYBERSHIELD FORENSIC SECURITY ANALYSIS REPORT          ",
      "=================================================================",
      `Report ID            : ${report.id}`,
      `Date / Time          : ${new Date(report.timestamp).toLocaleString()}`,
      `Input Type           : ${report.inputType}`,
      `Subject / Title      : ${report.title}`,
      `Threat Classification: ${report.classification}`,
      `Risk Score           : ${report.riskScore} / 100`,
      `Confidence           : ${report.confidence}%`,
      "-----------------------------------------------------------------",
      "DETECTION REASONS:",
      ...report.detectionReasons.map((r) => `  * ${r}`),
      "",
      "CONFIRMED EVIDENCE:",
      ...report.confirmedEvidence.map((e) => `  * ${e}`),
      "",
      "SUSPICIOUS URLS:",
      ...(report.suspiciousUrls.length > 0
        ? report.suspiciousUrls.map((u) => `  * ${u}`)
        : ["  * None extracted"]),
      "",
      "EXTRACTED INDICATORS:",
      ...report.extractedIndicators.map((i) => `  * ${i}`),
      "",
      "RECOMMENDED ACTION:",
      `  ${report.recommendedAction}`,
      "=================================================================",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.id}_Forensic_Summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle.trim()) return;

    onCreateIncidentReport({
      inputType: incidentChannel,
      title: incidentTitle.trim(),
      classification: incidentClassification,
      riskScore: Number(incidentRiskScore),
      confidence: 90,
      detectionReasons: incidentReason
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      suspiciousUrls: incidentUrls
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      extractedIndicators: incidentIndicators
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      confirmedEvidence: [
        `Operator-submitted forensic incident report (${incidentClassification}).`,
      ],
      uncertainFactors: [
        "Pending external abuse desk takedown confirmation.",
      ],
      recommendedAction: incidentAction,
    });

    setIncidentTitle("");
    setIncidentReason("");
    setIncidentUrls("");
    setIncidentIndicators("");
    setShowSubmitModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <FileText className="w-4 h-4" />
            <span>FORENSIC DOCUMENTATION & SCAM INCIDENT REPORTING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Security Reports & Scam Incident Filing
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review generated forensic reports across Email, Message, and Screenshot analyses, export
            to PDF/JSON, or file a new scam incident report.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-2 cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Scam Incident</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-white/10 w-fit no-print">
        {[
          "ALL",
          "Email Analysis",
          "Scam Message Analysis",
          "Screenshot Analysis",
          "Incident Report",
        ].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filterType === type
                ? "bg-cyan-500 text-slate-950 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {type === "ALL" ? `All Reports (${reports.length})` : type}
          </button>
        ))}
      </div>

      {/* Master-Detail Reports Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List of Reports */}
        <div className="lg:col-span-5 space-y-3 no-print">
          {filteredReports.length === 0 ? (
            <div className="p-8 rounded-2xl border border-white/10 bg-slate-900/40 text-center text-xs text-slate-400">
              No security reports match this filter.
            </div>
          ) : (
            filteredReports.map((rpt) => {
              const isSelected = selectedReport?.id === rpt.id;
              const isHigh = rpt.riskScore >= 65;
              const isMed = !isHigh && rpt.riskScore >= 35;
              const scoreColor = isHigh
                ? "text-red-400"
                : isMed
                ? "text-amber-400"
                : "text-emerald-400";

              return (
                <div
                  key={rpt.id}
                  onClick={() => setSelectedReport(rpt)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-800/90 border-cyan-400 shadow-lg"
                      : "bg-slate-900/60 border-white/10 hover:border-cyan-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>{rpt.id} · {rpt.inputType}</span>
                    <span className={`font-bold tabular-nums ${scoreColor}`}>
                      {rpt.riskScore}/100
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white truncate">{rpt.title}</h3>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className={scoreColor}>{rpt.classification}</span>
                    <span>
                      {new Date(rpt.timestamp).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Printable Forensic Report Document */}
        <div className="lg:col-span-7">
          {selectedReport ? (
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-6 sm:p-8 space-y-6">
              {/* Top Document Header & Export Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="text-xs font-mono text-cyan-400">
                    OFFICIAL FORENSIC REPORT · {selectedReport.id}
                  </div>
                  <h2 className="text-xl font-bold font-display text-white mt-1">
                    {selectedReport.title}
                  </h2>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                    <span>Input: {selectedReport.inputType}</span>
                    <span>·</span>
                    <span>
                      Generated: {new Date(selectedReport.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 no-print shrink-0">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadTextSummary(selectedReport)}
                    className="px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-white/15 text-xs text-slate-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.TXT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadJson(selectedReport)}
                    className="px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-white/15 text-xs text-slate-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteReport(selectedReport.id);
                      setSelectedReport(reports.find((r) => r.id !== selectedReport.id) || null);
                    }}
                    className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 cursor-pointer"
                    title="Delete report"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Metrics Strip */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950 border border-white/10 font-mono">
                <div>
                  <div className="text-[11px] text-slate-400">THREAT CLASSIFICATION</div>
                  <div
                    className={`text-base font-bold mt-0.5 ${
                      selectedReport.riskScore >= 65
                        ? "text-red-400"
                        : selectedReport.riskScore >= 35
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {selectedReport.classification}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">RISK SCORE</div>
                  <div className="text-base font-bold text-white tabular-nums mt-0.5">
                    {selectedReport.riskScore} / 100
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">CONFIDENCE</div>
                  <div className="text-base font-bold text-cyan-400 tabular-nums mt-0.5">
                    {selectedReport.confidence}%
                  </div>
                </div>
              </div>

              {/* Detection Reasons */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400">
                  PRIMARY DETECTION REASONS
                </div>
                <ul className="space-y-1.5 text-sm text-slate-200 list-disc list-inside bg-slate-950/70 p-4 rounded-xl border border-white/10">
                  {selectedReport.detectionReasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </div>

              {/* Confirmed Evidence & Extracted Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CONFIRMED EVIDENCE</span>
                  </div>
                  <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                    {selectedReport.confirmedEvidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                  <div className="text-xs font-mono text-amber-400">
                    EXTRACTED FORENSIC INDICATORS
                  </div>
                  <ul className="text-xs font-mono text-slate-300 list-disc list-inside space-y-1">
                    {selectedReport.extractedIndicators.map((ind, i) => (
                      <li key={i}>{ind}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suspicious URLs */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SUSPICIOUS URLS / DOMAINS LOGGED</span>
                </div>
                {selectedReport.suspiciousUrls.length > 0 ? (
                  <div className="space-y-1">
                    {selectedReport.suspiciousUrls.map((u, i) => (
                      <div key={i} className="text-xs font-mono text-red-300 break-all">
                        {u}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">
                    No suspicious URLs recorded in this report.
                  </div>
                )}
              </div>

              {/* Recommended Action */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <ShieldAlert className="w-4 h-4" />
                  <span>RECOMMENDED REMEDIATION ACTION</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedReport.recommendedAction}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-10 text-center text-xs text-slate-400">
              Select a report from the left list to view or export its forensic breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Modal to Submit New Scam Incident Report */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold font-display text-white">
                File New Scam Incident Report
              </h3>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmitIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Incident Title / Summary
                </label>
                <input
                  type="text"
                  required
                  value={incidentTitle}
                  onChange={(e) => setIncidentTitle(e.target.value)}
                  placeholder="e.g., Fake Customs Duty WhatsApp Call & Payment Link"
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-white/15 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Report Type
                  </label>
                  <select
                    value={incidentChannel}
                    onChange={(e) => setIncidentChannel(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-950 border border-white/15 rounded-lg text-white"
                  >
                    <option value="Incident Report">Incident Report</option>
                    <option value="Email Analysis">Email Analysis</option>
                    <option value="Scam Message Analysis">Scam Message Analysis</option>
                    <option value="Screenshot Analysis">Screenshot Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Classification
                  </label>
                  <select
                    value={incidentClassification}
                    onChange={(e) => setIncidentClassification(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-950 border border-white/15 rounded-lg text-white"
                  >
                    <option value="SCAM">SCAM</option>
                    <option value="PHISHING">PHISHING</option>
                    <option value="MALICIOUS">MALICIOUS</option>
                    <option value="SUSPICIOUS">SUSPICIOUS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Risk Score (0-100)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={incidentRiskScore}
                    onChange={(e) => setIncidentRiskScore(Number(e.target.value))}
                    className="w-full px-2.5 py-2 text-xs font-mono bg-slate-950 border border-white/15 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Observed Scam Reasons (one per line)
                </label>
                <textarea
                  rows={3}
                  required
                  value={incidentReason}
                  onChange={(e) => setIncidentReason(e.target.value)}
                  placeholder="Caller impersonated FedEx customs officer&#10;Demanded immediate UPI transfer to avoid parcel seizure"
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-white/15 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Suspicious URLs (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={incidentUrls}
                    onChange={(e) => setIncidentUrls(e.target.value)}
                    placeholder="https://fake-customs-pay.xyz"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-white/15 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Sender / Phone Indicators
                  </label>
                  <input
                    type="text"
                    value={incidentIndicators}
                    onChange={(e) => setIncidentIndicators(e.target.value)}
                    placeholder="Phone: +91 9001122334, VPA: scam@upi"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-white/15 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Recommended / Taken Action
                </label>
                <input
                  type="text"
                  value={incidentAction}
                  onChange={(e) => setIncidentAction(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-white/15 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs cursor-pointer"
                >
                  Save Incident Report to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
