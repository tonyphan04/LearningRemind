import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import type { Word } from "../types/common";

export function useWordFetch(vocabId?: string | null) {
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vocabId) return;
    setLoading(true);
    apiFetch(`/api/vocabs/${vocabId}`)
      .then((data) => setWord(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [vocabId]);

  return { word, setWord, loading, error, setError };
}
