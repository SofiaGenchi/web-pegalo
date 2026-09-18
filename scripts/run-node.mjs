import { loadEnvFile } from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
for (const file of ['../.env.mongodb.local', '../.env.node.local']) {
  try { loadEnvFile(new URL(file, import.meta.url)); }
  catch (error) { if(error.code !== 'ENOENT') throw error; }
}
const command = process.argv[2] || 'dev';
if (!['dev','build','start'].includes(command)) throw new Error('Comando inválido.');
const child = spawn(process.execPath, [fileURLToPath(new URL('../node_modules/vinext/dist/cli.js',import.meta.url)), command, ...process.argv.slice(3)], {stdio:'inherit',env:{...process.env,PEGALO_RUNTIME:'node'}});
for (const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>child.kill(signal));
child.on('exit',(code)=>{process.exitCode=code??1;});
