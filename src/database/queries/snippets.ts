import { SQLiteDatabase } from 'expo-sqlite';
import { DbSnippet, RichSnippet } from '../../types';

export const getAllSnippetsQuery = async (db: SQLiteDatabase): Promise<DbSnippet[]> => {
  return await db.getAllAsync<DbSnippet>('SELECT * FROM snippets ORDER BY updated_at DESC');
};

export const getSnippetByIdQuery = async (db: SQLiteDatabase, id: number): Promise<RichSnippet | null> => {
  const snippet = await db.getFirstAsync<DbSnippet>('SELECT * FROM snippets WHERE id = ?', [id]);
  if (!snippet) return null;

  const attachments = await db.getAllAsync<any>('SELECT * FROM attachments WHERE snippet_id = ?', [id]);
  const tags = await db.getAllAsync<any>(
    'SELECT t.* FROM tags t INNER JOIN snippet_tags st ON t.id = st.tag_id WHERE st.snippet_id = ?',
    [id]
  );
  const expRow = await db.getFirstAsync<any>('SELECT explanation FROM explanations WHERE snippet_id = ?', [id]);

  return {
    ...snippet,
    tags,
    attachments,
    explanation: expRow ? expRow.explanation : null,
  };
};

export const createSnippetQuery = async (
  db: SQLiteDatabase,
  title: string,
  code: string,
  description: string | null,
  language: string
): Promise<number> => {
  const result = await db.runAsync(
    'INSERT INTO snippets (title, code, description, language) VALUES (?, ?, ?, ?)',
    [title, code, description || '', language]
  );
  return result.lastInsertRowId;
};

export const updateSnippetQuery = async (
  db: SQLiteDatabase,
  id: number,
  title: string,
  code: string,
  description: string | null,
  language: string
): Promise<void> => {
  await db.runAsync(
    'UPDATE snippets SET title = ?, code = ?, description = ?, language = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, code, description || '', language, id]
  );
};

export const deleteSnippetQuery = async (db: SQLiteDatabase, id: number): Promise<void> => {
  await db.runAsync('DELETE FROM snippets WHERE id = ?', [id]);
};\n