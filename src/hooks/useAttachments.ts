import { useState, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { addAttachmentToSnippet, deleteAttachmentQuery } from '../database/queries/attachments';
import { copyAttachmentToLocal, deleteAttachmentFile } from '../services/fileSystem';

export const useAttachments = () => {
  const db = useSQLiteContext();
  const [uploading, setUploading] = useState(false);

  const addAttachment = useCallback(async (snippetId: number, fileUri: string, fileName: string, mimeType: string, fileSize: number) => {
    setUploading(true);
    try {
      const savedPath = await copyAttachmentToLocal(fileUri, fileName);
      const attachmentId = await addAttachmentToSnippet(db, snippetId, fileName, savedPath, mimeType, fileSize);
      return { id: attachmentId, path: savedPath };
    } catch (err) {
      console.error('Failed to attach file:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [db]);

  const removeAttachment = useCallback(async (attachmentId: number, fileUri: string) => {
    try {
      await deleteAttachmentFile(fileUri);
      await deleteAttachmentQuery(db, attachmentId);
    } catch (err) {
      console.error('Failed to remove attachment:', err);
      throw err;
    }
  }, [db]);

  return { addAttachment, removeAttachment, uploading };
};\n