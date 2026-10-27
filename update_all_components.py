import re

# ==========================================
# 1. Update ScamMessageDetectorView.tsx
# ==========================================
with open('src/components/ScamMessageDetectorView.tsx', 'r') as f:
    sm_code = f.read()

if 'useLanguage' not in sm_code:
    sm_code = sm_code.replace(
        'import { MessageAnalysisResult } from "../types/security";',
        'import { MessageAnalysisResult, SupportedLanguage } from "../types/security";\nimport { useLanguage } from "../i18n/LanguageContext";\nimport { TRANSLATIONS } from "../i18n/translations";'
    )

sm_code = sm_code.replace(
    'export const ScamMessageDetectorView: React.FC<ScamMessageDetectorViewProps> = ({\n  initialPrefillMessage,\n  onAnalysisComplete,\n  onExportReport,\n}) => {',
    '''export const ScamMessageDetectorView: React.FC<ScamMessageDetectorViewProps> = ({
  initialPrefillMessage,
  onAnalysisComplete,
  onExportReport,
}) => {
  const { currentTranslations, language } = useLanguage();
  const t = currentTranslations;
  const [presetLangTab, setPresetLangTab] = useState<"ACTIVE" | "kn" | "hi" | "en">("ACTIVE");'''
)

sm_code = sm_code.replace(
    '  const [sender, setSender] = useState(MESSAGE_PRESETS[0].sender);\n  const [message, setMessage] = useState(\n    initialPrefillMessage || MESSAGE_PRESETS[0].message\n  );',
    '''  const activePresetList =
    presetLangTab === "ACTIVE"
      ? t.messagePresets
      : TRANSLATIONS[presetLangTab as SupportedLanguage]?.messagePresets || t.messagePresets;

  const [sender, setSender] = useState(activePresetList[0]?.sender || "+91 98765 43210");
  const [message, setMessage] = useState(
    initialPrefillMessage || activePresetList[0]?.message || ""
  );'''
)

sm_code = sm_code.replace(
    'body: JSON.stringify({ platform, sender, message }),',
    'body: JSON.stringify({ platform, sender, message, language }),'
)

sm_code = sm_code.replace(
    'Scam Message & SMS Threat Detector',
    '{t.scamDetector.title}'
)
sm_code = sm_code.replace(
    'Inspect suspicious SMS, WhatsApp, or Telegram messages for social engineering, fake UPI collect lures, urgent threats, and advance-fee fraud.',
    '{t.scamDetector.subtitle}'
)
sm_code = sm_code.replace(
    'MESSAGE_PRESETS.map((p) =>',
    'activePresetList.map((p) =>'
)
sm_code = sm_code.replace(
    'Source Platform',
    '{t.scamDetector.platformLabel}'
)
sm_code = sm_code.replace(
    'Sender Name / Mobile Number',
    '{t.scamDetector.senderLabel}'
)
sm_code = sm_code.replace(
    'placeholder="e.g. +91 98765 43210 or IND-ALERT"',
    'placeholder={t.scamDetector.senderPlaceholder}'
)
sm_code = sm_code.replace(
    'Message Content',
    '{t.scamDetector.messageLabel}'
)
sm_code = sm_code.replace(
    'placeholder="Paste suspicious SMS or WhatsApp message text here..."',
    'placeholder={t.scamDetector.messagePlaceholder}'
)
sm_code = sm_code.replace(
    'Scanning Message Tactics...',
    '{t.scamDetector.analyzingBtn}'
)
sm_code = sm_code.replace(
    'Detect Scam Indicators',
    '{t.scamDetector.analyzeBtn}'
)
sm_code = sm_code.replace(
    'Export Message Report',
    '{t.scamDetector.exportReportBtn}'
)
sm_code = sm_code.replace(
    'DETECTION ASSESSMENT',
    '{t.scamDetector.whyDetected.toUpperCase()}'
)
sm_code = sm_code.replace(
    'SOCIAL ENGINEERING TACTICS',
    '{t.scamDetector.tacticsDetected.toUpperCase()}'
)
sm_code = sm_code.replace(
    'SUSPICIOUS PAYMENT / UPI LURES',
    '{t.scamDetector.paymentRequests.toUpperCase()}'
)
sm_code = sm_code.replace(
    'EXTRACTED SUSPICIOUS LINKS',
    '{t.scamDetector.suspiciousUrls.toUpperCase()}'
)
sm_code = sm_code.replace(
    'RECOMMENDED ACTION',
    '{t.scamDetector.recommendedAction.toUpperCase()}'
)

