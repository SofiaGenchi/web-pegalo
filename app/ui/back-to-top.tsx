'use client';
import { useEffect, useState } from 'react';

export default function BackToTop({
  raised,
  hidden,
}: {
  raised: boolean;
  hidden: boolean;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 400);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  if (!visible || hidden) return null;
  return (
    <button
      type="button"
      className={`back-to-top${raised ? ' back-to-top-raised' : ''}`}
      aria-label="Volver al inicio de la página"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
            .matches
            ? 'instant'
            : 'smooth',
        });
      }}
    >
      Arriba
    </button>
  );
}
