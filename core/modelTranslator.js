// core/modelTranslator.js
import { loadTranslationModel } from "./modelLoader.js";

export async function mlTranslate(text, targetLang) {
  try {
    const translator = await loadTranslationModel(targetLang);
    const output = await translator(text);
    return output[0].translation_text;
  } catch (err) {
    console.error("Translation failed:", err);
    return text; // fallback to original
  }
}
