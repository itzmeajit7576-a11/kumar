import React, { useEffect, useRef, useState } from "react";
import {
  ScanLine,
  Upload,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Smartphone,
} from "lucide-react";
import { ScreenshotAnalysisResult } from "../types/security";
import { HolographicGauge } from "./HolographicGauge";

interface ScreenshotScannerViewProps {
  onAnalysisComplete: (
    title: string,
    subtitle: string,
    result: ScreenshotAnalysisResult
  ) => void;
  onExportReport: (title: string, result: ScreenshotAnalysisResult) => void;
}

interface SyntheticScreenshotSample {
  id: string;
  label: string;
  headerTitle: string;
  headerSubtitle: string;
  platformBadge: string;
  lines: string[];
  accentColor: string;
  fallbackText: string;
}

const SYNTHETIC_SAMPLES: SyntheticScreenshotSample[] = [
  {
    id: "upi-collect-shot",
    label: "Sample 1: UPI ₹14,500 Collect Scam",
    headerTitle: "PhonePe / GPay Reward Desk",
    headerSubtitle: "+91 98112 44019 · Unverified Business",
    platformBadge: "WHATSAPP PAYMENT SCREENSHOT",
    accentColor: "#ef4444",
    lines: [
      "CONGRATULATIONS! Festival Cashback Won!",
      "You have received ₹14,500 Reward Cashback.",
      "ACTION REQUIRED WITHIN 15 MINUTES:",
      "Click 'PAY / APPROVE' and enter your 4-digit",
      "UPI PIN to credit ₹14,500 into your bank.",
      "Claim Link: https://upi-reward-claim.top/collect",
    ],
    fallbackText:
      "CONGRATULATIONS! Festival Cashback Won! You have received ₹14,500 Reward Cashback. ACTION REQUIRED WITHIN 15 MINUTES: Click 'PAY / APPROVE' and enter your 4-digit UPI PIN to credit ₹14,500 into your bank. Claim Link: https://upi-reward-claim.top/collect",
  },
  {
    id: "bank-kyc-shot",
    label: "Sample 2: Fake Bank KYC Suspension SMS",
    headerTitle: "SMS Message · +91 80912 33104",
    headerSubtitle: "Today, 10:42 AM · Unknown Sender",
    platformBadge: "MOBILE SMS SCREENSHOT",
    accentColor: "#f59e0b",
    lines: [
      "URGENT BANK ALERT: Dear Customer,",
      "Your HDFC/SBI NetBanking & PAN Card KYC",
      "has expired today. Your account will be",
      "frozen within 24 hours.",
      "Update KYC Now: http://secure-kyc-verify.xyz/login",
      "Or call KYC Officer: +91 8091233104",
    ],
    fallbackText:
      "URGENT BANK ALERT: Dear Customer, Your HDFC/SBI NetBanking & PAN Card KYC has expired today. Your account will be frozen within 24 hours. Update KYC Now: http://secure-kyc-verify.xyz/login Or call KYC Officer: +91 8091233104",
  },
  {
    id: "safe-bank-shot",
    label: "Sample 3: Official Transactional OTP",
    headerTitle: "VM-HDFCBK · Official Bank Header",
    headerSubtitle: "Verified Financial Sender",
    platformBadge: "VERIFIED SMS SCREENSHOT",
    accentColor: "#10b981",
    lines: [
      "HDFC Bank Security Alert:",
      "739201 is your One Time Password (OTP)",
      "for NetBanking transaction of ₹1,250.00.",
      "DO NOT SHARE this OTP with anyone.",
      "Bank officials will never ask for your",
      "OTP, PIN, or CVV over phone or SMS.",
    ],
    fallbackText:
      "HDFC Bank Security Alert: 739201 is your One Time Password (OTP) for NetBanking transaction of ₹1,250.00. DO NOT SHARE this OTP with anyone. Bank officials will never ask for your OTP, PIN, or CVV over phone or SMS.",
  },
];

