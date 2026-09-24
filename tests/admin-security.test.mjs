import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFile } from 'node:fs/promises';
async function load(path) {
  let source = await readFile(new URL(path, import.meta.url), 'utf8');
  if (path.endsWith('content-policy.ts')) {
    const products = await load('../app/catalog/products.ts');
    source = source.replace(/import \{ products, productFamilies, type Product \} from '.\/products';/, `const products = ${JSON.stringify(products.products)}; const productFamilies = ${JSON.stringify(products.productFamilies)};`);
  }
  return import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64'));
}
const { hashPassword, verifyPassword } = await load('../parked-admin/password.ts');
const { validateContent, defaultContent } = await load('../app/catalog/content-policy.ts');
await test('passwords use independent salts and reject incorrect passwords and damaged hashes', async () => {
  const password = 'test-only-long-passphrase';
  const first = await hashPassword(password), second = await hashPassword(password);
  assert.notEqual(first, second); assert.ok(!first.includes(password));
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword('incorrect', first), false);
  assert.equal(await verifyPassword(password, 'broken'), false);
});
await test('content rejects script URLs, duplicate IDs and invalid distributor coordinates', () => {
  assert.equal(validateContent(defaultContent), true);
  for (const mutation of [c => { c.products[0].image = 'javascript:alert(1)'; }, c => { c.products[0].technicalPdf = 'https://evil.example/file'; }, c => c.products.push(c.products[0])]) {
    const c = structuredClone(defaultContent); mutation(c); assert.equal(validateContent(c), false);
  }
  const distributor = { id:'local', name:'Local', address:'Calle 123', locality:'Ciudad', province:'Buenos Aires', latitude:-34.6, longitude:-58.55, phone:'+54 11 1234', email:'', active:true };
  assert.equal(validateContent({ ...defaultContent, distributors:[distributor] }), true);
  assert.equal(validateContent({ ...defaultContent, distributors:[{ ...distributor, latitude:0 }] }), false);
});
