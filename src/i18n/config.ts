import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // Lazy load translations from public/locales
  .use(LanguageDetector) // Auto-detect user's language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    fallbackLng: 'en', // Default language if detection fails
    supportedLngs: ['en', 'fa', 'is'], // Supported languages
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
    ns: ['common', 'auth', 'marketplace', 'entrepreneur', 'investor', 'admin', 'consultant'], // Namespaces
    defaultNS: 'common', // Default namespace
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // Cache language selection
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
