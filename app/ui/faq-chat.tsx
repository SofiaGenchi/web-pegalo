'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MessageCircle, X } from 'lucide-react';
import '../styles/faq-chat.css';

const topics = [
  {
    label: 'Venta mayorista',
    answer:
      '¡Sí, vendemos por mayor! Elegí los productos y presentaciones del catálogo. Con las cantidades y tu localidad, nuestro equipo te confirma disponibilidad, condiciones de compra y entrega.',
    href: '#catalogo',
    link: 'Explorar el catálogo',
  },
  {
    label: 'Envíos y entregas',
    answer:
      'Atendemos consultas mayoristas de todo el país. Pasanos tu localidad y los productos que necesitás por WhatsApp para que el equipo confirme las opciones, costos y tiempos de entrega.',
  },
  {
    label: 'Catálogo de productos',
    answer:
      'Podés explorar los productos en el catálogo de la web. Para pedir la lista de precios, conocer promociones y confirmar disponibilidad, escribinos por WhatsApp.',
    href: '#catalogo',
    link: 'Ver catálogo de productos',
  },
  {
    label: '¿Hacen venta minorista?',
    answer:
      'No realizamos ventas minoristas, pero podemos ayudarte a encontrar dónde comprar nuestros productos. Contactanos y te indicaremos el distribuidor PEGALO más cercano a tu zona.',
  },
];

export default function FaqChat({ hidden }: { hidden: boolean }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [invitation, setInvitation] = useState(false);
  const [activeTopic, setActiveTopic] = useState<(typeof topics)[number] | null>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let elapsed = false;
    let scrolled = false;
    let shown = false;
    const initialScroll = window.scrollY;
    const invite = () => {
      if (!elapsed || !scrolled || shown) return;
      shown = true;
      setVisible(true);
      setInvitation(true);
      window.removeEventListener('scroll', onScroll);
    };
    const onScroll = () => {
      if (Math.abs(window.scrollY - initialScroll) >= 80) scrolled = true;
      invite();
    };
    const timer = window.setTimeout(() => {
      elapsed = true;
      invite();
    }, 5000);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!invitation || hidden || open) return;
    const timer = window.setTimeout(() => setInvitation(false), 5000);
    return () => window.clearTimeout(timer);
  }, [invitation, hidden, open]);

  useEffect(() => {
    if (open && !hidden) closeButton.current?.focus({ preventScroll: true });
  }, [open, hidden]);

  function dismissInvitation() {
    setInvitation(false);
  }
  function close() {
    setOpen(false);
    launcher.current?.focus({ preventScroll: true });
  }

  const lastQuestion = activeTopic?.label;
  const whatsapp = `https://wa.me/541164174036?text=${encodeURIComponent(`Hola, vengo de la web de Pégalo. ${lastQuestion ? `Consulta sobre: ${lastQuestion}.` : 'Quisiera hacer una consulta.'}`)}`;

  return (
    <aside
      className="faq-chat"
      hidden={hidden || !visible}
      aria-label="Ayuda de Pegui"
    >
      {invitation && !open && (
        <div className="faq-chat-invitation">
          <button
            type="button"
            className="faq-chat-invite-copy"
            onClick={() => {
              dismissInvitation();
              setOpen(true);
            }}
          >
            <span className="faq-chat-greeting">
              ¡Hola! Soy Pegui <span aria-hidden="true">👋</span>
            </span>
            <strong>¿En qué te puedo ayudar?</strong>
            <span className="faq-chat-invite-hint">
              Elegí tu consulta
            </span>
          </button>
          <button
            type="button"
            className="faq-chat-icon"
            aria-label="Cerrar saludo"
            onClick={dismissInvitation}
          >
            <X size={17} />
          </button>
        </div>
      )}
      {open && (
        <dialog
          open
          id="faq-chat-panel"
          className="faq-chat-panel"
          aria-modal="false"
          aria-labelledby="faq-chat-title"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              close();
            }
          }}
        >
          {/* Header */}
          <header className="faq-chat-header">
            <span className="faq-chat-avatar">
              <Image src="/mascota-chat-3d.png" alt="" width={44} height={44} />
            </span>
            <div>
              <h2 id="faq-chat-title">PEGUI</h2>
              <p>
                <span className="faq-chat-online-dot" aria-hidden="true" />
                Asistente de PEGALO.
              </p>
            </div>
            <button
              ref={closeButton}
              type="button"
              className="faq-chat-icon"
              aria-label="Cerrar chat"
              onClick={close}
            >
              <X size={21} />
            </button>
          </header>

          {/* Greeting */}
          <div className="faq-chat-greeting-block" aria-live="polite">
            <p className="faq-chat-hello-primary">¡Hola! Soy Pegui.</p>
            <p className="faq-chat-hello-secondary">Elegí una opción y te ayudo con tu consulta.</p>
          </div>

          {/* Topics */}
          <div className="faq-chat-topics-section">
            <p className="faq-chat-topics-title">¿Qué necesitás?</p>
            <div className="faq-chat-topics" aria-label="Preguntas sugeridas">
              {topics.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  aria-pressed={activeTopic?.label === topic.label}
                  onClick={() =>
                    setActiveTopic((prev) =>
                      prev?.label === topic.label ? null : topic,
                    )
                  }
                >
                  {topic.label}
                </button>
              ))}
            </div>
            {activeTopic && (
              <section className="faq-chat-answer-box" aria-label="Respuesta del asistente" aria-live="polite">
                <p>{activeTopic.answer}</p>
                {activeTopic.href && (
                  <a href={activeTopic.href} onClick={close}>
                    {activeTopic.link}
                  </a>
                )}
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="faq-chat-footer">
            <a
              className="faq-chat-whatsapp"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} />
              Hablar por WhatsApp
            </a>
            <p className="faq-chat-direct">Atención directa del equipo PEGALO.</p>
          </div>
        </dialog>
      )}
      <button
        ref={launcher}
        type="button"
        className={`faq-chat-launcher${open ? '' : ' faq-chat-launcher-mascot'}`}
        aria-label={open ? 'Cerrar ayuda' : 'Abrir chat con Pegui'}
        aria-expanded={open}
        aria-controls={open ? 'faq-chat-panel' : undefined}
        onClick={() => {
          dismissInvitation();
          if (open) close();
          else setOpen(true);
        }}
      >
        {open ? (
          <>
            <X size={23} />
            <span>Cerrar</span>
          </>
        ) : (
          <Image src="/mascota-chat-3d.png" alt="" width={116} height={116} />
        )}
      </button>
    </aside>
  );
}
