import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
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
const { readQuote, normalizeQuantity } = await moduleFrom(
  '../app/quote-data.ts',
);
const { distanceAtY } = await moduleFrom('../app/scroll-path.ts');
const { products, productFamilies } = await moduleFrom('../app/products.ts');
const known = new Set(products.map((p) => p.id));
const { quoteOptions, quotePresentation, quoteProductId } = await moduleFrom(
  '../app/product-presentations.ts',
);
test('quotes keep only the color and size combinations listed for each product', () => {
  const acetica = products.find((p) => p.id === 'acetica');
  const options = quoteOptions(acetica);
  assert.equal(options.length, 5);
  assert.ok(options.some((o) => o.label === '280 CC · blanca'));
  assert.ok(options.some((o) => o.label === '32 CC · transparente'));
  assert.ok(!options.some((o) => o.label === '32 CC · blanca'));
  const epoxy = quoteOptions(products.find((p) => p.id === 'epoxi'));
  assert.deepEqual(
    epoxy.map((o) => o.label),
    ['150 G · blanca', '200 G · acero'],
  );
  assert.equal(
    quotePresentation(acetica, 'acetica'),
    'Presentación a confirmar',
  );
});
test('two presentations of a product retain independent quantities across reloads', () => {
  const options = quoteOptions(products.find((p) => p.id === 'acetica'));
  const keys = new Set(['acetica', ...options.map((o) => o.key)]);
  const items = [
    { id: options[0].key, quantity: 12 },
    { id: options[1].key, quantity: 24 },
  ];
  assert.deepEqual(readQuote(JSON.stringify(items), keys), items);
  assert.equal(quoteProductId(items[0].id), 'acetica');
  assert.deepEqual(
    readQuote(
      JSON.stringify([{ id: 'acetica::inventado', quantity: 2 }]),
      keys,
    ),
    [],
  );
});
test('decimal measures and model descriptions are not split into invented variants', () => {
  const decimal = { id: 'sample', size: '1,5 L y 4 L', colors: '' };
  assert.deepEqual(
    quoteOptions(decimal).map((o) => o.label),
    ['1,5 L', '4 L'],
  );
  const bars = quoteOptions(products.find((p) => p.id === 'barras'));
  assert.deepEqual(
    bars.map((o) => o.label),
    [
      'Barras finas, 1 KG · Transparente',
      'Barras gruesas, 1 KG · Transparente',
    ],
  );
  for (const p of products) {
    const options = quoteOptions(p);
    assert.ok(options.length > 0);
    assert.equal(new Set(options.map((o) => o.key)).size, options.length, p.id);
  }
});
test('stored quotes reject corrupt JSON, invalid products and unexpected shapes', () => {
  for (const raw of ['broken', 'null', '{}', '42'])
    assert.deepEqual(readQuote(raw, known), []);
  assert.deepEqual(
    readQuote(
      JSON.stringify([
        null,
        {},
        'ciano-20',
        { id: 'unknown', quantity: 20 },
        { id: 'ciano-20', quantity: 24 },
      ]),
      known,
    ),
    [{ id: 'ciano-20', quantity: 24 }],
  );
});
test('quantities remain whole positive units within the supported range', () => {
  assert.equal(normalizeQuantity(0), 1);
  assert.equal(normalizeQuantity(-7), 1);
  assert.equal(normalizeQuantity(Infinity), 1);
  assert.equal(normalizeQuantity(NaN), 1);
  assert.equal(normalizeQuantity(12.8), 12);
  assert.equal(normalizeQuantity(100000), 9999);
  assert.deepEqual(
    readQuote(
      '[{"id":"acetica","quantity":12},{"id":"acetica","quantity":24}]',
      known,
    ),
    [{ id: 'acetica', quantity: 24 }],
  );
});
test('all catalog products have one family and an available local photograph', async () => {
  assert.equal(known.size, 23);
  for (const p of products) {
    assert.equal(
      productFamilies.filter((f) => f.ids.includes(p.id)).length,
      1,
      p.id,
    );
    await access(
      new URL('../public/productos/' + p.id + '.png', import.meta.url),
    );
  }
});
test('scroll tracking is bounded, reversible and interpolated between samples', () => {
  const samples = [
    { y: 100, distance: 0 },
    { y: 200, distance: 130 },
    { y: 500, distance: 600 },
  ];
  assert.equal(distanceAtY([], 200), 0);
  assert.equal(distanceAtY(samples, 0), 0);
  assert.equal(distanceAtY(samples, 150), 65);
  assert.equal(distanceAtY(samples, 350), 365);
  assert.equal(distanceAtY(samples, 1000), 600);
  assert.equal(distanceAtY(samples, 150), 65);
});

const { canManage, isPdf, isDocumentKind } = await moduleFrom(
  '../app/document-policy.ts',
);
test('document management denies anonymous, empty configuration and unlisted accounts', () => {
  assert.equal(canManage(null, 'admin@example.com'), false);
  assert.equal(canManage('admin@example.com', ''), false);
  assert.equal(canManage('other@example.com', 'admin@example.com'), false);
  assert.equal(canManage('ADMIN@example.com', ' admin@example.com '), true);
});
test('disabled document slots and PDF signatures reject arbitrary files', () => {
  assert.equal(isDocumentKind('../other'), false);
  assert.equal(isDocumentKind('precios'), false);
  assert.equal(isDocumentKind('promociones'), false);
  assert.equal(
    isPdf(new TextEncoder().encode('<script>not a pdf</script>')),
    false,
  );
  assert.equal(isPdf(new TextEncoder().encode('%PDF-1.7\n')), true);
});

const { shouldUseSimpleView, createViewDecision } = await moduleFrom(
  '../app/view-policy.ts',
);
test('automatic view honors reduced data, reduced motion and slow estimated networks', () => {
  for (const signals of [
    { saveData: true },
    { reducedMotion: true },
    { online: false },
    { effectiveType: 'slow-2g' },
    { effectiveType: '2g' },
    { effectiveType: '3g' },
    { downlink: 0.7 },
    { rtt: 700 },
  ])
    assert.equal(shouldUseSimpleView(signals), true);
  assert.equal(
    shouldUseSimpleView({ effectiveType: '4g', downlink: 10, rtt: 50 }),
    false,
  );
  assert.equal(shouldUseSimpleView({}), false);
  assert.equal(shouldUseSimpleView({ downlink: 0, rtt: 0 }), false);
  assert.equal(shouldUseSimpleView({ downlink: NaN, rtt: Infinity }), false);
});
test('network fluctuations cannot replace the view during a visit', () => {
  let current = { effectiveType: '3g' };
  const view = createViewDecision(() => current);
  assert.equal(view(), true);
  current = { effectiveType: '4g' };
  assert.equal(view(), true);
  assert.equal(createViewDecision(() => current)(), false);
});
