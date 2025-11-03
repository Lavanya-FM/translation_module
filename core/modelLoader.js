// core/modelLoader.js
import { pipeline } from "@xenova/transformers";

// Singleton pattern – load model once
let modelCache = {};

export async function loadTranslationModel(targetLang) {
  const modelMap = {
    hi: "Helsinki-NLP/opus-mt-en-hi",
    ta: "Helsinki-NLP/opus-mt-en-ta",
    te: "Helsinki-NLP/opus-mt-en-te",
    ml: "Helsinki-NLP/opus-mt-en-ml",
    kn: "Helsinki-NLP/opus-mt-en-kn",
    mr: "Helsinki-NLP/opus-mt-en-mr",
    bn: "Helsinki-NLP/opus-mt-en-bn"
  };

  const modelName = modelMap[targetLang] || "Helsinki-NLP/opus-mt-en-hi";

  if (!modelCache[modelName]) {
    console.log(`🔄 Loading model for ${targetLang}...`);
    modelCache[modelName] = await pipeline("translation", modelName);
  }
  return modelCache[modelName];
}

