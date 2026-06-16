import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { FALLBACK_LOCALE, isSupportedLocale, type Locale } from '@/i18n/config';
import ar from '@/i18n/locales/ar.json';
import en from '@/i18n/locales/en.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const;

/**
 * The best-effort initial language, derived synchronously from the device
 * locale so the very first render is already translated. A persisted user
 * choice (read asynchronously in `use-locale.ts`) takes precedence after mount.
 */
export function getDeviceLocale(): Locale {
  const code = getLocales()[0]?.languageCode;
  return isSupportedLocale(code) ? code : FALLBACK_LOCALE;
}

// `i18n.use(...)` is the canonical i18next setup chain; the lint rule mistakes
// the instance method for the module's named `use` export.
// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLocale(),
  fallbackLng: FALLBACK_LOCALE,
  // React already escapes output, so i18next's own escaping would double-encode.
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
