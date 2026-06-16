import { focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';

/**
 * React Native wiring for TanStack Query. On web, focus/online are detected
 * automatically; on native they are not, so we bridge them manually.
 *
 * `useReactQueryFocus` refetches stale queries when the app returns to the
 * foreground. Call it once near the root (see `app-providers.tsx`).
 */
export function useReactQueryFocus() {
  useEffect(() => {
    const onChange = (status: AppStateStatus) => {
      // Web handles window focus itself; only bridge on native.
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }
    };

    const subscription = AppState.addEventListener('change', onChange);
    return () => subscription.remove();
  }, []);
}

/**
 * Optional online/offline bridge. RN has no `navigator.onLine`, so wire
 * `@react-native-community/netinfo` to TanStack Query's `onlineManager`. It is a
 * native module, so install it deliberately and rebuild the dev client:
 *
 *   npx expo install @react-native-community/netinfo
 *
 * Then uncomment:
 *
 *   import NetInfo from '@react-native-community/netinfo';
 *   import { onlineManager } from '@tanstack/react-query';
 *
 *   onlineManager.setEventListener((setOnline) =>
 *     NetInfo.addEventListener((state) => setOnline(!!state.isConnected)),
 *   );
 */
