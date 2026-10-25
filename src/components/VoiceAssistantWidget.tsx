import React, { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Bot,
  X,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { AssistantMessage, NavPage } from "../types/security";

interface VoiceAssistantWidgetProps {
  mode: "page" | "floating";
  onNavigate: (page: NavPage) => void;
  defaultTtsEnabled?: boolean;
}

const VOICE_COMMAND_SUGGESTIONS = [
  "Analyze this email.",
  "Is this message a scam?",
  "Explain why this email is dangerous.",
  "Open scam detector.",
  "Scan a screenshot.",
  "Show my recent threats.",
  "What is phishing?",
  "Give me safety tips.",
];

export const VoiceAssistantWidget: React.FC<VoiceAssistantWidgetProps> = ({
  mode,
  onNavigate,
  defaultTtsEnabled = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content:
        "Hello! I am your CyberShield AI Security Assistant. Press the microphone to speak a voice command—or type below—to analyze suspicious emails, detect SMS/WhatsApp scams, scan screenshots, or navigate the command center.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(defaultTtsEnabled);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const speakResponse = (text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.03;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore if browser blocks speechSynthesis
    }
  };

  const executeActionCommand = (cmd: string | null | undefined): string | undefined => {
    if (!cmd) return undefined;
    switch (cmd) {
      case "NAVIGATE_EMAIL_ANALYZER":
        onNavigate("email-analyzer");
        return "Navigated to Email Threat Analyzer";
      case "NAVIGATE_SCAM_DETECTOR":
        onNavigate("scam-detector");
        return "Navigated to Scam Message Detector";
      case "NAVIGATE_SCREENSHOT_SCANNER":
        onNavigate("screenshot-scanner");
        return "Navigated to Screenshot OCR Scanner";
      case "NAVIGATE_HISTORY":
        onNavigate("history");
        return "Navigated to Threat Analysis History";
      case "NAVIGATE_REPORTS":
        onNavigate("reports");
        return "Navigated to Security Reports";
      case "NAVIGATE_AWARENESS":
        onNavigate("awareness");
        return "Navigated to Scam Awareness & Safety Tips";
      case "NAVIGATE_DASHBOARD":
        onNavigate("dashboard");
        return "Navigated to Main Command Dashboard";
      default:
        return undefined;
    }
  };

  const handleSendCommand = async (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    const userMsg: AssistantMessage = {
      id: "usr-" + Date.now(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await response.json();
      const executedLabel = executeActionCommand(data.actionCommand);

      const botMsg: AssistantMessage = {
        id: "bot-" + Date.now(),
        role: "assistant",
        content:
          data.reply ||
          "I processed your security request. Let me know if you would like to inspect another message or email.",
        timestamp: new Date().toISOString(),
        actionExecuted: executedLabel,
      };
      setMessages((prev) => [...prev, botMsg]);
      speakResponse(botMsg.content);
    } catch {
      const fallbackMsg: AssistantMessage = {
        id: "bot-err-" + Date.now(),
        role: "assistant",
        content:
          "I am ready to help you inspect suspicious emails, SMS lures, or screenshots. Try saying 'Open scam detector' or 'What is phishing?'",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceListening = () => {
    setVoiceNote(null);
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setVoiceNote(
        "Browser Web Speech API is not supported in this frame. Click any voice command chip below or type your command."
      );
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNote("Listening... Speak your security command now.");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setVoiceNote(`Recognized voice command: “${transcript}”`);
          handleSendCommand(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNote(
          "Microphone access was unavailable in the preview container. You can click any voice command preset below to test voice execution."
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNote("Could not start microphone capture. Use text input or command presets below.");
    }
  };

  const renderAssistantBody = () => (
    <div className="flex flex-col h-full">
      {/* Assistant Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold font-display text-white">
              CyberShield Voice AI Assistant
            </div>
            <div className="text-[11px] font-mono text-cyan-400">
              Web Speech API · Command & Navigation Router
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !ttsEnabled;
              setTtsEnabled(next);
              if (!next && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
              }
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
              ttsEnabled
                ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                : "bg-slate-900 border-white/10 text-slate-400"
            }`}
            title="Toggle Spoken TTS Response"
          >
            {ttsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{ttsEnabled ? "TTS On" : "TTS Muted"}</span>
          </button>

          {mode === "floating" && (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Voice Command Presets */}
      <div className="px-5 py-3 border-b border-white/10 bg-slate-950/40">
        <div className="text-[11px] font-mono text-slate-400 mb-2">
          VOICE & ACTION COMMAND SHORTCUTS (CLICK OR SPEAK):
        </div>
        <div className="flex flex-wrap gap-1.5">
          {VOICE_COMMAND_SUGGESTIONS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => handleSendCommand(cmd)}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              “{cmd}”
            </button>
          ))}
        </div>
      </div>

      {/* Chat Transcript */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-cyan-500 text-slate-950 font-medium"
                  : "bg-slate-950/90 border border-white/10 text-slate-200"
              }`}
            >
              <p>{m.content}</p>
              {m.actionExecuted && (
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Action executed: {m.actionExecuted}</span>
                </div>
              )}
            </div>
            <span className="mt-1 text-[10px] font-mono text-slate-500">
              {m.role === "user" ? "You" : "CyberShield AI"} ·{" "}
              {new Date(m.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Interpreting command & checking threat telemetry...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Microphone Status Banner */}
      {voiceNote && (
        <div className="px-5 py-2 bg-cyan-950/50 border-t border-cyan-500/30 text-xs font-mono text-cyan-200 flex items-center justify-between">
          <span>{voiceNote}</span>
          <button
            type="button"
            onClick={() => setVoiceNote(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input & Microphone Control Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendCommand(inputText);
        }}
        className="p-4 border-t border-white/10 bg-slate-950/90 flex items-center gap-2.5"
      >
        <button
          type="button"
          onClick={toggleVoiceListening}
          className={`p-3 rounded-xl border transition-all cursor-pointer shrink-0 ${
            isListening
              ? "bg-red-500 text-white border-red-400 animate-pulse"
              : "bg-slate-900 hover:bg-slate-800 text-cyan-400 border-cyan-500/30"
          }`}
          title={isListening ? "Stop voice recognition" : "Press to speak a voice command"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Speak or type: 'Analyze this email', 'Open scam detector', 'What is phishing?'..."
          className="flex-1 px-4 py-2.5 text-sm bg-slate-900 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
        />

        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );

  // Full-Page Mode when opened from Sidebar
  if (mode === "page") {
    return (
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <div className="text-xs font-mono text-cyan-400 mb-1">
            VOICE & NATURAL LANGUAGE COMMAND INTERFACE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Voice AI Security Assistant
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Use your microphone or text commands to navigate tools, ask security questions, or hear
            spoken explanations.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/75 overflow-hidden h-[620px] shadow-2xl">
          {renderAssistantBody()}
        </div>
      </div>
    );
  }

  // Floating Persistent Launcher Mode (accessible from every major page)
  return (
    <div className="fixed bottom-5 right-5 z-40 no-print">
      {isOpen ? (
        <div className="w-[360px] sm:w-[430px] h-[540px] rounded-2xl border border-cyan-500/40 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
          {renderAssistantBody()}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs shadow-xl flex items-center gap-2.5 transition-transform hover:scale-105 cursor-pointer"
        >
          <Mic className="w-4 h-4" />
          <span>Voice AI Assistant</span>
        </button>
      )}
    </div>
  );
};
