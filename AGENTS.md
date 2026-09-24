# Pegalo web

## Estado actual

- La web pública se genera como sitio estático (`next.config.ts`: `output: 'export'`). Debe poder servir sus páginas y recursos sin una base de datos ni un servidor de aplicación en ejecución.
- El catálogo publicado sale de `app/catalog/products.ts` y `app/catalog/content-policy.ts` mediante `server/repository-static.ts`.
- `parked-admin/` contiene trabajo preliminar para un panel de administración. Está fuera de las rutas publicadas. No lo actives ni conectes una base de datos como efecto secundario de cambios en la web pública.
- La web se despliega en Dokploy en el VPS de Pegalo. La configuración de producción está en `Dockerfile` y `deploy/`.

## Dónde trabajar

- `app/catalog/`: productos, fichas y enlaces del catálogo.
- `app/sections/`: secciones de la portada; `app/home.tsx` las compone.
- `app/quote/`: armado de consultas por WhatsApp.
- `app/map/`: mapa y datos de ubicación.
- `app/ui/` y `app/styles/`: componentes compartidos y estilos.
- `public/`: imágenes, fichas técnicas y documentos descargables.
- `tests/`: pruebas automatizadas.

## Cambios y verificación

- Conservá las URL públicas de productos. Si una URL cambia, agregá una redirección y comprobá su destino.
- Al cambiar productos, comprobá que sus imágenes y fichas técnicas existan en `public/` y que los enlaces de consulta sigan funcionando.
- No presentes como publicado algo que solo funciona con `npm start`: comprobá también los archivos generados en `dist/client/`, incluidos `robots.txt`, `sitemap.xml` y los recursos referenciados por las páginas.
- Usá Node.js 22.13 o superior. Instalá dependencias con `npm ci`; ejecutá `npm test`, `npm run lint`, `npx tsc --noEmit` y `npm run build` para cambios que afecten la web.
- No incorpores secretos ni archivos `.env*` al repositorio.

## Ramas y publicación

- Cada desarrollador crea su propia rama a partir de `QAS` para cada cambio. No hagas commits ni push directos a `QAS`.
- Cuando el cambio esté listo y verificado, abrí un pull request desde esa rama hacia `QAS`. Revisá el diff y las verificaciones antes de integrarlo.
- `QAS` es la rama de integración y pruebas. Probá allí los cambios antes de promoverlos a producción.
- `main` representa la versión de producción. No hagas commits ni push directos a `main`.
- Para publicar, abrí un pull request de `QAS` hacia `main`. Revisá el diff y las verificaciones antes de integrarlo.
- El despliegue automático de producción toma únicamente `main`; comprobá el resultado en Dokploy después de cada integración.
