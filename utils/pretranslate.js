import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_URL = "https://translation-module.onrender.com/api/translate";
const LANGUAGES = ["hi", "ta", "te", "ml", "kn"];
const EN_FILE = path.join(__dirname, "../translations/en.json");
const OUT_DIR = path.join(__dirname, "../translations");

const enTexts = JSON.parse(fs.readFileSync(EN_FILE, "utf8"));

(async () => {
  for (const lang of LANGUAGES) {
    console.log(`Generating ${lang}.json...`);
    const translated = {};
    for (const [key, text] of Object.entries(enTexts)) {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang: "en", targetLang: lang })
      });
      const data = await res.json();
      translated[key] = data.translatedText || text;
      await new Promise(r => setTimeout(r, 150)); // Avoid rate limit
    }
    fs.writeFileSync(path.join(OUT_DIR, `${lang}.json`), JSON.stringify(translated, null, 2));
    console.log(`${lang}.json created`);
  }
  console.log("All done! Commit the new JSON files.");
})();