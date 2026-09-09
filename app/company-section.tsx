import PegaloName from './pegalo-name';
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
      {journey && <span className="company-route-point" data-route-point />}
      <p className="section-kicker">EMPRESA</p>
      <h2>
        <PegaloName />, una empresa
        <br />
        en constante crecimiento.
      </h2>
      <p className="company-lead">
        Creada en 1998 siempre dedicados a fabricar importar y distribuir una
        amplia gama de adhesivos y selladores.
      </p>
      <p className="company-markets">
        Somos fabricantes e importadores de una alta gama de productos
        orientados a mercados como el Automotor, Construcción, Hogar, Artesanía,
        Zapatero o Carpintería.
      </p>
      <div className="company-story">
        <div>
          <p>
            A lo largo de más de 18 años, <PegaloName /> ha mostrado claros
            signos de liderazgo. Desarrollando ideas al servicio de las empresas
            del sector, aportando soluciones concretas a los obstáculos que se
            interponen en el camino.
          </p>
          <p>
            Nuestros laboratorios y un extenso conocimiento del mercado hacen de{' '}
            <PegaloName /> un natural aliado en los diferentes procesos de
            fabricación, montaje e implementación.
          </p>
        </div>
        <div>
          <p>
            Cuidando el Medio Ambiente y comprometiéndonos con las generaciones
            futuras. Superándonos día a día. Certificaciones Internacionales de
            Calidad, Normas ISO y reconocimiento de estándares en los procesos
            de producción son algunos de los logros alcanzados a lo largo de
            estos años.
          </p>
          <p>
            Una variada línea de productos es el reflejo del desarrollo
            planteado como objetivo. Distintas familias de productos orientados
            a mercados como el Automotor, Autopartista, Construcción, Hogar,
            Artesanía, Zapatero ó Carpintería son algunos ejemplos, con
            presentaciones que van desde latas industriales hasta los cómodos
            blisters utilizados en los comercios de ventas masivas.
          </p>
        </div>
      </div>
      <div className="company-gallery-placeholder">
        <span>CONOCÉ NUESTROS ESPACIOS</span>
        <h3>Depósito · Oficinas · Equipo</h3>
        <p>Próximamente, un recorrido en imágenes por nuestra empresa.</p>
      </div>
    </section>
  );
}
