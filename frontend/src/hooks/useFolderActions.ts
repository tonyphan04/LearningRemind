import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function useDeleteFolder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteFolder = async (folderId: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/folders/${folderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete folder");
        setLoading(false);
        return false;
      }
      setLoading(false);
      return true;
    } catch (err) {
      setError("Network error: " + err);
      setLoading(false);
      return false;
    }
  };

  return { deleteFolder, loading, error, setError };
}

export function useEditFolder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editFolder = async (folderId: string, updates: { name?: string; description?: string }) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/folders/${folderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to edit folder");
        setLoading(false);
        return false;
      }
      setLoading(false);
      return true;
    } catch (err) {
      setError("Network error: " + err);
      setLoading(false);
      return false;
    }
  };

  return { editFolder, loading, error, setError };
}
