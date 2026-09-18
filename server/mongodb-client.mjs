import { MongoClient } from 'mongodb';
import { mongoConfiguration } from './mongodb-config.mjs';
/** @type {Promise<import("mongodb").Db> | undefined} */
let connection;
/** @returns {Promise<import("mongodb").Db>} */
export async function mongoDatabase() {
  if (!connection) {
    const config = mongoConfiguration(process.env);
    const client = new MongoClient(config.uri, {...config.options, appName:'pegalo-admin',maxPoolSize:5});
    connection = client.connect().then(() => client.db(config.databaseName)).catch(async () => {
      connection = undefined; await client.close(); throw new Error('MongoDB no disponible.');
    });
  }
  return connection;
}
