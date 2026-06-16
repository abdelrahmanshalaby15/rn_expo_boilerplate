import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { type Locale } from '@/i18n/config';
import { useLocale } from '@/i18n/use-locale';

/**
 * Segmented control that switches the active language. Selecting a right-to-left
 * language (e.g. Arabic) flips the whole app layout — on native this reloads the
 * app so the new direction takes effect.
 */
export function LanguageSwitcher() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { locale, locales, setLocale } = useLocale();

  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        {t('language.label')}
      </ThemedText>
      <ThemedView type="backgroundElement" style={styles.segment}>
        {(Object.keys(locales) as Locale[]).map((code) => {
          const selected = code === locale;
          return (
            <Pressable
              key={code}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                if (!selected) setLocale(code);
              }}
              style={[
                styles.option,
                selected && { backgroundColor: theme.backgroundSelected },
              ]}>
              <ThemedText
                type="smallBold"
                themeColor={selected ? 'text' : 'textSecondary'}>
                {locales[code].label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  segment: {
    flexDirection: 'row',
    borderRadius: Spacing.three,
    padding: Spacing.half,
    gap: Spacing.half,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three - Spacing.half,
  },
});
