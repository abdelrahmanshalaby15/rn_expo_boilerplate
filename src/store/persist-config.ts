import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersistConfig } from 'redux-persist';

import type { RootReducerState } from './root-reducer';

/**
 * redux-persist configuration. Persists to the same AsyncStorage engine the app
 * already uses (under the `persist:root` key — no collision with the i18n
 * `app.locale` key).
 *
 * `whitelist` is the safe default: ONLY the slices listed here survive a restart,
 * so ephemeral/server state never accidentally persists. Add a slice's key here
 * to make it durable.
 */
export const persistConfig: PersistConfig<RootReducerState> = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['counter'],
};
