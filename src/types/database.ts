export interface DbSnippet {
  id: number;
  title: string;
  code: string;
  description: string | null;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface DbTag {
  id: number;
  name: string;
}

export interface DbSnippetTag {
  snippet_id: number;
  tag_id: number;
}

export interface DbAttachment {
  id: number;
  snippet_id: number;
  file_name: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  created_at: string;
}

export interface DbExplanation {
  id: number;
  snippet_id: number;
  explanation: string;
  created_at: string;
}