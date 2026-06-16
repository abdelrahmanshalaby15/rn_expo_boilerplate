import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Sample client-state slice. It demonstrates the convention every feature
 * follows: the slice lives next to the feature, and is registered once in
 * `src/store/root-reducer.ts`. This slice is persisted (see the `whitelist`
 * in `src/store/persist-config.ts`), so its value survives app restarts.
 */
export type CounterState = {
  value: number;
};

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

export default counterSlice.reducer;
