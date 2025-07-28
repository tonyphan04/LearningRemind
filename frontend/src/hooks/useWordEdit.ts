import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import type { Word } from "../types/common";

export function useWordEdit(
  vocabId?: string | null,
  word?: Word | null,
  setWord?: (w: Word) => void
) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ word: "", description: "", example: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (word) {
      setForm({
        word: word.word ?? "",
        description: word.description ?? "",
        example: word.example ?? "",
      });
    }
  }, [word]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    if (word) {
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
    if (!vocabId || !setWord) return;
    setSaving(true);
    try {
      await apiFetch(`/api/vocabs/${vocabId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setWord({ ...word!, ...form });
      setEditMode(false);
      setError(null);
      return { success: true };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  };
  return {
    editMode,
    form,
    handleEdit,
    handleCancel,
    handleChange,
    handleSave,
    saving,
    error,
    setError,
  };
}
