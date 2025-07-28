import { useState } from "react";
import { apiFetch } from "../api";
import type { Word } from "../types/common";

export function useCreateFolder() {
  const [folderId, setFolderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const createFolder = async (name: string, description: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await apiFetch(
        "/api/folders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        }
      );
      setFolderId(data.id || data.folder?.id);
      setSuccess("Folder created!");
      return { id: data.id || data.folder?.id };
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { folderId, createFolder, loading, error, success };
}

export function useAddWordToFolder(folderId: number | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [words, setWords] = useState<Word[]>([]);

  const addWord = async (word: string, description: string, example: string) => {
    if (!folderId) return { error: "No folderId" };
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await apiFetch(
        "/api/vocabs",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            collectionId: folderId,
            word,
            description,
            example,
          }),
        }
      );
      setWords((prev) => [
        ...prev,
        { id: Date.now(), word, description, example },
      ]);
      setSuccess("Word added!");
      return { success: true };
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { addWord, words, loading, error, success };
}
