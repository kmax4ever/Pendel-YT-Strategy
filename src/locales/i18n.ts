import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/resource.json";
import vn from "./vn/resource.json";
import LanguageDetector from "i18next-browser-languagedetector";

export const DEFAULT_LANGUAGE_CODE = "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },

      vn: {
        translation: vn,
      },
    },
    fallbackLng: DEFAULT_LANGUAGE_CODE,
    debug: false,
    interpolation: { escapeValue: false },
  });

export default i18n;