function renderSyntheticScreenshotToDataUrl(sample: SyntheticScreenshotSample): string {
  const canvas = document.createElement("canvas");
  canvas.width = 680;
  canvas.height = 460;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Phone UI dark background
  ctx.fillStyle = "#090f1d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top phone status bar
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, 72);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 13px monospace";
  ctx.fillText(sample.platformBadge, 28, 26);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText(sample.headerTitle, 28, 50);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "13px monospace";
  ctx.fillText(sample.headerSubtitle, 370, 50);

  // Message bubble container
  ctx.fillStyle = "#111c33";
  ctx.strokeStyle = sample.accentColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(28, 96, 624, 310, 16);
  ctx.fill();
  ctx.stroke();

  // Render text lines
  ctx.font = "19px sans-serif";
  sample.lines.forEach((line, index) => {
    const y = 145 + index * 42;
    if (line.includes("http") || line.includes("PIN") || line.includes("URGENT") || line.includes("CONGRATULATIONS")) {
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 19px sans-serif";
    } else {
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "18px sans-serif";
    }
    ctx.fillText(line, 52, y);
  });

  // Footer timestamp inside screenshot
  ctx.fillStyle = "#64748b";
  ctx.font = "12px monospace";
  ctx.fillText("Captured Mobile Screenshot · 680x460px · Optical Input", 40, 438);

  return canvas.toDataURL("image/png");
}

