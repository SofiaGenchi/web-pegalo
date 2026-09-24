'use client';

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';
import './styles/route-states.css';

const sessionKey = 'pegalo:visited';
function hasNotVisited() {
  try {
    return sessionStorage.getItem(sessionKey) !== '1';
  } catch {
    return true;
  }
}

const subscribe = () => () => {};
const serverSnapshot = () => true;

export function FirstVisitIntro() {
  const firstVisit = useSyncExternalStore(subscribe, hasNotVisited, serverSnapshot);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!firstVisit || finished) return;
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(sessionKey, '1');
      } catch {
        // The intro still ends when storage is unavailable.
      }
      setFinished(true);
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 300 : 1800);
    return () => window.clearTimeout(timer);
  }, [firstVisit, finished]);

  if (!firstVisit || finished) return null;

  return (
    <div className="route-state first-visit-intro" aria-busy="true" aria-label="Cargando Pegalo">
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
    </div>
  );
}

export default function Loading() {
  return <output className="route-loading-status">Cargando…</output>;
}
