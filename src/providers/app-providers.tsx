import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { queryClient } from '@/services/query-client';
import { useReactQueryFocus } from '@/services/react-query-native';
import { persistor, store } from '@/store';

/**
 * App-wide providers, composed once and mounted at the root layout. Order
 * (outer → inner): Redux client/global state, then redux-persist rehydration
 * gate (shows the splash overlay until state is restored), then the TanStack
 * Query server-state cache.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<AnimatedSplashOverlay />} persistor={persistor}>
        <QueryProviders>{children}</QueryProviders>
      </PersistGate>
    </ReduxProvider>
  );
}

function QueryProviders({ children }: PropsWithChildren) {
  useReactQueryFocus();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
