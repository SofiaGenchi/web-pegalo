# SEO para Pégalo y Artesanato

Investigación: 13 de septiembre de 2026. Alcance: búsqueda de skills públicas, contraste con Google y revisión del código local. No se midieron posiciones, tráfico, volumen de búsquedas ni rendimiento del sitio publicado. Este documento prepara la implementación; no implica cambios publicados ni instalación de skills externas.

## Alcance acordado para la implementación

La usuaria pidió conservar la estética, las secciones y el catálogo interactivo existentes. Cualquier nueva página, sección, texto visible o cambio de navegación debe presentarse como propuesta y recibir su aprobación antes de implementarse. Las páginas de productos, guías y venta mayorista que se habían creado durante el trabajo fueron retiradas, junto con sus enlaces, estilos y redirecciones. También se restauró la animación de carga con su duración original.

Se mantienen únicamente mejoras sin cambios visuales: título y descripción para buscadores, canonical de la portada, metadatos Open Graph/Twitter, datos estructurados Organization con la información empresarial ya visible, robots.txt y sitemap.xml con una sola URL pública (la portada). El dominio principal es https://adhesivospegalo.com.ar, confirmado por la usuaria; pegalo.com.ar también responde, pero no se modificaron sus redirecciones ni DNS. La implementación sigue siendo local, sin publicación.

Las propuestas de arquitectura y guías que siguen son referencias para evaluar, no trabajo autorizado ni páginas existentes.

## Objetivo y contexto

Atraer consultas comerciales de Argentina y ayudar a quienes buscan qué adhesivo o sellador usar. Trabajar dos recorridos: compradores mayoristas que buscan proveedores y usuarios que necesitan resolver una aplicación y encontrar dónde comprar.

La usuaria confirmó durante esta investigación que Pégalo importa y comercializa. El código y el README describen comercialización mayorista. Posicionar como «empresa argentina importadora y comercializadora de adhesivos y selladores» y trabajar búsquedas de proveedores y venta mayorista. No describir a Pégalo como fábrica ni atribuir fabricación nacional a sus productos.

## Skills encontradas y selección

Son skills de terceros del repositorio público `coreyhaines31/marketingskills`, no skills oficiales de Google ni de OpenAI. Se consultaron como referencias; no se ejecutaron sus instaladores.

