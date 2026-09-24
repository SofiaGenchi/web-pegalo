import PegaloName from './pegalo-name';

export default function SiteFooter({ home = true }: { home?: boolean }) {
  return (
    <footer className="company-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a
            href={home ? '#inicio' : '/#inicio'}
            className="logo"
            aria-label="Pegalo, volver al inicio"
          >
            <span className="pegalo-wordmark" aria-hidden="true">
              PEGALO<sup className="pegalo-registered">®</sup>
            </span>
          </a>
          <p>
            Desde 1998 comercializamos adhesivos y selladores para comercios,
            distribuidores y profesionales de todo Argentina.
          </p>
        </div>
        <div className="footer-contact">
          <h2>Contactanos</h2>
          <address>
            <div>
              <span>WhatsApp</span>
              <a
                className="contact-value"
                href="https://wa.me/541164174036"
                target="_blank"
                rel="noopener noreferrer"
              >
                +54 9 11 6417-4036
              </a>
            </div>
            <div>
              <span>Teléfono</span>
              <a className="contact-value" href="tel:08001220975">
                0800-122-0975
              </a>
            </div>
            <div>
              <span>Correo electrónico</span>
              <a className="contact-value" href="mailto:ventas@pegalo.com.ar">
                ventas@pegalo.com.ar
              </a>
            </div>
            <div>
              <span>Encontranos</span>
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
            </div>
          </address>
        </div>
        <nav className="footer-social" aria-label="Redes sociales">
          <h2>Seguinos</h2>
          <p>@adhesivospegalo</p>
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
        </nav>
      </div>
      <div className="footer-bottom">
        <p>
          © 2026 <PegaloName />. Todos los derechos reservados.
        </p>
        <div>
          <a href={home ? '#inicio' : '#ficha'}>Volver arriba</a>
        </div>
      </div>
    </footer>
  );
}
