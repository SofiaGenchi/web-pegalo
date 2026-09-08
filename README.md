# Pegalo

Primera versión del rediseño institucional y catálogo mayorista.

## Desarrollo

- `npm install`
- `npm run dev`
- `npm run build`
- `npx tsc --noEmit`

## Dirección visual

Montserrat en títulos, navegación y textos; Open Sans en botones, según el CSS público de la web original consultado el 8 de septiembre de 2026. Fuentes servidas localmente. Logotipo e imágenes originales de adhesivospegalo.com.ar.

Portada con paralaje ligado al scroll, entradas de títulos por líneas, secciones de líneas superpuestas, revelado de contenidos y franja animada. Respeta prefers-reduced-motion. No intercepta el scroll nativo.

## Funcionalidad

Catálogo inicial de nueve productos, búsqueda, filtros por línea, fichas y selección temporal de productos para una consulta. El enlace de WhatsApp prepara un mensaje; el visitante debe enviarlo. No se registran pedidos ni se envían formularios automáticamente. La selección permanece durante la navegación actual, no al recargar.

## Contenido pendiente de validar con la empresa

Catálogo completo y vigencia de productos, presentaciones, imágenes, datos de contacto y fichas técnicas. El número de WhatsApp y el correo corresponden a la web original. No se trasladaron afirmaciones de certificaciones sin respaldo ni los teléfonos 0800 contradictorios.

## Verificación

Compilación y TypeScript. No se realizó una auditoría visual de navegadores/dispositivos ni envío de consultas. El lint global del scaffold contiene avisos previos en componentes UI de terceros; se revisa el código propio por separado.

Se agregó una búsqueda pública opcional mediante WebMCP. No se pudo validar su registro en este entorno: el navegador no expuso documentación para esa capacidad. La navegación y el catálogo no dependen de ella.
