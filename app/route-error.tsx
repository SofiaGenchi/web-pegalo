import Link from 'next/link';
import './route-states.css';

export default function RouteError({
  missing = false,
  reset,
}: {
  missing?: boolean;
  reset?: () => void;
}) {
  return (
    <main className="route-state">
      <div className="route-state-brand" aria-label="Pegalo">
        PEGALO
      </div>
      {missing && <p className="route-state-code">ERROR 404</p>}
      <h1>
        {missing
          ? 'No encontramos esta página.'
          : 'No pudimos abrir esta página.'}
      </h1>
      <p className="route-state-copy">
        {missing
          ? 'El enlace puede haber cambiado o ya no estar disponible. Volvé al inicio para explorar nuestros productos.'
          : 'Ocurrió un problema al cargar el contenido. Podés volver a intentarlo o ir al inicio.'}
      </p>
      <div className="route-state-actions">
        <Link href="/">Volver al inicio</Link>
        {reset && (
          <button type="button" onClick={reset}>
            Volver a intentar
          </button>
        )}
      </div>
    </main>
  );
}
