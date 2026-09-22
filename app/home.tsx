'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { productPath, uniqueProducts } from './product-links';
import {
  presentationBadges,
  quoteProductId,
  quotePresentation,
} from './product-presentations';
import PegaloName from './pegalo-name';
import CompanySection from './company-section';
import BusinessSections from './business-sections';
import BusinessStack from './business-stack';
import './business-stack.css';
import './business-sections.css';
import { X, Plus, Search } from 'lucide-react';
import SiteHeader, { navigation } from './site-header';
import SiteFooter from './site-footer';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

import { productFamilies } from './products';
import type { ManagedProduct as Product, Distributor } from './content-policy';
import { useQuote } from './use-quote';
import './refinements.css';
import StoryJourney from './story-journey';
import Downloads from './downloads';
import BackToTop from './back-to-top';
import FaqChat from './faq-chat';
import './documents.css';
import './simple-view.css';
import { useSimpleView } from './use-simple-view';

const whatsapp = (message: string) =>
  `https://wa.me/541164174036?text=${encodeURIComponent(message)}`;

export default function Home({
  products,
  distributors,
  catalogUnavailable = false,
}: {
  products: Product[];
  distributors: Distributor[];
  catalogUnavailable?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { simple } = useSimpleView();
  const [menu, setMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [filter, updateFilter] = useState('Todos');
  const [query, updateQuery] = useState('');
  const setFilter = (value: string) => {
    updateFilter(value);
    setVisibleCount(4);
  };
  const setQuery = (value: string) => {
    updateQuery(value);
    setVisibleCount(4);
  };
  const { ids: quote, setIds: setQuote } = useQuote(products);
  const [family, updateFamily] = useState('Todos');
  const setFamily = (value: string) => {
    updateFamily(value);
    setVisibleCount(4);
  };
  const [activeSection, setActiveSection] = useState('inicio');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [name, setName] = useState('');
  const [locality, setLocality] = useState('');
  const [note, setNote] = useState('');
  useEffect(() => {
    const openLinkedProduct = () => {
      if (new URL(window.location.href).searchParams.get('consulta') === '1') setQuoteOpen(true);
      const id = new URL(window.location.href).searchParams.get('producto');
      const product = products.find((product) => product.id === id);
      if (product) router.replace(productPath(product));
    };
    openLinkedProduct();
    window.addEventListener('popstate', openLinkedProduct);
    return () => window.removeEventListener('popstate', openLinkedProduct);
  }, [products, router]);
  const catalogProducts = uniqueProducts(products);
  const visible = catalogProducts.filter(
    (p) =>
      (filter === 'Todos' || p.lines.includes(filter)) &&
      (family === 'Todos' || p.family === family) &&
      `${p.name} ${p.use}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .includes(
          query
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase(),
        ),
  );
  const shownProducts = visible.slice(0, visibleCount);
  const browse = (line: string, productFamily = 'Todos') => {
    setFilter(line);
    setFamily(productFamily);
    setQuery('');
    document.getElementById('catalogo')?.scrollIntoView({
      behavior:
        simple || window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
    });
  };
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(false);
        root.current
          ?.querySelector<HTMLButtonElement>('.mobile-toggle')
          ?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menu]);
  useEffect(() => {
    const sections = navigation
      .map(([, id]) => id)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActiveSection(entry.target.id);
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [simple]);
  useEffect(() => {
    if (simple) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    const empresa = document.getElementById('empresa');
    const contacto = document.getElementById('contacto');
    if (!empresa) return;

    let raf = 0;
    let locked = false;
    let unlockTimeout: number | null = null;
    let lastY = window.scrollY;
    const headerOffset = 110;
    const snapZones: Array<{
      id: string;
      zoneDown: number;
      zoneUp: number;
    }> = [
      { id: 'empresa', zoneDown: 100, zoneUp: 100 },
    ];
    const lockMs = 900;

    const getTop = (el: HTMLElement) =>
      el.getBoundingClientRect().top + window.scrollY - headerOffset;

    const onScroll = () => {
      if (locked || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const allSections = [
          empresa
            ? ({ section: empresa, id: 'empresa' as const } as const)
            : null,
          contacto
            ? ({ section: contacto, id: 'contacto' as const } as const)
            : null,
        ]
          .filter((item): item is { section: HTMLElement; id: 'empresa' | 'contacto' } =>
            !!item
          )
          .map((item) => ({
            section: item.section,
            id: item.id,
            top: getTop(item.section),
            config: snapZones.find((c) => c.id === item.id),
          }))
          .filter((item) => Boolean(item.config)) as Array<{
          section: HTMLElement;
          id: 'empresa' | 'contacto';
          top: number;
          config: { id: string; zoneDown: number; zoneUp: number };
        }>;

        if (!allSections.length) {
          lastY = y;
          return;
        }

        const goingDown = y >= lastY;
        const snapCandidates = allSections
          .map((item) => {
            const zone = goingDown ? item.config.zoneDown : item.config.zoneUp;
            const shouldSnap =
              zone > 0 &&
              y >= item.top - zone &&
              y <= item.top + 50 &&
              (goingDown || item.config.zoneUp > 0);
            return { ...item, shouldSnap };
          })
          .filter((item) => item.shouldSnap);

        if (snapCandidates.length > 0) {
          const target = snapCandidates.reduce((best, current) =>
            Math.abs(y - current.top) < Math.abs(y - best.top) ? current : best,
          );

          locked = true;
          window.scrollTo({
            top: Math.max(0, target.top),
            behavior: 'smooth',
          });
          if (unlockTimeout) clearTimeout(unlockTimeout);
          unlockTimeout = window.setTimeout(() => {
            locked = false;
            unlockTimeout = null;
          }, lockMs);
        }

        lastY = y;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (unlockTimeout) clearTimeout(unlockTimeout);
      locked = false;
    };
  }, [simple]);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (simple) {
      el.classList.remove('motion-ready');
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reveals = el.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    reveals.forEach((item) => observer.observe(item));
    el.classList.add('motion-ready');
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const h = window.innerHeight;
      el.style.setProperty('--scroll', String(y));
      el.style.setProperty(
        '--page-progress',
        String(y / Math.max(1, document.documentElement.scrollHeight - h)),
      );
      el.classList.toggle('scrolled', y > 40);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    reduced.addEventListener('change', onScroll);
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      reduced.removeEventListener('change', onScroll);
      el.classList.remove('motion-ready');
    };
  }, [simple]);
  useEffect(() => {
    type CatalogTool = {
      name: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean };
      execute: (input: unknown) => unknown;
    };
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: CatalogTool,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: 'search_pegalo_catalog',
            description:
              'Search the public Pegalo catalog by product name or application. Returns product IDs, names, lines, presentations and uses. Does not add products or send a consultation.',
            inputSchema: {
              type: 'object',
              properties: { query: { type: 'string' } },
              required: ['query'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute(input) {
              if (
                !input ||
                typeof input !== 'object' ||
                !('query' in input) ||
                typeof input.query !== 'string'
              )
                throw new Error('query must be a string');
              const normalize = (value: string) =>
                value
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .toLowerCase();
              const term = normalize(input.query);
              return products
                .filter((p) => normalize(p.name + ' ' + p.use).includes(term))
                .map((p) => ({
                  id: p.id,
                  name: p.name,
                  lines: p.lines,
                  presentation: p.size,
                  application: p.use,
                }));
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {
        /* Progressive enhancement: catalog remains usable without WebMCP. */
      });
    } catch {
      /* Browser without a compatible registry. */
    }
    return () => lifecycle.abort();
  }, [products]);
  return (
    <div ref={root} className={'site' + (simple ? ' simple-view' : '')}>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader home quoteCount={quote.length} onQuote={() => setQuoteOpen(true)} menu={menu} onMenuChange={setMenu} activeSection={activeSection} />
      <main id="contenido">
        {simple ? (
          <section className="simple-intro" id="inicio">
            <h1>
              Adhesivos y selladores <PegaloName />
            </h1>
            <p>
              Empresa argentina dedicada a la importación y comercialización
              mayorista de adhesivos y selladores desde 1998.
            </p>
            <nav
              className="simple-links"
              id="productos"
              aria-label="Accesos directos"
            >
              <a href="#catalogo">Consultar productos</a>
              <a href="#descargas">Descargas</a>
              <button onClick={() => setQuoteOpen(true)}>
                Consulta mayorista
              </button>
            </nav>
          </section>
        ) : (
          <StoryJourney
            onProduct={(id) => {
              const product = products.find((p) => p.id === id);
              if (product) router.push(productPath(product));
            }}
            onContact={() => setQuoteOpen(true)}
            onBrowse={browse}
          />
        )}
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
                consultar disponibilidad y condiciones mientras
                restablecemos el catálogo.
              </p>
              <div className="catalog-recovery-actions">
                <button
                  className="button"
                  onClick={() => window.location.reload()}
                >
                  Reintentar
                </button>
                <button className="button" onClick={() => setQuoteOpen(true)}>
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
                  <article className="product-card" key={p.id} style={index >= visibleCount ? { display: 'none' } : undefined}>
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
                    <Link
                      className={'add-product'}
                      href={productPath(p)}
                    >
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
                  <p>
                    Probá con otro nombre o consultanos por lo que necesitás.
                  </p>
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
        <BusinessStack>
          <Downloads />
          <CompanySection />
          <BusinessSections distributors={distributors} />
        </BusinessStack>
      </main>
      <SiteFooter />
      <BackToTop raised={false} hidden={menu || quoteOpen} />
      <FaqChat hidden={menu || quoteOpen} />
      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent className="quote-dialog" showCloseButton={false}>
          <DialogClose className="modal-close" aria-label="Cerrar consulta">
            <X />
          </DialogClose>
          <p className="eyebrow">VENTA MAYORISTA / ASESORAMIENTO</p>
          <DialogTitle className="detail-title">
            Hablemos de tu proyecto.
          </DialogTitle>
          <DialogDescription>
            Prepará tu consulta y continuá por WhatsApp para enviarla al equipo
            de <PegaloName />.
          </DialogDescription>
          <div className="quote-items">
            {quote.length ? (
              quote.map((id) => {
                const p = products.find((x) => x.id === quoteProductId(id))!;
                return (
                  <div key={id} className="quote-row">
                    <Image
                      unoptimized
                      src={p.image || '/product-placeholder.svg'}
                      alt=""
                      width={64}
                      height={64}
                    />
                    <div className="quote-row-info">
                      <strong>{p.name}</strong>
                      <span>{quotePresentation(p, id)}</span>
                    </div>
                    <button
                      aria-label={'Quitar ' + p.name}
                      onClick={() => setQuote((q) => q.filter((x) => x !== id))}
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })
            ) : (
              <p>
                Podés consultarnos directamente o agregar productos desde el
                catálogo.
              </p>
            )}
          </div>
          <label className="field">
            Nombre o comercio
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="organization"
              placeholder="¿Cómo te llamás?"
            />
          </label>
          <label className="field">
            Localidad y provincia
            <input
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="¿Desde dónde nos escribís?"
            />
          </label>
          <label className="field">
            Tu consulta
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contanos qué te gustaría saber sobre los productos…"
            />
          </label>
          <a
            className="button"
            target="_blank"
            rel="noreferrer"
            href={whatsapp(
              [
                'Hola Pegalo, quisiera realizar una consulta.',
                name && 'Nombre / comercio: ' + name,
                locality && 'Localidad: ' + locality,
                quote.length &&
                  'Productos de interés:\n' +
                    quote
                      .map(
                        (id) =>
                          '• ' +
                          products.find((p) => p.id === quoteProductId(id))!
                            .name +
                          ' (' +
                          quotePresentation(
                            products.find((p) => p.id === quoteProductId(id))!,
                            id,
                          ) +
                          ')',
                      )
                      .join('\n'),
                note,
              ]
                .filter(Boolean)
                .join('\n\n'),
            )}
          >
            Continuar por WhatsApp
          </a>
        </DialogContent>
      </Dialog>
    </div>
  );
}
