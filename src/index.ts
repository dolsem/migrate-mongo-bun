import type { Db, MongoClient, ClientSession } from 'mongodb';
import type { config as c } from 'migrate-mongo';

export type Config = c.Config;

export const migration = (run: (db: Db, session: ClientSession) => Promise<void>) => async (db: Db, client: MongoClient) => {
    const session = client.startSession();
    try {
      await run(db, session);
    } finally {
      await session.endSession();
    }
  };