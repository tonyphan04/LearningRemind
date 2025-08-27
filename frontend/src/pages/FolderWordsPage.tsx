import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AddWordForm from "@/components/AddWordForm";
import { useFolders } from "@/hooks/useFolders";
import { useWords } from "@/hooks/useFolderWords";
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
  const [message, setMessage] = useState("");

  const handleAddWord = async (
    word: string,
    description: string,
    example: string
  ) => {
    const result = await addWord(word, description, example);
    if (result?.success) {
      setShowAddWordModal(false);
      setMessage("");
    } else {
      setMessage(result?.error || "Failed to add word");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center py-10">
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
        {(folderLoading || wordsLoading) && (
          <p className="text-center text-blue-400 mb-4">Loading...</p>
        )}
        <Button
          onClick={() => setShowAddWordModal(true)}
          className="mb-6 bg-blue-600 text-white hover:bg-blue-700 w-full py-3 rounded-lg font-semibold"
        >
          Add Word
        </Button>
        {showAddWordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-blue-200">
              <h3 className="text-xl font-bold text-blue-700 mb-4">Add Word</h3>
              <AddWordForm
                onSave={handleAddWord}
                onCancel={() => setShowAddWordModal(false)}
              />
              {message && <p className="text-red-500 mt-4">{message}</p>}
            </div>
          </div>
        )}
        <div className="mt-8">
          {wordsLoading ? (
            <p className="text-blue-400">Loading words...</p>
          ) : words.length === 0 ? (
            <p className="text-blue-500">No words found in this folder.</p>
          ) : (
            <div className="flex flex-col gap-4">
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
          )}
        </div>
        {(message || folderError || wordsError) && (
          <p className="text-red-500 text-center mt-6">
            {message || folderError || wordsError}
          </p>
        )}
      </div>
    </div>
  );
};

export default FolderWordsPage;
