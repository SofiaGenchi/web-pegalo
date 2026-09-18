import './frequently-asked.css';

export default function FrequentlyAsked() {
  return (
    <section
      className="faq-section"
      id="preguntas-frecuentes"
      aria-labelledby="faq-title"
    >
      <p className="section-kicker">ANTES DE ELEGIR</p>
      <h2 id="faq-title">Preguntas frecuentes.</h2>

      <div className="faq-list" id="preguntas-frecuentes-lista">
        <details>
          <summary>¿Qué diferencia hay entre silicona neutra y acética?</summary>
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
              <a href="/fichas/ficha-silicona-neutra-pegalo.pdf">
                Ficha de silicona neutra (PDF)
              </a>{' '}
              ·{' '}
              <a href="/fichas/ficha-silicona-acetica-pegalo.pdf">
                Ficha de silicona acética (PDF)
              </a>
            </p>
          </div>
        </details>

        <details>
          <summary>¿Qué sellador usar para canaletas y zinguería?</summary>
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
              <a href="/fichas/ficha-sellador-zingueria-artesanato.pdf">
                Ver ficha del sellador de zinguería (PDF)
              </a>
            </p>
          </div>
        </details>

        <details>
          <summary>¿Con qué pegar una bacha a la mesada?</summary>
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
              <a href="/fichas/ficha-crema-epoxy-pegalo.pdf">
                Ver ficha del adhesivo epoxi (PDF)
              </a>
            </p>
          </div>
        </details>

        <details>
          <summary>¿Cómo comprar productos Pegalo por mayor?</summary>
          <div className="faq-answer">
            <p>
              Elegí los productos y sus presentaciones en el{' '}
              <a href="#catalogo">catálogo</a> y armá tu consulta. Indicanos las
              cantidades y tu localidad; el equipo comercial te confirmará
              precios, disponibilidad, condiciones de compra y opciones de entrega.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}
