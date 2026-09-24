export default function CompanySection({
  journey = false,
}: {
  journey?: boolean;
}) {
  return (
    <section
      className="company-section"
      id="empresa"
      data-scene={journey || undefined}
    >
      <div id="empresa-anchor" className="empresa-anchor" aria-hidden="true" />
      {journey && <span className="company-route-point" data-route-point />}
      <p className="section-kicker">EMPRESA</p>
      <h2 id="empresa-title">
        Más de 25 años
        <br />
        <span>de experiencia.</span>
      </h2>
      <p className="company-lead">
        Desde 1998 desarrollamos, importamos y comercializamos adhesivos y
        selladores para distintos mercados e industrias.
      </p>
      <p className="company-markets">
        Somos fabricantes e importadores de una alta gama de productos orientados a
        mercados como el Automotor, Construcción, Hogar, Artesanía, Zapatero o
        Carpintería.
      </p>
      <div className="company-story">
        <p className="company-story-copy">
          A lo largo de más de 18 años, PEGALO ha mostrado claros signos de
          liderazgo. Desarrollando ideas al servicio de las empresas del sector,
          aportando soluciones concretas a los obstáculos que se interponen en el
          camino. Hoy somos un aliado estratégico en procesos de fabricación,
          montaje e implementación gracias a un profundo conocimiento técnico del
          mercado y una trayectoria constante de mejora. Cuidando el Medio
          Ambiente y comprometiéndonos con las generaciones futuras. Superándonos
          día a día. Nuestros laboratorios y nuestro conocimiento nos permiten
          sostener Certificaciones Internacionales de Calidad, Normas ISO y el
          reconocimiento de estándares en los procesos de producción.
        </p>
        <p className="company-story-copy">
          Una variada línea de productos refleja este desarrollo, con familias
          pensadas para distintos sectores e industrias, desde presentaciones
          industriales hasta formatos compactos para comercio. Son algunos
          ejemplos entre el Automotor, Autopartista, Construcción, Hogar,
          Artesanía, Zapatero ó Carpintería.
        </p>
      </div>
    </section>
  );
}
