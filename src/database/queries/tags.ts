import { SQLiteDatabase } from 'expo-sqlite';
import { DbTag } from '../../types';

export const getOrCreateTag = async (db: SQLiteDatabase, name: string): Promise<number> => {
  const cleanedName = name.trim().toLowerCase();
  const existing = await db.getFirstAsync<DbTag>('SELECT * FROM tags WHERE name = ?', [cleanedName]);
  if (existing) return existing.id;

  const result = await db.runAsync('INSERT INTO tags (name) VALUES (?)', [cleanedName]);
  return result.lastInsertRowId;
};

export const associateTagToSnippet = async (db: SQLiteDatabase, snippetId: number, tagId: number): Promise<void> => {
  await db.runAsync('INSERT OR IGNORE INTO snippet_tags (snippet_id, tag_id) VALUES (?, ?)', [snippetId, tagId]);
};

export const clearSnippetTags = async (db: SQLiteDatabase, snippetId: number): Promise<void> => {
  await db.runAsync('DELETE FROM snippet_tags WHERE snippet_id = ?', [snippetId]);
};\n