// src/database/queries/snippets.ts
import { db } from '../client';
import { Snippet, PopulatedSnippet, Tag, Attachment } from '../../types';

// Convert DB row to TypeScript object
const mapSnippetRow = (row: any): Snippet => ({
  id: row.id,
  title: row.title,
  content: row.content,
  language: row.language,
  isFavorite: row.is_favorite === 1,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getAllSnippets = (): Snippet[] => {
  const rows = db.getAllSync<any>('SELECT * FROM snippets ORDER BY updated_at DESC');
  return rows.map(mapSnippetRow);
};

export const getSnippetById = (id: string): PopulatedSnippet | null => {
  const row = db.getFirstSync<any>('SELECT * FROM snippets WHERE id = ?', [id]);
  if (!row) return null;

  const snippet = mapSnippetRow(row);

  // Fetch tags
  const tagRows = db.getAllSync<any>(
    `SELECT t.id, t.name FROM tags t 
     INNER JOIN snippet_tags st ON t.id = st.tag_id 
     WHERE st.snippet_id = ?`,
    [id]
  );
  const tags: Tag[] = tagRows.map(r => ({ id: r.id, name: r.name }));

  // Fetch attachments
  const attachmentRows = db.getAllSync<any>(
    `SELECT id, snippet_id, file_uri, file_type FROM attachments WHERE snippet_id = ?`,
    [id]
  );
  const attachments: Attachment[] = attachmentRows.map(r => ({
    id: r.id,
    snippetId: r.snippet_id,
    fileUri: r.file_uri,
    fileType: r.file_type,
  }));

  return {
    ...snippet,
    tags,
    attachments,
  };
};

export const createSnippet = (snippet: Snippet): void => {
  db.runSync(
    `INSERT INTO snippets (id, title, content, language, is_favorite, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      snippet.id,
      snippet.title,
      snippet.content,
      snippet.language,
      snippet.isFavorite ? 1 : 0,
      snippet.createdAt,
      snippet.updatedAt,
    ]
  );
};

export const updateSnippet = (snippet: Snippet): void => {
  db.runSync(
    `UPDATE snippets 
     SET title = ?, content = ?, language = ?, is_favorite = ?, updated_at = ? 
     WHERE id = ?`,
    [
      snippet.title,
      snippet.content,
      snippet.language,
      snippet.isFavorite ? 1 : 0,
      snippet.updatedAt,
      snippet.id,
    ]
  );
};

export const deleteSnippet = (id: string): void => {
  db.runSync('DELETE FROM snippets WHERE id = ?', [id]);
};