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

## Panel de administración (septiembre de 2026)

`/admin` usa ahora usuario y contraseña propios; el inicio con ChatGPT y ADMIN_EMAILS ya no autorizan cargas. No hay registro público. La primera cuenta se crea una única vez en `/admin/activar`, presentando el secreto ADMIN_SETUP_TOKEN (32 bytes aleatorios) y una contraseña de 15–256 caracteres. Generar la clave local con `node scripts/admin-activation.mjs`: queda en `work/admin-activation.txt`, excluida de Git, con permisos 0600. Configurar el mismo valor como secreto de Sites antes de publicar. Retirar el secreto de producción una vez activada la primera cuenta. Nunca enviar la contraseña por chat ni incluirla en código.

Contraseñas: PBKDF2-HMAC-SHA256, 600.000 iteraciones y sal aleatoria individual de 128 bits, comparación en tiempo constante. Referencia: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html y compatibilidad de ejecución https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/. Las sesiones usan tokens aleatorios de 256 bits; la base guarda sólo su SHA-256. Vencen a las 8 horas; las cookies son HttpOnly, SameSite=Strict y Secure bajo HTTPS. Cerrar sesión revoca el token en servidor. Los usuarios desactivados pierden acceso inmediatamente. Hay límites atómicos por usuario e IP (8 y 30 intentos cada 15 minutos), límite de activación y comprobación de origen en todas las escrituras. Los encabezados de ChatGPT y los controles del cliente no permiten saltar la autenticación. HTTPS debe mantenerse en producción.

Persistencia D1: usuarios, sesiones, intentos y contenido con revisión para evitar sobrescrituras concurrentes. Migraciones Drizzle incluidas; no se crea esquema en peticiones. R2 DOCUMENTS conserva precios/promociones y aloja fotos y fichas. Las escrituras verifican la sesión en cada endpoint. Las fotos aceptan PNG/JPG/WebP hasta 5 MB y los PDF hasta 12 MB, con límites por streaming y comprobación de firma. No se aceptan SVG ni URLs externas en el editor. Esto valida el formato, no sustituye un antivirus; subir sólo archivos de confianza. Los archivos publicados son públicos. Ocultar un producto retira su ficha del catálogo, no revoca un enlace ya compartido a su archivo.

El editor permite agregar y editar productos, marcas/líneas, familia, presentación, descripción, colores, foto y ficha técnica, y ocultarlos sin borrar sus datos. Los distribuidores tienen nombre, dirección, localidad, provincia, teléfono, correo, coordenadas y visibilidad. Los puntos se proyectan aproximadamente sobre el mapa nacional; las coordenadas deben confirmarse antes de publicar. El catálogo, los filtros, las consultas y el mapa leen los datos publicados del servidor. Precios y promociones conservan su descarga pública y se reemplazan desde el panel.

La primera cuenta es de administración. La gestión de altas adicionales y recuperación de contraseñas queda a cargo del responsable técnico mediante operaciones autorizadas sobre `admin_users`: generar hashes con `hashPassword` de `app/password.ts`, nunca guardar contraseñas en SQL o logs, y revocar todas las sesiones del usuario al cambiar una contraseña. Para bajas, establecer `active = 0`. No hay recuperación automática por correo ni MFA en esta versión. No se afirma invulnerabilidad ni se reemplaza una auditoría independiente de seguridad.

Verificación: `npm test` cubre hash/sal, contraseñas incorrectas, validación de contenido, enlaces peligrosos, coordenadas y lógica existente. `node tests/admin-http.mjs` está destinado exclusivamente a una base local de prueba sin cuentas: prueba activación única, ingreso, rechazo anónimo y de identidad heredada, CSRF, publicación visible, conflicto de revisiones, PDF inválido/válido, revocación al salir y bloqueo de intentos. No ejecutar contra producción. Luego retirar la cuenta local `local-security-test` y sus sesiones. No se hizo auditoría visual en navegador.

Se actualizaron React/React DOM/RSC a 19.3.0, Vinext a beta.9 y las herramientas compatibles de Cloudflare/Vite, junto con correcciones transitivas de sharp y esbuild. `npm audit` informó 0 vulnerabilidades conocidas después de la actualización. Esto no equivale a una garantía de seguridad. TypeScript, lint del código propio modificado, 10 pruebas unitarias y el flujo HTTP local pasan.

### Preparación de la conexión a MongoDB Atlas

`npm run db:check` utiliza el controlador oficial de MongoDB desde Node.js para verificar TLS y acceso de lectura a la base `pegalo`. Completar `.env.mongodb.local` (ignorado por Git, permisos 0600) con `MONGODB_URI`, la cadena original de Atlas con el usuario técnico, y `MONGODB_PASSWORD`, su contraseña por separado. El marcador de contraseña de la URI puede permanecer: el controlador recibe la contraseña separada sin problemas de codificación URL. El comando no imprime credenciales ni contenidos, y no realiza escrituras. La base sigue estando en Atlas; este archivo guarda únicamente configuración privada de desarrollo.

Esta preparación todavía NO migra el panel de D1 a MongoDB ni crea la cuenta de administración. Una vez recibida la configuración privada, verificar acceso real y adaptar la persistencia y la ejecución del servidor a Node.js para el hosting externo de la empresa. El controlador TCP de MongoDB no debe importarse en el Worker de Sites. Para producción, configurar las credenciales en los secretos del hosting. R2 independiente y backups automáticos siguen pendientes.

