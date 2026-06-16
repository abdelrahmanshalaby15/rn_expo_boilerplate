import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Trans, useTranslation } from 'react-i18next';
import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const code = <ThemedText type="code" />;

export default function TabTwoScreen() {
  const { t } = useTranslation();
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">{t('explore.title')}</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            {t('explore.intro')}
          </ThemedText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView type="backgroundElement" style={styles.linkButton}>
                <ThemedText type="link">{t('explore.docsLink')}</ThemedText>
                <SymbolView
                  tintColor={theme.text}
                  name={{ ios: 'arrow.up.right.square', android: 'link', web: 'link' }}
                  size={12}
                />
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title={t('explore.sections.language.title')} defaultOpen>
            <ThemedText type="small">{t('explore.sections.language.body')}</ThemedText>
            <LanguageSwitcher />
          </Collapsible>

          <Collapsible title={t('explore.sections.routing.title')}>
            <ThemedText type="small">
              <Trans i18nKey="explore.sections.routing.screens" components={{ code }} />
            </ThemedText>
            <ThemedText type="small">
              <Trans i18nKey="explore.sections.routing.layout" components={{ code }} />
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <ThemedText type="linkPrimary">{t('explore.sections.routing.learnMore')}</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title={t('explore.sections.platforms.title')}>
            <ThemedView type="backgroundElement" style={styles.collapsibleContent}>
              <ThemedText type="small">
                <Trans
                  i18nKey="explore.sections.platforms.body"
                  components={{ bold: <ThemedText type="smallBold" /> }}
                />
              </ThemedText>
              <Image
                source={require('@/assets/images/tutorial-web.png')}
                style={styles.imageTutorial}
              />
            </ThemedView>
          </Collapsible>

          <Collapsible title={t('explore.sections.images.title')}>
            <ThemedText type="small">
              <Trans i18nKey="explore.sections.images.body" components={{ code }} />
            </ThemedText>
            <Image source={require('@/assets/images/react-logo.png')} style={styles.imageReact} />
            <ExternalLink href="https://reactnative.dev/docs/images">
              <ThemedText type="linkPrimary">{t('explore.sections.images.learnMore')}</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title={t('explore.sections.themes.title')}>
            <ThemedText type="small">
              <Trans i18nKey="explore.sections.themes.body" components={{ code }} />
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
              <ThemedText type="linkPrimary">{t('explore.sections.themes.learnMore')}</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title={t('explore.sections.animations.title')}>
            <ThemedText type="small">
              <Trans i18nKey="explore.sections.animations.body" components={{ code }} />
            </ThemedText>
          </Collapsible>
        </ThemedView>
        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    justifyContent: 'center',
    gap: Spacing.one,
    alignItems: 'center',
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  collapsibleContent: {
    alignItems: 'center',
  },
  imageTutorial: {
    width: '100%',
    aspectRatio: 296 / 171,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});
