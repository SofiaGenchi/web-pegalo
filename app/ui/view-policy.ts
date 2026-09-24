export type ViewSignals = {
  reducedMotion?: boolean;
  online?: boolean;
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
};

export function shouldUseSimpleView(signals: ViewSignals): boolean {
  if (signals.reducedMotion || signals.saveData || signals.online === false)
    return true;
  if (['slow-2g', '2g', '3g'].includes(signals.effectiveType ?? ''))
    return true;
  // Estimates, not a speed test. Zero/missing bandwidth is not proof of a slow connection.
  if (
    Number.isFinite(signals.downlink) &&
    signals.downlink! > 0 &&
    signals.downlink! <= 1
  )
    return true;
  if (Number.isFinite(signals.rtt) && signals.rtt! >= 600) return true;
  return false;
}

// Keep the layout stable while reading, filtering, or entering a quote.
// A full page load takes a fresh decision; no persistent user override is used.
export function createViewDecision(readSignals: () => ViewSignals) {
  let decision: boolean | undefined;
  return () => (decision ??= shouldUseSimpleView(readSignals()));
}