### MongoDB Atlas conectado — ejecución Node.js

`npm run dev`, `npm run build` y `npm start` ahora ejecutan la variante Node.js con MongoDB Atlas. Los alias de servidor eligen un repositorio MongoDB y conservan la variante D1 en archivos separados para el despliegue anterior. `dev:sites` y `build:sites` corresponden exclusivamente a esa variante anterior; no usarla para la entrega Atlas. El hosting final debe soportar un proceso Node.js persistente y HTTPS; PHP/WordPress por sí solos no bastan.

Los secretos locales de desarrollo están en `.env.mongodb.local` y `.env.node.local`, ambos excluidos de Git. El servidor de producción recibe las mismas variables mediante los secretos del hosting. MongoDB es la fuente persistente del catálogo, distribuidores, usuarios, sesiones y límites de ingreso. `npm run db:init` crea índices de usuario único y TTL, y carga el catálogo original únicamente cuando no existe `site_content/main`. No sobrescribe contenido ni crea usuarios. La base remota fue inicializada y se verificó acceso de lectura y escritura.

La primera cuenta se crea en `/admin/activar`, usando la clave privada de `work/admin-activation.txt`. La contraseña la elige la persona responsable en el formulario; se guarda únicamente su hash. El identificador único `initial-admin` impide activaciones repetidas o concurrentes. No se ha creado ninguna cuenta administradora ni cuenta temporal en Atlas. Después de activar, retirar `ADMIN_SETUP_TOKEN` de la configuración y reiniciar. El inicio de sesión y las escrituras siguen verificándose en servidor. En Node se utiliza un límite global adicional al límite por usuario: no se confía en cabeceras de IP sin conocer la configuración del proxy del hosting.

Cada publicación de contenido MongoDB conserva hasta diez revisiones anteriores en el documento principal mediante una actualización atómica condicionada por la revisión. Esto permite implementar restauración, pero no constituye un backup independiente: exportaciones automáticas y restauración siguen pendientes. El almacenamiento R2 independiente de la empresa todavía no está configurado. La variante Node muestra ese estado y rechaza cargas; nunca escribe imágenes o PDF en disco como alternativa. Las fotografías originales empaquetadas con la web se siguen sirviendo como recursos estáticos hasta migrarlas a R2.

Validación de esta etapa: conexión TLS real, inicialización remota idempotente, catálogo remoto en la página, pantallas de acceso, cabeceras no-store y rechazos anónimo, de activación inválida, contraseña inválida y origen ajeno. La creación válida y el ingreso con la cuenta definitiva quedan pendientes de que el responsable complete el formulario. `tests/admin-http.mjs` queda bloqueado por defecto y reservado al entorno D1 desechable; nunca ejecutarlo contra Atlas.

### Documentos comerciales incluidos en el proyecto

Por decisión de la empresa durante el desarrollo, las cargas remotas de archivos se posponen. Se incorporaron sin modificar los PDF aportados: lista 89 de septiembre de 2026 y promociones de septiembre de 2026, en `public/documentos`. La variante Node sin almacenamiento remoto publica su disponibilidad desde `app/bundled-documents.json` y redirige las descargas existentes a esos archivos estáticos. El panel permite descargar los documentos, muestra que las actualizaciones se realizan desde el proyecto y deshabilita las cargas. Para reemplazarlos, copiar el nuevo archivo, actualizar la referencia/fecha/tamaño en el manifiesto y volver a publicar. Los archivos originales aportados se conservaron.

Límites internos provinciales: Natural Earth, `ne_10m_admin_1_states_provinces_lines` (dominio público). Se incluyen como SVG local, con la misma proyección lineal usada por los marcadores y recortados a la silueta nacional.

### Primera etapa de mejoras UX/UI

La portada incorpora accesos a catálogo y consulta mayorista; el menú incluye precios y promociones y se compacta antes en pantallas intermedias. Se unifica la descripción institucional como importadora y comercializadora desde 1998. Si falla la lectura del catálogo, se conservan la presentación institucional, descargas, empresa, cobertura y contacto, con reintento localizado en el catálogo. No se publica un catálogo de respaldo que pueda mostrar productos retirados.

Las consultas permiten elegir presentación y color dentro de las combinaciones declaradas para cada producto, y conservar cantidades independientes por combinación. La selección anterior sigue siendo legible; productos antiguos con múltiples presentaciones se identifican como “Presentación a confirmar”. Las opciones retiradas del catálogo se filtran al leer la selección. No se modificó la base remota. Los enlaces `/?producto=ID#catalogo` abren la ficha correspondiente; son accesos compartibles, no páginas de producto independientes para SEO.

Se amplían los controles de cantidad a 44 px, se incorpora cierre del menú por Escape y se mantiene la confirmación final por WhatsApp a cargo del visitante. Pruebas unitarias cubren combinaciones restringidas, cantidades independientes, descripciones con decimales y compatibilidad de la selección anterior. La respuesta local de error conserva las secciones institucionales. La conexión remota del catálogo sigue fallando en este entorno; no se afirma una validación visual completa del flujo con datos remotos. La entrega mantiene la arquitectura Node/MongoDB existente; no desplegar su variante D1 anterior como sustituto.
