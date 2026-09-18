import { loadEnvFile } from 'node:process';
import { MongoClient } from 'mongodb';
import { mongoConfiguration } from '../server/mongodb-config.mjs';
try { loadEnvFile(new URL('../.env.mongodb.local', import.meta.url)); }
catch { console.error('Falta el archivo privado .env.mongodb.local.'); process.exit(1); }
let client;
try {
  const config = mongoConfiguration(process.env);
  client = new MongoClient(config.uri, config.options);
  await client.connect();
  const db = client.db(config.databaseName);
  await db.command({ ping: 1 });
  // Read only, with no document contents or credentials printed to the terminal.
  await db.listCollections({}, { nameOnly: true }).toArray();
  console.log('Conexión segura a MongoDB Atlas correcta. Acceso de lectura a pegalo verificado.');
  console.log('Esta comprobación no crea usuarios ni modifica registros. Los permisos de escritura todavía deben verificarse.');
} catch (error) {
  const messages = {
    MISSING_CONFIGURATION: 'Completá MONGODB_URI y MONGODB_PASSWORD en .env.mongodb.local.',
    INVALID_URI: 'Pegá la conexión mongodb+srv:// original de tu clúster Atlas.',
    INVALID_CREDENTIALS: 'Revisá el usuario de la conexión y la contraseña técnica.',
  };
  const message = messages[error.message] || (error.code === 18 ? 'Atlas rechazó el usuario o la contraseña.' : error.code === 13 ? 'El usuario no tiene los permisos necesarios sobre pegalo.' : 'No se pudo conectar. Revisá el clúster, la contraseña y la IP autorizada en Atlas.');
  console.error(message);
  // Do not log raw driver errors: they may contain connection information.
  process.exitCode = 1;
} finally { await client?.close(); }
