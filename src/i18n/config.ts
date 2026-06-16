/**
 * Single source of truth for the languages the app ships with.
 *
 * To add a language: drop a `locales/<code>.json` file next to the existing
 * ones, then add an entry here (and import it in `index.ts`). Everything else
 * — the device-locale fallback, the language switcher UI, and RTL handling —
 * is driven off this registry.
 */
export const LOCALES = {
  en: { label: 'English', rtl: false },
  ar: { label: 'العربية', rtl: true },
} as const;

export type Locale = keyof typeof LOCALES;

/** Language used when the device locale isn't one we support. */
export const FALLBACK_LOCALE: Locale = 'en';

/** AsyncStorage key holding the user's explicit language choice. */
export const LOCALE_STORAGE_KEY = 'app.locale';

export const SUPPORTED_LOCALES = Object.keys(LOCALES) as Locale[];

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return value != null && value in LOCALES;
}

/** Whether a given locale lays out right-to-left. */
export function isRTL(locale: Locale): boolean {
  return LOCALES[locale].rtl;
}
