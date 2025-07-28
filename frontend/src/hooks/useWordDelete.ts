import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export function useWordDelete(vocabId?: string | null, folderId?: string | null) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleDelete = async () => {
    if (!vocabId) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/vocabs/${vocabId}`, { method: "DELETE" });
      setTimeout(() => {
        navigate(`/view/folder?id=${folderId}`);
      }, 800);
      setError(null);
      return { success: true };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      return { success: false, error: message };
    } finally {
      setDeleting(false);
    }
  };
  return { handleDelete, deleting, error, setError };
}
