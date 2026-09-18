import type { CSSProperties } from 'react';
import './route-states.css';

export default function Loading() {
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
