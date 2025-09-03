import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCreateFolder } from "../hooks/useCreateFolder";

const CreatePage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { createFolder } = useCreateFolder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Folder name is required.", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await createFolder(name, description);
      if (result.id) {
        showToast("Folder created successfully!", "success");
        navigate("/view");
      } else {
        showToast(result.error || "Failed to create folder", "error");
      }
    } catch {
      // Catch any unexpected errors
      showToast("An error occurred while creating the folder", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center py-10">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
          <h2 className="text-2xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">
            Create New Folder
          </h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Folder Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 w-full py-3 rounded-lg font-semibold"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : "Create Folder"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => navigate("/view")}
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Back to Folders
            </Button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CreatePage;
