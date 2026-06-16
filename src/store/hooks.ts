import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './index';

/**
 * Typed Redux hooks. Always use these instead of the raw react-redux
 * `useDispatch` / `useSelector` so dispatch and state are fully typed.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
