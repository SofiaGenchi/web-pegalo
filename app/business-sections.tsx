'use client';
import ArgentinaMap from './argentina-map';
import { ArrowUpRight, MapPin } from 'lucide-react';
export default function BusinessSections() {
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
        <ArgentinaMap />
      </section>
      <section className="business-contact" id="contacto">
        <div className="contact-heading">
          <p className="section-kicker">CONTACTO / HABLEMOS</p>
          <h2>
            Estamos para
            <br />
            <em>ayudarte.</em>
          </h2>
          <p>
            Para cualquier consulta comuníquese con nosotros por los siguientes
            medios:
          </p>
          <a
            className="contact-main-action"
            href="https://wa.me/541164174036"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              Empezá una conversación<small>Escribinos por WhatsApp</small>
            </span>
            <ArrowUpRight size={32} />
          </a>
        </div>
        <div className="contact-channels">
          <a
            className="contact-channel"
            href="https://wa.me/541164174036"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <small>01 / CELULAR Y WHATSAPP</small>+54 9 11 6417-4036
            </span>
            <ArrowUpRight />
          </a>
          <a className="contact-channel" href="tel:08001220975">
            <span>
              <small>02 / TELÉFONO</small>0800-122-0975
            </span>
            <ArrowUpRight />
          </a>
          <a className="contact-channel" href="mailto:ventas@pegalo.com.ar">
            <span>
              <small>03 / CORREO ELECTRÓNICO</small>ventas@pegalo.com.ar
            </span>
            <ArrowUpRight />
          </a>
          <div className="contact-network">
            <p>
              SEGUÍ CONECTADO <span>@adhesivospegalo</span>
            </p>
            <div>
              <a
                href="https://www.instagram.com/adhesivospegalo/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram <ArrowUpRight size={16} />
              </a>
              <a
                href="https://www.facebook.com/adhesivospegalo/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook <ArrowUpRight size={16} />
              </a>
              <a
                href="https://www.tiktok.com/@adhesivospegalo"
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
