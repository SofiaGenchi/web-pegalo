import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function moduleFrom(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return import(
    'data:text/javascript;base64,' + Buffer.from(outputText).toString('base64')
  );
}
const { products } = await moduleFrom('../app/products.ts');
const { productPath, productSlug, uniqueProducts } = await moduleFrom(
  '../app/product-links.ts',
);

test('every product has a stable readable URL, including products without a legacy URL', () => {
  for (const product of products) {
    assert.match(
      productPath(product),
      /^\/productos\/[a-z0-9]+(?:-[a-z0-9]+)*$/,
    );
    assert.equal(
      productPath({ ...product, name: 'Nombre comercial actualizado' }),
      productPath(product),
    );
  }
  assert.equal(
    productPath(products.find((p) => p.id === 'contacto')),
    '/productos/adhesivo-de-contacto-pegalo',
  );
});

test('cianoacrilato presentations share one page without merging other products', () => {
  const groups = new Map();
  for (const product of products) {
    const slug = productSlug(product);
    groups.set(slug, [...(groups.get(slug) ?? []), product.id]);
  }
  assert.deepEqual(groups.get('cianoacrilato-pegalo'), [
    'ciano-10',
    'ciano-20',
    'ciano-100',
  ]);
  assert.equal([...groups.values()].filter((ids) => ids.length > 1).length, 1);
  assert.equal(uniqueProducts(products).length, products.length - 2);
});

test('a remaining active presentation keeps the shared page in the catalog', () => {
  const active = products.filter(
    (p) => p.id !== 'ciano-10' && p.id !== 'ciano-20',
  );
  assert.equal(
    uniqueProducts(active).find(
      (p) => productSlug(p) === 'cianoacrilato-pegalo',
    ).id,
    'ciano-100',
  );
});
