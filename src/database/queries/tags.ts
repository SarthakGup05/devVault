// src/database/queries/tags.ts
import { db } from '../client';
import { Tag } from '../../types';

export const getOrCreateTag = (name: string): Tag => {
  const cleanedName = name.trim().toLowerCase();
  const existing = db.getFirstSync<any>('SELECT * FROM tags WHERE name = ?', [cleanedName]);
  if (existing) {
    return { id: existing.id, name: existing.name };
  }

  // Generate simple unique ID
  const id = Math.random().toString(36).substring(2, 9);
  db.runSync('INSERT INTO tags (id, name) VALUES (?, ?)', [id, cleanedName]);
  return { id, name: cleanedName };
};

export const associateTagToSnippet = (snippetId: string, tagId: string): void => {
  db.runSync('INSERT OR IGNORE INTO snippet_tags (snippet_id, tag_id) VALUES (?, ?)', [snippetId, tagId]);
};

export const clearSnippetTags = (snippetId: string): void => {
  db.runSync('DELETE FROM snippet_tags WHERE snippet_id = ?', [snippetId]);
};