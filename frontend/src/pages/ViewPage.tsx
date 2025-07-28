import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useDeleteFolder, useEditFolder } from "../hooks/useFolderActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: 6,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 4,
      }}
    >
      <Typography
        variant="h4"
        color="primary"
        mb={3}
        align="center"
        sx={{ fontWeight: 600 }}
      >
        Your Folders
      </Typography>
      <Stack
        spacing={3}
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
      >
        {loading ? (
          <Spinner />
        ) : folders.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ width: "100%" }}
          >
            You have no folders yet. Create a folder to get started!
          </Typography>
        ) : (
          <>
            {folders.map((folder: Folder) => (
              <Card
                key={folder.id}
                sx={{
                  minWidth: 220,
                  maxWidth: 260,
                  bgcolor: "#e3f2fd",
                  borderRadius: 2,
                  boxShadow: 1,
                  m: 1,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    >
                      {folder.name}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(folder)}
                        aria-label="Edit folder"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(folder.id)}
                        aria-label="Delete folder"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  {folder.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={1}
                      sx={{ minHeight: 40 }}
                    >
                      {folder.description}
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ mt: 1, mb: 1 }}
                    onClick={() => navigate(`/view/folder?id=${folder.id}`)}
                  >
                    View Words
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Edit Folder Dialog */}
            <Dialog
              open={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle>Edit Folder</DialogTitle>
              <DialogContent>
                <TextField
                  label="Folder Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                {editError && (
                  <Typography color="error">{editError}</Typography>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setEditDialogOpen(false)}
                  disabled={editing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSave}
                  disabled={editing}
                  variant="contained"
                >
                  {editing ? "Saving..." : "Save"}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete Folder Dialog */}
            <Dialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle>Delete Folder</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this folder? This action
                  cannot be undone.
                </Typography>
                {deleteError && (
                  <Typography color="error">{deleteError}</Typography>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  color="error"
                  variant="contained"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Stack>
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
    </Box>
  );
};

export default ViewPage;
