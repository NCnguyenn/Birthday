import { useSyncExternalStore } from 'react';

const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const subscribe = (notify: () => void) => {
  preference.addEventListener('change', notify);
  return () => preference.removeEventListener('change', notify);
};
const getSnapshot = () => preference.matches;

export default function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
