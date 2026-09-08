'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Menu,
  X,
  Plus,
  Check,
  Search,
  MessageCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

const products = [
  {
    id: 'acetica',
    name: 'Silicona acética Pegalo',
    line: 'Pegalo',
    lines: ['Pegalo', 'Instalador'],
    size: '280 cc · 32 cc · 85 cc',
    use: 'Para sellar y pegar vidrio, chapa, madera, cerámicas y azulejos.',
    colors: 'Transparente, blanco y negro en cartuchos. Transparente en pomos.',
    url: 'sellador-acetico-pegalo',
    pdf: 'Pegalo-Acetic-Silicone-Sealant-TDS.pdf',
  },
  {
    id: 'neutra',
    name: 'Silicona neutra',
    line: 'Pegalo',
    lines: ['Pegalo', 'Instalador'],
    size: 'Cartucho de 280 cc',
    use: 'Sellador adhesivo de uso profesional para vidrios, espejos, policarbonatos y mampostería.',
    colors: 'Transparente, blanco y negro.',
    url: 'silicona-neutra',
  },
  {
    id: 'espuma',
    name: 'Espuma de poliuretano',
    line: 'Artesanato',
    lines: ['Artesanato', 'Instalador'],
    size: '300 cc · 500 cc',
    use: 'Para rellenar, obturar, sellar y fijar. Uso profesional en construcción e industria.',
    colors: 'Consultar disponibilidad.',
    url: 'espuma-de-poliuretano',
  },
  {
    id: 'acrilico',
    name: 'Sellador acrílico',
    line: 'Pegalo',
    lines: ['Pegalo', 'Instalador'],
    size: 'Cartucho de 280 cc',
    use: 'Para juntas en la construcción, marcos de puertas y ventanas y grietas en paredes y techos.',
    colors: 'Blanco.',
    url: 'sellador-acrilico',
  },
  {
    id: 'artesanato',
    name: 'Silicona acética Artesanato',
    line: 'Artesanato',
    lines: ['Artesanato', 'Instalador'],
    size: 'Cartucho de 280 cc',
    use: 'Sellador para construcción, reparaciones automotrices, ingeniería sanitaria y náutica.',
    colors: 'Transparente.',
    url: 'silicona-acetica-artesanato',
  },
  {
    id: 'pistola',
    name: 'Pistola aplicadora',
    line: 'Instalador',
    lines: ['Instalador'],
    size: 'Liviana · Reforzada',
    use: 'Para la aplicación de productos presentados en cartuchos de 280 cc y 300 cc.',
    colors: 'Consultar disponibilidad.',
    url: 'pistola-aplicadora',
  },
  {
    id: 'cola',
    name: 'Cola vinílica Pegalo',
    line: 'Pegalo',
    lines: ['Pegalo'],
    size: 'Desde ⅛ kg hasta 20 kg',
    use: 'Cola de carpintería de base acuosa para madera, cartón y masa de porcelana.',
    colors: 'Consultar disponibilidad.',
    url: 'cola-vinilica-pegalo',
  },
  {
    id: 'ciano',
    name: 'Cianoacrilato Pegalo',
    line: 'Pegalo',
    lines: ['Pegalo'],
    size: '10 g · 20 g',
    use: 'Adhesivo instantáneo para una amplia variedad de superficies y materiales.',
    colors: 'Consultar disponibilidad.',
    url: 'cianocrilato-pegalo',
  },
  {
    id: 'teflon',
    name: 'Cinta teflón',
    line: 'Pegalo',
    lines: ['Pegalo'],
    size: 'Consultar medidas',
    use: 'Para el sellado de conexiones roscadas de plástico y metal.',
    colors: 'Consultar disponibilidad.',
    url: 'cinta-teflon',
  },
];
type Product = (typeof products)[number];
const lines = [
  {
    name: 'Pegalo',
    title: (
      <>
        LA UNIÓN
        <br />
        HACE TODO.
      </>
    ),
    desc: 'Adhesivos y selladores que acompañan cada proyecto. Del primer arreglo al trabajo de todos los días.',
    tag: 'CONSTRUCCIÓN / HOGAR / CARPINTERÍA',
    image: 'acetica',
    second: 'cola',
  },
  {
    name: 'Artesanato',
    title: (
      <>
        IDEAS QUE
        <br />
        TOMAN FORMA.
      </>
    ),
    desc: 'Soluciones para crear, reparar y transformar. Una línea tan versátil como tus proyectos.',
    tag: 'ARTESANÍA / INDUSTRIA / AUTOMOTOR',
    image: 'espuma',
    second: 'artesanato',
  },
  {
    name: 'Instalador',
    title: (
      <>
        TU OFICIO.
        <br />
        NUESTRA FUERZA.
      </>
    ),
    desc: 'Selladores y complementos para quienes conocen el valor de un trabajo bien hecho.',
    tag: 'INSTALACIONES / CONSTRUCCIÓN',
    image: 'neutra',
    second: 'pistola',
  },
];
const whatsapp = (message: string) =>
  `https://wa.me/541164174036?text=${encodeURIComponent(message)}`;

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [quote, setQuote] = useState<string[]>([]);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [name, setName] = useState('');
  const [locality, setLocality] = useState('');
  const [note, setNote] = useState('');
  const visible = products.filter(
    (p) =>
      (filter === 'Todos' || p.lines.includes(filter)) &&
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
    setQuery('');
    document.getElementById('catalogo')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  };
  useEffect(() => {
    const el = root.current;
    if (!el) return;
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
    const panels = Array.from(el.querySelectorAll<HTMLElement>('.line-panel'));
    const hero = el.querySelector<HTMLElement>('.hero');
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
      if (!reduced.matches) {
        hero?.style.setProperty(
          '--hero-progress',
          String(Math.min(1, y / (h * 0.95))),
        );
        panels.forEach((panel) => {
          const next = panel.nextElementSibling;
          if (next) {
            const n = next.getBoundingClientRect().top;
            panel.style.setProperty(
              '--overlap',
              String(Math.max(0, Math.min(1, (h - n) / (h - 100)))),
            );
          }
        });
      }
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
    };
  }, []);
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
    <div ref={root} className="site">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <header className="header">
        <a href="#inicio" className="logo" aria-label="Pegalo, inicio">
          <Image
            unoptimized
            src="/logo.png"
            alt="PEGALO"
            width="178"
            height="39"
          />
        </a>
        <nav aria-label="Navegación principal">
          <a href="#productos">Nuestras líneas</a>
          <a href="#catalogo">Productos</a>
          <a href="#empresa">Empresa</a>
        </nav>
        <button className="header-cta" onClick={() => setQuoteOpen(true)}>
          Hablemos de tu proyecto <ArrowUpRight size={19} />
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
          {[
            ['Nuestras líneas', 'productos'],
            ['Productos', 'catalogo'],
            ['Empresa', 'empresa'],
            ['Contacto', 'contacto'],
          ].map(([label, id]) => (
            <a href={'#' + id} key={id} onClick={() => setMenu(false)}>
              {label}
              <ArrowUpRight />
            </a>
          ))}
        </nav>
      )}
      <main id="contenido">
        <section className="hero" id="inicio">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-kicker">
            <span className="live-dot" /> ADHESIVOS Y SELLADORES{' '}
            <span className="hero-origin">ARGENTINA · DESDE 1998</span>
          </div>
          <div className="hero-main">
            <div className="hero-copy">
              <h1>
                <span>
                  <b>HECHOS</b>
                </span>
                <span>
                  <b>PARA</b>
                </span>
                <span>
                  <b className="red">UNIR.</b>
                </span>
              </h1>
              <p>
                Materiales. Ideas. Proyectos.
                <br />
                La fuerza que los mantiene juntos.
              </p>
              <a href="#productos" className="button light">
                Descubrí nuestras líneas <ArrowUpRight size={22} />
              </a>
            </div>
            <div className="hero-stage">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="stage-cross" aria-hidden="true">
                +
              </div>
              <span className="stage-label">UNA UNIÓN QUE PERDURA.</span>
              <Image
                unoptimized
                width={1500}
                height={1500}
                className="hero-bottle bottle-back"
                src="/productos/espuma.png"
                alt="Espuma de poliuretano Artesanato"
              />
              <Image
                unoptimized
                width={1500}
                height={1500}
                className="hero-bottle bottle-front"
                src="/productos/acetica.png"
                alt="Silicona acética Pegalo"
                fetchPriority="high"
              />
              <div className="stage-note">
                <span>PEGALO</span>
                <p>Precisión en cada aplicación.</p>
                <ArrowUpRight size={26} />
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#productos">
              <span className="scroll-arrow">
                <ArrowDown size={18} />
              </span>
              DESLIZÁ. CONOCÉ. ELEGÍ.
            </a>
            <span>FABRICAMOS · IMPORTAMOS · DISTRIBUIMOS</span>
            <span className="hero-number">01 / 04</span>
          </div>
        </section>
        <div
          className="ticker"
          aria-label="Construcción, industria, hogar, automotor y artesanía"
        >
          <div className="ticker-track">
            {[0, 1].map((i) => (
              <span key={i} aria-hidden={i === 1}>
                CONSTRUCCIÓN <i>✳</i> INDUSTRIA <i>✳</i> HOGAR <i>✳</i>{' '}
                AUTOMOTOR <i>✳</i> ARTESANÍA <i>✳</i>{' '}
              </span>
            ))}
          </div>
        </div>
        <section className="lines" id="productos">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">01 — NUESTRAS LÍNEAS</p>
            <h2>
              DISTINTOS DESAFÍOS.
              <br />
              <span>LA MISMA FUERZA.</span>
            </h2>
            <p>
              Tres líneas de productos.
              <br />
              Encontrá la tuya.
            </p>
          </div>
          <div className="line-stack">
            {lines.map((line, i) => (
              <article className={'line-panel panel-' + i} key={line.name}>
                <div className="line-inner">
                  <div className="panel-top">
                    <span>LÍNEA {line.name.toUpperCase()}</span>
                    <span>0{i + 1} / 03</span>
                  </div>
                  <div className="line-content">
                    <div className="line-copy">
                      <p className="line-tag">{line.tag}</p>
                      <h3>{line.title}</h3>
                      <p className="line-desc">{line.desc}</p>
                      <button
                        className="button"
                        onClick={() => browse(line.name)}
                      >
                        Explorar {line.name} <ArrowUpRight size={22} />
                      </button>
                    </div>
                    <div className="line-visual">
                      <span className="line-watermark" aria-hidden="true">
                        0{i + 1}
                      </span>
                      <Image
                        unoptimized
                        width={1500}
                        height={1500}
                        className="line-secondary"
                        src={'/productos/' + line.second + '.png'}
                        alt=""
                        loading="lazy"
                      />
                      <Image
                        unoptimized
                        width={1500}
                        height={1500}
                        className="line-primary"
                        src={'/productos/' + line.image + '.png'}
                        alt={'Producto de la línea ' + line.name}
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="panel-bottom">
                    <span>ADHESIVOS Y SELLADORES PEGALO</span>
                    <ArrowDown size={20} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="catalog section" id="catalogo">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">02 — EXPLORÁ EL CATÁLOGO</p>
            <h2>
              EL PRODUCTO JUSTO.
              <br />
              <span>PARA TU TRABAJO.</span>
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
                aria-label="Buscar productos"
                placeholder="¿Qué estás buscando?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          <output className="result-count">{visible.length} productos</output>
          <div className="product-grid">
            {visible.map((p) => (
              <article className="product-card" key={p.id}>
                <button
                  className="product-open"
                  onClick={() => setSelected(p)}
                  aria-label={'Ver ' + p.name}
                >
                  <div className="product-image">
                    <span className="product-line">{p.line}</span>
                    <Image
                      unoptimized
                      width={1500}
                      height={1500}
                      src={'/productos/' + p.id + '.png'}
                      alt={p.name}
                      loading="lazy"
                    />
                    <span className="product-arrow">
                      <ArrowUpRight size={22} />
                    </span>
                  </div>
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p>{p.size}</p>
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
                }}
              >
                Ver todos los productos <ArrowRight size={18} />
              </button>
            </div>
          )}
        </section>
        <section className="about" id="empresa">
          <div className="about-top" data-reveal>
            <p className="eyebrow">03 — SOMOS PEGALO</p>
            <span>EL VALOR DE HACER.</span>
          </div>
          <h2 data-reveal>
            NO SOLO UNIMOS
            <br />
            MATERIALES.
            <br />
            <span>
              UNIMOS LO QUE
              <br />
              VIENE.
            </span>
          </h2>
          <div className="about-bottom">
            <div className="year" data-reveal>
              1998<span>EL COMIENZO DE NUESTRA HISTORIA.</span>
            </div>
            <div data-reveal>
              <p>
                Desde entonces, fabricamos, importamos y distribuimos adhesivos
                y selladores para acompañar a comercios, industrias y
                profesionales.
              </p>
              <p>
                De una idea a un proyecto terminado. De un pequeño arreglo a una
                gran obra. Ahí está Pegalo.
              </p>
              <a
                href="https://adhesivospegalo.com.ar/empresa/"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Conocé nuestra historia <ArrowUpRight size={22} />
              </a>
            </div>
          </div>
        </section>
        <section className="contact section" id="contacto">
          <div className="contact-top" data-reveal>
            <p className="eyebrow">04 — SIGAMOS CONSTRUYENDO</p>
            <span>ATENCIÓN EN TODO EL PAÍS</span>
          </div>
          <div className="contact-main" data-reveal>
            <h2>
              HAGAMOS
              <br />
              <span>CONTACTO.</span>
            </h2>
            <button
              className="contact-circle"
              aria-label="Preparar consulta mayorista"
              onClick={() => setQuoteOpen(true)}
            >
              <ArrowUpRight />
            </button>
          </div>
          <div className="contact-bottom">
            <p>
              ¿Tenés un comercio, una industria o un proyecto?
              <br />
              Encontrá tu producto o consultá por el distribuidor de tu zona.
            </p>
            <a
              href={whatsapp('Hola Pegalo, quisiera realizar una consulta.')}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={19} /> Hablemos por WhatsApp{' '}
              <ArrowUpRight size={19} />
            </a>
          </div>
        </section>
      </main>
      <footer>
        <a href="#inicio" className="logo">
          <Image
            unoptimized
            src="/logo.png"
            alt="Pegalo, volver al inicio"
            width="178"
            height="39"
          />
        </a>
        <p>
          ADHESIVOS Y SELLADORES
          <br />
          ARGENTINA · DESDE 1998
        </p>
        <a href="mailto:ventas@pegalo.com.ar">
          ventas@pegalo.com.ar <ArrowUpRight size={16} />
        </a>
        <a href="#inicio" aria-label="Volver al inicio" className="back-top">
          <ArrowUpRight />
        </a>
      </footer>
      {quote.length > 0 && (
        <button className="quote-float" onClick={() => setQuoteOpen(true)}>
          Tu consulta <span>{quote.length}</span>
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
                  width={1500}
                  height={1500}
                  src={'/productos/' + selected.id + '.png'}
                  alt={selected.name}
                />
              </div>
              <div className="detail-copy">
                <p className="eyebrow">LÍNEA {selected.line.toUpperCase()}</p>
                <DialogTitle className="detail-title">
                  {selected.name}
                </DialogTitle>
                <DialogDescription className="detail-description">
                  {selected.use}
                </DialogDescription>
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
                  <Plus size={18} />
                </button>
                <a
                  className="text-link"
                  href={
                    selected.pdf
                      ? 'https://adhesivospegalo.com.ar/wp-content/uploads/2016/02/' +
                        selected.pdf
                      : 'https://adhesivospegalo.com.ar/' + selected.url + '/'
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {selected.pdf
                    ? 'Ver hoja técnica'
                    : 'Ver información técnica'}
                  <ArrowUpRight size={18} />
                </a>
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
            de Pegalo.
          </DialogDescription>
          <div className="quote-items">
            {quote.length ? (
              quote.map((id) => {
                const p = products.find((x) => x.id === id)!;
                return (
                  <div key={id}>
                    <span>{p.name}</span>
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
                        (id) => '• ' + products.find((p) => p.id === id)!.name,
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
