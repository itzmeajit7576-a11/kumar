import React from "react";

interface HolographicGaugeProps {
  score: number;
  classification: string;
  confidence?: number;
  subtitle?: string;
}

export const HolographicGauge: React.FC<HolographicGaugeProps> = ({
  score,
  classification,
  confidence = 90,
  subtitle = "Forensic Threat Index",
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const isCritical =
    clampedScore >= 65 ||
    ["PHISHING", "SCAM", "MALICIOUS", "HIGH RISK"].includes(classification.toUpperCase());
  const isWarning =
    !isCritical &&
    (clampedScore >= 35 ||
      ["SUSPICIOUS", "SPAM", "LOW RISK"].includes(classification.toUpperCase()));

  const strokeColor = isCritical
    ? "#EF4444"
    : isWarning
    ? "#F59E0B"
    : "#10B981";

  const textColor = isCritical
    ? "text-red-400"
    : isWarning
    ? "text-amber-400"
    : "text-emerald-400";

  const borderAccent = isCritical
    ? "border-red-500/30 bg-red-950/20"
    : isWarning
    ? "border-amber-500/30 bg-amber-950/20"
    : "border-emerald-500/30 bg-emerald-950/20";

  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-6 p-5 rounded-xl border ${borderAccent} transition-all duration-300`}
    >
      {/* Circular Holographic SVG Gauge */}
      <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
          {/* Outer decorative tick ring */}
          <circle
            cx="70"
            cy="70"
            r="66"
            fill="none"
            stroke="rgba(148, 163, 184, 0.12)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          {/* Background track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="rgba(15, 23, 42, 0.9)"
            strokeWidth="10"
          />
          {/* Animated value arc */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-bold font-mono tabular-nums ${textColor}`}>
            {clampedScore}
          </span>
          <span className="text-[11px] font-mono text-slate-400">/ 100 RISK</span>
        </div>
      </div>

      {/* Classification & Confidence Readout */}
      <div className="flex-1 text-center sm:text-left space-y-2">
        <div className="text-xs font-mono text-slate-400">
          {subtitle} · Confidence <span className="text-slate-200 tabular-nums">{confidence}%</span>
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <span className={`text-2xl font-bold font-display tracking-wide ${textColor}`}>
            {classification}
          </span>
          <span className="text-xs font-mono text-slate-400">
            · {isCritical ? "Immediate Action Required" : isWarning ? "Caution Advised" : "Verified Safe"}
          </span>
        </div>
        <div className="w-full bg-slate-900/90 h-2 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${clampedScore}%`,
              backgroundColor: strokeColor,
            }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400 tabular-nums">
          <span>0 Safe</span>
          <span>35 Suspicious</span>
          <span>70+ High Threat</span>
        </div>
      </div>
    </div>
  );
};
