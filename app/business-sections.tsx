'use client';
import { useState } from 'react';
import { ArrowUpRight, MapPin, Phone, Mail } from 'lucide-react';
const address = 'Asamblea 4355, Santos Lugares, Buenos Aires, Argentina';
export default function BusinessSections() {
  const [local, setLocal] = useState(false);
  return (
    <>
      <section className="coverage-section" id="donde-atendemos">
        <div className="coverage-copy">
          <p className="section-kicker">DÓNDE ATENDEMOS</p>
          <h2>
            Atendemos en
            <br />
            todo el país.
          </h2>
          <p>Consultar el distribuidor de su zona.</p>
          <a
            className="business-button"
            href="https://wa.me/541164174036?text=Hola%2C%20quisiera%20consultar%20el%20distribuidor%20de%20mi%20zona."
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar distribuidor <ArrowUpRight size={18} />
          </a>
          <address>
            <p>
              <MapPin size={19} />
              <span>
                Asamblea 4355, Santos Lugares
                <br />
                CP 1676, Buenos Aires
              </span>
            </p>
            <a
              href="https://wa.me/541164174036"
              target="_blank"
              rel="noopener noreferrer"
            >
              +54 9 11 6417-4036 · WhatsApp
            </a>
            <a href="tel:08001220975">0800-122-0975</a>
            <a href="mailto:ventas@pegalo.com.ar">ventas@pegalo.com.ar</a>
          </address>
        </div>
        <div className="coverage-map">
          <div className="map-controls" aria-label="Vista del mapa">
            <button aria-pressed={!local} onClick={() => setLocal(false)}>
              Argentina
            </button>
            <button aria-pressed={local} onClick={() => setLocal(true)}>
              Nuestra dirección
            </button>
          </div>
          <iframe
            title={
              local
                ? 'Ubicación de PEGALO en Santos Lugares'
                : 'Mapa de Argentina y ubicación de PEGALO'
            }
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=${local ? 16 : 3}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <p>Ubicación indicada: Santos Lugares, Buenos Aires.</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir mapa y cómo llegar <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <section className="business-contact" id="contacto">
        <p className="section-kicker">CONTACTO</p>
        <h2>Estamos para ayudarte.</h2>
        <p>
          Para cualquier consulta comuníquese con nosotros por los siguientes
          medios:
        </p>
        <div className="contact-options">
          <article>
            <Phone size={26} />
            <h3>Llamanos o escribinos</h3>
            <a
              href="https://wa.me/541164174036"
              target="_blank"
              rel="noopener noreferrer"
            >
              +54 9 11 6417-4036 · WhatsApp
            </a>
            <a href="tel:08001220975">0800-122-0975</a>
          </article>
          <article>
            <Mail size={26} />
            <h3>Correo electrónico</h3>
            <a href="mailto:ventas@pegalo.com.ar">ventas@pegalo.com.ar</a>
          </article>
          <article>
            <ArrowUpRight size={26} />
            <h3>Nuestras redes</h3>
            <p>@adhesivospegalo</p>
            <div className="contact-socials">
              <a
                href="https://www.instagram.com/adhesivospegalo/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/adhesivospegalo/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                href="https://www.tiktok.com/@adhesivospegalo"
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok
              </a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