| Skill | Qué aporta a Pégalo | Prioridad |
|---|---|---|
| [seo-audit](https://github.com/coreyhaines31/marketingskills/blob/main/skills/seo-audit/SKILL.md) | Revisar rastreo, indexación, enlaces, títulos y problemas técnicos antes de producir contenido. | Primera |
| [content-strategy](https://github.com/coreyhaines31/marketingskills/blob/main/skills/content-strategy/SKILL.md) | Organizar temas por necesidad de compra y preguntas sobre aplicaciones. | Primera |
| [schema](https://github.com/coreyhaines31/marketingskills/blob/main/skills/schema/SKILL.md) | Describir empresa, productos y navegación mediante datos estructurados fieles al contenido visible. | Segunda |
| [ai-seo](https://github.com/coreyhaines31/marketingskills/blob/main/skills/ai-seo/SKILL.md) | Revisar claridad de respuestas, comparaciones y respaldo técnico; aplicar únicamente recomendaciones verificadas. | Complementaria |

### Correcciones necesarias al usar estas skills

- Google no exige archivos para IA, `llms.txt` ni un schema especial para AI Overviews o AI Mode. El acceso para esas funciones de Search se gestiona mediante Googlebot; no confundirlo con Google-Extended. La skill de IA mezcla esos controles en algunas secciones. [Documentación de Google](https://developers.google.com/search/docs/appearance/ai-features).
- Las preguntas frecuentes siguen siendo contenido útil, pero Google retiró los resultados enriquecidos FAQ. No vender `FAQPage` como una forma de conseguir ese resultado. [Registro oficial de cambios](https://developers.google.com/search/updates).
- Para resultados de producto, Google exige `name` y al menos uno de `offers`, `review` o `aggregateRating`, con sus requisitos correspondientes. En un catálogo de consulta no inventar precio cero, disponibilidad ni reseñas. Un marcado descriptivo no garantiza elegibilidad para resultados enriquecidos. [Requisitos de Product](https://developers.google.com/search/docs/appearance/structured-data/product-snippet).
- No trasladar porcentajes de mejora o reglas rígidas de cantidad de palabras de una skill como garantías para esta web. Google recomienda contenido útil para personas, con aportes propios y organización natural. [Guía de Google para funciones generativas](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

## Hallazgos del proyecto local

| Hallazgo | Evidencia | Acción propuesta |
|---|---|---|
| Los detalles de producto se abren con botones y estado del cliente. | `app/home.tsx`: `setSelected`, `Dialog` y parámetro `?producto=` interpretado en `useEffect`. | Crear páginas estables por producto y enlaces HTML a ellas. Conservar los enlaces compartidos actuales mediante una transición compatible. |
| Parte del catálogo aparece después de «ver más». | `shownProducts = visible.slice(0, visibleCount)` en `app/home.tsx`. | Ofrecer acceso rastreable a todos los productos activos, mediante categorías o paginación con enlaces. |
| Hay título y descripción generales, pero no páginas de producto con metadatos propios. | `app/layout.tsx`; rutas de páginas actuales. | Título, descripción, encabezado y canonical por página relevante. |
| No se encontró implementación de sitemap, robots públicos ni JSON-LD en el código revisado. | Búsqueda en `app`, `server` y `public`. | Implementar según el dominio final y comprobar la respuesta publicada; esto no prueba ausencia en la web que ya está online. |
| El servidor espera al menos 2,4 segundos antes de devolver el contenido de la página. | `app/page.tsx`: `setTimeout(resolve, 2400)` junto a la carga del catálogo. | Revisar cómo conservar la animación sin retrasar la entrega del contenido. Medir antes y después; no hay diagnóstico de Core Web Vitals todavía. |
| Ya hay idioma `es-AR`, fotos, PDFs técnicos y contacto local. | `app/layout.tsx`, `app/products.ts`, `public/fichas`, `app/contact-locations.ts`. | Aprovecharlos para fichas HTML completas y contenido argentino consistente. |
| Administración ya declara `noindex`. | `app/admin/page.tsx`, `app/admin/activar/page.tsx`. | Mantener su exclusión de buscadores y del sitemap. |

Los enlaces a páginas deberían ser elementos `<a href="…">`: Google no suele activar botones para descubrir contenido. [Enlaces rastreables](https://developers.google.com/search/docs/crawling-indexing/links-crawlable). La revisión de la demora es una hipótesis de mejora de experiencia, pendiente de medición. [Experiencia de página](https://developers.google.com/search/docs/appearance/page-experience).

## Arquitectura propuesta

- `/`: presentación de la empresa y acceso a familias, guías y contacto.
- `/productos/`: catálogo completo con enlaces a productos.
- `/productos/silicona-neutra-pegalo/`: ejemplo de ficha individual.
- `/productos/sellador-zingueria-artesanato/`: ejemplo de ficha individual.
- `/adhesivos/` y `/selladores/`: selección por familia y aplicación.
- `/guias/`: índice de consejos y comparaciones.
- `/venta-mayorista/`: condiciones reales de compra, atención a ferreterías y distribuidores, consulta comercial.
- `/contacto/`: datos verificables y cobertura real.

Son rutas propuestas, no implementadas. Antes de publicar, inventariar las URLs del sitio anterior y asignar redirecciones permanentes a equivalentes reales. Elegir el dominio definitivo antes de generar canonical y sitemap. No crear páginas casi idénticas para cada ciudad.

Google recomienda una estructura comprensible, contenido útil y títulos descriptivos; un sitemap ayuda a descubrir URLs, pero no asegura indexación ni una posición concreta. [Guía inicial de SEO](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

## Búsquedas y contenidos iniciales

Estas son hipótesis editoriales basadas en el catálogo y una exploración pública, no una lista de consultas medidas en Search Console ni de «preguntas más buscadas».

| Búsqueda o pregunta propuesta | Página adecuada | Qué debe resolver |
|---|---|---|
| Adhesivos y selladores por mayor en Argentina | Venta mayorista | A quién vende, mínimos si existen, cobertura confirmada y cómo consultar. |
| Proveedor de adhesivos para ferreterías | Venta mayorista | Líneas disponibles, presentaciones y proceso comercial. |
| ¿Qué diferencia hay entre silicona neutra y acética? | Guía comparativa | Diferencias, compatibilidades y limitaciones según cada ficha técnica. |
| ¿Qué sellador usar para canaletas y zinguería? | Guía + producto de zinguería | Material, estado de la junta, preparación y elección respaldada. |
| ¿Con qué pegar una bacha a la mesada? | Guía + crema epoxi para bachas | Materiales compatibles, preparación, mezcla y curado documentados. |
| ¿Cuánto tarda en secar la silicona? | Guía + fichas relevantes | Diferenciar formación de piel y curado; explicar dependencia de producto, espesor y ambiente. |
| ¿Qué sellador se puede pintar? | Comparativa | Identificar productos y condiciones de pintado verificadas. |
| ¿Para qué sirve el adhesivo de contacto? | Ficha + guía | Aplicaciones, preparación, instrucciones y restricciones del producto. |
| ¿Qué pegamento usar para madera? | Guía + cola vinílica/contacto | Elegir según materiales, esfuerzos y exposición, sin recomendar un adhesivo universal. |
| ¿Dónde comprar Pégalo en Buenos Aires? | Contacto/distribuidores | Puntos reales de venta y modalidad de atención; no confundir oficina con local minorista. |

La comparación neutra/acética ya aparece en contenido de [Würth Argentina](https://www.wurth.com.ar/blog/siliconas/silicona-acetica-y-neutra-para-que-sirven-que-es-y-diferencias/). [Parsecs](https://www.parsecs.com.ar/product/sellador-de-poliuretano/) organiza información de selladores por aplicaciones. Son señales de temas trabajados por empresas del sector; no demuestran volumen ni permiten atribuir a Pégalo propiedades de productos ajenos.

## Cómo redactar cada ficha y guía

Ficha: nombre exacto, descripción directa, usos comprobados, materiales compatibles y excluidos, presentaciones, colores, modo de aplicación, curado y condiciones, ficha técnica descargable y consulta comercial. Usar datos del catálogo administrado vigente y PDFs verificados; el archivo de productos local no sustituye esa validación.

Guía: pregunta como título, respuesta clara al comienzo, explicación con ejemplos, tabla si facilita elegir, errores habituales y enlace al producto pertinente. Dar crédito al responsable técnico real que la revise, con fecha de actualización cuando haya cambios. No inventar certificaciones, resistencia térmica, aptitud alimentaria, aplicaciones en gas ni usos estructurales.

Ejemplo de título de inicio provisional: «Adhesivos y selladores en Argentina | Pégalo». Ejemplo de título de producto: «Silicona neutra Pégalo: usos y ficha técnica». La descripción debe resumir la página con lenguaje natural, sin acumular palabras clave.

## Presencia local y medición

Comprobar elegibilidad del Perfil de Empresa de Google y mantener nombre, dirección, teléfono y horarios reales consistentes con la web. El código registra Asamblea 4355, Santos Lugares, Buenos Aires; verificar modalidad de atención antes de promocionar visitas. La relevancia, distancia y prominencia influyen en resultados locales. [Ayuda oficial de Google](https://support.google.com/business/answer/7091?hl=es).

Al publicar, verificar Search Console, enviar el sitemap e inspeccionar una ficha, una guía y la portada. Medir consultas y páginas con impresiones y clics, filtrando Argentina; comparar períodos equivalentes. Registrar clics hacia WhatsApp y descargas como señales de interés, distinguiéndolos de mensajes enviados o ventas confirmadas. No hay acceso a estas métricas en esta investigación.

## Orden de implementación y comprobación

1. Mantener la actividad confirmada (importación y comercialización), definir dominio y relevar URLs existentes.
2. Crear fichas con contenido propio, enlaces rastreables y acceso al catálogo completo.
3. Configurar metadatos, canonical, sitemap y directivas de rastreo; validar HTML y códigos HTTP con el runtime Vinext del proyecto.
4. Publicar inicialmente tres guías revisadas: neutra/acética, zinguería y bachas; enlazarlas a productos.
5. Incorporar datos estructurados apropiados y probarlos con las herramientas de Google y Schema.org.
6. Revisar demora de portada y rendimiento móvil; comprobar que la experiencia visual conserva acceso al contenido.
7. Validar en Search Console tras la publicación y priorizar nuevas guías según consultas observadas y preguntas comerciales reales.

La investigación queda completada. Se implementó solo el alcance técnico sin cambios visuales descrito al inicio. Las ampliaciones de contenido y arquitectura requieren aprobación previa; la publicación queda pendiente. Ninguna skill puede garantizar el primer puesto.
