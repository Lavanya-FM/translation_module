// src/utils/translator.js
export const translateText = async (text, sourceLang = "en", targetLang) => {
  if (!text) return text;

  const cacheKey = `${sourceLang}:${targetLang}:${text}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch("/api/translate", {  // ← FIXED: relative path
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang, targetLang }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const translated = data.translatedText || text;
    sessionStorage.setItem(cacheKey, translated);
    return translated;
  } catch (err) {
    console.warn("Translation fallback:", err);
    return text; // never break the UI
  }
};