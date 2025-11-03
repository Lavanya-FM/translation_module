// core/nlpProcessor.js
export function preprocessText(text) {
  if (!text) return "";
  // Remove extra spaces and normalize punctuation fast
  const clean = text
    .replace(/\s+/g, " ")
    .replace(/\s([,!.?:;])/g, "$1")
    .trim();
  return clean;
}
