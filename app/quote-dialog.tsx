'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import type { ManagedProduct as Product } from './content-policy';
import { quoteProductId, quotePresentation } from './product-presentations';
import PegaloName from './pegalo-name';
import './refinements.css';

const whatsapp = (message: string) =>
  `https://wa.me/541164174036?text=${encodeURIComponent(message)}`;

type QuoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  quote: string[];
  setQuote: (updater: (current: string[]) => string[]) => void;
};

export default function QuoteDialog({
  open,
  onOpenChange,
  products,
  quote,
  setQuote,
}: QuoteDialogProps) {
  const [name, setName] = useState('');
  const [locality, setLocality] = useState('');
  const [note, setNote] = useState('');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="quote-dialog" showCloseButton={false}>
        <DialogClose className="modal-close" aria-label="Cerrar consulta">
          <X />
        </DialogClose>
        <p className="eyebrow">VENTA MAYORISTA / ASESORAMIENTO</p>
        <DialogTitle className="detail-title">
          Hablemos de tu proyecto.
        </DialogTitle>
        <DialogDescription>
          Prepará tu consulta y continuá por WhatsApp para enviarla al equipo de{' '}
          <PegaloName />.
        </DialogDescription>
        <div className="quote-items">
          {quote.length ? (
            quote.map((id) => {
              const p = products.find((x) => x.id === quoteProductId(id))!;
              return (
                <div key={id} className="quote-row">
                  <Image
                    unoptimized
                    src={p.image || '/product-placeholder.svg'}
                    alt=""
                    width={64}
                    height={64}
                  />
                  <div className="quote-row-info">
                    <strong>{p.name}</strong>
                    <span>{quotePresentation(p, id)}</span>
                  </div>
                  <button
                    aria-label={'Quitar ' + p.name}
                    onClick={() => setQuote((q) => q.filter((x) => x !== id))}
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })
          ) : (
            <p>
              Podés consultarnos directamente o agregar productos desde el
              catálogo.
            </p>
          )}
        </div>
        <label className="field">
          Nombre o comercio
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="organization"
            placeholder="¿Cómo te llamás?"
          />
        </label>
        <label className="field">
          Localidad y provincia
          <input
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            placeholder="¿Desde dónde nos escribís?"
          />
        </label>
        <label className="field">
          Tu consulta
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contanos qué te gustaría saber sobre los productos…"
          />
        </label>
        <a
          className="button"
          target="_blank"
          rel="noreferrer"
          href={whatsapp(
            [
              'Hola Pegalo, quisiera realizar una consulta.',
              name && 'Nombre / comercio: ' + name,
              locality && 'Localidad: ' + locality,
              quote.length &&
                'Productos de interés:\n' +
                  quote
                    .map(
                      (id) =>
                        '• ' +
                        products.find((p) => p.id === quoteProductId(id))!
                          .name +
                        ' (' +
                        quotePresentation(
                          products.find((p) => p.id === quoteProductId(id))!,
                          id,
                        ) +
                        ')',
                    )
                    .join('\n'),
              note,
            ]
              .filter(Boolean)
              .join('\n\n'),
          )}
        >
          Continuar por WhatsApp
        </a>
      </DialogContent>
    </Dialog>
  );
}
