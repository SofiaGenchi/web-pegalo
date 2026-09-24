'use client';

import { MapPin } from 'lucide-react';
import type { Distributor } from '../content-policy';

type DistributorEditorProps = {
  distributor?: Distributor;
  onEdit: (patch: Partial<Distributor>) => void;
};

export default function DistributorEditor({
  distributor,
  onEdit,
}: DistributorEditorProps) {
  if (!distributor) {
    return (
      <div className="admin-empty">
        <MapPin size={36} />
        <h2>La red de distribuidores</h2>
        <p>
          Agregá los datos de un local y activá su visibilidad para que aparezca
          en el mapa de Argentina.
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="admin-detail-title">
        <h2>{distributor.name}</h2>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={distributor.active}
            onChange={(e) => onEdit({ active: e.target.checked })}
          />
          Visible en el mapa
        </label>
      </div>
      {(
        ['name', 'address', 'locality', 'province', 'phone', 'email'] as const
      ).map((key, i) => (
        <label key={key}>
          {
            [
              'Nombre comercial',
              'Dirección',
              'Localidad',
              'Provincia',
              'Teléfono (opcional)',
              'Correo electrónico (opcional)',
            ][i]
          }
          <input
            type={key === 'email' ? 'email' : 'text'}
            value={distributor[key]}
            onChange={(e) => onEdit({ [key]: e.target.value })}
          />
        </label>
      ))}
      <div className="admin-fields">
        <label>
          Latitud
          <input
            type="number"
            step="any"
            min={-55.5}
            max={-21.5}
            value={distributor.latitude}
            onChange={(e) =>
              onEdit({
                latitude: e.target.valueAsNumber,
              })
            }
          />
        </label>
        <label>
          Longitud
          <input
            type="number"
            step="any"
            min={-73.7}
            max={-53.5}
            value={distributor.longitude}
            onChange={(e) =>
              onEdit({
                longitude: e.target.valueAsNumber,
              })
            }
          />
        </label>
      </div>
      <p className="admin-help">
        Ingresá las coordenadas confirmadas del local, en grados decimales. El
        mapa nacional muestra una ubicación aproximada. Revisá las coordenadas
        sugeridas antes de publicar.
      </p>
    </>
  );
}
