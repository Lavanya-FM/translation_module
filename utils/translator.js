// utils/translator.js - Instant, sync, pre-translated
const translations = {};

// Load all JSON at build time (works in CRA)
try {
  const context = require.context('../translations', false, /\.json$/);
  context.keys().forEach((file) => {
    const lang = file.replace('./', '').replace('.json', '');
    translations[lang] = context(file);
  });
} catch {
  // Fallback for Vite/other
  const modules = import.meta.glob('../translations/*.json', { eager: true });
  for (const [path, mod] of Object.entries(modules)) {
    const lang = path.split('/').pop().replace('.json', '');
    translations[lang] = mod.default || mod;
  }
}

// Sync t() - zero delay
export const t = (key, lang = 'en') => {
  return translations[lang]?.[key] ?? translations['en']?.[key] ?? key;
};