import * as Sharing from 'expo-sharing';

export const shareLocalFile = async (fileUri: string, dialogTitle: string): Promise<void> => {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Native sharing is not available on this device');
  }
  await Sharing.shareAsync(fileUri, { dialogTitle });
};\n