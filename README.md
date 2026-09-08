# Pegalo

Primera versión del rediseño institucional y catálogo mayorista.

## Desarrollo

- `npm install`
- `npm run dev`
- `npm run build`
- `npx tsc --noEmit`

## Dirección visual

Montserrat en títulos, navegación y textos; Open Sans en botones, según el CSS público de la web original consultado el 8 de septiembre de 2026. Fuentes servidas localmente. Logotipo original de adhesivospegalo.com.ar. Las 23 fotografías actuales fueron aportadas por la usuaria y se copiaron sin modificar desde productos-pegalo y Downloads. Los archivos originales se conservaron.

Portada azul con primer plano de pico centrado, titulares de gran escala, recorrido de gota translúcida, productos alternados con desplazamiento y rotación vinculados al scroll, entradas de títulos y franja roja animada. Respeta prefers-reduced-motion. No intercepta el scroll nativo.

## Funcionalidad

Catálogo de 23 productos y presentaciones, búsqueda, filtros por línea, fichas y selección temporal de productos para una consulta. El enlace de WhatsApp prepara un mensaje; el visitante debe enviarlo. No se registran pedidos ni se envían formularios automáticamente. La selección y sus cantidades se conservan localmente entre recargas cuando el navegador permite almacenamiento.

## Contenido pendiente de validar con la empresa

Catálogo completo y vigencia de productos, presentaciones, imágenes, datos de contacto y fichas técnicas. El número de WhatsApp y el correo corresponden a la web original. No se trasladaron afirmaciones de certificaciones sin respaldo ni los teléfonos 0800 contradictorios.

## Verificación

Compilación y TypeScript. No se realizó una auditoría visual de navegadores/dispositivos ni envío de consultas. El lint global del scaffold contiene avisos previos en componentes UI de terceros; se revisa el código propio por separado.

Se agregó una búsqueda pública opcional mediante WebMCP. No se pudo validar su registro en este entorno: el navegador no expuso documentación para esa capacidad. La navegación y el catálogo no dependen de ella.

Rediseño con fotografías aportadas: compilación, TypeScript y lint de código propio correctos. Integridad del catálogo validada: 23 identificadores únicos, archivos PNG presentes y tres presentaciones de cianoacrilato. Disponible en vista previa local; el sitio privado publicado conserva la versión anterior hasta que se solicite publicar esta actualización.


## Brief de marca y recorrido (actualización)

Pegalo es importadora y comercializadora mayorista, no se presenta como fábrica. Paleta oficial: #102a83, #f1000e, #ffffff, #b8c1e8, #000000. Se conserva el logotipo original como imagen, manteniendo su diseño Stop; no se recibió el archivo de la fuente Stop. Artesanato usa Poppins local y amarillo #ffdf00 (tono elegido provisionalmente al no especificarse hexadecimal).

El componente story-journey.tsx calcula un recorrido Bézier propio desde puntos de las escenas, dibuja el trazo y desplaza una gota SVG con el scroll nativo. Formación, estiramiento, desprendimiento y llegada al botón de consulta. Recalcula geometría con ResizeObserver y respeta movimiento reducido. No utiliza WebGL ni copia el código de referencias.

Referencias consultadas: https://skiper-ui.com/v1/skiper19, https://mindmarket.com/, https://www.awwwards.com/inspiration/path-scroll-with-rive-animations-mindmarket, https://www.awwwards.com/inspiration/svg-zoom-on-scroll-and-ball-svg-animation-with-path-hear, https://svg-scroll-draw.vercel.app/.

Asset ilustrativo de pico: public/nozzle-study.png, generado con imagegen integrado. Prompt: primer plano frontal de pico blanco abierto de cianoacrilato, invertido y apuntando hacia abajo, cuello y hombro entrando por arriba, sin tapa, gota, etiquetas ni logotipos; iluminación de estudio y fondo transparente. El resultado incluyó damero opaco; se muestra únicamente el contorno del pico mediante clip-path CSS, sin modificar el archivo raster. Las fotos del catálogo siguen siendo las originales aportadas. No representa un envase exacto de catálogo.

Compilación, TypeScript y lint de código propio correctos. Vista previa HTTP 200. No se realizó verificación visual de animaciones en distintos dispositivos. Actualización local sin reemplazar la versión privada publicada.

## Mejoras de catálogo y consultas

Filtros combinados por línea, tipo y búsqueda; limpieza de filtros y contador de resultados. Fichas con selección de las presentaciones de cianoacrilato. Consulta con cantidades por producto (1–9999 unidades), miniaturas y total. Selección almacenada localmente con esquema validado y sincronizada entre pestañas; si el almacenamiento falla, se conserva en memoria durante esa navegación. Nombre, localidad y mensaje no se persisten. El envío final sigue a cargo del visitante en WhatsApp, sin registrar órdenes automáticamente.

El seguimiento de la gota precalcula 513 muestras cuando cambia el tamaño del recorrido: usa búsqueda binaria e interpolación y una sola consulta de geometría SVG por frame, frente a las 16 anteriores. Pruebas: `node --test tests/logic.test.mjs`. Cuatro pruebas pasan: datos almacenados inválidos, límites de cantidades, cobertura/fotografías del catálogo y recorrido reversible. Compilación, TypeScript y lint del código propio pasan.

## Nueva puesta en escena

Se reemplazó la hoja de estilos del recorrido: portada azul inmersiva, pico central, titulares escalonados, franja roja continua, escenas con grandes números de capítulo, superficies curvas y fotografías con paralaje y rotación vinculados al scroll. El cierre azul recibe la gota en la consulta. Móvil apila productos y textos, conserva navegación contrastada y respeta movimiento reducido. La medición de escenas se cachea en cambios de tamaño; el scroll no lee el layout de cada sección. Vista previa desde /#inicio para mostrar el rediseño, manteniendo catálogo y consultas existentes.
