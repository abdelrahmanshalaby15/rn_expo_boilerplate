import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { selectCount } from '../store/counter-selectors';
import { decrement, increment, incrementByAmount, reset } from '../store/counter-slice';

/**
 * Facade hook over the counter slice. Components consume this instead of
 * touching Redux directly, so the wiring can change without rippling into UI.
 */
export function useCounter() {
  const value = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return {
    value,
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
    incrementByAmount: (amount: number) => dispatch(incrementByAmount(amount)),
    reset: () => dispatch(reset()),
  };
}
