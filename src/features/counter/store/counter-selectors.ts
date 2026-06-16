import type { RootState } from '@/store';

/** Read the counter value. Selectors keep components decoupled from state shape. */
export const selectCount = (state: RootState) => state.counter.value;
