# Organización de la web

- `page.tsx`, `layout.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`, `robots.ts` y `sitemap.ts` son archivos de rutas que usa el framework.
- `productos/[slug]/page.tsx` es la plantilla compartida de las fichas de producto.
- `catalog/` reúne datos del catálogo, fichas, enlaces y componentes de producto.
- `map/` contiene el mapa de Argentina, sus datos y la ubicación de Pegalo.
- `sections/` contiene las secciones de la portada.
- `quote/` contiene la consulta de productos.
- `ui/` contiene componentes y comportamiento compartidos.
- `styles/` reúne los estilos; `globals.css` los incorpora a la web.

`home.tsx` compone la portada con estas piezas. Los archivos del panel de administración están apartados en `parked-admin/`, fuera de las rutas publicadas.
