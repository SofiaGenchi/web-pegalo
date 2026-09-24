import type { ManagedProduct } from './content-policy';

const uppercaseUnits = (value: string) =>
  value.replace(
    /(\d\s*)(cc|lt|kg|gr|ml|mm|cm|g|l|w)\b/gi,
    (_, amount, unit) => amount + unit.toUpperCase(),
  );

// Derive display information from the fields employees already edit in the admin.
export function presentationGroups(
  product: Pick<ManagedProduct, 'size' | 'colors'>,
) {
  return product.size.split(';').map((entry) => {
    const text = entry.trim().replace(/\.$/, '');
    const match = text.match(/^(.*?)\s*\(([^)]+)\)\.?$/);
    // Parentheses with quantities describe a model, not a color.
    if (match && !/\d/.test(match[2])) {
      return {
        presentation: uppercaseUnits(match[1].trim()),
        color: match[2].replace(/^solo\s+/i, ''),
      };
    }
    return {
      presentation: uppercaseUnits(text),
      color: product.colors.replace(/\.$/, ''),
    };
  });
}

// Only combine colors inside their own presentation group. Unknown descriptions
// remain one option, so the interface never invents a sellable combination.
export function quoteOptions(
  product: Pick<ManagedProduct, 'id' | 'size' | 'colors'>,
) {
  return presentationGroups(product).flatMap(({ presentation, color }) => {
    let sizes = presentation.split(/;\s*/);
    if (/^\d/.test(presentation)) {
      sizes = presentation.split(/,\s+(?=\d)|\s+y\s+(?=\d)/);
    } else if (/^Barras finas y gruesas, /i.test(presentation)) {
      const weight = presentation.slice(presentation.indexOf(',') + 1).trim();
      sizes = [`Barras finas, ${weight}`, `Barras gruesas, ${weight}`];
    } else if (/^Pistola fina \(.+\) y gruesa \(.+\)$/i.test(presentation)) {
      sizes = presentation
        .split(' y ')
        .map((size) => (size.startsWith('Pistola') ? size : `Pistola ${size}`));
    }
    const colors =
      !color || /según/i.test(color) ? [''] : color.split(/,\s*|\s+y\s+/);
    return sizes.flatMap((size) =>
      colors.map((shade) => {
        const label = [size.trim(), shade.trim()].filter(Boolean).join(' · ');
        return { key: `${product.id}::${encodeURIComponent(label)}`, label };
      }),
    );
  });
}

export function quoteProductId(key: string) {
  return key.split('::')[0];
}

export function quotePresentation(
  product: Pick<ManagedProduct, 'id' | 'size' | 'colors'>,
  key: string,
) {
  const options = quoteOptions(product);
  return (
    options.find((option) => option.key === key)?.label ??
    (options.length === 1 ? options[0].label : 'Presentación a confirmar')
  );
}

export function presentationBadges(product: ManagedProduct) {
  const quantities = product.size.match(
    /\d+(?:[.,]\d+)?\s*(?:cc|lt|kg|gr|g|ml|mm|cm|l|w)\b/gi,
  );
  if (quantities?.length) {
    return [
      ...new Set(
        quantities.map((value) => value.replace(/\s+/g, '').toUpperCase()),
      ),
    ];
  }
  return presentationGroups(product).flatMap(({ presentation }) =>
    presentation
      .split(/,\s*|\s+y\s+/)
      .map((value) => value.trim())
      .filter(Boolean),
  );
}
