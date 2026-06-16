import { combineReducers } from '@reduxjs/toolkit';

import counterReducer from '@/features/counter/store/counter-slice';

/**
 * Single registration point for feature reducers. Add a feature's slice here:
 *
 *   import fooReducer from '@/features/foo/store/foo-slice';
 *   ...
 *   foo: fooReducer,
 *
 * Reducers are imported directly from their slice file (not the feature barrel)
 * so configuring the store never pulls feature UI into the store module.
 */
export const rootReducer = combineReducers({
  counter: counterReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
