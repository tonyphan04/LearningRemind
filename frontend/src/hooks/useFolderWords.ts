import { useEffect, useState } from "react";
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
    // Use caching for folder data to avoid repeated requests
    apiFetch(`/api/folders/${folderId}`, {}, true, true)
      .then((data: { name: string }) => setFolderName(data.name))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [folderId]);

  return { folderName, loading, error };
}

export function useWords(folderId?: string | null) {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!folderId) return;
    setLoading(true);
    // Use caching for vocabulary list to avoid repeated requests
    apiFetch(`/api/vocabs?collectionId=${folderId}`, {}, true, true)
      .then((data: Word[]) => setWords(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [folderId]);

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

  // Add a manual refetch function for when we need to refresh data
  const fetchWords = () => {
    if (!folderId) return;
    setLoading(true);
    // Skip cache for manual refresh to ensure fresh data
    apiFetch(`/api/vocabs?collectionId=${folderId}`, {}, true, false)
      .then((data: Word[]) => setWords(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  return { words, loading, error, addWord, fetchWords };
}
