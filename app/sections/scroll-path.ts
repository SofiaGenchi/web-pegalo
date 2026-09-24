export type PathSample = { y: number; distance: number };
/** Interpolate arc distance in a path whose anchors progress down the page. */
export function distanceAtY(samples: readonly PathSample[], y: number): number {
  if (!samples.length) return 0;
  if (y <= samples[0].y) return samples[0].distance;
  const last = samples[samples.length - 1];
  if (y >= last.y) return last.distance;
  let low = 0,
    high = samples.length - 1;
  while (high - low > 1) {
    const middle = (low + high) >> 1;
    if (samples[middle].y < y) low = middle;
    else high = middle;
  }
  const a = samples[low],
    b = samples[high];
  const ratio = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
  return a.distance + (b.distance - a.distance) * ratio;
}
