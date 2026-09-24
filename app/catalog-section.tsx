'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search, X } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { productFamilies } from './products';
import type { ManagedProduct as Product } from './content-policy';
import { productPath } from './product-links';
import { presentationBadges } from './product-presentations';
import PegaloName from './pegalo-name';

type CatalogSectionProps = {
  catalogUnavailable: boolean;
  filter: string;
  setFilter: (value: string) => void;
  family: string;
  setFamily: (value: string) => void;
  query: string;
  setQuery: (value: string) => void;
  visible: Product[];
  shownProducts: Product[];
  visibleCount: number;
  setVisibleCount: Dispatch<SetStateAction<number>>;
  onQuoteOpen: () => void;
};

export default function CatalogSection({
  catalogUnavailable,
  filter,
  setFilter,
  family,
  setFamily,
  query,
  setQuery,
  visible,
  shownProducts,
  visibleCount,
  setVisibleCount,
  onQuoteOpen,
}: CatalogSectionProps) {
  return (
    <section className="catalog section" id="catalogo" tabIndex={-1}>
      <div className="section-heading" data-reveal>
        <p className="eyebrow">EXPLORÁ EL CATÁLOGO</p>
        <h2>
          Soluciones
          <br />
          <span>para cada aplicación.</span>
        </h2>
        <p>
          Encontrá los productos que mejor se adaptan
          <br />a tu negocio y armá tu consulta.
        </p>
      </div>
      {catalogUnavailable ? (
        <div className="catalog-unavailable" aria-live="polite">
          <h3>No pudimos cargar los productos.</h3>
          <p>
            Podés consultar precios y promociones o escribirnos mientras
            consultar disponibilidad y condiciones mientras restablecemos el
            catálogo.
          </p>
          <div className="catalog-recovery-actions">
            <button className="button" onClick={() => window.location.reload()}>
              Reintentar
            </button>
            <button className="button" onClick={() => onQuoteOpen()}>
              Consultar a ventas
            </button>
            <a href="#descargas">Descargas</a>
          </div>
        </div>
      ) : (
        <>
          <div className="catalog-tools">
            <div className="filters" aria-label="Filtrar por línea">
              {['Todos', 'Pegalo', 'Artesanato', 'Instalador'].map((l) => (
                <button
                  aria-pressed={filter === l}
                  key={l}
                  onClick={() => setFilter(l)}
                  className={filter === l ? 'active' : ''}
                >
                  {l}
                </button>
              ))}
            </div>
            <label className="search">
              <Search size={18} />
              <input
                type="search"
                aria-label="Buscar productos"
                placeholder="¿Qué estás buscando?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          <div
            className="family-filters"
            aria-label="Filtrar por tipo de producto"
          >
            {['Todos', ...productFamilies.map((group) => group.name)].map(
              (group) => (
                <button
                  key={group}
                  aria-pressed={family === group}
                  onClick={() => setFamily(group)}
                >
                  {group === 'Todos' ? 'Todos los tipos' : group}
                </button>
              ),
            )}
          </div>
          <div className="catalog-summary">
            <output className="result-count">
              Mostrando {shownProducts.length} de {visible.length} productos
            </output>
            {(family !== 'Todos' || filter !== 'Todos' || query) && (
              <button
                onClick={() => {
                  setFamily('Todos');
                  setFilter('Todos');
                  setQuery('');
                }}
              >
                Limpiar filtros <X size={14} />
              </button>
            )}
            <span>
              Seleccioná los productos sobre los que querés consultar.
            </span>
          </div>
          <div className="product-grid" id="catalog-product-grid">
            {visible.map((p, index) => (
              <article
                className="product-card"
                key={p.id}
                style={index >= visibleCount ? { display: 'none' } : undefined}
              >
                <Link
                  className="product-open"
                  href={productPath(p)}
                  aria-label={'Ver ' + p.name}
                >
                  <div className="product-image">
                    <span className="product-line">
                      {p.line === 'Pegalo' ? <PegaloName /> : p.line}
                    </span>
                    <Image
                      unoptimized
                      width={500}
                      height={500}
                      src={p.image || '/product-placeholder.svg'}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <span className="product-application">{p.use}</span>
                    <div
                      className="presentation-badges"
                      aria-label="Presentaciones disponibles"
                    >
                      {presentationBadges(p).map((presentation) => (
                        <span key={presentation}>{presentation}</span>
                      ))}
                    </div>
                  </div>
                </Link>
                <Link className={'add-product'} href={productPath(p)}>
                  <Plus size={16} /> Elegir y agregar
                </Link>
              </article>
            ))}
          </div>
          {visible.length > 4 && (
            <div className="catalog-more">
              <button
                type="button"
                className="story-button"
                aria-controls="catalog-product-grid"
                onClick={() => {
                  if (shownProducts.length < visible.length) {
                    setVisibleCount((count) =>
                      Math.min(count + 4, visible.length),
                    );
                  } else {
                    setVisibleCount(4);
                    requestAnimationFrame(() => {
                      const catalog = document.getElementById('catalogo');
                      if (!catalog) return;
                      catalog.focus({ preventScroll: true });
                      const top =
                        catalog.getBoundingClientRect().top +
                        window.scrollY -
                        100;
                      window.scrollTo({
                        top: Math.max(0, top),
                        behavior: window.matchMedia(
                          '(prefers-reduced-motion: reduce)',
                        ).matches
                          ? 'instant'
                          : 'smooth',
                      });
                    });
                  }
                }}
              >
                {shownProducts.length < visible.length
                  ? 'Ver más productos'
                  : 'Ver menos'}
              </button>
            </div>
          )}
          {!visible.length && (
            <div className="no-results">
              <h3>No encontramos ese producto.</h3>
              <p>Probá con otro nombre o consultanos por lo que necesitás.</p>
              <button
                className="button"
                onClick={() => {
                  setQuery('');
                  setFilter('Todos');
                  setFamily('Todos');
                }}
              >
                Ver todos los productos
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
