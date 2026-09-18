# Pegui

Ilustración 3D: `public/mascota-chat-3d.png`. Generada con la herramienta integrada image_gen a partir del personaje proporcionado por la usuaria.

Prompt inicial: Transform this exact friendly Viking character into a polished 3D toy-like rendered mascot, preserving recognizable face, large bright red beard and mustache, black helmet with white horns with red bands and red center spike, brown fur shoulders, black outfit, belt, and thumbs-up pose. Waist-up centered square composition, entire horns and hand visible. Rounded dimensional forms, soft studio illumination, subtle glossy material highlights, warm approachable smile, readable at 90px. No text, border, extra props or watermark.

Prompt de la versión seleccionada: Preserve the character exactly, including pose, face, colors, lighting, horns and thumb. Replace the entire gray checkerboard background with a clean solid pure white (#FFFFFF) background. No checkerboard anywhere. Center the waist-up character in a square with white padding around horns and hands. High quality 3D toy render. No text.

La herramienta devolvió imágenes RGB incluso al solicitar transparencia. La web conserva el arte y aplica una máscara SVG al elemento de imagen, sin el recorte poligonal aproximado anterior. `public/pegui-silhouette.svg` define el contorno preciso. `node scripts/build-pegui-mask.mjs` regenera esa máscara desde el fondo neutro de la ilustración. Si cambia la imagen, regenerar y revisar especialmente los cuernos blancos sobre fondo azul.
