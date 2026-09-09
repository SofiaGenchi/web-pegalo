import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
// Generates a local activation secret without printing it or committing it.
mkdirSync('work', { recursive: true });
const path = 'work/admin-activation.txt';
if (!existsSync(path)) writeFileSync(path, randomBytes(32).toString('hex') + '\n', { mode: 0o600 });
const secret = readFileSync(path, 'utf8').trim();
const vars = existsSync('.dev.vars') ? readFileSync('.dev.vars', 'utf8') : '';
writeFileSync('.dev.vars', vars.replace(/^ADMIN_SETUP_TOKEN=.*\n?/gm, '') + `\nADMIN_SETUP_TOKEN=${secret}\n`, { mode: 0o600 });
console.log('Clave privada guardada en work/admin-activation.txt. Activación local configurada.');
