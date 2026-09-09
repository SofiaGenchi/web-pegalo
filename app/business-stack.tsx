'use client';
import { useEffect, useRef, type ReactNode } from 'react';
export default function BusinessStack({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cards = Array.from(
      root.current?.querySelectorAll<HTMLElement>(':scope > section') ?? [],
    );
    const measure = () =>
      cards.forEach((card) => {
        card.style.setProperty(
          '--stack-top',
          `${Math.min(88, window.innerHeight - card.offsetHeight - 20)}px`,
        );
      });
    const observer = new ResizeObserver(measure);
    cards.forEach((card) => observer.observe(card));
    window.addEventListener('resize', measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  return (
    <div className="business-stack" ref={root}>
      {children}
    </div>
  );
}
