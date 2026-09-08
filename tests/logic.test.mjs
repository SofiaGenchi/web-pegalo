import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import ts from 'typescript';
async function moduleFrom(path) {
 const source=await readFile(new URL(path,import.meta.url),'utf8');
 const {outputText}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});
 return import('data:text/javascript;base64,'+Buffer.from(outputText).toString('base64'));
}
const {readQuote,normalizeQuantity}=await moduleFrom('../app/quote-data.ts');
const {distanceAtY}=await moduleFrom('../app/scroll-path.ts');
const {products,productFamilies}=await moduleFrom('../app/products.ts');
const known=new Set(products.map(p=>p.id));
test('stored quotes reject corrupt JSON, invalid products and unexpected shapes',()=>{
 for(const raw of ['broken','null','{}','42'])assert.deepEqual(readQuote(raw,known),[]);
 assert.deepEqual(readQuote(JSON.stringify([null,{},'ciano-20',{id:'unknown',quantity:20},{id:'ciano-20',quantity:24}]),known),[{id:'ciano-20',quantity:24}]);
});
test('quantities remain whole positive units within the supported range',()=>{
 assert.equal(normalizeQuantity(0),1);assert.equal(normalizeQuantity(-7),1);
 assert.equal(normalizeQuantity(Infinity),1);assert.equal(normalizeQuantity(NaN),1);
 assert.equal(normalizeQuantity(12.8),12);assert.equal(normalizeQuantity(100000),9999);
 assert.deepEqual(readQuote('[{"id":"acetica","quantity":12},{"id":"acetica","quantity":24}]',known),[{id:'acetica',quantity:24}]);
});
test('all catalog products have one family and an available local photograph',async()=>{
 assert.equal(known.size,23);
 for(const p of products){assert.equal(productFamilies.filter(f=>f.ids.includes(p.id)).length,1,p.id);await access(new URL('../public/productos/'+p.id+'.png',import.meta.url));}
});
test('scroll tracking is bounded, reversible and interpolated between samples',()=>{
 const samples=[{y:100,distance:0},{y:200,distance:130},{y:500,distance:600}];
 assert.equal(distanceAtY([],200),0);assert.equal(distanceAtY(samples,0),0);
 assert.equal(distanceAtY(samples,150),65);assert.equal(distanceAtY(samples,350),365);
 assert.equal(distanceAtY(samples,1000),600);
 assert.equal(distanceAtY(samples,150),65);
});
