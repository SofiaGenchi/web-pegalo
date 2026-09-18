'use client';
import RouteError from './route-error';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es-AR">
      <body style={{ margin: 0 }}>
        <RouteError reset={reset} />
      </body>
    </html>
  );
}
