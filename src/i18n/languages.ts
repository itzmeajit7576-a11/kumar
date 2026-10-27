export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
  dir?: "ltr" | "rtl";
  region: string;
}

/**
 * Complete list of all 22 Eighth Schedule official languages of India,
 * plus English (associate official) and Bhojpuri (major regional language).
 */
export const INDIAN_LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    speechCode: "en-IN",
    region: "Pan-India / International",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    speechCode: "hi-IN",
    region: "National / Uttar Pradesh, MP, Bihar, Delhi, Rajasthan",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    speechCode: "bn-IN",
    region: "West Bengal, Tripura, Assam",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    speechCode: "te-IN",
    region: "Andhra Pradesh & Telangana",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    speechCode: "mr-IN",
    region: "Maharashtra & Goa",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    speechCode: "ta-IN",
    region: "Tamil Nadu & Puducherry",
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    speechCode: "ur-IN",
    dir: "rtl",
    region: "Jammu & Kashmir, UP, Telangana, Bihar, Pan-India",
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    speechCode: "gu-IN",
    region: "Gujarat, Daman & Diu, Dadra & Nagar Haveli",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    speechCode: "kn-IN",
    region: "Karnataka",
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    speechCode: "ml-IN",
    region: "Kerala & Lakshadweep",
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    speechCode: "pa-IN",
    region: "Punjab & Chandigarh",
  },
  {
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    speechCode: "or-IN",
    region: "Odisha",
  },
  {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    speechCode: "as-IN",
    region: "Assam",
  },
  {
    code: "mai",
    name: "Maithili",
    nativeName: "मैथिली",
    speechCode: "hi-IN",
    region: "Bihar & Jharkhand",
  },
  {
    code: "sant",
    name: "Santali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ",
    speechCode: "hi-IN",
    region: "Jharkhand, Odisha, West Bengal",
  },
  {
    code: "ks",
    name: "Kashmiri",
    nativeName: "कॉशुर / کٲشُر",
    speechCode: "ur-IN",
    region: "Jammu & Kashmir",
  },
  {
    code: "ne",
    name: "Nepali",
    nativeName: "नेपाली",
    speechCode: "ne-NP",
    region: "Sikkim, West Bengal (Darjeeling), Assam",
  },
  {
    code: "kok",
    name: "Konkani",
    nativeName: "कोंकणी",
    speechCode: "mr-IN",
    region: "Goa, Maharashtra, Karnataka",
  },
  {
    code: "sd",
    name: "Sindhi",
    nativeName: "سنڌي / सिंधी",
    speechCode: "hi-IN",
    region: "Gujarat, Maharashtra, Rajasthan, Pan-India",
  },
  {
    code: "doi",
    name: "Dogri",
    nativeName: "डोगरी",
    speechCode: "hi-IN",
    region: "Jammu & Kashmir, Himachal Pradesh",
  },
  {
    code: "mni",
    name: "Manipuri (Meitei)",
    nativeName: "মৈতৈলোন্ / Manipuri",
    speechCode: "bn-IN",
    region: "Manipur",
  },
  {
    code: "brx",
    name: "Bodo",
    nativeName: "बड़ो",
    speechCode: "as-IN",
    region: "Assam (Bodoland)",
  },
  {
    code: "sa",
    name: "Sanskrit",
    nativeName: "संस्कृतम्",
    speechCode: "hi-IN",
    region: "Classical Heritage / Uttarakhand",
  },
  {
    code: "bho",
    name: "Bhojpuri",
    nativeName: "भोजपुरी",
    speechCode: "hi-IN",
    region: "Bihar, Eastern UP, Jharkhand",
  },
];

export const DEFAULT_LANGUAGE = "en";
