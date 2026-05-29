import { useState, useCallback } from 'react';
import { getAiApiKey, saveAiApiKey, deleteAiApiKey } from '../services/secureStore';
import { generateCodeExplanation } from '../services/ai';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const explainCode = useCallback(async (code: string, language: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = await getAiApiKey();
      if (!apiKey) {
        throw new Error('API Key missing. Please set it in Settings.');
      }
      const response = await generateCodeExplanation(code, language, apiKey);
      setExplanation(response.explanation);
      return response.explanation;
    } catch (err) {
      setError(err.message || 'Failed to explain code');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { explainCode, explanation, loading, error, getAiApiKey, saveAiApiKey, deleteAiApiKey };
};
