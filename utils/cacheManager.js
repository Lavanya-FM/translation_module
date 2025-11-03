// utils/cacheManager.js
let userLangOverride = null;

export function setUserLanguage(lang) {
  userLangOverride = lang;
  localStorage.setItem("userLang", lang);
}

export function getUserLanguage() {
  return userLangOverride || localStorage.getItem("userLang");
}
