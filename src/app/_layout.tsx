import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { bootstrapLocale } from '@/i18n/use-locale';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Reconcile the saved language / RTL direction once on startup. The animated
  // splash overlay covers any transition; an RTL switch reloads the app here.
  useEffect(() => {
    bootstrapLocale();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
