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

## Documentos comerciales y fichas integradas

Se agregó /#descargas con dos documentos públicos: precios y promociones. /admin permite reemplazar los PDF (máximo 12 MB), con inicio de sesión de ChatGPT y autorización por correo ADMIN_EMAILS en el servidor. El almacenamiento usa R2 DOCUMENTS, con un objeto por tipo; la sustitución conserva la URL y la descarga siempre consulta la última versión. No hay listas comerciales de ejemplo publicadas. La cuenta de administración de producción está pendiente de que la empresa indique el correo; sin configuración todas las cargas se deniegan.

Configurar ADMIN_EMAILS en Sites antes del próximo despliegue. Para desarrollo, .dev.vars contiene únicamente seedy@sites.test, la identidad de prueba del plugin local; no se incluye en el paquete ni en Git. La variable de ejemplo no contiene cuentas reales.

La ficha de silicona acética se descargó del PDF original y se sirve en /fichas/silicona-acetica.pdf. El resto muestra los datos disponibles dentro de la ficha, sin enlaces al sitio anterior ni características técnicas inventadas. Las fichas técnicas completas restantes deben ser aportadas por la empresa.

Se corrigieron tamaños y ajuste contain de las fotos dentro de los diálogos, grillas y navegación para tablet/celular. Validación de servidor local: listado 200, carga autorizada 200, descarga idéntica al archivo cargado, carga anónima 403 y origen ajeno 403. El archivo de prueba fue retirado del almacenamiento local. Seis pruebas de lógica pasan. Sin auditoría visual en navegador.

Logo: pendiente archivo web Stop (WOFF/WOFF2) para reemplazar el PNG conservando la tipografía exacta; no está disponible en los archivos del proyecto.

## Vista simple y materiales del recorrido

Selector persistente de vista simple/animada, y enlaces ?vista=simple y ?vista=animada. La vista simple se activa por defecto cuando el navegador informa prefers-reduced-motion o saveData, salvo elección explícita. El render inicial usa la vista simple para no descargar imágenes decorativas antes de consultar preferencias. No monta StoryJourney. Conserva las fotografías de todas las tarjetas con carga diferida nativa y sin transformaciones animadas. Conserva catálogo, búsqueda, consultas y descargas con navegación semántica y desplazamiento nativo. No equivale a una certificación de accesibilidad: no se realizó una auditoría de lector de pantalla.

La versión animada sustituye gradualmente la gota por cordón blanco en la escena Artesanato, y por trazo ancho color espuma en poliuretanos. Los segmentos siguen el mismo recorrido y se revierten al subir.

## Selección automática de experiencia

El botón y las preferencias manuales se retiraron. La decisión se toma una vez por carga usando movimiento reducido, saveData, estado sin conexión, effectiveType slow-2g/2g/3g, downlink positivo de hasta 1 Mbps o RTT de al menos 600 ms. No usa pruebas de velocidad ni descarga archivos para medir. Sin señales de red disponibles, respeta movimiento reducido y usa la experiencia animada en los demás casos. La accesibilidad del contenido no depende de detectar una discapacidad.

La decisión queda estable mientras se navega; recargar vuelve a evaluar. Los antiguos parámetros ?vista y la preferencia guardada ya no fuerzan una vista. La vista simple conserva las fotografías con carga diferida. El movimiento reducido activado durante la visita sigue deteniendo animaciones mediante CSS y el listener propio del recorrido, sin cambiar la estructura de la página.

Fuente oficial Stop incorporada desde STOP.ttf aportada por la usuaria. Se sirve en /fonts/stop.ttf y se aplica al texto del logo del menú, sin depender de fuentes instaladas en el dispositivo.

## Tarjetas y cobertura gráfica

Secciones ordenadas Descargas → Empresa → Cobertura → Contacto. Stack sticky con top calculado según altura para permitir leer secciones extensas antes de que queden cubiertas. En vista simple/movimiento reducido se usa flujo normal. Contacto tiene composición azul, llamada principal roja a WhatsApp y canales separados.

Silueta cartográfica derivada de Natural Earth a través de https://github.com/datasets/geo-countries (dominio público), simplificada y proyectada para la vista nacional. Coordenadas de la localidad Santos Lugares: -34.6,-58.55, referencia https://www.coordenadas.com.es/argentina/santos-lugares-buenos-aires/555. El marcador representa la localidad a escala nacional, no un geocodificado exacto del domicilio. Dirección y provincia aportadas por la empresa. No se agregan distribuidores sin ubicaciones confirmadas. El mapa no descarga mosaicos externos y su ficha funciona con hover, foco, clic y Escape.
