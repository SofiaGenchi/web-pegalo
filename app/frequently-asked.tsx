import './frequently-asked.css';
import Link from 'next/link';

export default function FrequentlyAsked() {
  return (
    <section
      className="faq-section"
      id="preguntas-frecuentes"
      aria-labelledby="faq-title"
    >
      <p className="section-kicker">TE AYUDAMOS A ELEGIR</p>
      <h2 id="faq-title">Preguntas frecuentes.</h2>

      <div className="faq-list" id="preguntas-frecuentes-lista">
        <details>
          <summary>¿Silicona neutra o acética, cuál elegir?</summary>
          <div className="faq-answer">
            <p>
              Se diferencian por su sistema de curado. La silicona neutra Pegalo se
              describe en su ficha como no corrosiva y de curado sin olor;
              incluye aplicaciones en puertas, ventanas, vidrio y acero inoxidable.
              La acética incluye usos sobre vidrio, aluminio y superficies
              esmaltadas, entre otros materiales.
            </p>
            <p>
              Elegí según el material y el tipo de junta, verificando la
              compatibilidad antes de aplicar. Estas indicaciones corresponden a
              las siliconas Pegalo de las fichas enlazadas.
            </p>
            <p>
              <Link href="/fichas/ficha-silicona-neutra-pegalo.pdf">
                Ficha de silicona neutra (PDF)
              </Link>{' '}
              ·{' '}
              <Link href="/fichas/ficha-silicona-acetica-pegalo.pdf">
                Ficha de silicona acética (PDF)
              </Link>
            </p>
          </div>
        </details>

        <details>
          <summary>¿Con qué sellar chapas, canaletas y zinguería?</summary>
          <div className="faq-answer">
            <p>
              El sellador de zinguería Artesanato está formulado para pegar y
              sellar chapas, canaletas y otras uniones de zinguería. Es un
              sellador de silicona modificada que cura con la humedad del aire.
            </p>
            <p>
              Aplicalo sobre superficies limpias, secas y libres de grasa y
              adhesivo viejo, siguiendo su ficha técnica. Aunque admite usos
              exteriores, no se recomienda para inmersión continua en agua.
            </p>
            <p>
              <Link href="/fichas/ficha-sellador-zingueria-artesanato.pdf">
                Ver ficha del sellador de zinguería (PDF)
              </Link>
            </p>
          </div>
        </details>

        <details>
          <summary>¿Cuál es el adhesivo para instalar una bacha?</summary>
          <div className="faq-answer">
            <p>
              La crema epoxi para bachas Pegalo está indicada para unir bachas a
              mesadas. Es un adhesivo de dos componentes: antes de usarlo,
              comprobá la compatibilidad con los materiales de ambas piezas y
              seguí las instrucciones de mezcla y curado.
            </p>
            <p>
              No reemplaza los soportes o fijaciones que requiera la
              instalación: la ficha excluye el uso como adhesivo estructural y el
              contacto directo con alimentos.
            </p>
            <p>
              <Link href="/fichas/ficha-crema-epoxy-pegalo.pdf">
                Ver ficha del adhesivo epoxi (PDF)
              </Link>
            </p>
          </div>
        </details>

        <details>
          <summary>¿Cómo comprar PEGALO por mayor?</summary>
          <div className="faq-answer">
            <p>
              Elegí los productos y sus presentaciones en el{' '}
              <Link href="#catalogo">catálogo</Link> y armá tu consulta. Indicanos las
              cantidades y tu localidad; el equipo comercial te confirmará
              precios, disponibilidad, condiciones de compra y opciones de entrega.
            </p>
          </div>
        </details>

        <details>
          <summary>¿Qué diferencia hay entre un sellador acrílico y uno de silicona?</summary>
          <div className="faq-answer">
            <p>
              El sellador acrílico permite ser pintado fácilmente, por lo que es
              la mejor opción para tapar grietas en paredes y techos interiores
              antes de pintar. La silicona, en cambio, repele la pintura pero es
              100% impermeable, lo que la hace indispensable para evitar
              filtraciones en baños, cocinas y exteriores.
            </p>
          </div>
        </details>

        <details>
          <summary>¿Para qué sirve y cuándo se debe usar un sellador de poliuretano?</summary>
          <div className="faq-answer">
            <p>
              Se utiliza para pegar y sellar materiales que van a soportar peso,
              vibraciones o tránsito, como juntas en pisos, chapas de techo,
              placas de cemento o carrocerías. Es extremadamente resistente,
              elástico y, a diferencia de la silicona, sí permite que lo pinten
              encima.
            </p>
          </div>
        </details>

        <details>
          <summary>¿Cuánto tiempo tarda en secar la silicona y el poliuretano?</summary>
          <div className="faq-answer">
            <p>
              Al tacto parecen secar muy rápido, ya que forman una capa
              superficial en unos 10 a 20 minutos. Sin embargo, para que se
              sequen (o curen) por completo en su interior, es necesario esperar
              entre 24 y 48 horas, tiempo en el cual no deben mojarse ni
              someterse a fuerza.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}
