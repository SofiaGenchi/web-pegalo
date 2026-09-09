'use client';
import type { Distributor } from './content-policy';
import ArgentinaMap from './argentina-map';
export default function BusinessSections({
  distributors,
}: {
  distributors: Distributor[];
}) {
  return (
    <>
      <section className="coverage-section" id="donde-atendemos">
        <div className="coverage-copy">
          <p className="section-kicker">DÓNDE ESTAMOS</p>
          <h2>
            Atendemos en
            <br />
            todo el país.
          </h2>
          <div className="coverage-distribution">
            <span className="coverage-label">DISTRIBUCIÓN NACIONAL</span>
            <p>Consultar el distribuidor de su zona.</p>
            <a
              href="https://wa.me/541164174036?text=Hola%2C%20quisiera%20consultar%20el%20distribuidor%20de%20mi%20zona."
              target="_blank"
              rel="noopener noreferrer"
            >
              Encontrá tu distribuidor
            </a>
          </div>
          <address className="coverage-details">
            <div className="coverage-location">
              <span className="coverage-label">NUESTRA SEDE</span>
              <p>
                Asamblea 4355, Santos Lugares
                <br />
                CP 1676, Buenos Aires
              </p>
            </div>
            <div className="coverage-phones">
              <span className="coverage-label">TELÉFONOS</span>
              <a
                href="https://wa.me/541164174036"
                target="_blank"
                rel="noopener noreferrer"
              >
                +54 9 11 6417-4036 <small>WhatsApp</small>
              </a>
              <a href="tel:08001220975">0800-122-0975</a>
            </div>
            <div className="coverage-email">
              <span className="coverage-label">CORREO ELECTRÓNICO</span>
              <a href="mailto:ventas@pegalo.com.ar">ventas@pegalo.com.ar</a>
            </div>
          </address>
        </div>
        <ArgentinaMap distributors={distributors} />
      </section>
      <section className="business-contact" id="contacto">
        <div className="contact-heading">
          <p className="section-kicker">CONTACTO</p>
          <h2>
            Estamos para
            <br />
            <em>ayudarte.</em>
          </h2>
          <p>
            Para cualquier consulta comuníquese con nosotros por los siguientes
            medios:
          </p>
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
          </a>
          <a className="contact-channel" href="tel:08001220975">
            <span>
              <small>02 / TELÉFONO</small>0800-122-0975
            </span>
          </a>
          <a className="contact-channel" href="mailto:ventas@pegalo.com.ar">
            <span>
              <small>03 / CORREO ELECTRÓNICO</small>ventas@pegalo.com.ar
            </span>
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
          </div>
        </div>
      </section>
    </>
  );
}
