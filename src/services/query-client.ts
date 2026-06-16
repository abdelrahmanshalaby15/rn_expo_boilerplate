import { QueryClient } from '@tanstack/react-query';

/**
 * Shared TanStack Query client (server-state cache). A module singleton so it
 * survives Fast Refresh and is importable by the providers and any imperative
 * code (e.g. cache invalidation outside React).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: true,
    },
  },
});
