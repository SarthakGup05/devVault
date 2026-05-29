import { SQLiteDatabase } from 'expo-sqlite';
import { DbAttachment } from '../../types';

export const addAttachmentToSnippet = async (
  db: SQLiteDatabase,
  snippetId: number,
  fileName: string,
  filePath: string,
  mimeType: string,
  fileSize: number
): Promise<number> => {
  const result = await db.runAsync(
    'INSERT INTO attachments (snippet_id, file_name, file_path, mime_type, file_size) VALUES (?, ?, ?, ?, ?)',
    [snippetId, fileName, filePath, mimeType, fileSize]
  );
  return result.lastInsertRowId;
};

export const getAttachmentsBySnippetId = async (db: SQLiteDatabase, snippetId: number): Promise<DbAttachment[]> => {
  return await db.getAllAsync<DbAttachment>('SELECT * FROM attachments WHERE snippet_id = ?', [snippetId]);
};

export const deleteAttachmentQuery = async (db: SQLiteDatabase, id: number): Promise<void> => {
  await db.runAsync('DELETE FROM attachments WHERE id = ?', [id]);
};\n