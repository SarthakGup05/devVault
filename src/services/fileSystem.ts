import * as FileSystem from 'expo-file-system/legacy';

export const copyAttachmentToLocal = async (sourceUri: string, filename: string): Promise<string> => {
  const destDir = FileSystem.documentDirectory + 'attachments/';
  const dirInfo = await FileSystem.getInfoAsync(destDir);
  
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });
  }
  
  const destUri = destDir + Date.now() + '_' + filename;
  await FileSystem.copyAsync({ from: sourceUri, to: destUri });
  return destUri;
};

export const deleteAttachmentFile = async (fileUri: string): Promise<void> => {
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(fileUri);
  }
};

export const exportDataAsJson = async (data: any, fileName: string): Promise<string> => {
  const fileUri = FileSystem.documentDirectory + fileName + '.json';
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2), {
    encoding: 'utf8',
  });
  return fileUri;
};
