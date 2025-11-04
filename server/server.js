// server/server.js (ESM version)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import fetch from 'node-fetch'; // Use v3+ for ESM

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.de/translate';
const CACHE_TTL = parseInt(process.env.CACHE_TTL, 10) || 3600;

// Simple in-memory cache
const cache = new Map();

function getCacheKey(sourceLang, targetLang, text) {
  return `${sourceLang || 'auto'}:${targetLang}:${text.trim().toLowerCase()}`;
}

function cacheGet(key) {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expiry) {
    return entry.value;
  }
  cache.delete(key);
  return null;
}

function cacheSet(key, value) {
  cache.set(key, { value, expiry: Date.now() + CACHE_TTL * 1000 });
}

// Auto-detect language (fixed URL)
async function detectLanguage(text) {
  try {
    const response = await fetch(`${LIBRETRANSLATE_URL.replace('/translate', '/detect')}`, {  // Dynamic from your .env URL
      method: 'POST',
      body: JSON.stringify({ q: text }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`Detect HTTP ${response.status}`);
    const data = await response.json();
    return data[0]?.language || 'en';
  } catch (err) {
    console.error('Detection error (falling back to "en"):', err.message);
    return 'en';  // Fallback to English if detection fails
  }
}

// Translate using LibreTranslate
async function translateText(text, sourceLang, targetLang) {
  const response = await fetch(LIBRETRANSLATE_URL, {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      source: sourceLang || 'auto',
      target: targetLang,
      format: 'text',
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`LibreTranslate error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.translatedText || text;
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Translation API is running', provider: 'libretranslate' });
});

// Translate endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLang, sourceLang } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Invalid or missing "text"' });
    }
    if (!targetLang || typeof targetLang !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "targetLang"' });
    }

    const providedKey = req.headers['x-api-key'] || req.query.apiKey || req.body.apiKey;
    if (process.env.TRANSLATE_API_KEY && providedKey !== process.env.TRANSLATE_API_KEY) {
      return res.status(401).json({ error: 'Invalid or missing API key' });
    }

    const cacheKey = getCacheKey(sourceLang, targetLang, text);
    const cached = cacheGet(cacheKey);
    if (cached) {
      return res.json({ translatedText: cached, detectedSource: sourceLang || 'auto', cached: true });
    }

    let detectedSource = sourceLang;
    if (!detectedSource || detectedSource === 'auto') {
      detectedSource = await detectLanguage(text);
    }

    const translatedText = await translateText(text, detectedSource, targetLang);

    cacheSet(cacheKey, translatedText);

    res.json({
      translatedText,
      detectedSource,
      cached: false,
    });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ error: 'Translation failed', details: err.message });
  }
});

// Supported languages
app.get('/api/languages', (req, res) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
  ];
  res.json({ languages });
});

if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '../multilingual-site/build');
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuild, 'index.html'));
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Translation API running on http://localhost:${PORT}`);
  console.log(`Provider: LibreTranslate (${LIBRETRANSLATE_URL})`);
  if (!process.env.TRANSLATE_API_KEY) {
    console.log('API is public (no key required)');
  } else {
    console.log('Secure your API with x-api-key header');
  }
});