import { loadEnvFile } from 'node:process';
import { readFile } from 'node:fs/promises';
import { MongoClient } from 'mongodb';
import ts from 'typescript';
import { mongoConfiguration } from '../server/mongodb-config.mjs';
loadEnvFile(new URL('../.env.mongodb.local', import.meta.url));
const config=mongoConfiguration(process.env);
const client=new MongoClient(config.uri,config.options);
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
try {
  const productsUrl=moduleUrl(await readFile(new URL('../app/catalog/products.ts',import.meta.url),'utf8'));
  const source=(await readFile(new URL('../app/catalog/content-policy.ts',import.meta.url),'utf8')).replace("from './products'",`from '${productsUrl}'`);
  const {defaultContent,validateContent}=await import(moduleUrl(source));
  await client.connect();
  const collection=client.db(config.databaseName).collection('site_content');
  const previous=await collection.findOne({_id:'main'});
  if(!previous) throw new Error('MISSING_CONTENT');
  let changed=0;
  const content={...previous.content,products:previous.content.products.map(p=>{
    if (!['lubricante', 'flexitapa'].includes(p.id)) return p;
    const pdf=defaultContent.products.find(d=>d.id===p.id)?.technicalPdf;
    if(!pdf || pdf===p.technicalPdf) return p;
    changed++; return {...p,technicalPdf:pdf};
  })};
  if(!validateContent(content)) throw new Error('INVALID_CONTENT');
  if(changed){
    const {content:oldContent,revision,updatedBy,updatedAt}=previous;
    const result=await collection.updateOne({_id:'main',revision}, {
      $set:{content,updatedBy:'bundled-technical-documents',updatedAt:new Date()},
      $inc:{revision:1},
      $push:{history:{$each:[{content:oldContent,revision,updatedBy,updatedAt}],$slice:-10}}
    });
    if(result.modifiedCount!==1) throw new Error('CONCURRENT_EDIT');
  }
  console.log(`${changed} enlaces de documentos actualizados. Otros datos conservados.`);
} catch {
  console.error('No se pudo completar la actualización de fichas. Revisá conexión, validación o ediciones simultáneas.');
  process.exitCode=1;
} finally {await client.close();}
