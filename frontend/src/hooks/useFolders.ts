import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import type { Folder } from "../types/common";

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = () => {
    setLoading(true);
    apiFetch("/api/folders")
      .then((data) => setFolders(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { folders, loading, error, refetch: fetchFolders };
}
