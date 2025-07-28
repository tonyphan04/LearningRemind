import { useParams } from "react-router-dom";
import { useWordFetch } from "./useWordFetch";
import { useWordEdit } from "./useWordEdit";
import { useWordDelete } from "./useWordDelete";
import { useSnackbarState } from "./useSnackbarState";
import { useEffect } from "react";

export function useWordDetail() {
  const { vocabId, folderId } = useParams();
  const { word, setWord, loading, error, setError } = useWordFetch(vocabId);
  const edit = useWordEdit(vocabId, word, setWord);
  const del = useWordDelete(vocabId, folderId);
  const { snackbar, setSnackbar } = useSnackbarState();

  // Compose error and snackbar logic for UI
  useEffect(() => {
    if (edit.error) setSnackbar({ message: edit.error, severity: "error" });
    if (del.error) setSnackbar({ message: del.error, severity: "error" });
  }, [edit.error, del.error, setSnackbar]);

  // Wrap save and delete to show snackbar on success
  const handleSave = async () => {
    const result = await edit.handleSave();
    if (result?.success)
      setSnackbar({ message: "Word updated!", severity: "success" });
  };
  const handleDelete = async () => {
    const result = await del.handleDelete();
    if (result?.success)
      setSnackbar({ message: "Word deleted!", severity: "success" });
  };

  return {
    loading,
    error,
    word,
    editMode: edit.editMode,
    form: edit.form,
    snackbar,
    handleEdit: edit.handleEdit,
    handleCancel: edit.handleCancel,
    handleChange: edit.handleChange,
    handleSave,
    handleDelete,
    setError,
    setSnackbar,
  };
}
