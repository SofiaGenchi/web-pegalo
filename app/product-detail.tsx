'use client';

import { useLayoutEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Plus } from 'lucide-react';
import PegaloName from './pegalo-name';
import type { ManagedProduct } from './content-policy';
import ProductOptionSelect from './product-option-select';
import { presentationGroups, quoteOptions } from './product-presentations';
import { useQuote } from './use-quote';

export default function ProductDetail({
  products,
  variants,
}: {
  products: ManagedProduct[];
  variants: ManagedProduct[];
}) {
  const pathname = usePathname();
  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  const [selectedId, setSelectedId] = useState(variants[0].id);
  const selected =
    variants.find((product) => product.id === selectedId) ?? variants[0];
  const options = quoteOptions(selected);
  const [option, setOption] = useState('');
  const key =
    options.find((item) => item.key === option)?.key ?? options[0]?.key ?? '';
  const { ids, setIds } = useQuote(products);
  const added = ids.includes(key);

  return (
    <div className="product-dialog product-page-detail">
      <div className="detail-image">
        <Image
          unoptimized
          priority
          width={600}
          height={600}
          src={selected.image || '/product-placeholder.svg'}
          alt={selected.name}
        />
      </div>
      <div className="detail-copy">
        <p className="eyebrow">
          LÍNEA{' '}
          {selected.line === 'Pegalo' ? (
            <PegaloName />
          ) : (
            selected.line.toUpperCase()
          )}
        </p>
        <h1 className="detail-title product-page-title">
          {variants.length > 1 ? 'Cianoacrilato Pegalo' : selected.name}
        </h1>
        <p className="detail-description product-page-description">
          {selected.use}
        </p>
        <p className="product-page-wholesale">
          Venta mayorista para ferreterías y distribuidores.
        </p>
        {variants.length > 1 && (
          <div className="variant-picker">
            <span>Elegí la presentación</span>
            <div>
              {variants.map((product) => (
                <button
                  key={product.id}
                  aria-pressed={selected.id === product.id}
                  onClick={() => {
                    setSelectedId(product.id);
                    setOption('');
                  }}
                >
                  {product.size}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="presentation-groups">
          {presentationGroups(selected).map((group, index) => (
            <dl className="presentation-group" key={index}>
              {group.color && (
                <>
                  <dt>Color:</dt>
                  <dd>{group.color}</dd>
                </>
              )}
              <dt>
                {selected.id === 'teflon'
                  ? 'Medida (pulgadas):'
                  : 'Presentación:'}
              </dt>
              <dd>{group.presentation}</dd>
            </dl>
          ))}
        </div>
        <div className="field variant-field">
          <span id="product-option-label">
            {selected.id === 'teflon'
              ? 'Medida (pulgadas)'
              : 'Presentación y color'}
          </span>
          <ProductOptionSelect
            value={key}
            options={options}
            onChange={setOption}
            label={
              selected.id === 'teflon'
                ? 'Medida (pulgadas)'
                : 'Presentación y color'
            }
          />
        </div>
        <output className="selection-feedback" aria-live="polite">
          {added
            ? 'Esta presentación ya está en tu consulta. Podés elegir otra o continuar con tu consulta.'
            : ''}
        </output>
        <button
          className="button"
          disabled={added || !key}
          onClick={() => setIds((current) => [...current, key])}
        >
          {added ? 'Agregado a tu consulta' : 'Agregar a consulta'}
          {added ? <Check size={18} /> : <Plus size={18} />}
        </button>
        {ids.length > 0 && (
          <Link href="/?consulta=1#catalogo" className="detail-quote-link">
            Continuar con mi consulta ({ids.length})
          </Link>
        )}
        {selected.technicalPdf && (
          <div className="technical-info">
            <a
              href={selected.technicalPdf}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Información técnica (PDF, se abre en una nueva pestaña)"
            >
              Información técnica
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
