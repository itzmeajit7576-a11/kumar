import React, { useState } from "react";
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Cpu,
  Eye,
  EyeOff,
} from "lucide-react";
import { CyberShield3D } from "./CyberShield3D";
import { firebaseService } from "../services/firebaseService";
import { ShieldThreatState, UserProfile } from "../types/security";

interface AuthScreenProps {
  onAuthenticated: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("itzmeajit7576@gmail.com");
  const [password, setPassword] = useState("CyberShield#2026");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [shieldPreviewState, setShieldPreviewState] = useState<ShieldThreatState>("SAFE");
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const user = await firebaseService.loginWithEmailPassword(email, password);
        onAuthenticated(user);
      } else if (mode === "register") {
        const user = await firebaseService.registerWithEmailPassword(displayName, email, password);
        onAuthenticated(user);
      } else if (mode === "forgot") {
        const msg = await firebaseService.resetPassword(email);
        setSuccessMsg(msg);
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (selectedEmail: string, selectedName: string) => {
    setError(null);
    setShowGoogleModal(false);
    setLoading(true);
    try {
      const user = await firebaseService.loginWithGoogle(selectedEmail, selectedName);
      onAuthenticated(user);
    } catch (err: any) {
      setError(err?.message || "Google OAuth login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050A14] text-slate-100 cyber-grid-bg cyber-scanlines relative flex flex-col justify-between overflow-x-hidden">
      {/* Ambient Radial Lighting */}
      <div className="pointer-events-none fixed top-0 left-1/4 w-[520px] h-[520px] rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 w-[480px] h-[480px] rounded-full bg-blue-600/10 blur-[130px]" />

      {/* Clean 3-Zone Top Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <a href="#top" className="text-lg font-bold font-display tracking-wider text-white">
          CyberShield
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <button
            type="button"
            onClick={() => setShieldPreviewState("SAFE")}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap"
          >
            3D Shield Core
          </button>
          <button
            type="button"
            onClick={() => setShieldPreviewState("WARNING")}
            className="hover:text-amber-400 transition-colors whitespace-nowrap"
          >
            Email & Scam AI
          </button>
          <button
            type="button"
            onClick={() => setShieldPreviewState("CRITICAL")}
            className="hover:text-red-400 transition-colors whitespace-nowrap"
          >
            OCR Screenshot Scanner
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleGoogleSignIn("itzmeajit7576@gmail.com", "Ajit Kumar")}
            className="px-4 py-2 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap"
          >
            Quick Operator Access
          </button>
        </div>
      </header>

      {/* Main Split Viewport */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: 3D CyberShield Showcase & Capabilities */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-mono text-cyan-400 tracking-wide">
              AI-Powered Cyber Threat & Scam Command Center · BCA Capstone Architecture
            </p>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white leading-tight"
              style={{ textWrap: "balance" }}
            >
              Real-Time Email Forensics, Scam Detection & Visual OCR Defense
            </h1>
            <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
              Inspect raw <span className="text-slate-200 font-mono">.eml</span> headers, detect
              SMS/WhatsApp social engineering lures, scan suspicious screenshots with computer
              vision OCR, and navigate with an interactive Voice AI Security Assistant.
            </p>
          </div>

          {/* Interactive 3D CyberShield Viewport */}
          <div className="relative rounded-2xl border border-cyan-500/25 bg-slate-950/60 backdrop-blur-md p-2">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-xs font-mono text-slate-400">
              <span>INTERACTIVE 3D HOLOGRAPHIC SHIELD CORE</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShieldPreviewState("SAFE")}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap ${
                    shieldPreviewState === "SAFE"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Nominal
                </button>
                <button
                  type="button"
                  onClick={() => setShieldPreviewState("WARNING")}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap ${
                    shieldPreviewState === "WARNING"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Suspicious
                </button>
                <button
                  type="button"
                  onClick={() => setShieldPreviewState("CRITICAL")}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap ${
                    shieldPreviewState === "CRITICAL"
                      ? "bg-red-500/20 text-red-300 border border-red-500/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Threat Alert
                </button>
              </div>
            </div>
            <CyberShield3D
              threatState={shieldPreviewState}
              isScanning={loading}
              heightClass="h-[320px] sm:h-[350px]"
            />
          </div>

          {/* Unboxed Metadata Highlights (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-slate-400 pt-1">
            <span className="text-cyan-400">SPF / DKIM / DMARC Header Analysis</span>
            <span aria-hidden="true">·</span>
            <span>SMS / WhatsApp / UPI Scam Engine</span>
            <span aria-hidden="true">·</span>
            <span>Multimodal Screenshot OCR</span>
            <span aria-hidden="true">·</span>
            <span>Web Speech Voice AI</span>
          </div>
        </div>

        {/* Right Column: Glassmorphic Authentication Terminal */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-cyan-500/25 bg-slate-900/75 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Terminal Header */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl font-bold font-display text-white">
                    {mode === "login"
                      ? "Operator Authentication"
                      : mode === "register"
                      ? "Provision Security Account"
                      : "Credential Recovery"}
                  </h2>
                </div>
                <span className="text-xs font-mono text-cyan-400 tabular-nums">TLS 1.3 · E2E</span>
              </div>
              <p className="text-xs text-slate-400">
                {mode === "login"
                  ? "Sign in with Google OAuth or your Firebase operator credentials."
                  : mode === "register"
                  ? "Create an isolated Firestore workspace for threat history and reports."
                  : "Enter your registered email to receive a password reset link."}
              </p>
            </div>

            {/* Segmented Mode Control */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/90 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  mode === "login"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  mode === "register"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  mode === "forgot"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Forgot Password
              </button>
            </div>

            {/* Error / Success Banners */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Operator Name / Callsign
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g., Ajit Kumar"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/90 border border-white/15 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@cybershield.sec"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/90 border border-white/15 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Password</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setError(null);
                        }}
                        className="text-xs text-cyan-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950/90 border border-white/15 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span className="font-mono text-xs">VERIFYING CREDENTIALS...</span>
                ) : mode === "login" ? (
                  <>
                    <span>Sign In with Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : mode === "register" ? (
                  <>
                    <span>Create Security Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Send Recovery Token</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10" />
              <span className="flex-shrink mx-3 text-xs font-mono text-slate-400">
                OR FEDERATED OAUTH
              </span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            {/* Google OAuth Login & Demo Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 border border-white/15 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3 0 5.5-1 7.4-2.7l-3.7-2.9c-1 .7-2.3 1.1-3.7 1.1-3.1 0-5.8-2.1-6.7-5L1.6 16.3C3.5 20.2 7.4 23 12 23z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  handleGoogleSignIn("soc.commander@cybershield.sec", "Commander Aria Vance (Demo)")
                }
                className="w-full py-2 px-4 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Launch Pre-Populated Demo SOC Session</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-4 border-t border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>CyberShield AI Threat Detection & Scam Awareness Platform</span>
        <span className="font-mono">Zero-Trust Firestore Rules · Multimodal OCR · Web Speech AI</span>
      </footer>

      {/* Google OAuth Account Picker Modal (Iframe-Safe Federated Flow) */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/15 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3 0 5.5-1 7.4-2.7l-3.7-2.9c-1 .7-2.3 1.1-3.7 1.1-3.1 0-5.8-2.1-6.7-5L1.6 16.3C3.5 20.2 7.4 23 12 23z"
                  />
                </svg>
                <h3 className="text-base font-semibold text-white">Sign in with Google</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Choose an account to continue to <span className="text-cyan-400 font-semibold">CyberShield Command Center</span>:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleGoogleSignIn("itzmeajit7576@gmail.com", "Ajit Kumar")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/10 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-sm">
                    AK
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Ajit Kumar</div>
                    <div className="text-xs text-slate-400 font-mono">itzmeajit7576@gmail.com</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleGoogleSignIn("analyst.soc@cybershield.sec", "Priya Sharma (SOC Lead)")
                }
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/10 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold text-sm">
                    PS
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Priya Sharma (SOC Lead)</div>
                    <div className="text-xs text-slate-400 font-mono">analyst.soc@cybershield.sec</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
