import re

with open('src/components/VoiceAssistantWidget.tsx', 'r') as f:
    code = f.read()

# Add useLanguage import
if 'useLanguage' not in code:
    code = code.replace(
        'import { AssistantMessage, NavPage } from "../types/security";',
        'import { AssistantMessage, NavPage } from "../types/security";\nimport { useLanguage } from "../i18n/LanguageContext";'
    )

# Hook into useLanguage in component
code = code.replace(
    '  defaultTtsEnabled = true,\n}) => {\n  const [isOpen, setIsOpen] = useState(false);',
    '  defaultTtsEnabled = true,\n}) => {\n  const { currentTranslations, language, currentLangOption } = useLanguage();\n  const t = currentTranslations;\n  const [isOpen, setIsOpen] = useState(false);'
)

# Replace initial welcome message with t.assistant.welcome
code = re.sub(
    r'id: "msg-welcome",\s*role: "assistant",\s*content:\s*"Hello! I am your CyberShield AI Security Assistant\..*?",',
    'id: "msg-welcome",\n      role: "assistant",\n      content: t.assistant.welcome,',
    code,
    flags=re.DOTALL
)

# In speakResponse, set voice for language
speak_old = '''    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.03;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {'''

speak_new = '''    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 1.0;
      utterance.lang = currentLangOption.speechCode;
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(
        (v) =>
          v.lang.toLowerCase() === currentLangOption.speechCode.toLowerCase() ||
          v.lang.toLowerCase().startsWith(language)
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch {'''

code = code.replace(speak_old, speak_new)

# In fetch to /api/assistant, pass language
code = code.replace(
    'body: JSON.stringify({ message: trimmed }),',
    'body: JSON.stringify({ message: trimmed, language }),'
)

# In toggleVoiceListening, set recognition.lang = currentLangOption.speechCode
code = code.replace(
    'recognition.lang = "en-US";',
    'recognition.lang = currentLangOption.speechCode;'
)

code = code.replace(
    'setVoiceNote("Listening... Speak your security command now.");',
    'setVoiceNote(`${t.assistant.listening} (${currentLangOption.nativeName})...`);'
)

# Replace suggestions
code = code.replace(
    'VOICE_COMMAND_SUGGESTIONS.map',
    't.assistant.suggestions.map'
)
code = code.replace(
    '{VOICE_COMMAND_SUGGESTIONS.slice',
    '{t.assistant.suggestions.slice'
)

# Replace input placeholder
code = code.replace(
    'placeholder="Ask a security question, paste a link or email, or give a voice command..."',
    'placeholder={t.assistant.inputPlaceholder}'
)

with open('src/components/VoiceAssistantWidget.tsx', 'w') as f:
    f.write(code)

print("VoiceAssistantWidget updated successfully.")