export const ScreenshotScannerView: React.FC<ScreenshotScannerViewProps> = ({
  onAnalysisComplete,
  onExportReport,
}) => {
  const [selectedSample, setSelectedSample] = useState<SyntheticScreenshotSample>(
    SYNTHETIC_SAMPLES[0]
  );
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [fallbackText, setFallbackText] = useState<string>(SYNTHETIC_SAMPLES[0].fallbackText);
  const [loading, setLoading] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);
  const [result, setResult] = useState<ScreenshotAnalysisResult | null>(null);
  const [reportExported, setReportExported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize with first synthetic screenshot on mount
  useEffect(() => {
    const url = renderSyntheticScreenshotToDataUrl(SYNTHETIC_SAMPLES[0]);
    setImageDataUrl(url);
  }, []);

  const handleSelectSample = (sample: SyntheticScreenshotSample) => {
    setSelectedSample(sample);
    const url = renderSyntheticScreenshotToDataUrl(sample);
    setImageDataUrl(url);
    setMimeType("image/png");
    setFallbackText(sample.fallbackText);
    setResult(null);
    setReportExported(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = String(ev.target?.result || "");
      setImageDataUrl(dataUrl);
      setMimeType(file.type || "image/png");
      setFallbackText(
        `Uploaded screenshot file (${file.name}). Please review extracted OCR text and visual indicators.`
      );
      setResult(null);
      setReportExported(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRunScan = async () => {
    if (!imageDataUrl) return;
    setLoading(true);
    setReportExported(false);

    try {
      const response = await fetch("/api/analyze-screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageDataUrl,
          mimeType,
          fallbackText,
        }),
      });
      const data: ScreenshotAnalysisResult = await response.json();
      const enriched: ScreenshotAnalysisResult = {
        ...data,
        imagePreviewUrl: imageDataUrl,
      };
      setResult(enriched);
      onAnalysisComplete(
        `Screenshot OCR: ${enriched.extractedText.slice(0, 56)}...`,
        `Image Upload · ${enriched.threatType}`,
        enriched
      );
    } catch (err) {
      console.error("Failed to scan screenshot:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Sample Screenshot Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <ScanLine className="w-4 h-4" />
            <span>MULTIMODAL OCR & VISUAL BOUNDING ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Scan Scam Screenshot
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload a screenshot (JPG, PNG, WebP) of a suspicious SMS, WhatsApp, or email message to
            extract text via OCR and highlight deceptive sections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-xs font-medium text-cyan-300 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            <span>Upload JPG / PNG Screenshot</span>
          </button>

          {SYNTHETIC_SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectSample(s)}
              className={`px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer whitespace-nowrap ${
                selectedSample.id === s.id
                  ? "bg-slate-800 border-cyan-500/40 text-white"
                  : "bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Screenshot Preview with Bounding Box Overlay */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-slate-900/65 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>SCREENSHOT PREVIEW & VISUAL HIGHLIGHTS</span>
            </div>
            {result && result.highlightedRegions?.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHighlights(!showHighlights)}
                className="px-2.5 py-1 rounded-md bg-slate-950 border border-white/15 text-xs font-mono text-cyan-300 flex items-center gap-1.5 cursor-pointer"
              >
                {showHighlights ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showHighlights ? "Hide Overlays" : "Show Overlays"}</span>
              </button>
            )}
          </div>

          {/* Image Viewport with Scanning Beam & Bounding Highlights */}
          <div className="relative rounded-xl overflow-hidden border border-white/15 bg-slate-950">
            {imageDataUrl ? (
              <div className="relative w-full">
                <img
                  src={imageDataUrl}
                  alt="Suspicious message screenshot preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block"
                />

                {/* Animated Laser Scan Beam while OCR is running */}
                {loading && (
                  <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none overflow-hidden">
                    <div className="w-full h-12 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-scan-beam" />
                  </div>
                )}

                {/* Visual Bounding Box Overlays over Suspicious Portions */}
                {result &&
                  showHighlights &&
                  result.highlightedRegions?.map((box, idx) => {
                    const isHigh = box.severity === "HIGH";
                    const borderStyle = isHigh
                      ? "border-red-500 bg-red-500/15 text-red-200"
                      : "border-amber-400 bg-amber-400/15 text-amber-200";
                    return (
                      <div
                        key={idx}
                        style={{
                          left: `${box.x}%`,
                          top: `${box.y}%`,
                          width: `${box.width}%`,
                          height: `${box.height}%`,
                        }}
                        className={`absolute border-2 rounded-lg transition-all duration-300 pointer-events-auto group ${borderStyle}`}
                      >
                        <span
                          className={`absolute -top-5 left-0 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-t ${
                            isHigh ? "bg-red-600 text-white" : "bg-amber-500 text-slate-950"
                          }`}
                        >
                          {box.label}
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-xs font-mono text-slate-500">
                No screenshot loaded
              </div>
            )}
          </div>

          {/* Scan Action Button */}
          <button
            type="button"
            disabled={loading || !imageDataUrl}
            onClick={handleRunScan}
            className="w-full py-3 px-5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {loading
                ? "Extracting OCR Text & Evaluating Threat..."
                : "Run Optical OCR & Threat Scan"}
            </span>
          </button>
        </div>

        {/* Right: OCR Extracted Text & Threat Score Result */}
        <div className="lg:col-span-6 space-y-5">
          {loading ? (
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-10 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <div className="text-base font-display font-bold text-white">
                Performing Optical Character Recognition (OCR)...
              </div>
              <p className="text-xs font-mono text-slate-400">
                Segmenting message lines · Detecting deceptive URLs · Computing bounding regions
              </p>
            </div>
          ) : result ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-6">
              {/* Threat Type & Risk Score Gauge */}
              <HolographicGauge
                score={result.riskScore}
                classification={result.threatType}
                confidence={result.confidence}
                subtitle={`Threat Type: ${result.threatType} · Risk Score: ${result.riskScore}/100`}
              />

              {/* Extracted OCR Text */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span>EXTRACTED MESSAGE (OCR TEXT)</span>
                  <span className="text-slate-400">Optical Extraction Complete</span>
                </div>
                <blockquote className="text-sm font-mono text-slate-200 bg-slate-900/90 p-3.5 rounded-lg border border-white/5 leading-relaxed">
                  “{result.extractedText}”
                </blockquote>
              </div>

              {/* Security Explanation */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-1.5">
                <div className="text-xs font-mono text-amber-400">AI SECURITY EXPLANATION</div>
                <p className="text-sm text-slate-200 leading-relaxed">{result.explanation}</p>
              </div>

              {/* Detected Indicators */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="text-xs font-mono text-red-400">DETECTED INDICATORS</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                  {result.detectedIndicators.map((ind, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/90 border border-white/5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Confirmed Evidence vs Uncertain Factors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>CONFIRMED EVIDENCE</span>
                  </div>
                  <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                    {result.confirmedEvidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-sky-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>UNCERTAIN FACTORS</span>
                  </div>
                  <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
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
                  “{result.recommendedAction}”
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    Saved to Screenshot Scan History
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onExportReport("Screenshot OCR Forensic Report", result);
                      setReportExported(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>
                      {reportExported ? "Saved to Security Reports ✓" : "Export OCR Report"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-10 text-center space-y-3">
              <ScanLine className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
              <h3 className="text-lg font-bold font-display text-white">
                Screenshot Ready for Optical OCR Scan
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Click <strong className="text-slate-200">Run Optical OCR & Threat Scan</strong> on
                the loaded screenshot preview, or upload your own JPG/PNG screenshot to extract text
                and highlight suspicious regions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
