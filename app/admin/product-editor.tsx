'use client';

import Image from 'next/image';
import { FileText } from 'lucide-react';
import type { ManagedProduct } from '../content-policy';
import { productFamilies } from '../products';

type ProductEditorProps = {
  product: ManagedProduct;
  storageAvailable: boolean;
  onEdit: (patch: Partial<ManagedProduct>) => void;
  onUpload: (file: File | undefined, field: 'image' | 'technicalPdf') => void;
};

export default function ProductEditor({
  product,
  storageAvailable,
  onEdit,
  onUpload,
}: ProductEditorProps) {
  return (
    <>
      <div className="admin-detail-title">
        <h2>{product.name}</h2>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={product.active}
            onChange={(e) => onEdit({ active: e.target.checked })}
          />
          Visible en la web
        </label>
      </div>
      <label>
        Nombre
        <input
          value={product.name}
          maxLength={150}
          onChange={(e) => onEdit({ name: e.target.value })}
        />
      </label>
      <div className="admin-fields">
        <label>
          Marca principal
          <select
            value={product.line}
            onChange={(e) =>
              onEdit({
                line: e.target.value,
                lines: [...new Set([...product.lines, e.target.value])],
              })
            }
          >
            {['Pegalo', 'Artesanato', 'Instalador'].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
        <label>
          Tipo de producto
          <select
            value={product.family}
            onChange={(e) => onEdit({ family: e.target.value })}
          >
            {productFamilies.map((f) => (
              <option key={f.name}>{f.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="admin-line-options">
        <span>Aparece en las líneas</span>
        {['Pegalo', 'Artesanato', 'Instalador'].map((l) => (
          <label key={l}>
            <input
              type="checkbox"
              checked={product.lines.includes(l)}
              disabled={product.line === l}
              onChange={(e) =>
                onEdit({
                  lines: e.target.checked
                    ? [...product.lines, l]
                    : product.lines.filter((x) => x !== l),
                })
              }
            />
            {l}
          </label>
        ))}
      </div>
      <label>
        Presentación
        <input
          value={product.size}
          maxLength={150}
          onChange={(e) => onEdit({ size: e.target.value })}
        />
      </label>
      <label>
        Descripción y usos
        <textarea
          rows={4}
          maxLength={3000}
          value={product.use}
          onChange={(e) => onEdit({ use: e.target.value })}
        />
      </label>
      <label>
        Colores / disponibilidad
        <input
          maxLength={300}
          value={product.colors}
          onChange={(e) => onEdit({ colors: e.target.value })}
        />
      </label>
      <div className="admin-fields">
        <div className="admin-upload">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              width={140}
              height={110}
              unoptimized
            />
          )}
          <label>
            Foto del producto
            <input
              type="file"
              disabled={!storageAvailable}
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                void onUpload(e.target.files?.[0], 'image');
                e.target.value = '';
              }}
            />
          </label>
          <small>PNG, JPG o WebP. Hasta 5 MB.</small>
        </div>
        <div className="admin-upload">
          <FileText size={28} />
          <label>
            Ficha técnica
            <input
              type="file"
              disabled={!storageAvailable}
              accept="application/pdf"
              onChange={(e) => {
                void onUpload(e.target.files?.[0], 'technicalPdf');
                e.target.value = '';
              }}
            />
          </label>
          <small>PDF. Hasta 12 MB.</small>
          {product.technicalPdf && (
            <>
              <a href={product.technicalPdf} target="_blank" rel="noreferrer">
                Descargar ficha actual
              </a>
              <button
                type="button"
                onClick={() => onEdit({ technicalPdf: '' })}
              >
                Quitar ficha
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
