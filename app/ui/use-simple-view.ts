'use client';
import { useSyncExternalStore } from 'react';
import { createViewDecision, type ViewSignals } from './view-policy';

const snapshot = createViewDecision(() => {
  const connection = (navigator as Navigator & { connection?: ViewSignals })
    .connection;
  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches,
    online: navigator.onLine,
    saveData: connection?.saveData,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
  };
});
// Network changes do not replace the page underneath the visitor.
const subscribe = () => () => {};
const serverSnapshot = () => true;
export function useSimpleView() {
  const simple = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return { simple };
}
