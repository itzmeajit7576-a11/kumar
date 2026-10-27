import React, { useRef, useState } from "react";
import {
  Mail,
  Upload,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Link2,
  Paperclip,
  FileText,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { EmailAnalysisResult } from "../types/security";
import { useLanguage } from "../i18n/LanguageContext";
import { HolographicGauge } from "./HolographicGauge";

interface EmailAnalyzerViewProps {
  onAnalysisComplete: (
    title: string,
    subtitle: string,
    result: EmailAnalysisResult
  ) => void;
  onExportReport: (title: string, result: EmailAnalysisResult) => void;
}

const EMAIL_PRESETS = [
  {
    id: "phishing-m365",
    label: "Phishing: M365 Password Expiry",
    subject: "URGENT: Your Corporate Microsoft 365 Password Expires in 2 Hours",
    sender: "Microsoft Security Team <security-update@micr0soft-auth-portal.xyz>",
    recipient: "itzmeajit7576@gmail.com",
    headers: `Received: from mail.micr0soft-auth-portal.xyz (185.234.219.44)
Authentication-Results: mx.google.com; spf=fail (google.com: domain of security-update@micr0soft-auth-portal.xyz does not designate 185.234.219.44 as permitted sender); dkim=fail; dmarc=fail
Reply-To: harvest-admin@protonmail.com`,
    attachments: "",
    body: `Dear Office User,

Your corporate Microsoft 365 account password is scheduled to expire in 2 hours due to a mandatory security upgrade.
If you do not verify your credentials immediately, your email access and OneDrive files will be permanently suspended.

Keep Same Password Here: https://micr0soft-auth-portal.xyz/sso/login?user=itzmeajit7576@gmail.com

Thank you,
IT Security Desk`,
  },
  {
    id: "bec-wire",
    label: "BEC: Urgent CFO Wire Transfer",
    subject: "Confidential: Overdue Vendor Settlement — Updated Beneficiary Bank",
    sender: "Vikram Mehta - CFO <cfo.office.exec@gmail.com>",
    recipient: "finance-team@company.org",
    headers: `Authentication-Results: mx.google.com; spf=pass; dkim=pass; dmarc=pass
Reply-To: vikram.exec.private@outlook.com`,
    attachments: "Updated_Wire_Instructions_Invoice_882.pdf.exe",
    body: `Hi,

I am currently locked in our Q4 board strategy session and cannot take phone calls.
We need to process an urgent wire transfer of $48,500 to our international supplier before the 4:00 PM SWIFT cutoff today.

Note that their beneficiary routing and IBAN details changed this morning. Please open the attached executable PDF instruction sheet and send me the wire confirmation receipt within 30 minutes. Do not discuss this with anyone else until the board announcement.

Regards,
Vikram Mehta
Chief Financial Officer`,
  },
  {
    id: "safe-github",
    label: "Safe: Verified GitHub Security Alert",
    subject: "[GitHub] A new public key was added to your account",
    sender: "GitHub <noreply@github.com>",
    recipient: "itzmeajit7576@gmail.com",
    headers: `Authentication-Results: mx.google.com; spf=pass (google.com: domain of noreply@github.com designates 192.30.252.204 as permitted sender); dkim=pass header.i=@github.com; dmarc=pass`,
    attachments: "SSH_Audit_Receipt.pdf",
    body: `Hey developer,

A new SSH public key (SHA256:9xK2Lp8vR...) was added to your GitHub account from a recognized workstation.

If you added this key, no further action is needed. To review your active keys, visit your account settings directly at https://github.com/settings/keys.

Thanks,
The GitHub Team`,
  },
];

export const EmailAnalyzerView: React.FC<EmailAnalyzerViewProps> = ({
  onAnalysisComplete,
  onExportReport,
}) => {
  const { currentTranslations, language } = useLanguage();
  const t = currentTranslations;
  const [subject, setSubject] = useState(EMAIL_PRESETS[0].subject);
  const [sender, setSender] = useState(EMAIL_PRESETS[0].sender);
  const [recipient, setRecipient] = useState(EMAIL_PRESETS[0].recipient);
  const [headers, setHeaders] = useState(EMAIL_PRESETS[0].headers);
  const [attachmentsInput, setAttachmentsInput] = useState(EMAIL_PRESETS[0].attachments);
  const [body, setBody] = useState(EMAIL_PRESETS[0].body);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailAnalysisResult | null>(null);
  const [reportExported, setReportExported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Parse .eml file upload
  const handleEmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || "");
      const parts = content.split(/\r?\n\r?\n/);
      const rawHeaderBlock = parts[0] || "";
      const rawBodyBlock = parts.slice(1).join("\n\n") || content;

      const subjMatch = rawHeaderBlock.match(/^Subject:\s*(.+)$/im);
      const fromMatch = rawHeaderBlock.match(/^From:\s*(.+)$/im);
      const toMatch = rawHeaderBlock.match(/^To:\s*(.+)$/im);
      const fileMatches = Array.from(
        content.matchAll(/filename=["']?([^"'\r\n;]+)["']?/gi)
      ).map((m) => m[1]);

      if (subjMatch) setSubject(subjMatch[1].trim());
      if (fromMatch) setSender(fromMatch[1].trim());
      if (toMatch) setRecipient(toMatch[1].trim());
      setHeaders(rawHeaderBlock.trim());
      if (fileMatches.length > 0) setAttachmentsInput(fileMatches.join(", "));
      setBody(rawBodyBlock.trim());
      setResult(null);
    };
    reader.readAsText(file);
  };

  const handleLoadPreset = (preset: (typeof EMAIL_PRESETS)[0]) => {
    setSubject(preset.subject);
    setSender(preset.sender);
    setRecipient(preset.recipient);
    setHeaders(preset.headers);
    setAttachmentsInput(preset.attachments);
    setBody(preset.body);
    setResult(null);
    setReportExported(false);
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReportExported(false);
    try {
      const attachments = attachmentsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const response = await fetch("/api/analyze-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          sender,
          recipient,
          headers,
          body,
          attachments,
          language,
        }),
      });
      const data: EmailAnalysisResult = await response.json();
      setResult(data);
      onAnalysisComplete(
        subject || "Untitled Email Inspection",
        sender || "Unknown Sender",
        data
      );
    } catch (err) {
      console.error("Failed to analyze email:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Preset Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Mail className="w-4 h-4" />
            <span>FORENSIC SMTP & HEADER ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            {t.emailAnalyzer.title}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload a <code className="text-cyan-300 font-mono">.eml</code> file or inspect headers,
            SPF/DKIM/DMARC alignment, URLs, attachments, and BEC indicators.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".eml,.txt,.msg"
            onChange={handleEmlUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-xs font-medium text-cyan-300 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            <span>Upload .eml File</span>
          </button>

          {EMAIL_PRESETS.map((p) => (
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

      {/* Main Split Grid: Input Form vs Forensic Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Email Inspection Form */}
        <form
          onSubmit={handleRunAnalysis}
          className="lg:col-span-6 rounded-2xl border border-white/10 bg-slate-900/65 p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Subject Line
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., URGENT: Verify your account within 24 hours"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Sender Address (From)
              </label>
              <input
                type="text"
                required
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="security@domain.com"
                className="w-full px-3.5 py-2 text-sm font-mono bg-slate-950 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Recipient Address (To)
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="you@organization.com"
                className="w-full px-3.5 py-2 text-sm font-mono bg-slate-950 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Raw Email Headers (SPF / DKIM / DMARC / Reply-To)
            </label>
            <textarea
              rows={3}
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              placeholder="Paste Authentication-Results, Received, and Reply-To headers..."
              className="w-full px-3.5 py-2 text-xs font-mono bg-slate-950 border border-white/15 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Attachment Filenames (comma-separated, optional)
            </label>
            <input
              type="text"
              value={attachmentsInput}
              onChange={(e) => setAttachmentsInput(e.target.value)}
              placeholder="e.g., Invoice_8821.pdf.exe, Remittance.xlsm"
              className="w-full px-3.5 py-2 text-xs font-mono bg-slate-950 border border-white/15 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Message Body
            </label>
            <textarea
              rows={7}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Paste the complete email body content here..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Running Deep Email Forensics..." : "Analyze Email Threat"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSubject("");
                setSender("");
                setHeaders("");
                setAttachmentsInput("");
                setBody("");
                setResult(null);
              }}
              className="py-2.5 px-3.5 bg-slate-950 hover:bg-slate-800 border border-white/10 rounded-lg text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </form>

        {/* Right: Forensic Threat Classification Output */}
        <div className="lg:col-span-6 space-y-5">
          {loading ? (
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-10 text-center space-y-4 relative overflow-hidden">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <div className="text-base font-display font-bold text-white">
                Inspecting Headers, Links & BEC Signatures...
              </div>
              <p className="text-xs font-mono text-slate-400">
                Verifying SPF/DKIM alignment · Extracting URLs · Evaluating coercion patterns
              </p>
            </div>
          ) : result ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-6">
              {/* Top Holographic Gauge */}
              <HolographicGauge
                score={result.riskScore}
                classification={result.classification}
                confidence={result.confidence}
                subtitle={`Threat Level: ${result.threatLevel}`}
              />

              {/* Plain-language Summary */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-white/10 space-y-1.5">
                <div className="text-xs font-mono text-cyan-400">EXECUTIVE SUMMARY</div>
                <p className="text-sm text-slate-200 leading-relaxed">{result.summary}</p>
              </div>

              {/* Sender & Authentication Matrix (SPF / DKIM / DMARC) */}
              <div className="p-4 rounded-xl bg-slate-950/75 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>SENDER & CRYPTOGRAPHIC AUTHENTICATION</span>
                  <span className="text-slate-300">
                    Impersonation Risk: <strong>{result.senderInfo.impersonationRisk}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
                  {(["spf", "dkim", "dmarc"] as const).map((proto) => {
                    const val = result.senderInfo[proto];
                    const tone =
                      val === "PASS"
                        ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/20"
                        : val === "FAIL" || val === "SOFTFAIL"
                        ? "text-red-400 border-red-500/30 bg-red-950/20"
                        : "text-amber-300 border-amber-500/30 bg-amber-950/20";
                    return (
                      <div key={proto} className={`p-2.5 rounded-lg border ${tone}`}>
                        <div className="text-[11px] text-slate-400 uppercase">{proto}</div>
                        <div className="font-bold mt-0.5">{val}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirement #17: Epistemic Separation (Confirmed Evidence vs Suspicious vs Uncertain) */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CONFIRMED TECHNICAL EVIDENCE</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {result.confirmedEvidence.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>SUSPICIOUS BEHAVIORAL INDICATORS</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {result.suspiciousIndicators.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                    {result.becIndicators.map((item, i) => (
                      <li key={`bec-${i}`} className="text-amber-200">
                        [BEC Indicator] {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>UNCERTAIN / CONTEXTUAL FACTORS</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                    {result.uncertainFactors.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Extracted URLs & Attachments */}
              {(result.urls.length > 0 || result.attachmentsInfo.length > 0) && (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  {result.urls.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-2">
                        <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>EXTRACTED URLS & DOMAIN REPUTATION ({result.urls.length})</span>
                      </div>
                      <div className="space-y-2">
                        {result.urls.map((u, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-slate-950 border border-white/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div className="truncate">
                              <div className="font-mono text-slate-200 truncate">{u.url}</div>
                              <div className="text-[11px] text-slate-400">{u.reason}</div>
                            </div>
                            <span
                              className={`font-mono text-[11px] font-semibold shrink-0 ${
                                u.status === "DANGEROUS"
                                  ? "text-red-400"
                                  : u.status === "SAFE"
                                  ? "text-emerald-400"
                                  : "text-amber-400"
                              }`}
                            >
                              {u.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.attachmentsInfo.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-2">
                        <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                        <span>ATTACHMENT PAYLOAD INSPECTION</span>
                      </div>
                      <div className="space-y-1.5">
                        {result.attachmentsInfo.map((att, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-slate-950 border border-white/10 text-xs flex items-center justify-between"
                          >
                            <span className="font-mono text-slate-200">{att.name}</span>
                            <span
                              className={`font-mono text-[11px] ${
                                att.risk.startsWith("HIGH")
                                  ? "text-red-400 font-semibold"
                                  : "text-emerald-400"
                              }`}
                            >
                              {att.risk}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Recommended Action & Export Report */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <ShieldAlert className="w-4 h-4" />
                  <span>RECOMMENDED SECURITY ACTION</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {result.recommendedAction}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Automatically saved to Firestore Threat History
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onExportReport(subject || "Email Forensic Report", result);
                      setReportExported(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>
                      {reportExported ? "Saved to Security Reports ✓" : "Generate Formal Report"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-10 text-center space-y-3">
              <Mail className="w-10 h-10 text-cyan-400 mx-auto opacity-80" />
              <h3 className="text-lg font-bold font-display text-white">
                Ready for Email Threat Inspection
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Select one of the presets above, upload a <code className="font-mono">.eml</code>{" "}
                message file, or paste suspicious email content and click{" "}
                <strong className="text-slate-200">Analyze Email Threat</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
