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
  const order=new Map(defaultContent.products.map((p,index)=>[p.id,index]));
  const sorted=[...previous.content.products].sort((a,b)=>(order.get(a.id)??Infinity)-(order.get(b.id)??Infinity));
  const changed=sorted.some((p,index)=>p.id!==previous.content.products[index].id);
  const content={...previous.content,products:sorted};
  if(!validateContent(content)) throw new Error('INVALID_CONTENT');
  if(changed){
    const {content:oldContent,revision,updatedBy,updatedAt}=previous;
    const result=await collection.updateOne({_id:'main',revision}, {
      $set:{content,updatedBy:'requested-product-order',updatedAt:new Date()},
      $inc:{revision:1},
      $push:{history:{$each:[{content:oldContent,revision,updatedBy,updatedAt}],$slice:-10}}
    });
    if(result.modifiedCount!==1) throw new Error('CONCURRENT_EDIT');
  }
  console.log(changed ? 'Orden actualizado en MongoDB. Datos de productos conservados.' : 'El catálogo ya tenía el orden solicitado.');
} catch {
  console.error('No se pudo completar la actualización del orden. Revisá conexión, validación o ediciones simultáneas.');
  process.exitCode=1;
} finally {await client.close();}
