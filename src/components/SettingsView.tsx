import React, { useState } from "react";
import {
  Settings,
  Shield,
  User,
  CheckCircle2,
  Lock,
  Database,
} from "lucide-react";
import { SupportedLanguage, UserProfile } from "../types/security";
import { useLanguage } from "../i18n/LanguageContext";
import { Languages, Check } from "lucide-react";

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (partial: Partial<UserProfile>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser }) => {
  const { currentTranslations, language, setLanguage, languages } = useLanguage();
  const t = currentTranslations;
  const [displayName, setDisplayName] = useState(user.displayName);
  const [organization, setOrganization] = useState(user.organization);
  const [role, setRole] = useState(user.role);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      displayName: displayName.trim() || user.displayName,
      organization: organization.trim() || user.organization,
      role: role.trim() || user.role,
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Settings className="w-4 h-4" />
          <span>OPERATOR PREFERENCES & ZERO-TRUST FIRESTORE POSTURE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          {t.settings.title}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {t.settings.subtitle}
          controls.
        </p>
      </div>

      {savedBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Operator profile and security preferences updated in Firestore.</span>
        </div>
      )}

            {/* Language Preference Section */}
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold font-display text-white border-b border-white/10 pb-3">
          <Languages className="w-4 h-4 text-cyan-400" />
          <span>{t.settings.languageHeader}</span>
        </div>
        <p className="text-xs text-slate-400">
          {t.settings.languageSubtext}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {languages.map((langOpt) => {
            const isSelected = language === langOpt.code;
            return (
              <button
                key={langOpt.code}
                type="button"
                onClick={() => {
                  setLanguage(langOpt.code);
                  onUpdateUser({ preferredLanguage: langOpt.code });
                }}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                    : "bg-slate-950/70 border-white/10 text-slate-300 hover:border-cyan-500/40 hover:text-white"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{langOpt.flag}</span>
                    <span className="font-bold text-sm tracking-wide text-white">
                      {langOpt.nativeName}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {langOpt.name} ({langOpt.code.toUpperCase()})
                  </div>
                </div>
                {isSelected && (
                  <div className="p-1 rounded-full bg-cyan-500 text-slate-950">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Operator Identity Form */}
        <form
          onSubmit={handleSaveProfile}
          className="lg:col-span-6 rounded-2xl border border-white/10 bg-slate-900/65 p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-sm font-bold font-display text-white border-b border-white/10 pb-3">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Operator Profile & Callsign</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-white/15 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-white/15 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Organization / Unit
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-white/15 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-mono text-slate-400">
            <div className="p-3 rounded-lg bg-slate-950 border border-white/10">
              <div>Authenticated Email</div>
              <div className="text-slate-200 mt-0.5 truncate">{user.email}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-white/10">
              <div>Auth Provider & UID</div>
              <div className="text-cyan-400 mt-0.5 truncate">
                {user.authProvider.toUpperCase()} · {user.uid}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs cursor-pointer"
          >
            {t.settings.saveProfile}
          </button>
        </form>

        {/* Security & Telemetry Toggles */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/65 p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold font-display text-white border-b border-white/10 pb-3">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Security & Assistant Controls</span>
            </div>

            {[
              {
                key: "mfaEnabled" as const,
                title: "Multi-Factor Authentication (MFA) Enforcement",
                desc: "Require hardware key or TOTP verification on sensitive account actions.",
                value: user.mfaEnabled,
              },
              {
                key: "voiceTtsEnabled" as const,
                title: "Voice AI Assistant Text-to-Speech (TTS)",
                desc: "Speak assistant security explanations aloud using the Web Speech API.",
                value: user.voiceTtsEnabled,
              },
              {
                key: "realtimeAlertsEnabled" as const,
                title: "Simulated Live Threat Demo Stream",
                desc: "Auto-rotate educational scam campaign alerts on the main dashboard.",
                value: user.realtimeAlertsEnabled,
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-950/80 border border-white/10"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateUser({ [item.key]: !item.value })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer shrink-0 ${
                    item.value
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 border border-white/10"
                  }`}
                >
                  {item.value ? "ENABLED" : "DISABLED"}
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-cyan-500/25 bg-slate-900/65 p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Database className="w-4 h-4" />
              <span>FIRESTORE DATA ISOLATION & SECURITY RULES</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your email analysis history, scam message inspections, screenshot OCR results, and
              exported forensic reports are scoped strictly to{" "}
              <code className="font-mono text-cyan-300">/users/{user.uid}/*</code> with owner-only
              read/write verification.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Trust ABAC Rules Active · No Private API Keys in Client Bundle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
