import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AddWordForm from "@/components/AddWordForm";
import { useFolders } from "@/hooks/useFolders";
import { useWords } from "@/hooks/useFolderWords";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";
import { useToast } from "../hooks/useToast";

const FolderWordsPage = () => {
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get("id");
  const { folders, loading: folderLoading, error: folderError } = useFolders();
  const folder = folders?.find((f) => String(f.id) === folderId);
  const folderName = folder?.name;
  const {
    words,
    loading: wordsLoading,
    error: wordsError,
    addWord,
  } = useWords(folderId);
  const navigate = useNavigate();
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const { showToast } = useToast();

  const handleAddWord = async (
    word: string,
    description: string,
    example: string
  ) => {
    const result = await addWord(word, description, example);
    if (result?.success) {
      setShowAddWordModal(false);
      showToast("Word added successfully!", "success");
    } else {
      showToast(result?.error || "Failed to add word", "error");
    }
  };

  // Show loading or error states
  if (folderLoading || wordsLoading) {
    return <LoadingSpinner size="lg" text="Loading folder contents..." />;
  }

  if (folderError || wordsError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg shadow-md">
        {folderError || wordsError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center py-10">
      <ErrorBoundary>
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="mr-2 border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Back
            </Button>
            <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight">
              {folderName || "Folder"}
            </h2>
          </div>

          <div className="flex justify-between mb-6">
            <Button
              onClick={() => setShowAddWordModal(!showAddWordModal)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {showAddWordModal ? "Cancel" : "Add Word"}
            </Button>
          </div>

          {showAddWordModal && (
            <div className="mb-6">
              <AddWordForm
                onSave={handleAddWord}
                onCancel={() => setShowAddWordModal(false)}
              />
            </div>
          )}

          {words && words.length > 0 ? (
            <div className="space-y-3">
              {words.map((word, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-5"
                >
                  <div className="font-bold text-lg text-blue-700 mb-1">
                    {word.word}
                  </div>
                  {word.description && (
                    <div className="text-gray-700 text-sm mb-1">
                      {word.description}
                    </div>
                  )}
                  {word.example && (
                    <div className="italic text-blue-500 text-sm">
                      Ex: {word.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 p-10">
              No words in this folder yet. Click "Add Word" to create one.
            </div>
          )}

          {(folderError || wordsError) && (
            <div className="text-red-500 text-center mt-6">
              {folderError || wordsError}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default FolderWordsPage;
