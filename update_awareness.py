import re

# 1. Update AwarenessCenterView.tsx
with open('src/components/AwarenessCenterView.tsx', 'r') as f:
    awareness_code = f.read()

# Add useLanguage import
if 'useLanguage' not in awareness_code:
    awareness_code = awareness_code.replace(
        'import React, { useState } from "react";',
        'import React, { useState } from "react";\nimport { useLanguage } from "../i18n/LanguageContext";'
    )

# Use currentTranslations.scamCards and localized titles
awareness_patch = '''export const AwarenessCenterView: React.FC<AwarenessCenterViewProps> = ({
  onTestScenarioInDetector,
}) => {
  const { currentTranslations } = useLanguage();
  const t = currentTranslations;
  const cards = t.scamCards;

  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(cards[0]?.id || "phishing");
  const [completedQuizIds, setCompletedQuizIds] = useState<string[]>([]);
'''

awareness_code = re.sub(
    r'export const AwarenessCenterView: React\.FC<AwarenessCenterViewProps> = \(\{.*?const \[activeCategory, setActiveCategory\] = useState<string>\("ALL"\);.*?const \[expandedCardId, setExpandedCardId\] = useState<string \| null>\("phishing"\);.*?const \[completedQuizIds, setCompletedQuizIds\] = useState<string\[\]>\(\[\]\);',
    awareness_patch,
    awareness_code,
    flags=re.DOTALL
)

# Replace SCAM_AWARENESS_CARDS reference in filteredCards
awareness_code = awareness_code.replace(
    'const filteredCards = activeCategory === "ALL" ? SCAM_AWARENESS_CARDS : SCAM_AWARENESS_CARDS.filter((c) => c.category === activeCategory);',
    'const filteredCards = activeCategory === "ALL" ? cards : cards.filter((c) => c.category === activeCategory);'
)

# Localize golden rule banner
awareness_code = awareness_code.replace(
    'THE GOLDEN RULE OF DIGITAL SAFETY',
    '{t.awarenessCenter.ruleTitle.toUpperCase()}'
)
awareness_code = awareness_code.replace(
    'A UPI PIN is strictly required to SEND money, never to RECEIVE money. Legitimate banks and government officials never demand immediate payment through personal UPI or gift cards.',
    '{t.awarenessCenter.ruleText}'
)
awareness_code = awareness_code.replace(
    'Scam Awareness & Cyber Safety Center',
    '{t.awarenessCenter.title}'
)
awareness_code = awareness_code.replace(
    'Test Scenario in Scam Detector →',
    '{t.awarenessCenter.testInDetector} →'
)

with open('src/components/AwarenessCenterView.tsx', 'w') as f:
    f.write(awareness_code)

print("AwarenessCenterView updated successfully.")