preset_tabs_ui = '''          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono text-slate-400">
              {t.scamDetector.presetsLabel}
            </span>
            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-950 border border-white/10 text-[11px]">
              <button
                type="button"
                onClick={() => setPresetLangTab("ACTIVE")}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  presetLangTab === "ACTIVE"
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Auto ({language.toUpperCase()})
              </button>
              <button
                type="button"
                onClick={() => setPresetLangTab("kn")}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  presetLangTab === "kn"
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                ಕನ್ನಡ (KN)
              </button>
              <button
                type="button"
                onClick={() => setPresetLangTab("hi")}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  presetLangTab === "hi"
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                हिंदी (HI)
              </button>
              <button
                type="button"
                onClick={() => setPresetLangTab("en")}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  presetLangTab === "en"
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>'''

sm_code = re.sub(
    r'<div className="text-xs font-mono text-slate-400">\s*Try Realistic Threat Samples:\s*</div>',
    preset_tabs_ui,
    sm_code
)

with open('src/components/ScamMessageDetectorView.tsx', 'w') as f:
    f.write(sm_code)

print("ScamMessageDetectorView updated.")

# ==========================================
# 2. Update EmailAnalyzerView.tsx
# ==========================================
with open('src/components/EmailAnalyzerView.tsx', 'r') as f:
    ea_code = f.read()

if 'useLanguage' not in ea_code:
    ea_code = ea_code.replace(
        'import { EmailAnalysisResult } from "../types/security";',
        'import { EmailAnalysisResult } from "../types/security";\nimport { useLanguage } from "../i18n/LanguageContext";'
    )

ea_code = ea_code.replace(
    'export const EmailAnalyzerView: React.FC<EmailAnalyzerViewProps> = ({\n  onAnalysisComplete,\n  onExportReport,\n}) => {',
    '''export const EmailAnalyzerView: React.FC<EmailAnalyzerViewProps> = ({
  onAnalysisComplete,
  onExportReport,
}) => {
  const { currentTranslations, language } = useLanguage();
  const t = currentTranslations;'''
)

ea_code = ea_code.replace(
    '''        body: JSON.stringify({
          subject,
          sender,
          recipient,
          headers,
          body,
          attachments,
        }),''',
    '''        body: JSON.stringify({
          subject,
          sender,
          recipient,
          headers,
          body,
          attachments,
          language,
        }),'''
)

ea_code = ea_code.replace(
    'AI Email Threat Analyzer',
    '{t.emailAnalyzer.title}'
)
ea_code = ea_code.replace(
    'Deep forensic inspection of SPF, DKIM, DMARC, lookalike sender domains, Business Email Compromise (BEC), and credential phishing links.',
    '{t.emailAnalyzer.subtitle}'
)
ea_code = ea_code.replace(
    'Try Sample Scenarios:',
    '{t.emailAnalyzer.presetsLabel}'
)
ea_code = ea_code.replace(
    '>Sender Address<',
    '>{t.emailAnalyzer.senderLabel}<'
)
ea_code = ea_code.replace(
    '>Recipient Email<',
    '>{t.emailAnalyzer.recipientLabel}<'
)
ea_code = ea_code.replace(
    '>Email Subject<',
    '>{t.emailAnalyzer.subjectLabel}<'
)
ea_code = ea_code.replace(
    'Raw Email Headers (Optional, for SPF / DKIM verification)',
    '{t.emailAnalyzer.headersLabel}'
)
ea_code = ea_code.replace(
    '>Email Body Text<',
    '>{t.emailAnalyzer.bodyLabel}<'
)
ea_code = ea_code.replace(
    'placeholder="Paste full email body text here..."',
    'placeholder={t.emailAnalyzer.bodyPlaceholder}'
)
ea_code = ea_code.replace(
    'Analyzing Threat Vector...',
    '{t.emailAnalyzer.analyzingBtn}'
)
ea_code = ea_code.replace(
    'Run AI Threat Analysis',
    '{t.emailAnalyzer.analyzeBtn}'
)
ea_code = ea_code.replace(
    'Export Forensic Report',
    '{t.emailAnalyzer.exportReportBtn}'
)
ea_code = ea_code.replace(
    'CONFIRMED EVIDENCE',
    '{t.emailAnalyzer.evidenceFound}'
)
ea_code = ea_code.replace(
    'UNCERTAIN FACTORS',
    '{t.emailAnalyzer.uncertainFactors}'
)

with open('src/components/EmailAnalyzerView.tsx', 'w') as f:
    f.write(ea_code)

print("EmailAnalyzerView updated.")

# ==========================================
# 3. Update ScreenshotScannerView.tsx
# ==========================================
with open('src/components/ScreenshotScannerView.tsx', 'r') as f:
    ss_code = f.read()

if 'useLanguage' not in ss_code:
    ss_code = ss_code.replace(
        'import { HighlightedRegion, ScreenshotAnalysisResult } from "../types/security";',
        'import { HighlightedRegion, ScreenshotAnalysisResult } from "../types/security";\nimport { useLanguage } from "../i18n/LanguageContext";'
    )

