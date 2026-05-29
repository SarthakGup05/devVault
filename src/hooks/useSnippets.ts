import { useState, useCallback } from 'react';
import { Snippet, PopulatedSnippet } from '../types';
import { getAllSnippets, getSnippetById, createSnippet, deleteSnippet } from '../database/queries/snippets';

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSnippets = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const data = getAllSnippets();
      setSnippets(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch snippets');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSnippet = useCallback((id: string): PopulatedSnippet | null => {
    try {
      return getSnippetById(id);
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  const addSnippet = useCallback((title: string, content: string, language: string) => {
    try {
      const id = Math.random().toString(36).substring(2, 9);
      const now = new Date().toISOString();
      const newSnippet: Snippet = {
        id,
        title,
        content,
        language,
        isFavorite: false,
        createdAt: now,
        updatedAt: now,
      };
      createSnippet(newSnippet);
      fetchSnippets();
      return id;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [fetchSnippets]);

  const removeSnippet = useCallback((id: string) => {
    try {
      deleteSnippet(id);
      fetchSnippets();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [fetchSnippets]);

  return { snippets, loading, error, fetchSnippets, getSnippetById: getSnippet, addSnippet, removeSnippet };
};