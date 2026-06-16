/** Public surface of the counter feature. */
export { default as counterReducer } from './store/counter-slice';
export * from './store/counter-slice';
export { selectCount } from './store/counter-selectors';
export { useCounter } from './hooks/use-counter';
export { CounterCard } from './components/counter-card';
