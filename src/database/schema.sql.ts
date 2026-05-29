// src/database/schema.sql.ts

export const createTablesQuery = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS snippets (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    language TEXT NOT NULL,
    is_favorite INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS snippet_tags (
    snippet_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (snippet_id, tag_id),
    FOREIGN KEY (snippet_id) REFERENCES snippets (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS attachments (
    id TEXT PRIMARY KEY NOT NULL,
    snippet_id TEXT NOT NULL,
    file_uri TEXT NOT NULL,
    file_type TEXT NOT NULL,
    FOREIGN KEY (snippet_id) REFERENCES snippets (id) ON DELETE CASCADE
  );
`;