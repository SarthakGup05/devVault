// src/database/queries/attachments.ts
import { db } from '../client';
import { Attachment } from '../../types';

export const addAttachment = (attachment: Attachment): void => {
  db.runSync(
    'INSERT INTO attachments (id, snippet_id, file_uri, file_type) VALUES (?, ?, ?, ?)',
    [attachment.id, attachment.snippetId, attachment.fileUri, attachment.fileType]
  );
};

export const deleteAttachment = (id: string): void => {
  db.runSync('DELETE FROM attachments WHERE id = ?', [id]);
};