ss_code = ss_code.replace(
    'export const ScreenshotScannerView: React.FC<ScreenshotScannerViewProps> = ({\n  onAnalysisComplete,\n  onExportReport,\n}) => {',
    '''export const ScreenshotScannerView: React.FC<ScreenshotScannerViewProps> = ({
  onAnalysisComplete,
  onExportReport,
}) => {
  const { currentTranslations, language } = useLanguage();
  const t = currentTranslations;'''
)

ss_code = ss_code.replace(
    '''        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: imageMimeType,
          fallbackText,
        }),''',
    '''        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: imageMimeType,
          fallbackText,
          language,
        }),'''
)

ss_code = ss_code.replace(
    'Scam Screenshot OCR Scanner',
    '{t.screenshotScanner.title}'
)
ss_code = ss_code.replace(
    'Extract visual text from screenshots to identify fraudulent banking alerts, fake payment slips, and credential login scams.',
    '{t.screenshotScanner.subtitle}'
)
ss_code = ss_code.replace(
    'Click or drag screenshot here to upload',
    '{t.screenshotScanner.dropzoneText}'
)
ss_code = ss_code.replace(
    'Supports JPG, PNG up to 10MB. Text is analyzed with privacy-preserving OCR.',
    '{t.screenshotScanner.dropzoneSubtext}'
)
ss_code = ss_code.replace(
    'Or inspect a realistic sample:',
    '{t.screenshotScanner.presetsLabel}'
)
ss_code = ss_code.replace(
    'Extracting Visual Indicators...',
    '{t.screenshotScanner.scanningBtn}'
)
ss_code = ss_code.replace(
    'Run Forensic OCR Analysis',
    '{t.screenshotScanner.scanBtn}'
)
ss_code = ss_code.replace(
    'Export Screenshot Report',
    '{t.screenshotScanner.exportReportBtn}'
)
ss_code = ss_code.replace(
    'EXTRACTED TEXT (OCR)',
    '{t.screenshotScanner.extractedText.toUpperCase()}'
)
ss_code = ss_code.replace(
    'IDENTIFIED THREAT INDICATORS',
    '{t.screenshotScanner.detectedIndicators.toUpperCase()}'
)
ss_code = ss_code.replace(
    'FORENSIC ANALYSIS',
    '{t.screenshotScanner.explanation.toUpperCase()}'
)

with open('src/components/ScreenshotScannerView.tsx', 'w') as f:
    f.write(ss_code)

print("ScreenshotScannerView updated.")

# ==========================================
# 4. Update SettingsView.tsx
# ==========================================
with open('src/components/SettingsView.tsx', 'r') as f:
    set_code = f.read()

if 'useLanguage' not in set_code:
    set_code = set_code.replace(
        'import { UserProfile } from "../types/security";',
        'import { SupportedLanguage, UserProfile } from "../types/security";\nimport { useLanguage } from "../i18n/LanguageContext";\nimport { Languages, Check } from "lucide-react";'
    )

set_code = set_code.replace(
    'export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser }) => {',
    '''export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser }) => {
  const { currentTranslations, language, setLanguage, languages } = useLanguage();
  const t = currentTranslations;'''
)

set_code = set_code.replace(
    'Command Center Settings',
    '{t.settings.title}'
)
set_code = set_code.replace(
    'Manage your Firebase operator identity, voice synthesis preferences, and data isolation',
    '{t.settings.subtitle}'
)
set_code = set_code.replace(
    'Save Operator Profile',
    '{t.settings.saveProfile}'
)

lang_section_html = '''      {/* Language Preference Section */}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">'''

set_code = set_code.replace(
    '<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">',
    lang_section_html
)

with open('src/components/SettingsView.tsx', 'w') as f:
    f.write(set_code)

print("SettingsView updated.")

# ==========================================
# 5. Update AuthScreen.tsx
# ==========================================
with open('src/components/AuthScreen.tsx', 'r') as f:
    auth_code = f.read()

if 'useLanguage' not in auth_code:
    auth_code = auth_code.replace(
        'import { ShieldThreatState, UserProfile } from "../types/security";',
        'import { ShieldThreatState, UserProfile } from "../types/security";\nimport { useLanguage } from "../i18n/LanguageContext";\nimport { LanguageSelector } from "./LanguageSelector";'
    )

auth_code = auth_code.replace(
    'export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {',
    '''export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const { currentTranslations } = useLanguage();
  const t = currentTranslations;'''
)

auth_code = auth_code.replace(
    '<div className="flex items-center justify-between pb-4 border-b border-white/10">',
    '''<div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 tracking-wider">
                  CYBERSHIELD DEFENSE
                </span>
              </div>
              <LanguageSelector />
            </div>
            <div className="hidden">'''
)

with open('src/components/AuthScreen.tsx', 'w') as f:
    f.write(auth_code)

print("AuthScreen updated.")
