// src/types/snippet.ts

export interface Snippet {
  id: string;              // UUID
  title: string;
  content: string;         // The actual code
  language: string;        // e.g., 'typescript', 'python'
  isFavorite: boolean;     // Will map to is_favorite (0/1) in SQLite
  createdAt: string;       // ISO Date string
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Attachment {
  id: string;
  snippetId: string;       // Foreign key mapping
  fileUri: string;         // Local file system path
  fileType: string;        // e.g., 'image/png'
}

// A combined type for the UI to consume easily
export interface PopulatedSnippet extends Snippet {
  tags: Tag[];
  attachments: Attachment[];
}