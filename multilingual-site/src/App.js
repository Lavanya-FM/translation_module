import React, { useState, useEffect } from "react";
import { t } from "./utils/translator";

// ==================== STATIC ENGLISH TEXTS ====================
const enTexts = {
  welcome: "Welcome to My Store",
  description: "Shop the best products at unbeatable prices!",
  cart: "Go to Cart",
  featuredProducts: "Featured Products",
  product1: "Premium Headphones",
  product2: "Smart Watch",
  product3: "Wireless Speaker",
  price: "Price",
  addToCart: "Add to Cart",
  whyChooseUs: "Why Choose Us",
  freeShipping: "Free Shipping",
  freeShippingDesc: "On orders over $50",
  securePayment: "Secure Payment",
  securePaymentDesc: "100% secure transactions",
  support: "24/7 Support",
  supportDesc: "Always here to help",
  newsletter: "Subscribe to Newsletter",
  emailPlaceholder: "Enter your email",
  subscribe: "Subscribe",
  footer: "© 2025 My Store. All rights reserved.",
};

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "ml", name: "മലയാളം" },
  { code: "kn", name: "ಕನ್ನಡ" },
];

// ==================== MAIN APP ====================
const App = () => {
  const [lang, setLang] = useState("en");
  const [t, setT] = useState(enTexts);
  const [loading, setLoading] = useState(true);

  // Pre-load all keys for current language
  useEffect(() => {
    const preloadLanguage = async () => {
      setLoading(true);
      const cacheKey = "fullTranslationCache";
      const fullCache = JSON.parse(localStorage.getItem(cacheKey) || "{}");

      if (fullCache[lang]) {
        setT(fullCache[lang]);
        setLoading(false);
        return;
      }

      const translated = {};
      for (const key in enTexts) {
        translated[key] = await t(key, lang); // Uses translator.js
      }

      fullCache[lang] = translated;
      localStorage.setItem(cacheKey, JSON.stringify(fullCache));
      setT(translated);
      setLoading(false);
    };

    preloadLanguage();
  }, [lang]);

  // Instant language switch
  const changeLang = (newLang) => {
    setLang(newLang);
    const fullCache = JSON.parse(localStorage.getItem("fullTranslationCache") || "{}");
    if (fullCache[newLang]) {
      setT(fullCache[newLang]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading translations…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-2xl">Shopping Cart</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">My Store</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-3 rounded-full font-bold text-sm sm:text-base hover:from-yellow-500 hover:to-orange-500 transition shadow-lg hover:shadow-xl transform hover:scale-105">
                Shopping Cart {t.cart}
              </button>
              <select
                value={lang}
                onChange={(e) => changeLang(e.target.value)}
                className="bg-white border-2 border-yellow-300 text-gray-800 px-4 py-2 rounded-full font-medium text-sm focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-md cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white drop-shadow-2xl leading-tight">
            {t.welcome}
          </h2>
          <p className="mt-6 text-lg sm:text-2xl lg:text-3xl text-white font-medium drop-shadow-lg max-w-3xl mx-auto">
            {t.description}
          </p>
          <button className="mt-10 bg-gradient-to-r from-yellow-400 to-red-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-yellow-500 hover:to-red-600 transition shadow-xl hover:shadow-2xl transform hover:scale-110 border-4 border-white">
            Shopping Cart {t.cart}
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              {t.featuredProducts}
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: t.product1, price: "$99.99", emoji: "Headphones", color: "blue", tag: "HOT Fire" },
              { name: t.product2, price: "$149.99", emoji: "Watch", color: "purple", tag: "NEW Sparkle" },
              { name: t.product3, price: "$79.99", emoji: "Speaker", color: "pink", tag: "SALE Money" },
            ].map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2 duration-300 border-2 border-gray-100"
              >
                <div className={`h-56 bg-gradient-to-br from-${p.color}-400 to-${p.color}-600 relative flex items-center justify-center`}>
                  <div className="absolute top-4 right-4 bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    {p.tag}
                  </div>
                  <span className="text-8xl">{p.emoji}</span>
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl font-bold text-gray-800">{p.name}</h4>
                  <p className={`text-2xl font-black mt-2 text-${p.color}-600`}>
                    {t.price}: {p.price}
                  </p>
                  <button className={`w-full mt-4 bg-gradient-to-r from-${p.color}-500 to-${p.color}-600 text-white py-3 rounded-full font-bold hover:from-${p.color}-600 hover:to-${p.color}-700 transition shadow-md hover:shadow-lg transform hover:scale-105`}>
                    {t.addToCart}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              {t.whyChooseUs}
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "Truck", title: t.freeShipping, desc: t.freeShippingDesc },
              { icon: "Lock", title: t.securePayment, desc: t.securePaymentDesc },
              { icon: "Chat Bubble", title: t.support, desc: t.supportDesc },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h4 className="text-xl font-bold text-gray-800">{item.title}</h4>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">Envelope {t.newsletter}</h3>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              required
              className="flex-1 px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-white shadow-lg"
            />
            <button
              type="submit"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t.subscribe}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm sm:text-base">{t.footer}</p>
          <div className="flex justify-center space-x-6 mt-6">
            {["Mobile", "Briefcase", "Bird", "Camera"].map((icon, i) => (
              <span key={i} className="text-2xl hover:scale-125 transition cursor-pointer">
                {icon}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;