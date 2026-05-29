import { useState, useCallback } from 'react';
import { getAiApiKey, saveAiApiKey, deleteAiApiKey } from '../services/secureStore';
import { generateCodeExplanation, generateCodeSuggestion } from '../services/ai';

const getOfflineSuggestion = (code: string, title: string, language: string): string => {
  const cleanLang = language.toLowerCase();
  const cleanTitle = title.toLowerCase();
  const cleanCode = code.trim();

  // If user hasn't written any code yet, provide a starter structure
  if (cleanCode.length === 0) {
    if (cleanLang === 'typescript' || cleanLang === 'javascript') {
      if (cleanTitle.includes('fetch') || cleanTitle.includes('api') || cleanTitle.includes('get')) {
        return 'const response = await fetch(url);\nconst data = await response.json();\nreturn data;';
      }
      if (cleanTitle.includes('react') || cleanTitle.includes('component')) {
        return 'export const MyComponent = () => {\n  return (\n    <View>\n      <Text>Snippet</Text>\n    </View>\n  );\n};';
      }
      return 'const init = () => {\n  console.log("DevVault Snippet initialized");\n};';
    }
    if (cleanLang === 'python') {
      if (cleanTitle.includes('request') || cleanTitle.includes('api') || cleanTitle.includes('get')) {
        return 'response = requests.get(url)\ndata = response.json()\nreturn data';
      }
      if (cleanTitle.includes('file') || cleanTitle.includes('read')) {
        return 'with open(filename, "r") as f:\n    data = f.read()\nreturn data';
      }
      return 'def main():\n    print("Hello from DevVault Python Snippet!")\n\nif __name__ == "__main__":\n    main()';
    }
    if (cleanLang === 'sql') {
      return 'SELECT * FROM users WHERE active = 1 ORDER BY created_at DESC;';
    }
    if (cleanLang === 'html') {
      return '<div class="container">\n  <h1>DevVault Snippet</h1>\n</div>';
    }
    if (cleanLang === 'css') {
      return '.container {\n  padding: 16px;\n  background-color: #1e1e2e;\n}';
    }
    return '// Happy coding!';
  }

  // If the user has already written some code, suggest relevant single-line additions
  if (cleanLang === 'typescript' || cleanLang === 'javascript') {
    if (cleanCode.endsWith('{') || cleanCode.endsWith('=>')) {
      return '\n  console.log("Executed block");';
    }
    if (cleanCode.includes('fetch(') && !cleanCode.includes('json()')) {
      return '\nconst data = await response.json();';
    }
    if (cleanCode.endsWith('=')) {
      return ' await fetch(url);';
    }
    return '\nconsole.log("Current state:", state);';
  }
  if (cleanLang === 'python') {
    if (cleanCode.endsWith(':')) {
      return '\n    print("Inside block")';
    }
    if (cleanCode.includes('requests.get(') && !cleanCode.includes('json()')) {
      return '\ndata = response.json()';
    }
    return '\nprint(f"Debug context: {context}")';
  }
  if (cleanLang === 'sql') {
    if (cleanCode.toLowerCase().endsWith('select')) {
      return ' * FROM users;';
    }
    if (cleanCode.toLowerCase().endsWith('from')) {
      return ' users WHERE id = 1;';
    }
    return '\nLIMIT 10;';
  }

  return '';
};

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
    } catch (err: any) {
      setError(err.message || 'Failed to explain code');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSuggestion = useCallback(async (code: string, title: string, language: string) => {
    try {
      const apiKey = await getAiApiKey();
      if (!apiKey) {
        return getOfflineSuggestion(code, title, language);
      }
      return await generateCodeSuggestion(code, title, language, apiKey);
    } catch (err: any) {
      console.warn('AI Suggestion failed, falling back to offline:', err);
      return getOfflineSuggestion(code, title, language);
    }
  }, []);

  return { explainCode, getSuggestion, explanation, loading, error, getAiApiKey, saveAiApiKey, deleteAiApiKey };
};
