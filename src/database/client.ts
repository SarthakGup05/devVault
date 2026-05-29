import * as SQLite from 'expo-sqlite';
import { migrate } from './migrations/01_init';

export const getDbInstance = async (): Promise<SQLite.SQLiteDatabase> => {
  return await SQLite.openDatabaseAsync('devvault.db');
};

export const initializeDatabase = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  await migrate(db);
};\n