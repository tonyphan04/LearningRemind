import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWordFetch } from "../hooks/useWordFetch";
import { useWordEdit } from "../hooks/useWordEdit";
import { useWordDelete } from "../hooks/useWordDelete";
import { useToast } from "../hooks/useToast";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function WordDetailPage() {
  const { vocabId, folderId } = useParams();
  const { word, setWord, loading, error } = useWordFetch(vocabId);
  const edit = useWordEdit(vocabId, word, setWord);
  const del = useWordDelete(vocabId, folderId);
  const { showToast } = useToast();

  useEffect(() => {
    if (edit.error) showToast(edit.error, "error");
    if (del.error) showToast(del.error, "error");
  }, [edit.error, del.error, showToast]);

  const handleSave = async () => {
    const result = await edit.handleSave();
    if (result?.success) {
      showToast("Word updated successfully!", "success");
    }
  };

  const handleDelete = async () => {
    const result = await del.handleDelete();
    if (result?.success) {
      showToast("Word deleted successfully!", "success");
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading word details..." />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg shadow-md">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center py-10">
      <ErrorBoundary>
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
          {word ? (
            edit.editMode ? (
              <>
                <h2 className="text-2xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">
                  Edit Word
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Word
                    </label>
                    <Input
                      name="word"
                      value={edit.form.word || ""}
                      onChange={edit.handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Input
                      name="description"
                      value={edit.form.description || ""}
                      onChange={edit.handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Example
                    </label>
                    <Input
                      name="example"
                      value={edit.form.example || ""}
                      onChange={edit.handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={handleSave}
                      className="bg-blue-600 text-white hover:bg-blue-700 flex-1"
                      disabled={edit.saving}
                    >
                      {edit.saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={edit.handleCancel}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-blue-700 mb-2">
                  {word.word}
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  {word.description || "No description"}
                </p>
                {word.example && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-8">
                    <h2 className="text-sm text-blue-700 uppercase font-bold mb-1">
                      Example
                    </h2>
                    <p className="text-blue-800 italic">{word.example}</p>
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button
                    onClick={edit.handleEdit}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    className="bg-red-600 text-white hover:bg-red-700"
                    disabled={del.deleting}
                  >
                    {del.deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </>
            )
          ) : (
            <div className="text-center text-gray-500">Word not found</div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default WordDetailPage;
