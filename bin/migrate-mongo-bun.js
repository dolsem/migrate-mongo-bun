import path from 'path';

let configFilename = 'migrate-mongo-config.ts';
const fileOptIx = process.argv.findIndex((arg) => ['-f', '--file'].includes(arg));
if (fileOptIx >= 0) {
  [, configFilename] = process.argv.splice(fileOptIx, 2);
}

const { default: config } = await import(path.join(process.cwd(), configFilename));
Object.assign(global, { config });

Bun.write(new URL(import.meta.resolve('migrate-mongo/samples/esm/migration.js')), `
import { migration } from 'migrate-mongo-bun';

export const up = migration(async (db, session) => {
  // migration here
});

export const down = migration(async (db, session) => {
  // rollback here
});
`.trimStart());
  
await import('migrate-mongo/bin/migrate-mongo');