import React, { useState, useRef, useEffect } from "react";
import { Languages, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { SupportedLanguage } from "../types/security";

interface LanguageSelectorProps {
  variant?: "pill" | "compact" | "full";
  className?: string;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = "pill",
  className = "",
  onLanguageChange,
}) => {
  const { language, setLanguage, languages, currentLangOption } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setDropdownOpen(false);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  if (variant === "compact") {
    // Quick segment buttons for tight spaces (e.g. mobile drawer or inside forms)
    return (
      <div className={`inline-flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 ${className}`}>
        {languages.map((l) => {
          const isActive = l.code === language;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => handleSelect(l.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-500 text-slate-950 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title={l.name}
            >
              {l.nativeName}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 hover:border-cyan-500/40 text-xs font-medium text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
        aria-label="Select application language"
        aria-expanded={dropdownOpen}
      >
        <Languages className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold text-white tracking-wide">
          {currentLangOption.nativeName}
        </span>
        <span className="text-[10px] text-slate-400 uppercase font-mono">
          ({currentLangOption.code})
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            dropdownOpen ? "rotate-180 text-cyan-400" : ""
          }`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/35 p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/10 mb-1">
            Choose Language / ಭಾಷೆ
          </div>
          {languages.map((opt) => {
            const isSelected = opt.code === language;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleSelect(opt.code)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{opt.flag}</span>
                  <div>
                    <div className="text-white font-medium">{opt.nativeName}</div>
                    <div className="text-[10px] text-slate-400">{opt.name}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
