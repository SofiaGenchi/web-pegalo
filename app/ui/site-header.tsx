'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export const navigation = [
  ['Inicio', 'inicio'],
  ['Productos', 'catalogo'],
  ['Descargas', 'descargas'],
  ['Empresa', 'empresa'],
  ['Dónde estamos', 'donde-atendemos'],
  ['Contacto', 'contacto'],
];

export default function SiteHeader({
  home = false,
  quoteCount = 0,
  onQuote,
  menu: controlledMenu,
  onMenuChange,
  activeSection,
}: {
  home?: boolean;
  quoteCount?: number;
  onQuote?: () => void;
  menu?: boolean;
  onMenuChange?: (open: boolean) => void;
  activeSection?: string;
}) {
  const [localMenu, setLocalMenu] = useState(false);
  const menu = controlledMenu ?? localMenu;
  const setMenu = onMenuChange ?? setLocalMenu;
  const toggle = useRef<HTMLButtonElement>(null);
  const href = (id: string) => `${home ? '' : '/'}#${id}`;
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menu, setMenu]);
  const quoteLabel = (
    <>
      {quoteCount > 0 ? 'Tu consulta' : 'Armar consulta'}{' '}
      {quoteCount > 0 && (
        <span className="nav-quote-count">{quoteCount}</span>
      )}{' '}
    </>
  );
  const quoteClass = 'header-cta' + (quoteCount > 0 ? ' has-products' : '');
  return (
    <>
      <header className="header">
        <Link
          href={href('inicio')}
          className="logo"
          aria-label="Pegalo, inicio"
        >
          <span className="pegalo-wordmark" aria-hidden="true">
            PEGALO<sup className="pegalo-registered">®</sup>
          </span>
        </Link>
        <nav aria-label="Navegación principal">
          {navigation.map(([label, id]) => (
            <Link
              key={id}
              href={href(id)}
              aria-current={activeSection === id ? 'location' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        {onQuote ? (
          <button className={quoteClass} onClick={onQuote}>
            {quoteLabel}
          </button>
        ) : (
          <Link href="/?consulta=1#catalogo" className={quoteClass}>
            {quoteLabel}
          </Link>
        )}
        <button
          ref={toggle}
          className="mobile-toggle"
          aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menu}
          aria-controls="mobile-nav"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
        <div className="scroll-progress" />
      </header>
      {menu && (
        <nav
          className="mobile-nav"
          id="mobile-nav"
          aria-label="Navegación móvil"
        >
          {navigation.map(([label, id]) => (
            <Link key={id} href={href(id)} onClick={() => setMenu(false)}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
