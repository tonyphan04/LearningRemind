import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import type { Word } from "../types/common";

export function useWordDetail() {
  const { vocabId, folderId } = useParams();
  const navigate = useNavigate();
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ word: "", description: "", example: "" });
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!vocabId) return;
    setLoading(true);
    apiFetch(`/api/vocabs/${vocabId}`)
      .then((data) => {
        setWord(data);
        setForm({
          word: data.word ?? "",
          description: data.description ?? "",
          example: data.example ?? "",
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [vocabId]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    // If in edit mode, cancel edit and go back to word list
    if (editMode) {
      navigate(`/view/folder?id=${folderId}`);
    } else {
      setEditMode(false);
      if (word)
        setForm({
          word: word.word ?? "",
          description: word.description ?? "",
          example: word.example ?? "",
        });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    try {
      await apiFetch(`/api/vocabs/${vocabId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setWord({ ...word!, ...form });
      setEditMode(false);
      setSnackbar({ message: "Word updated!", severity: "success" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setSnackbar({ message, severity: "error" });
    }
  };
  const handleDelete = async () => {
    if (!vocabId) return;
    try {
      await apiFetch(`/api/vocabs/${vocabId}`, { method: "DELETE" });
      setSnackbar({ message: "Word deleted!", severity: "success" });
      setTimeout(() => {
        navigate(`/view/folder/${folderId}?deleted=1`);
      }, 800);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setSnackbar({ message, severity: "error" });
    }
  };

  return {
    loading,
    error,
    word,
    editMode,
    form,
    snackbar,
    handleEdit,
    handleCancel,
    handleChange,
    handleSave,
    handleDelete,
    setError,
    setSnackbar,
  };
}
