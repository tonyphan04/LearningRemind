import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDeleteFolder, useEditFolder } from "../hooks/useFolderActions";
import { useNavigate } from "react-router-dom";
import { useFolders } from "../hooks/useFolders";
import type { Folder } from "../types/common";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";
import { useToast } from "../hooks/useToast";

const ViewPage = () => {
  const { folders, loading, error, refetch } = useFolders();
  const {
    deleteFolder,
    loading: deleting,
    error: deleteError,
  } = useDeleteFolder();
  const {
    editFolder,
    loading: editing,
    error: editError,
  } = useEditFolder();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFolderId, setEditFolderId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleEditClick = (folder: Folder) => {
    setEditFolderId(String(folder.id));
    setEditName(folder.name);
    setEditDescription(folder.description || "");
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editFolderId) return;
    const success = await editFolder(editFolderId, {
      name: editName,
      description: editDescription,
    });
    if (success) {
      setEditDialogOpen(false);
      showToast("Folder updated successfully", "success");
      refetch();
    } else if (editError) {
      showToast(editError, "error");
    }
  };

  const handleDeleteClick = (folderId: string) => {
    setDeleteFolderId(folderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteFolderId) return;
    const success = await deleteFolder(deleteFolderId);
    if (success) {
      setDeleteDialogOpen(false);
      showToast("Folder deleted successfully", "success");
      refetch();
    } else if (deleteError) {
      showToast(deleteError, "error");
    }
  };

  const handleFolderClick = (folderId: string) => {
    navigate(`/view/folder?id=${folderId}`);
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading folders..." />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg shadow-md">
        {error}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-2xl font-extrabold text-blue-700 mb-6 tracking-tight">
              My Folders
            </h2>

            <div className="mb-6">
              <Button
                onClick={() => navigate("/create")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create New Folder
              </Button>
            </div>

            {folders && folders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-6 transition-shadow hover:shadow-md"
                  >
                    <h3
                      onClick={() => handleFolderClick(String(folder.id))}
                      className="text-xl font-bold text-blue-700 mb-2 cursor-pointer hover:text-blue-800"
                    >
                      {folder.name}
                    </h3>
                    {folder.description && (
                      <p className="text-gray-700 mb-4">{folder.description}</p>
                    )}
                    <div className="flex space-x-2 mt-4">
                      <Button
                        onClick={() => handleEditClick(folder)}
                        variant="outline"
                        size="sm"
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(String(folder.id))}
                        variant="destructive"
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-10">
                No folders found. Create your first folder to get started!
              </p>
            )}
          </div>
        </div>

        {/* Edit Dialog */}
        {editDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Edit Folder</h3>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 mb-3"
                placeholder="Folder Name"
              />
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 mb-4"
                placeholder="Description (optional)"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setEditDialogOpen(false)}
                  variant="outline"
                  className="border-gray-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEditSave} 
                  disabled={editing}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editing ? <LoadingSpinner size="sm" /> : "Save"}
                </Button>
              </div>
              {editError && (
                <p className="text-red-500 text-sm mt-2">{editError}</p>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Delete Folder</h3>
              <p className="mb-6">
                Are you sure you want to delete this folder? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setDeleteDialogOpen(false)}
                  variant="outline"
                  className="border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  variant="destructive"
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? <LoadingSpinner size="sm" /> : "Delete"}
                </Button>
              </div>
              {deleteError && (
                <p className="text-red-500 text-sm mt-2">{deleteError}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ViewPage;