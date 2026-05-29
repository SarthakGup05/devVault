import { useState, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { DbSnippet, RichSnippet } from '../types';
import { getAllSnippetsQuery, getSnippetByIdQuery, createSnippetQuery, deleteSnippetQuery } from '../database/queries/snippets';

export const useSnippets = () => {
  const db = useSQLiteContext();
  const [snippets, setSnippets] = useState<DbSnippet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSnippets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllSnippetsQuery(db);
      setSnippets(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch snippets');
    } finally {
      setLoading(false);
    }
  }, [db]);

  const getSnippetById = useCallback(async (id: number): Promise<RichSnippet | null> => {
    try {
      return await getSnippetByIdQuery(db, id);
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [db]);

  const addSnippet = useCallback(async (title: string, code: string, desc: string | null, lang: string) => {
    try {
      const id = await createSnippetQuery(db, title, code, desc, lang);
      await fetchSnippets();
      return id;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [db, fetchSnippets]);

  const removeSnippet = useCallback(async (id: number) => {
    try {
      await deleteSnippetQuery(db, id);
      await fetchSnippets();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [db, fetchSnippets]);

  return { snippets, loading, error, fetchSnippets, getSnippetById, addSnippet, removeSnippet };
};\n