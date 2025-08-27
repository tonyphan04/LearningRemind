import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDeleteFolder, useEditFolder } from "../hooks/useFolderActions";
import { useNavigate } from "react-router-dom";
import { useFolders } from "../hooks/useFolders";
import type { Folder } from "../types/common";
import Spinner from "../components/Spinner";
import SnackbarMessage from "../components/SnackbarMessage";

const ViewPage: React.FC = () => {
  const { folders, loading, error, refetch } = useFolders();
  const {
    deleteFolder,
    loading: deleting,
    error: deleteError,
    setError: setDeleteError,
  } = useDeleteFolder();
  const {
    editFolder,
    loading: editing,
    error: editError,
    setError: setEditError,
  } = useEditFolder();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFolderId, setEditFolderId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);
  const handleEditClick = (folder: Folder) => {
    setEditFolderId(String(folder.id));
    setEditName(folder.name);
    setEditDescription(folder.description || "");
    setEditDialogOpen(true);
    setEditError("");
  };

  const handleEditSave = async () => {
    if (!editFolderId) return;
    const success = await editFolder(editFolderId, {
      name: editName,
      description: editDescription,
    });
    if (success) {
      setEditDialogOpen(false);
      setSuccessMessage("Folder updated successfully.");
      refetch();
    }
  };

  const handleDeleteClick = (folderId: number | string) => {
    setDeleteFolderId(String(folderId));
    setDeleteDialogOpen(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteFolderId) return;
    const success = await deleteFolder(deleteFolderId);
    if (success) {
      setDeleteDialogOpen(false);
      setSuccessMessage("Folder deleted successfully.");
      refetch();
    }
  };
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  React.useEffect(() => {
    if (error) setSnackbarOpen(true);
  }, [error]);

  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center py-10">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-10 border border-blue-100 text-center z-10">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Your Folders
        </h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {loading ? (
            <Spinner />
          ) : folders.length === 0 ? (
            <p className="w-full text-center text-gray-500">
              You have no folders yet. Create a folder to get started!
            </p>
          ) : (
            <>
              {folders.map((folder: Folder) => (
                <div
                  key={folder.id}
                  className="min-w-[220px] max-w-[260px] bg-blue-50 rounded-lg shadow p-4 m-1 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-lg text-blue-600">
                      {folder.name}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(folder)}
                        className="px-2 py-1"
                      >
                        ✏️
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(folder.id)}
                        className="px-2 py-1"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                  {folder.description && (
                    <div className="text-gray-700 text-sm mb-2 min-h-[40px]">
                      {folder.description}
                    </div>
                  )}
                  <Button
                    onClick={() => navigate(`/view/folder?id=${folder.id}`)}
                    className="mt-2 mb-2"
                  >
                    View Words
                  </Button>
                </div>
              ))}
              {/* Edit Folder Modal */}
              {editDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow p-6 w-full max-w-xs">
                    <h3 className="text-lg font-bold mb-2">Edit Folder</h3>
                    <input
                      type="text"
                      placeholder="Folder Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mb-3 w-full border border-gray-300 rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="mb-3 w-full border border-gray-300 rounded px-2 py-1"
                    />
                    {editError && (
                      <p className="text-red-500 mb-2">{editError}</p>
                    )}
                    <div className="flex gap-4 mt-2">
                      <Button
                        onClick={() => setEditDialogOpen(false)}
                        disabled={editing}
                        variant="outline"
                        className="w-24"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleEditSave}
                        disabled={editing}
                        className="w-24"
                      >
                        {editing ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {/* Delete Folder Modal */}
              {deleteDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow p-6 w-full max-w-xs">
                    <h3 className="text-lg font-bold mb-2">Delete Folder</h3>
                    <p>
                      Are you sure you want to delete this folder? This action
                      cannot be undone.
                    </p>
                    {deleteError && (
                      <p className="text-red-500 mb-2">{deleteError}</p>
                    )}
                    <div className="flex gap-4 mt-2">
                      <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={deleting}
                        variant="outline"
                        className="w-24"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDeleteConfirm}
                        disabled={deleting}
                        className="w-24"
                        variant="destructive"
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <SnackbarMessage
          open={snackbarOpen}
          message={error || ""}
          severity="error"
          onClose={() => setSnackbarOpen(false)}
        />
        <SnackbarMessage
          open={!!successMessage}
          message={successMessage}
          severity="success"
          onClose={() => setSuccessMessage("")}
        />
      </div>
    </div>
  );
};

export default ViewPage;
