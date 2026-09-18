// Build a precise vector mask for the web UI; the source artwork stays intact.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
const { data, info } = await sharp('public/mascota-chat-3d.png').removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const size = width * height;
const outside = new Uint8Array(size);
const queue = new Int32Array(size);
let start = 0, end = 0;
function visit(index) {
  if (outside[index]) return;
  const offset = index * channels;
  const r = data[offset], g = data[offset + 1], b = data[offset + 2];
  // Only the near-white neutral backdrop qualifies. Cream-colored horns stay.
  if (Math.min(r, g, b) < 236 || Math.max(r, g, b) - Math.min(r, g, b) > 12) return;
  outside[index] = 1;
  queue[end++] = index;
}
for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x); }
for (let y = 0; y < height; y++) { visit(y * width); visit(y * width + width - 1); }
while (start < end) {
  const index = queue[start++], x = index % width, y = Math.floor(index / width);
  if (x) visit(index - 1);
  if (x < width - 1) visit(index + 1);
  if (y) visit(index - width);
  if (y < height - 1) visit(index + width);
}
// Trace all foreground spans as a vector path, preserving small hair details.
const spans = [];
for (let y = 0; y < height; y++) {
  let x = 0;
  while (x < width) {
    while (x < width && outside[y * width + x]) x++;
    const left = x;
    while (x < width && !outside[y * width + x]) x++;
    if (x > left) spans.push(`M${left} ${y}h${x-left}v1H${left}z`);
  }
}
await writeFile('public/pegui-silhouette.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path fill="white" d="${spans.join('')}"/></svg>\n`);
console.log(`Vector mask: ${width}×${height}; ${spans.length} contours.`);
