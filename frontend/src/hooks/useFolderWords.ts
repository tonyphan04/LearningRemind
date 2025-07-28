import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api";

export interface Word {
  id: number;
  word: string;
  description?: string;
  example?: string;
}

export function useFolder(folderId?: string | null) {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!folderId) return;
    setLoading(true);
    apiFetch(`/api/folders/${folderId}`)
      .then((data) => setFolderName(data.name))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [folderId]);

  return { folderName, loading, error };
}

export function useWords(folderId?: string | null) {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWords = useCallback(() => {
    if (!folderId) return;
    setLoading(true);
    apiFetch(`/api/vocabs?collectionId=${folderId}`)
      .then((data) => setWords(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [folderId]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const addWord = async (word: string, description: string, example: string) => {
    if (!folderId) return;
    try {
      const data = await apiFetch(
        "/api/vocabs",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            collectionId: Number(folderId),
            word,
            description,
            example,
          }),
        }
      );
      setWords((prev) => [...prev, { id: data.id, word, description, example }]);
      return { success: true };
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return { words, loading, error, fetchWords, addWord };
}
