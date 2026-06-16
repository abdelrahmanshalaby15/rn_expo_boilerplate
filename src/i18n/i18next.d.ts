import 'i18next';

import type en from '@/i18n/locales/en.json';

/**
 * Make `t()` and `<Trans i18nKey>` keys type-safe and autocompleted against the
 * English resource (the source of truth). `ar.json` mirrors its shape.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof en };
  }
}
