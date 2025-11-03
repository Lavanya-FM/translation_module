// utils/languageDetector.js
import os from "os";

/**
 * Detects user's preferred language in a flexible way:
 * - Checks environment variable (for backend)
 * - Checks browser (for frontend)
 * - Maps regional variants (hi-IN → hi, en-US → en)
 */
export function detectUserLanguage(req = null) {
  let lang = "en"; // default fallback

  try {
    // 1️⃣ From HTTP Header (backend / API)
    if (req && req.headers && req.headers["accept-language"]) {
      lang = req.headers["accept-language"].split(",")[0];
    }
    // 2️⃣ From Browser (frontend)
    else if (typeof navigator !== "undefined" && navigator.language) {
      lang = navigator.language;
    }
    // 3️⃣ From OS Locale (Node environment)
    else {
      lang = Intl.DateTimeFormat().resolvedOptions().locale;
    }

    // Normalize language code
    lang = lang.split("-")[0]; // e.g. "hi-IN" → "hi"
  } catch (e) {
    console.warn("Language detection failed, defaulting to English.");
  }

  return supportedLanguages.includes(lang) ? lang : "en";
}

export const supportedLanguages = ["en", "hi", "ta", "te", "ml", "kn", "mr", "bn"];
