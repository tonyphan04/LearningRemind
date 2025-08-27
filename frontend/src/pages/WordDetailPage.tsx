import React from "react";
import { useParams } from "react-router-dom";
import { useWordFetch } from "../hooks/useWordFetch";
import { useWordEdit } from "../hooks/useWordEdit";
import { useWordDelete } from "../hooks/useWordDelete";
import { useSnackbarState } from "../hooks/useSnackbarState";
import Spinner from "../components/Spinner";
import SnackbarMessage from "../components/SnackbarMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function WordDetailPage() {
  const { vocabId, folderId } = useParams();
  const { word, setWord, loading, error, setError } = useWordFetch(vocabId);
  const edit = useWordEdit(vocabId, word, setWord);
  const del = useWordDelete(vocabId, folderId);
  const { snackbar, setSnackbar } = useSnackbarState();

  React.useEffect(() => {
    if (edit.error) setSnackbar({ message: edit.error, severity: "error" });
    if (del.error) setSnackbar({ message: del.error, severity: "error" });
  }, [edit.error, del.error, setSnackbar]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center py-10">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
        {loading ? (
          <Spinner />
        ) : error ? (
          <SnackbarMessage
            open={!!error}
            message={error}
            severity="error"
            onClose={() => setError(null)}
          />
        ) : word ? (
          edit.editMode ? (
            <>
              <h2 className="text-2xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">
                Edit Word
              </h2>
              <form className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Word</label>
                  <Input
                    name="word"
                    value={edit.form.word}
                    onChange={edit.handleChange}
                    className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Input
                    name="description"
                    value={edit.form.description}
                    onChange={edit.handleChange}
                    className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Example
                  </label>
                  <Input
                    name="example"
                    value={edit.form.example}
                    onChange={edit.handleChange}
                    className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex gap-4 mt-2">
                  <Button
                    type="button"
                    onClick={handleSave}
                    className="w-32 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={edit.handleCancel}
                    className="w-32 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">
                {word.word}
              </h2>
              <div className="mb-3">
                <strong className="text-blue-600">Description</strong>
                <div>{word.description}</div>
              </div>
              <div className="mb-3">
                <strong className="text-blue-600">Example</strong>
                <div className="italic text-blue-500">{word.example}</div>
              </div>
              <div className="flex gap-4 mt-4">
                <Button
                  type="button"
                  onClick={edit.handleEdit}
                  className="w-32 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold"
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  className="w-32 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold"
                >
                  Delete
                </Button>
              </div>
            </>
          )
        ) : (
          <div>No word found.</div>
        )}
      </div>
      <SnackbarMessage
        open={!!snackbar}
        message={snackbar?.message || ""}
        severity={snackbar?.severity || "info"}
        onClose={() => setSnackbar(null)}
      />
    </div>
  );
}

export default WordDetailPage;
