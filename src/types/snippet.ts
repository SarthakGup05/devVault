import { DbSnippet, DbAttachment, DbTag } from './database';

export interface RichSnippet extends DbSnippet {
  tags: DbTag[];
  attachments: DbAttachment[];
  explanation: string | null;
}\n