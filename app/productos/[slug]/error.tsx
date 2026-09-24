'use client';

import RouteError from '../../route-error';

export default function ProductError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError product reset={reset} />;
}
