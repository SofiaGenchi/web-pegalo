'use client';
import { useRef, useState, type KeyboardEvent } from 'react';
import geometry from './argentina-geometry.json';
import territories from './argentina-territories.json';
import { contactLocations, type ContactLocation } from './contact-locations';
import PegaloName from './pegalo-name';
function LocationPoint({ location }: { location: ContactLocation }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const shown = open || hover || focused;
  const dismiss = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      button.current?.focus();
      setOpen(false);
      setHover(false);
      setFocused(false);
    }
  };
  return (
    <div
      className="map-location"
      style={{
        left: `${(location.point[0] / 360) * 100}%`,
        top: `${(location.point[1] / 620) * 100}%`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
          setOpen(false);
        }
      }}
    >
      <button
        ref={button}
        className="map-location-dot"
        aria-label={`Ver ${location.name}, ${location.locality}`}
        aria-expanded={shown}
        aria-controls={location.id + '-info'}
        onKeyDown={dismiss}
        onClick={() => {
          setHover(false);
          setFocused(false);
          setOpen(!open);
        }}
      >
        <span />
      </button>
      <div
        className="map-location-info"
        id={location.id + '-info'}
        hidden={!shown}
      >
        <small className="map-location-type">
          {location.type === 'office' ? 'Oficina oficial' : 'Distribuidor'}
        </small>
        <strong>
          {location.name
            .split(/(Pegalo)/i)
            .map((part, index) =>
              part.toLowerCase() === 'pegalo' ? (
                <PegaloName key={index} />
              ) : (
                part
              ),
            )}
        </strong>
        <span>{location.address}</span>
        <span>
          {location.locality} · {location.province}
        </span>
        {location.phones?.length || location.email ? (
          <div className="map-location-contacts">
            {location.phones?.map((phone) => (
              <a
                key={phone.href}
                href={phone.href}
                target={phone.href.startsWith('https:') ? '_blank' : undefined}
                rel={
                  phone.href.startsWith('https:')
                    ? 'noopener noreferrer'
                    : undefined
                }
                onKeyDown={dismiss}
              >
                {phone.label}
              </a>
            ))}
            {location.email && (
              <a href={`mailto:${location.email}`} onKeyDown={dismiss}>
                {location.email}
              </a>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default function ArgentinaMap() {
  return (
    <div className="argentina-map">
      <div className="argentina-canvas">
        <svg
          viewBox="0 0 360 620"
          role="img"
          aria-labelledby="argentina-map-title"
        >
          <title id="argentina-map-title">
            Argentina, Islas Malvinas y Sector Antártico Argentino en recuadro
          </title>
          <path d={geometry.path} fill="#102a83" />
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
        {contactLocations.map((location) => (
          <LocationPoint key={location.id} location={location} />
        ))}
      </div>
      <p className="map-hint">
        Explorá el punto para conocer nuestra oficina y contactarnos.
      </p>
    </div>
  );
}
