'use client';
import { useState } from 'react';
import geometry from './argentina-geometry.json';
export default function ArgentinaMap() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const shown = open || hover;
  return (
    <div className="argentina-map">
      <div className="argentina-canvas">
        <svg viewBox="0 0 360 620" aria-hidden="true">
          <path d={geometry.path} fill="#102a83" />
        </svg>
        <div
          className="map-location"
          style={{
            left: `${(geometry.point[0] / 360) * 100}%`,
            top: `${(geometry.point[1] / 620) * 100}%`,
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <button
            className="map-location-dot"
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setOpen(false);
                setHover(false);
              }
            }}
            aria-label="Ver sede PEGALO: Santos Lugares, Buenos Aires"
            aria-expanded={shown}
            aria-controls="santos-lugares-info"
            onClick={() => {
              setHover(false);
              setOpen(!open);
            }}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
          >
            <span />
          </button>
          <div
            className="map-location-info"
            id="santos-lugares-info"
            hidden={!shown}
          >
            <strong>Sede Santos Lugares</strong>
            <span>Asamblea 4355 · CP 1676</span>
            <span>Provincia de Buenos Aires</span>
          </div>
        </div>
      </div>
      <p className="map-hint">Explorá el punto para conocer nuestra sede.</p>
    </div>
  );
}
