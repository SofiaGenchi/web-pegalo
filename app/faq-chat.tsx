'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MessageCircle, X } from 'lucide-react';
import './faq-chat.css';

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
];
type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  href?: string;
  link?: string;
};
const greeting: Message = {
  id: 0,
  role: 'assistant',
  text: '¡Hola! 👋 Soy Pegui, el asistente de PEGALO. Elegí una opción y te ayudo.',
};

export default function FaqChat({ hidden }: { hidden: boolean }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [invitation, setInvitation] = useState(false);
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const launcher = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const conversation = useRef<HTMLDivElement>(null);

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
    if (open && !hidden) closeButton.current?.focus({ preventScroll: true });
  }, [open, hidden]);
  useEffect(() => {
    if (open && conversation.current)
      conversation.current.scrollTop = conversation.current.scrollHeight;
  }, [messages, open]);

  function dismissInvitation() {
    setInvitation(false);
  }
  function close() {
    setOpen(false);
    launcher.current?.focus({ preventScroll: true });
  }
  function ask(topic: (typeof topics)[number]) {
    setMessages((previous) => [
      ...previous,
      { id: previous.length, role: 'user', text: topic.label },
      {
        id: previous.length + 1,
        role: 'assistant',
        text: topic.answer,
        href: topic.href,
        link: topic.link,
      },
    ]);
  }
  const lastQuestion = [...messages]
    .reverse()
    .find((message) => message.role === 'user')?.text;
  const whatsapp = `https://wa.me/541164174036?text=${encodeURIComponent(`Hola, vengo de la web de Pégalo. ${lastQuestion || 'Quisiera hacer una consulta.'}`)}`;

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
          <header className="faq-chat-header">
            <span className="faq-chat-avatar">
              <Image src="/mascota-chat-3d.png" alt="" width={44} height={44} />
            </span>
            <div>
              <h2 id="faq-chat-title">PEGUI</h2>
              <p>El asistente de PEGALO.</p>
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
          <div
            ref={conversation}
            className="faq-chat-messages"
            role="log"
            aria-label="Conversación"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`faq-chat-message faq-chat-message-${message.role}`}
              >
                <span className="sr-only">
                  {message.role === 'user' ? 'Vos: ' : 'Asistente: '}
                </span>
                <p>{message.text}</p>
                {message.href && (
                  <a href={message.href} onClick={close}>
                    {message.link}
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="faq-chat-topics" aria-label="Preguntas sugeridas">
            {topics.map((topic) => (
              <button
                key={topic.label}
                type="button"
                onClick={() => ask(topic)}
              >
                {topic.label}
              </button>
            ))}
          </div>
          <div className="faq-chat-footer">
            <p className="faq-chat-other">¿Tu consulta es sobre otro tema?</p>
            <a
              className="faq-chat-whatsapp"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} />
              Hablar por WhatsApp
            </a>
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
