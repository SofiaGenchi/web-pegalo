'use client';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import geometry from './argentina-geometry.json';
import provinceBoundaries from './argentina-province-boundaries.json';
import territories from './argentina-territories.json';
import { contactLocations, type ContactLocation } from './contact-locations';
import type { Distributor } from '../catalog/content-policy';
import PegaloName from '../ui/pegalo-name';
function LocationPoint({ location }: { location: ContactLocation }) {
  const whatsapp =
    location.phones?.filter((phone) =>
      phone.href.startsWith('https://wa.me/'),
    ) ?? [];
  const phones =
    location.phones?.filter(
      (phone) => !phone.href.startsWith('https://wa.me/'),
    ) ?? [];
  return (
    <div
      className="map-location"
      style={{
        left: `${(location.point[0] / 360) * 100}%`,
        top: `${(location.point[1] / 620) * 100}%`,
      }}
    >
      <Dialog>
        <DialogTrigger
          className="map-location-dot"
          aria-label={`Ver ${location.name}, ${location.locality}`}
        >
          <span />
        </DialogTrigger>
        <DialogContent className="location-dialog" showCloseButton={false}>
          <DialogClose
            className="modal-close"
            aria-label="Cerrar información de contacto"
          >
            <X />
          </DialogClose>
          <div className="location-summary">
            <DialogDescription className="location-kind">
              {location.type === 'office' ? 'Oficina oficial' : 'Distribuidor'}
            </DialogDescription>
            <DialogTitle className="location-title">
              {location.name
                .split(/(Pegalo)/i)
                .map((part, index) =>
                  part.toLowerCase() === 'pegalo' ? (
                    <PegaloName key={index} />
                  ) : (
                    part
                  ),
                )}
            </DialogTitle>
          </div>
          <dl className="location-details">
            <div>
              <dt>Dirección</dt>
              <dd>{location.address?.trim() || '-'}</dd>
            </div>
            <div>
              <dt>Localidad</dt>
              <dd>{location.locality?.trim() || '-'}</dd>
            </div>
            <div>
              <dt>Provincia</dt>
              <dd>{location.province?.trim() || '-'}</dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd>
                {whatsapp.length
                  ? whatsapp.map((phone) => (
                      <a
                        className="contact-value"
                        key={phone.href}
                        href={phone.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {phone.label.replace(/\s*·\s*WhatsApp/i, '')}
                      </a>
                    ))
                  : '-'}
              </dd>
            </div>
            <div>
              <dt>Número de teléfono</dt>
              <dd>
                {phones.length
                  ? phones.map((phone) => (
                      <a
                        className="contact-value"
                        key={phone.href}
                        href={phone.href}
                        target={
                          phone.href.startsWith('https:') ? '_blank' : undefined
                        }
                        rel={
                          phone.href.startsWith('https:')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                      >
                        {phone.label}
                      </a>
                    ))
                  : '-'}
              </dd>
            </div>
            <div>
              <dt>Correo electrónico</dt>
              <dd>
                {location.email?.trim() ? (
                  <a
                    className="contact-value"
                    href={`mailto:${location.email}`}
                  >
                    {location.email}
                  </a>
                ) : (
                  '-'
                )}
              </dd>
            </div>
          </dl>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default function ArgentinaMap({
  distributors,
}: {
  distributors: Distributor[];
}) {
  const locations: ContactLocation[] = [
    ...contactLocations,
    ...distributors.map((d) => ({
      id: d.id,
      name: d.name,
      type: 'distributor' as const,
      address: d.address,
      locality: d.locality,
      province: d.province,
      point: [
        geometry.projection.x +
          (d.longitude - geometry.projection.west) * geometry.projection.scaleX,
        geometry.projection.y +
          (geometry.projection.north - d.latitude) * geometry.projection.scaleY,
      ],
      phones: d.phone
        ? [{ label: d.phone, href: 'tel:' + d.phone.replace(/[^+0-9]/g, '') }]
        : [],
      email: d.email,
    })),
  ];
  return (
    <div className="argentina-map">
      <div className="argentina-canvas">
        <svg
          viewBox="0 0 360 620"
          aria-labelledby="argentina-map-title"
        >
          <title id="argentina-map-title">
            Argentina, Islas Malvinas y Sector Antártico Argentino en recuadro
          </title>
          <defs>
            <clipPath id="argentina-province-clip">
              <path d={geometry.path} />
            </clipPath>
          </defs>
          <path d={geometry.path} fill="#102a83" />
          <path
            d={provinceBoundaries.path}
            fill="none"
            stroke="#fff"
            strokeWidth="0.65"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            clipPath="url(#argentina-province-clip)"
            pointerEvents="none"
          />
          <path d={territories.malvinas} fill="#102a83" />
          <g transform="translate(274 498) scale(0.52)">
            <rect
              width="148"
              height="156"
              rx="12"
              fill="#fff"
              stroke="#b8c1e8"
            />
            <path
              d="M22,31 Q72,9 122,31 L72,140 Z"
              fill="#b8c1e8"
              fillOpacity=".18"
              stroke="#102a83"
              strokeOpacity=".35"
              strokeDasharray="3 4"
            />
            <path d={territories.antarctica} fill="#102a83" />
          </g>
        </svg>
        {locations.map((location) => (
          <LocationPoint key={location.id} location={location} />
        ))}
      </div>
      <p className="map-hint">
        Hacé clic en un punto para ver la información de contacto
      </p>
    </div>
  );
}
