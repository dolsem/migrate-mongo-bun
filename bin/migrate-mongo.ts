import path from 'path';

let configFilename = 'migrate-mongo-config.ts';
let argv = [...process.argv];
const fileOptIx = argv.findIndex((arg) => ['-f', '--file'].includes(arg));
if (fileOptIx >= 0) {
  [, configFilename] = argv.splice(fileOptIx, 2);
}

const { default: config } = await import(path.join(process.cwd(), configFilename));
Object.assign(global, { config });

Bun.write(new URL(import.meta.resolve('migrate-mongo/samples/esm/migration.js')), `
import { migration } from 'migrate-mongo-ts';

export const up = migration(async (db, session) => {
  // migration here
});

export const down = migration(async (db, session) => {
  // rollback here
});
  `);
  
await import('migrate-mongo/bin/migrate-mongo' as any);