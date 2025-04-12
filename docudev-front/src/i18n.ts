import i18n, { Module } from 'i18next'
import { initReactI18next } from 'react-i18next'
import general_en from './locales/en/general.json'
import general_es from './locales/es/general.json'

const resources = {
  es: {
    general: general_es,
  },
  en: {
    general: general_en,
  },
}

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lng: string) => void) => {
    const lang = navigator.language
    callback(lang)
    return lang
  },
}

i18n
  .use(initReactI18next)
  .use(languageDetector as Module)
  .init({
    compatibilityJSON: 'v4',
    resources,
    fallbackLng: 'es',
    defaultNS: 'general',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
