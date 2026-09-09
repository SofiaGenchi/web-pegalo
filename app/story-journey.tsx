'use client';
import PegaloName from './pegalo-name';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, ArrowRight } from 'lucide-react';
import './story.css';
import { distanceAtY, type PathSample } from './scroll-path';

export default function StoryJourney({
  onProduct,
  onContact,
  onBrowse,
}: {
  onProduct: (id: string) => void;
  onContact: () => void;
  onBrowse: (line: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const guide = useRef<SVGPathElement>(null);
  const drop = useRef<SVGGElement>(null);
  const neck = useRef<SVGPathElement>(null);
  const silicone = useRef<SVGPathElement>(null);
  const foam = useRef<SVGPathElement>(null);
  const foamTexture = useRef<SVGPathElement>(null);
  useEffect(() => {
    const container = root.current,
      path = trail.current,
      base = guide.current,
      ball = drop.current,
      surface = svg.current;
    if (!container || !path || !base || !ball || !surface) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let samples: PathSample[] = [];
    let siliconeY = 0,
      foamY = 0,
      siliconeStart = 0,
      foamStart = 0;
    let scenes: { el: HTMLElement; top: number; height: number }[] = [];
    let frame = 0,
      total = 0,
      top = 0,
      points: { x: number; y: number }[] = [];
    const clamp = (v: number, min = 0, max = 1) =>
      Math.max(min, Math.min(max, v));
    const paint = () => {
      frame = 0;
      if (!points.length || !total) return;
      const scroll = Math.max(0, window.scrollY - top);
      const formation = clamp(scroll / 180);
      scenes.forEach(({ el, top: sceneTop, height }) => {
        const progress = clamp(
          (window.scrollY + window.innerHeight - sceneTop) /
            (height + window.innerHeight),
        );
        el.style.setProperty(
          '--scene-progress',
          String(reduce.matches ? 0.5 : progress),
        );
        el.style.setProperty(
          '--scene-shift',
          `${reduce.matches ? 0 : (progress - 0.5) * 110}px`,
        );
        el.style.setProperty(
          '--scene-turn',
          `${reduce.matches ? 0 : (progress - 0.5) * 18}deg`,
        );
      });
      const first = points[0],
        last = points[points.length - 1];
      const target = clamp(
        first.y + Math.max(0, scroll - 180),
        first.y,
        last.y,
      );
      const distance = distanceAtY(samples, target);
      const point = path.getPointAtLength(distance);
      const land = clamp((target - last.y + 70) / 70);
      surface.style.opacity = '1';
      if (reduce.matches) {
        base.style.opacity = '.28';
        path.style.strokeDashoffset = '0';
        ball.style.opacity = '0';
        if (neck.current) neck.current.style.opacity = '0';
        return;
      }
      path.style.strokeDashoffset = String(total - distance);
      base.style.opacity = '1';
      const materialChange = clamp((target - siliconeY) / 100);
      ball.style.opacity = String((1 - land * 0.9) * (1 - materialChange));
      const drawSegment = (
        el: SVGPathElement | null,
        start: number,
        end: number,
      ) => {
        if (!el) return;
        const length = Math.max(0, Math.min(distance, end) - start);
        el.style.opacity = length > 0 ? '1' : '0';
        el.style.strokeDasharray = `${length} ${total}`;
        el.style.strokeDashoffset = String(-start);
      };
      drawSegment(silicone.current, siliconeStart, foamStart);
      drawSegment(foam.current, foamStart, total);
      drawSegment(foamTexture.current, foamStart, total);
      const sx = 0.6 + formation * 0.85 + land * 0.6;
      const sy =
        (0.6 + formation * 0.85) *
        (1 + Math.sin(formation * Math.PI) * 0.5) *
        (1 - land * 0.45);
      ball.setAttribute(
        'transform',
        `translate(${point.x},${point.y}) scale(${sx},${sy})`,
      );
      if (neck.current) {
        neck.current.setAttribute(
          'd',
          `M ${first.x} ${first.y - 18} Q ${first.x - 5} ${first.y + 5} ${first.x} ${first.y + 18}`,
        );
        neck.current.style.opacity = String(
          formation < 0.88 ? Math.sin(formation * Math.PI) : 0,
        );
      }
      container.style.setProperty('--drop-landed', String(land));
      container.classList.toggle('drop-detached', formation === 1);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const measure = () => {
      const box = container.getBoundingClientRect();
      top = box.top + window.scrollY;
      scenes = Array.from(
        container.querySelectorAll<HTMLElement>('[data-scene]'),
      ).map((el) => {
        const rect = el.getBoundingClientRect();
        return { el, top: rect.top + window.scrollY, height: rect.height };
      });
      points = Array.from(
        container.querySelectorAll<HTMLElement>('[data-route-point]'),
      ).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - box.left + r.width / 2,
          y: r.top - box.top + r.height / 2,
        };
      });
      if (points.length < 2) return;
      const d = points.reduce((s, p, i) => {
        if (!i) return `M ${p.x} ${p.y}`;
        const prev = points[i - 1],
          dy = (p.y - prev.y) * 0.52;
        return (
          s + ` C ${prev.x} ${prev.y + dy} ${p.x} ${p.y - dy} ${p.x} ${p.y}`
        );
      }, '');
      surface.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      path.setAttribute('d', d);
      base.setAttribute('d', d);
      total = path.getTotalLength();
      samples = Array.from({ length: 513 }, (_, i) => {
        const distance = (total * i) / 512;
        return { distance, y: path.getPointAtLength(distance).y };
      });
      siliconeY =
        (scenes.find((scene) => scene.el.classList.contains('artesanato-scene'))
          ?.top ?? top) -
        top +
        90;
      foamY =
        (scenes.find((scene) => scene.el.classList.contains('solutions-scene'))
          ?.top ?? top) -
        top +
        90;
      siliconeStart = distanceAtY(samples, siliconeY);
      foamStart = distanceAtY(samples, foamY);
      [silicone.current, foam.current, foamTexture.current].forEach((el) =>
        el?.setAttribute('d', d),
      );
      path.style.strokeDasharray = String(total);
      request();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(container);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', measure);
    reduce.addEventListener('change', request);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', measure);
      reduce.removeEventListener('change', request);
    };
  }, []);
  return (
    <div className="brand-journey" ref={root}>
      <svg
        ref={svg}
        className="adhesive-route"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="foam-surface" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035"
              numOctaves="1"
              result="texture"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="texture"
              scale="7"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <linearGradient id="cyano-liquid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="32%" stopColor="#ffffff" stopOpacity="0.38" />
            <stop offset="65%" stopColor="#ffffff" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="cyano-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.38" />
          </linearGradient>
        </defs>
        <path ref={guide} className="route-guide" />
        <path ref={trail} className="route-trail" />
        <path ref={silicone} className="silicone-cord" />
        <path ref={foam} className="foam-cord" />
        <path ref={foamTexture} className="foam-core" />
        <path ref={neck} className="drop-neck" />
        <g ref={drop}>
          <path
            className="adhesive-drop"
            d="M0 -20 C-3 -10 -16 1 -16 11 A16 16 0 0 0 16 11 C16 1 3 -10 0 -20Z"
          />
          <path d="M-5 -3 Q-12 7 -10 13" className="drop-shine" />
          <path d="M-5 23 Q4 27 10 20" className="drop-rim" />
        </g>
      </svg>
      <section className="journey-hero" id="inicio" data-scene>
        <div className="hero-halo" aria-hidden="true" />
        <span className="hero-side-note">UN MUNDO DE POSIBILIDADES ↓</span>
        <div className="journey-hero-copy">
          <p className="story-eyebrow">ADHESIVOS QUE CONECTAN TU MUNDO</p>
          <h1>
            <span>Pequeña gota.</span>
            <em>Gran conexión.</em>
          </h1>
          <p>
            Para lo que creás. Para lo que reparás.
            <br />
            Para todo lo que está por venir.
          </p>
          <div className="journey-hero-actions">
            <a className="story-button" href="#empresa">
              Seguí la gota <ArrowDown size={18} />
            </a>
            <a className="journey-catalog-shortcut" href="#catalogo">
              Ir al catálogo <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="nozzle-scene">
          <span className="nozzle-caption">
            PEQUEÑOS DETALLES.
            <br />
            GRANDES SOLUCIONES.
          </span>
          <div className="nozzle-crop">
            <Image
              unoptimized
              src="/nozzle-study.png"
              alt="Detalle ilustrativo de un pico aplicador abierto"
              width={1024}
              height={1536}
              priority
            />
            <span className="nozzle-origin" data-route-point />
          </div>
          <span className="drop-caption">
            Hacé scroll.
            <br />
            Lo que sigue nos une.
          </span>
        </div>
        <div className="journey-hero-foot">
          <span>IMPORTACIÓN Y VENTA MAYORISTA</span>
          <span>ADHESIVOS + SELLADORES + SOLUCIONES</span>
        </div>
      </section>
      <div className="journey-ribbon" aria-hidden="true">
        <div>
          {[0, 1].map((i) => (
            <span key={i}>
              CREÁ <b>✳</b> REPARÁ <b>✳</b> TRANSFORMÁ <b>✳</b> <PegaloName />{' '}
              <b>✳</b>{' '}
            </span>
          ))}
        </div>
      </div>
      <section className="journey-intro" id="empresa" data-scene>
        <span className="intro-graphic" aria-hidden="true">
          +
        </span>
        <span className="intro-route-point" data-route-point />
        <p className="story-eyebrow" data-reveal>
          UNA MARCA QUE TE ACOMPAÑA
        </p>
        <h2 data-reveal>
          Unimos materiales.
          <br />
          <span>Conectamos posibilidades.</span>
        </h2>
        <div className="intro-bottom" data-reveal>
          <span className="intro-year">
            Desde
            <br />
            <strong>1998.</strong>
          </span>
          <p>
            Somos una empresa argentina dedicada a la importación y
            comercialización mayorista de adhesivos y selladores.
            <br />
            <br />
            Acercamos soluciones a comercios, profesionales y personas que
            crean, reparan y transforman.
          </p>
        </div>
      </section>
      <section
        className="journey-product ciano-scene"
        id="productos"
        data-scene
      >
        <div className="chapter-label">
          <span>EL PODER DE LO PEQUEÑO</span>
          <span>01 — 03</span>
        </div>
        <span className="scene-point" data-route-point />
        <div className="scene-art" data-reveal>
          <span className="scene-orbit" />
          <span className="scene-index">01</span>
          <Image
            unoptimized
            width={500}
            height={500}
            src="/productos/ciano-100.png"
            alt="Cianoacrilato Pegalo de 100 gramos"
            className="scene-bottle companion"
          />
          <Image
            unoptimized
            width={500}
            height={500}
            src="/productos/ciano-20.png"
            alt="Cianoacrilato Pegalo de 20 gramos"
            className="scene-bottle main-bottle"
          />
          <span className="photo-caption">10 g / 20 g / 100 g</span>
        </div>
        <div className="scene-copy" data-reveal>
          <p className="story-eyebrow">
            01 / CIANOACRILATOS <PegaloName />
          </p>
          <h2>
            Una gota.
            <br />
            <em>Y listo.</em>
          </h2>
          <p>
            Precisión para los pequeños detalles. Adhesivos instantáneos para
            unir materiales y dar forma a tus ideas.
          </p>
          <div className="material-tags">
            <span>Madera</span>
            <span>Cuero</span>
            <span>Metal</span>
            <span>Cerámica</span>
          </div>
          <button
            className="story-button"
            onClick={() => onProduct('ciano-20')}
          >
            Conocé los cianoacrilatos <ArrowUpRight size={19} />
          </button>
        </div>
      </section>
      <section className="journey-product artesanato-scene" data-scene>
        <div className="chapter-label">
          <span>EL DETALLE HACE LA DIFERENCIA</span>
          <span>02 — 03</span>
        </div>
        <span className="scene-point" data-route-point />
        <div className="scene-copy" data-reveal>
          <p className="artesanato-logo">
            ARTESANATO<span>®</span>
          </p>
          <p className="story-eyebrow">02 / SILICONAS</p>
          <h2>
            Sellá el detalle.
            <br />
            <em>Disfrutá el resultado.</em>
          </h2>
          <p>
            Soluciones que acompañan tus arreglos y proyectos. Para que cada
            unión tenga su lugar.
          </p>
          <div className="material-tags">
            <span>Sellado</span>
            <span>Reparaciones</span>
            <span>Instalaciones</span>
          </div>
          <button
            className="story-button"
            onClick={() => onProduct('artesanato')}
          >
            Explorá las siliconas <ArrowUpRight size={19} />
          </button>
        </div>
        <div className="scene-art" data-reveal>
          <span className="scene-orbit" />
          <span className="scene-index">02</span>
          <Image
            unoptimized
            width={500}
            height={500}
            src="/productos/artesanato.png"
            alt="Silicona acética Artesanato"
            className="scene-bottle main-bottle"
          />
          <span className="photo-caption">SILICONA ACÉTICA / 280 ml</span>
        </div>
      </section>
      <section className="journey-product solutions-scene" data-scene>
        <div className="chapter-label">
          <span>SEGUÍ DÁNDOLE FORMA A TUS IDEAS</span>
          <span>03 — 03</span>
        </div>
        <span className="scene-point" data-route-point />
        <div className="scene-art" data-reveal>
          <span className="scene-orbit" />
          <span className="scene-index">03</span>
          <Image
            unoptimized
            width={500}
            height={500}
            src="/productos/espuma.png"
            alt="Espuma de poliuretano Artesanato"
            className="scene-bottle main-bottle"
          />
          <Image
            unoptimized
            width={500}
            height={500}
            src="/productos/hotmelt.png"
            alt="Pistola Hot Melt Artesanato"
            className="scene-bottle companion"
          />
        </div>
        <div className="scene-copy" data-reveal>
          <p className="story-eyebrow">03 / MÁS FORMAS DE UNIR</p>
          <h2>
            Para cada idea,
            <br />
            <em>una solución.</em>
          </h2>
          <p>
            Selladores, poliuretanos, hot melt, pistolas y mucho más. Un
            catálogo para acompañarte de principio a fin.
          </p>
          <div className="solution-links">
            <button onClick={() => onProduct('acrilico')}>
              Selladores <ArrowUpRight size={18} />
            </button>
            <button onClick={() => onProduct('espuma')}>
              Poliuretanos <ArrowUpRight size={18} />
            </button>
            <button onClick={() => onProduct('barras')}>
              Hot melt y aplicadores <ArrowUpRight size={18} />
            </button>
          </div>
          <button className="story-button" onClick={() => onBrowse('Todos')}>
            Ver todas las soluciones <ArrowRight size={19} />
          </button>
        </div>
      </section>
      <section className="journey-finale" id="contacto" data-scene>
        <span className="final-graphic" aria-hidden="true">
          ↗
        </span>
        <p className="story-eyebrow" data-reveal>
          EL RECORRIDO SIGUE CON VOS
        </p>
        <h2 data-reveal>
          ¿Qué vamos
          <br />a <em>unir hoy?</em>
        </h2>
        <p data-reveal>
          Contanos qué necesitás.
          <br />
          Nuestro equipo te ayuda a encontrar tu solución.
        </p>
        <div className="drop-destination">
          <span data-route-point />
          <button className="story-button" onClick={onContact}>
            Hablemos de tu proyecto <ArrowUpRight size={20} />
          </button>
        </div>
        <a href="#catalogo" className="final-catalog-link">
          O recorré el catálogo completo <ArrowDown size={16} />
        </a>
        <span className="final-foot">ATENCIÓN MAYORISTA EN TODO EL PAÍS.</span>
      </section>
    </div>
  );
}
