// index.js
import { t } from "./utils/translator.js";

async function runDemo() {
  const langs = ["hi", "ta", "te", "ml", "kn", "mr", "bn"];
  for (const lang of langs) {
    console.log(`\n🌐 ${lang.toUpperCase()} Translation Demo:`);
    console.log(await t("signin_title", lang));
    console.log(await t("wishlist", lang));
    console.log(await t("track_order", lang));
  }
}

runDemo();

