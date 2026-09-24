import { Buffer } from 'node:buffer';
import { pbkdf2, randomBytes, createHash, timingSafeEqual } from 'node:crypto';
const iterations = 600000;
function derive(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) =>
    pbkdf2(password, salt, iterations, 32, 'sha256', (error, key) =>
      error ? reject(error) : resolve(Buffer.from(key)),
    ),
  );
}
export async function hashPassword(password: string) {
  const salt = Buffer.from(randomBytes(16)).toString('hex');
  return `pbkdf2-sha256$${iterations}$${salt}$${Buffer.from(await derive(password, salt)).toString('hex')}`;
}
export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, rounds, salt, hash] = encoded.split('$');
  if (
    algorithm !== 'pbkdf2-sha256' ||
    rounds !== String(iterations) ||
    !/^[a-f0-9]{32}$/.test(salt || '') ||
    !/^[a-f0-9]{64}$/.test(hash || '')
  )
    return false;
  return timingSafeEqual(
    await derive(password, salt),
    Buffer.from(hash, 'hex'),
  );
}
export const digest = (value: string) =>
  createHash('sha256').update(value).digest('hex');
export const randomToken = () => Buffer.from(randomBytes(32)).toString('hex');
