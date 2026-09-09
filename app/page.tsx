'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PegaloName from './pegalo-name';
import CompanySection from './company-section';
import BusinessSections from './business-sections';
import BusinessStack from './business-stack';
import './business-stack.css';
import './business-sections.css';
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Plus,
  Check,
  Search,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

import { products, productFamilies, type Product } from './products';
import { useQuote } from './use-quote';
import './refinements.css';
import StoryJourney from './story-journey';
import Downloads from './downloads';
import './documents.css';
import './simple-view.css';
import { useSimpleView } from './use-simple-view';

const navigation = [
  ['Inicio', 'inicio'],
  ['Empresa', 'empresa'],
  ['Productos', 'catalogo'],
  ['Dónde atendemos', 'donde-atendemos'],
  ['Contacto', 'contacto'],
];

const whatsapp = (message: string) =>
  `https://wa.me/541164174036?text=${encodeURIComponent(message)}`;

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const { simple } = useSimpleView();
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const {
    ids: quote,
    setIds: setQuote,
    quantities,
    setQuantity,
    total,
  } = useQuote();
  const [family, setFamily] = useState('Todos');
  const [activeSection, setActiveSection] = useState('inicio');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [name, setName] = useState('');
  const [locality, setLocality] = useState('');
  const [note, setNote] = useState('');
  const visible = products.filter(
    (p) =>
      (filter === 'Todos' || p.lines.includes(filter)) &&
      (family === 'Todos' ||
        productFamilies
          .find((group) => group.name === family)
          ?.ids.includes(p.id)) &&
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
  const add = (id: string) =>
    setQuote((q) => (q.includes(id) ? q : [...q, id]));
  const browse = (line: string) => {
    setFilter(line);
    setFamily('Todos');
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
  }, []);
  return (
    <div ref={root} className={'site' + (simple ? ' simple-view' : '')}>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <header className="header">
        <a href="#inicio" className="logo" aria-label="Pegalo, inicio">
          <span className="pegalo-wordmark" aria-hidden="true">
            PEGALO<sup className="pegalo-registered">®</sup>
          </span>
        </a>
        <nav aria-label="Navegación principal">
          {navigation.map(([label, id]) => (
            <a
              href={'#' + id}
              key={id}
              aria-current={activeSection === id ? 'location' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <button className="header-cta" onClick={() => setQuoteOpen(true)}>
          Consulta mayorista{' '}
          {quote.length > 0 && (
            <span className="nav-quote-count">{quote.length}</span>
          )}{' '}
          <ArrowUpRight size={19} />
        </button>
        <button
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
            <a href={'#' + id} key={id} onClick={() => setMenu(false)}>
              {label}
              <ArrowUpRight />
            </a>
          ))}
        </nav>
      )}
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
            <p>
              Vista sin animaciones, con fotos y acceso directo a toda la
              información.
            </p>
            <nav
              className="simple-links"
              id="productos"
              aria-label="Accesos directos"
            >
              <a href="#catalogo">Consultar productos</a>
              <a href="#descargas">Precios y promociones</a>
              <button onClick={() => setQuoteOpen(true)}>
                Consulta mayorista
              </button>
            </nav>
          </section>
        ) : (
          <StoryJourney
            onProduct={(id) =>
              setSelected(products.find((p) => p.id === id) ?? null)
            }
            onContact={() => setQuoteOpen(true)}
            onBrowse={browse}
          />
        )}
        <section className="catalog section" id="catalogo">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">02 — EXPLORÁ EL CATÁLOGO</p>
            <h2>
              El producto justo.
              <br />
              <span>Para tu trabajo.</span>
            </h2>
            <p>
              Conocé sus aplicaciones
              <br />y armá tu consulta.
            </p>
          </div>
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
              {visible.length} de {products.length} productos
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
            <span>Seleccioná productos y pedí tu cotización.</span>
          </div>
          <div className="product-grid">
            {visible.map((p) => (
              <article className="product-card" key={p.id}>
                <button
                  className="product-open"
                  onClick={() => setSelected(p)}
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
                      src={'/productos/' + p.id + '.png'}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="product-arrow">
                      <ArrowUpRight size={22} />
                    </span>
                  </div>
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p>{p.size}</p>
                    <span className="product-application">{p.use}</span>
                  </div>
                </button>
                <button
                  className={
                    'add-product ' + (quote.includes(p.id) ? 'added' : '')
                  }
                  onClick={() => add(p.id)}
                  disabled={quote.includes(p.id)}
                >
                  {quote.includes(p.id) ? (
                    <>
                      <Check size={16} /> Agregado a tu consulta
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Agregar a consulta
                    </>
                  )}
                </button>
              </article>
            ))}
          </div>
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
                Ver todos los productos <ArrowRight size={18} />
              </button>
            </div>
          )}
        </section>
        <BusinessStack>
          <Downloads />
          <CompanySection />
          <BusinessSections />
        </BusinessStack>
      </main>
      <footer className="company-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a
              href="#inicio"
              className="logo"
              aria-label="Pegalo, volver al inicio"
            >
              <span className="pegalo-wordmark" aria-hidden="true">
                PEGALO<sup className="pegalo-registered">®</sup>
              </span>
            </a>
            <p>
              A lo largo de más de 18 años, <PegaloName /> ha mostrado claros
              signos de liderazgo. Desarrollando ideas al servicio de las
              empresas del sector, aportando soluciones concretas a los
              obstáculos que se interponen en el camino.
            </p>
          </div>
          <div className="footer-contact">
            <h2>Contactanos</h2>
            <address>
              <a
                href="https://wa.me/541164174036"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Celular / WhatsApp</span>+54 9 11 6417-4036
              </a>
              <a href="tel:08001220975">
                <span>Teléfono</span>0800-122-0975
              </a>
              <a href="mailto:ventas@pegalo.com.ar">
                <span>Correo electrónico</span>ventas@pegalo.com.ar
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Asamblea%204355%2C%20Santos%20Lugares%2C%20Buenos%20Aires"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Encontranos</span>Asamblea 4355, Santos Lugares
                <br />
                CP 1676, Buenos Aires
              </a>
            </address>
          </div>
          <nav className="footer-social" aria-label="Redes sociales">
            <h2>Seguinos</h2>
            <p>@adhesivospegalo</p>
            <a
              href="https://www.instagram.com/adhesivospegalo/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram <ArrowUpRight size={17} />
            </a>
            <a
              href="https://www.facebook.com/adhesivospegalo/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook <ArrowUpRight size={17} />
            </a>
            <a
              href="https://www.tiktok.com/@adhesivospegalo"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok <ArrowUpRight size={17} />
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            © 2026 <PegaloName />. Todos los derechos reservados.
          </p>
          <div>
            <a href="#inicio">
              Volver arriba <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </footer>
      {quote.length > 0 && (
        <button className="quote-float" onClick={() => setQuoteOpen(true)}>
          Tu consulta <span>{quote.length}</span>
          <small>{total} unidades</small>
          <ArrowUpRight size={20} />
        </button>
      )}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="product-dialog" showCloseButton={false}>
          <DialogClose className="modal-close" aria-label="Cerrar ficha">
            <X />
          </DialogClose>
          {selected && (
            <>
              <div className="detail-image">
                <Image
                  unoptimized
                  width={500}
                  height={500}
                  src={'/productos/' + selected.id + '.png'}
                  alt={selected.name}
                />
              </div>
              <div className="detail-copy">
                <p className="eyebrow">
                  LÍNEA{' '}
                  {selected.line === 'Pegalo' ? (
                    <PegaloName />
                  ) : (
                    selected.line.toUpperCase()
                  )}
                </p>
                <DialogTitle className="detail-title">
                  {selected.name}
                </DialogTitle>
                <DialogDescription className="detail-description">
                  {selected.use}
                </DialogDescription>
                {selected.id.startsWith('ciano-') && (
                  <div className="variant-picker">
                    <span>Elegí la presentación</span>
                    <div>
                      {[10, 20, 100].map((size) => (
                        <button
                          key={size}
                          aria-pressed={selected.id === 'ciano-' + size}
                          onClick={() =>
                            setSelected(
                              products.find((p) => p.id === 'ciano-' + size)!,
                            )
                          }
                        >
                          {size} g
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <dl>
                  <dt>Presentación</dt>
                  <dd>{selected.size}</dd>
                  <dt>Colores</dt>
                  <dd>{selected.colors}</dd>
                </dl>
                <button
                  className="button"
                  disabled={quote.includes(selected.id)}
                  onClick={() => add(selected.id)}
                >
                  {quote.includes(selected.id)
                    ? 'Agregado a tu consulta'
                    : 'Agregar a consulta'}
                  {quote.includes(selected.id) ? (
                    <Check size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                </button>
                {quote.includes(selected.id) && (
                  <button
                    className="detail-quote-link"
                    onClick={() => {
                      setSelected(null);
                      setQuoteOpen(true);
                    }}
                  >
                    Continuar con mi consulta <ArrowRight size={16} />
                  </button>
                )}
                <details className="technical-info">
                  <summary>Información técnica</summary>
                  <p>{selected.use}</p>
                  <dl>
                    <dt>Presentación</dt>
                    <dd>{selected.size}</dd>
                    <dt>Colores disponibles</dt>
                    <dd>{selected.colors}</dd>
                  </dl>
                  {selected.pdf ? (
                    <a href="/fichas/silicona-acetica.pdf" download>
                      Descargar ficha técnica PDF <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <p className="technical-pending">
                      La ficha técnica completa de este producto todavía no está
                      publicada.
                    </p>
                  )}
                </details>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
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
                const p = products.find((x) => x.id === id)!;
                return (
                  <div key={id} className="quote-row">
                    <Image
                      unoptimized
                      src={'/productos/' + p.id + '.png'}
                      alt=""
                      width={64}
                      height={64}
                    />
                    <div className="quote-row-info">
                      <strong>{p.name}</strong>
                      <span>{p.size}</span>
                      <div className="quantity-control">
                        <button
                          aria-label={'Restar una unidad de ' + p.name}
                          disabled={(quantities[id] ?? 1) <= 1}
                          onClick={() =>
                            setQuantity(id, (quantities[id] ?? 1) - 1)
                          }
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="9999"
                          step="1"
                          inputMode="numeric"
                          aria-label={'Cantidad de ' + p.name}
                          value={quantities[id] ?? 1}
                          onChange={(e) =>
                            setQuantity(id, Number(e.target.value))
                          }
                        />
                        <button
                          aria-label={'Sumar una unidad de ' + p.name}
                          disabled={(quantities[id] ?? 1) >= 9999}
                          onClick={() =>
                            setQuantity(id, (quantities[id] ?? 1) + 1)
                          }
                        >
                          +
                        </button>
                        <span>unidades</span>
                      </div>
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
          {quote.length > 0 && (
            <div className="quote-total">
              <span>{quote.length} productos seleccionados</span>
              <strong>{total} unidades</strong>
            </div>
          )}
          <p className="quote-storage-note">
            Tu selección se conserva en este navegador. Las cantidades están
            sujetas a la presentación comercial disponible.
          </p>
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
              placeholder="Contanos qué necesitás, presentaciones y cantidades…"
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
                          (quantities[id] ?? 1) +
                          ' unidades — ' +
                          products.find((p) => p.id === id)!.name +
                          ' (' +
                          products.find((p) => p.id === id)!.size +
                          ')',
                      )
                      .join('\n'),
                note,
              ]
                .filter(Boolean)
                .join('\n\n'),
            )}
          >
            Continuar por WhatsApp <ArrowUpRight size={20} />
          </a>
        </DialogContent>
      </Dialog>
    </div>
  );
}
