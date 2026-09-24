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
  await client.connect(); const db=client.db(config.databaseName);
  await db.collection('admin_users').createIndex({username:1},{unique:true,name:'unique_username'});
  await db.collection('admin_sessions').createIndex({expiresAt:1},{expireAfterSeconds:0,name:'session_expiration'});
  await db.collection('admin_attempts').createIndex({expiresAt:1},{expireAfterSeconds:0,name:'attempt_expiration'});
  const productsUrl=moduleUrl(await readFile(new URL('../app/catalog/products.ts',import.meta.url),'utf8'));
  const source=(await readFile(new URL('../app/catalog/content-policy.ts',import.meta.url),'utf8')).replace("from './products'",`from '${productsUrl}'`);
  const {defaultContent,validateContent}=await import(moduleUrl(source));
  if(!validateContent(defaultContent)) throw new Error('INVALID_INITIAL_CONTENT');
  const result=await db.collection('site_content').updateOne({_id:'main'},{$setOnInsert:{content:defaultContent,revision:0,updatedBy:'initialization',updatedAt:new Date(),history:[]}},{upsert:true});
  console.log(result.upsertedCount ? 'Catálogo inicial guardado en MongoDB Atlas.' : 'El contenido remoto existente se conservó.');
  const user=await db.collection('admin_users').findOne({_id:'initial-admin'},{projection:{_id:1}});
  console.log(user ? 'La cuenta administradora ya existe.' : 'Base lista. Falta crear la cuenta en /admin/activar.');
  console.log('Índices de usuarios y vencimiento de sesiones configurados.');
} catch(e) {
  console.error(e.code===13 ? 'Atlas rechazó la escritura. Revisá readWrite sobre pegalo.' : 'No se pudo inicializar MongoDB. No se reemplazó el contenido existente.');process.exitCode=1;
} finally {await client.close();}
