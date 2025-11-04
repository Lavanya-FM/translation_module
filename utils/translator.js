// utils/translator.js
const translations = {};

// ────────────────────── LOAD ALL JSON AT BUILD TIME ──────────────────────
// CRA (react-scripts)
try {
  const context = require.context('../translations', false, /\.json$/);
  context.keys().forEach((file) => {
    const lang = file.replace('./', '').replace('.json', '');
    translations[lang] = context(file);
  });
} catch (e) {
  // Vite / other bundlers
  const modules = import.meta.glob('../translations/*.json', { eager: true });
  for (const [path, mod] of Object.entries(modules)) {
    const lang = path.split('/').pop().replace('.json', '');
    translations[lang] = mod.default || mod;
  }
}

// ────────────────────── SYNC t() – INSTANT, NO ASYNC ──────────────────────
export const t = (key, lang = 'en') => {
  return translations[lang]?.[key] ?? translations['en']?.[key] ?? key;
};