import { useState, useCallback } from 'react';
import { addAttachment, deleteAttachment } from '../database/queries/attachments';
import { copyAttachmentToLocal, deleteAttachmentFile } from '../services/fileSystem';
import { Attachment } from '../types';

export const useAttachments = () => {
  const [uploading, setUploading] = useState(false);

  const handleAddAttachment = useCallback(async (snippetId: string, fileUri: string, fileType: string) => {
    setUploading(true);
    try {
      const fileName = fileUri.split('/').pop() || 'file';
      const savedPath = await copyAttachmentToLocal(fileUri, fileName);
      const id = Math.random().toString(36).substring(2, 9);
      const attachment: Attachment = {
        id,
        snippetId,
        fileUri: savedPath,
        fileType,
      };
      addAttachment(attachment);
      return attachment;
    } catch (err) {
      console.error('Failed to attach file:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const handleRemoveAttachment = useCallback(async (attachmentId: string, fileUri: string) => {
    try {
      await deleteAttachmentFile(fileUri);
      deleteAttachment(attachmentId);
    } catch (err) {
      console.error('Failed to remove attachment:', err);
      throw err;
    }
  }, []);

  return { addAttachment: handleAddAttachment, removeAttachment: handleRemoveAttachment, uploading };
};