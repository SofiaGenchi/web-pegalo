'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productPath, uniqueProducts } from './catalog/product-links';
import CatalogSection from './catalog/catalog-section';
import QuoteDialog from './quote/quote-dialog';
import PegaloName from './ui/pegalo-name';
import CompanySection from './sections/company-section';
import BusinessSections from './sections/business-sections';
import BusinessStack from './sections/business-stack';
import './styles/business-stack.css';
import './styles/business-sections.css';
import SiteHeader, { navigation } from './ui/site-header';
import SiteFooter from './ui/site-footer';
import type { ManagedProduct as Product, Distributor } from './catalog/content-policy';
import { useQuote } from './quote/use-quote';
import StoryJourney from './sections/story-journey';
import Downloads from './sections/downloads';
import BackToTop from './ui/back-to-top';
import FaqChat from './ui/faq-chat';
import './styles/documents.css';
import './styles/simple-view.css';
import { useSimpleView } from './ui/use-simple-view';

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
  useEffect(() => {
    const openLinkedProduct = () => {
      const url = new URL(window.location.href);
      if (url.searchParams.get('consulta') === '1') {
        setQuoteOpen(true);
        url.searchParams.delete('consulta');
        window.history.replaceState(window.history.state, '', url);
      }
      const id = url.searchParams.get('producto');
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
    }> = [{ id: 'empresa', zoneDown: 100, zoneUp: 100 }];
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
          .filter(
            (
              item,
            ): item is { section: HTMLElement; id: 'empresa' | 'contacto' } =>
              !!item,
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
      <SiteHeader
        home
        quoteCount={quote.length}
        onQuote={() => setQuoteOpen(true)}
        menu={menu}
        onMenuChange={setMenu}
        activeSection={activeSection}
      />
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
        <CatalogSection
          catalogUnavailable={catalogUnavailable}
          filter={filter}
          setFilter={setFilter}
          family={family}
          setFamily={setFamily}
          query={query}
          setQuery={setQuery}
          visible={visible}
          shownProducts={shownProducts}
          visibleCount={visibleCount}
          setVisibleCount={setVisibleCount}
          onQuoteOpen={() => setQuoteOpen(true)}
        />
        <BusinessStack>
          <Downloads />
          <CompanySection />
          <BusinessSections distributors={distributors} />
        </BusinessStack>
      </main>
      <SiteFooter />
      <BackToTop raised={false} hidden={menu || quoteOpen} />
      <FaqChat hidden={menu || quoteOpen} />
      <QuoteDialog
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        products={products}
        quote={quote}
        setQuote={setQuote}
      />
    </div>
  );
}
