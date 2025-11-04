// utils/translator.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getCached, setCached } from "./cacheManager.js";
import { mlTranslate } from "../core/modelTranslator.js";
import { preprocessText } from "../core/nlpProcessor.js";
import { detectUserLanguage } from "./languageDetector.js";

import axios from "axios";


// utils/translator.js
// Dynamic API URL (set in .env.production or Render)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// In-memory fallback translations (en, hi, ta, etc.)
const translations = {};

// Load all *.json at build time
try {
  const context = require.context('../translations', false, /\.json$/);
  context.keys().forEach((key) => {
    const lang = key.replace('./', '').replace('.json', '');
    translations[lang] = context(key);
  });
} catch {
  const modules = import.meta.glob('../translations/*.json', { eager: true });
  Object.entries(modules).forEach(([path, mod]) => {
    const lang = path.match(/([^/]+)\.json$/)?.[1];
    if (lang) translations[lang] = mod.default || mod;
  });
}

// Sync t() — no async
export const t = (key, lang = "en") => {
  return translations[lang]?.[key] || translations["en"]?.[key] || key;
};
// Load JSON files at build time (Vite/React Scripts supports this)
const loadTranslations = () => {
  const context = require.context('../translations', false, /\.json$/);
  context.keys().forEach((key) => {
    const lang = key.replace('./', '').replace('.json', '');
    translations[lang] = context(key);
  });
};
loadTranslations();

/**
 * Translate text using backend API + JSON fallback + caching
 */

/**
 * t("welcome") → gets from JSON or translates
 */
export const t = async (key, targetLang = "en") => {
  const cacheKey = `t:${targetLang}:${key}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached;

  // 1. Try static JSON
  const staticText = translations[targetLang]?.[key] || translations["en"]?.[key];
  if (staticText) {
    sessionStorage.setItem(cacheKey, staticText);
    return staticText;
  }

  // 2. Auto-translate English version
  const baseText = translations["en"]?.[key] || key;
  const translated = await translateText(baseText, "en", targetLang);
  sessionStorage.setItem(cacheKey, translated);
  return translated;
};
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

