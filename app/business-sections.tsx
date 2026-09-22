'use client';
import type { Distributor } from './content-policy';
import ArgentinaMap from './argentina-map';
import FrequentlyAsked from './frequently-asked';
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
            Distribución en
            <br />
            todo Argentina.
          </h2>
          <div className="coverage-distribution">
            <span className="coverage-label">DISTRIBUCIÓN NACIONAL</span>
            <p>Trabajamos con distribuidores y comercios de todo el país. Consultá por el distribuidor de tu zona.</p>
          </div>
          <address className="coverage-details">
            <div className="coverage-location">
              <span className="coverage-label">DÓNDE ENCONTRARNOS</span>
              <p>
                <a
                  className="contact-value"
                  href="https://www.google.com/maps/search/?api=1&query=Asamblea%204355%2C%20Santos%20Lugares%2C%20Buenos%20Aires"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Asamblea 4355, Santos Lugares
                  <br />
                  CP 1676, Buenos Aires
                </a>
              </p>
            </div>
            <div className="coverage-phones">
              <span className="coverage-label">WHATSAPP</span>
              <a
                className="contact-value"
                href="https://wa.me/541164174036"
                target="_blank"
                rel="noopener noreferrer"
              >
                +54 9 11 6417-4036
              </a>
            </div>
            <div className="coverage-phones">
              <span className="coverage-label">TELÉFONO</span>
              <a className="contact-value" href="tel:08001220975">
                0800-122-0975
              </a>
            </div>
            <div className="coverage-email">
              <span className="coverage-label">CORREO ELECTRÓNICO</span>
              <a className="contact-value" href="mailto:ventas@pegalo.com.ar">
                ventas@pegalo.com.ar
              </a>
            </div>
          </address>
        </div>
        <ArgentinaMap distributors={distributors} />
      </section>
      <FrequentlyAsked />
      <section className="business-contact" id="contacto">
        <div className="contact-heading">
          <p className="section-kicker">CONTACTO</p>
          <h2>
            Hablemos de
            <br />
            <em>tu negocio.</em>
          </h2>
          <p>
            Consultanos por productos, precios, disponibilidad y condiciones de
            compra mayorista.
          </p>
        </div>
        <div className="contact-channels">
          <div className="contact-channel">
            <small>WHATSAPP</small>
            <a
              className="contact-value"
              href="https://wa.me/541164174036"
              target="_blank"
              rel="noopener noreferrer"
            >
              +54 9 11 6417-4036
            </a>
          </div>
          <div className="contact-channel">
            <small>TELÉFONO</small>
            <a className="contact-value" href="tel:08001220975">
              0800-122-0975
            </a>
          </div>
          <div className="contact-channel">
            <small>CORREO ELECTRÓNICO</small>
            <a className="contact-value" href="mailto:ventas@pegalo.com.ar">
              ventas@pegalo.com.ar
            </a>
          </div>
          <div className="contact-network">
            <p>
              SEGUÍ CONECTADO <span>@adhesivospegalo</span>
            </p>
            <div>
              <a
                className="contact-value"
                href="https://www.instagram.com/adhesivospegalo/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                className="contact-value"
                href="https://www.facebook.com/adhesivospegalo/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                className="contact-value"
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
