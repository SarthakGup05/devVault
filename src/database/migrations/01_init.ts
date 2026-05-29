import { SQLiteDatabase } from 'expo-sqlite';
import {
  CREATE_SNIPPETS_TABLE,
  CREATE_TAGS_TABLE,
  CREATE_SNIPPET_TAGS_TABLE,
  CREATE_ATTACHMENTS_TABLE,
  CREATE_EXPLANATIONS_TABLE
} from '../schema.sql';

export const migrate = async (db: SQLiteDatabase): Promise<void> => {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    ${CREATE_SNIPPETS_TABLE}
    ${CREATE_TAGS_TABLE}
    ${CREATE_SNIPPET_TAGS_TABLE}
    ${CREATE_ATTACHMENTS_TABLE}
    ${CREATE_EXPLANATIONS_TABLE}
  `);
};