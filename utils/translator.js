// utils/translator.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getCached, setCached } from "./cacheManager.js";
import { mlTranslate } from "../core/modelTranslator.js";
import { preprocessText } from "../core/nlpProcessor.js";
import { detectUserLanguage } from "./languageDetector.js";

import axios from "axios";

const API_URL = "http://localhost:5000/translate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const translationsPath = path.join(__dirname, "../translations");

// Load JSON translations at startup
const languageFiles = {};
for (const file of fs.readdirSync(translationsPath)) {
  if (file.endsWith(".json")) {
    const lang = path.basename(file, ".json");
    languageFiles[lang] = JSON.parse(
      fs.readFileSync(path.join(translationsPath, file), "utf8")
    );
  }
}

/**
 * Translate a key (from JSON) or fallback to auto translation
 */


export const translateText = async (text, sourceLang, targetLang) => {
  try {
    if (!text.trim()) return text;
    const response = await axios.post(API_URL, {
      q: text,
      source: sourceLang,
      target: targetLang,
    });
    return response.data.translatedText;
  } catch (error) {
    console.error("Translation error:", error.message);
    return text; // fallback
  }
};

export async function t(key, targetLang = null, req = null) {
  // Automatically detect if not provided
  const lang = targetLang || detectUserLanguage(req);

  const cached = getCached(lang, key);
  if (cached) return cached;

  const staticText = languageFiles[lang]?.[key];
  if (staticText) {
    setCached(lang, key, staticText);
    return staticText;
  }
  
  // If not found, auto translate using ML model
  const baseText = languageFiles["en"]?.[key] || key;
  const cleanText = preprocessText(baseText);
  const translated = await mlTranslate(cleanText, targetLang);
  setCached(targetLang, key, translated);
  return translated;
}

