import AsyncStorage from '@react-native-async-storage/async-storage';
import { reloadAppAsync } from 'expo';
import { I18nManager, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  FALLBACK_LOCALE,
  isRTL,
  isSupportedLocale,
  LOCALE_STORAGE_KEY,
  LOCALES,
  type Locale,
} from '@/i18n/config';
import i18n, { getDeviceLocale } from '@/i18n';

/**
 * Align the native/web layout direction with `locale`.
 *
 * On native, `I18nManager.forceRTL` only takes effect after a reload and the
 * setting persists across launches — so we report back whether a reload is
 * needed and let the caller trigger it. On web the flag doesn't survive a page
 * reload, so we apply the direction to the document live and never reload (doing
 * so would loop forever).
 *
 * @returns `true` if a native reload is required for the change to take effect.
 */
function syncDirection(locale: Locale): boolean {
  const shouldRTL = isRTL(locale);

  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = shouldRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
    }
    I18nManager.allowRTL(shouldRTL);
    I18nManager.forceRTL(shouldRTL);
    return false;
  }

  if (I18nManager.isRTL === shouldRTL) {
    return false;
  }
  I18nManager.allowRTL(shouldRTL);
  I18nManager.forceRTL(shouldRTL);
  return true;
}

/**
 * Persist and apply a language choice. Switching to/from a right-to-left
 * language reloads the app on native so the new layout direction takes hold.
 */
export async function setLocale(locale: Locale): Promise<void> {
  await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
  await i18n.changeLanguage(locale);
  if (syncDirection(locale)) {
    await reloadAppAsync();
  }
}

/**
 * Reconcile the active language and layout direction with the user's stored
 * preference (falling back to the device locale) once on startup. Call this
 * from the root layout before rendering app content.
 *
 * @returns `true` if the app is reloading to apply RTL — callers should hold
 *   off on revealing UI when this happens.
 */
export async function bootstrapLocale(): Promise<boolean> {
  const saved = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
  const locale = isSupportedLocale(saved) ? saved : getDeviceLocale();

  if (i18n.language !== locale) {
    await i18n.changeLanguage(locale);
  }
  if (syncDirection(locale)) {
    await reloadAppAsync();
    return true;
  }
  return false;
}

/** Active locale plus helpers for reading and changing it from components. */
export function useLocale() {
  const { i18n: instance } = useTranslation();
  const locale = isSupportedLocale(instance.language) ? instance.language : FALLBACK_LOCALE;

  return {
    locale,
    isRTL: isRTL(locale),
    locales: LOCALES,
    setLocale,
  };
}
