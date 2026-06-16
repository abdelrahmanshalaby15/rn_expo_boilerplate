import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import { useTodos } from '../hooks/use-todos';

/**
 * Reference UI for the sample TanStack Query feature. Renders the loading,
 * error, and data states from `useTodos`. Point `env.apiUrl` at a
 * JSONPlaceholder-style API to see real data.
 */
export function TodoList() {
  const { data, isPending, isError, error } = useTodos();

  if (isPending) {
    return (
      <ThemedView type="backgroundElement" style={styles.card}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold">Failed to load todos</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {error.status ? `Status ${error.status}: ` : ''}
          {error.message}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        TanStack Query todos
      </ThemedText>
      {data.slice(0, 5).map((todo) => (
        <View key={todo.id} style={styles.row}>
          <ThemedText type="small">{todo.completed ? '☑' : '☐'}</ThemedText>
          <ThemedText type="small" style={styles.title} numberOfLines={1}>
            {todo.title}
          </ThemedText>
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    flex: 1,
  },
});
