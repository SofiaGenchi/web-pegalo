'use client';

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react';
import './route-states.css';

const sessionKey = 'pegalo:visited';
let visited = false;

function isFirstVisit() {
  try {
    return !visited && sessionStorage.getItem(sessionKey) !== '1';
  } catch {
    return !visited;
  }
}

const subscribe = () => () => {};
const serverSnapshot = () => false;

export function SessionReady() {
  useEffect(() => {
    visited = true;
    try {
      sessionStorage.setItem(sessionKey, '1');
    } catch {
      // Keep in-memory navigation working when storage is unavailable.
    }
  }, []);
  return null;
}

export default function Loading() {
  const firstVisit = useSyncExternalStore(
    subscribe,
    isFirstVisit,
    serverSnapshot,
  );
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  if (!firstVisit) {
    return slow ? (
      <output className="route-loading-status">Cargando…</output>
    ) : null;
  }

  return (
    <main className="route-state" aria-busy="true" aria-label="Cargando Pegalo">
      <div className="route-state-brand loading-word" aria-hidden="true">
        {'PEGALO'.split('').map((letter, index) => (
          <span
            key={index}
            style={{ '--letter-index': index } as CSSProperties}
          >
            {letter}
          </span>
        ))}
      </div>
      <output className="loading-caption">Cargando…</output>
    </main>
  );
}
