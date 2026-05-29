import * as SecureStore from 'expo-secure-store';

const API_KEY_STORAGE_KEY = 'DEVVAULT_AI_API_KEY';

export const saveAiApiKey = async (apiKey: string): Promise<void> => {
  await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, apiKey);
};

export const getAiApiKey = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
};

export const deleteAiApiKey = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
};\n