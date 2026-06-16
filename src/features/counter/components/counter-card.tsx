import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { useCounter } from '../hooks/use-counter';

/**
 * Reference UI for the sample Redux feature. Demonstrates reading state and
 * dispatching actions through the `useCounter` facade. The value is persisted,
 * so it survives an app restart.
 */
export function CounterCard() {
  const theme = useTheme();
  const { value, increment, decrement, reset } = useCounter();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        Redux counter (persisted)
      </ThemedText>

      <ThemedText type="title" style={styles.value}>
        {value}
      </ThemedText>

      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          onPress={decrement}
          style={[styles.button, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="subtitle">−</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={increment}
          style={[styles.button, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="subtitle">+</ThemedText>
        </Pressable>
      </View>

      <Pressable accessibilityRole="button" onPress={reset}>
        <ThemedText type="link" themeColor="textSecondary">
          Reset
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.two,
    alignItems: 'center',
  },
  value: {
    marginVertical: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
