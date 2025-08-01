import React from "react";
import { useParams } from "react-router-dom";
import { useWordFetch } from "../hooks/useWordFetch";
import { useWordEdit } from "../hooks/useWordEdit";
import { useWordDelete } from "../hooks/useWordDelete";
import { useSnackbarState } from "../hooks/useSnackbarState";
import Spinner from "../components/Spinner";
import SnackbarMessage from "../components/SnackbarMessage";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

// UI component for displaying and editing word details
interface WordDetailUIProps {
  loading: boolean;
  error: string | null;
  word: {
    word: string;
    description: string;
    example: string;
    // [key: string]: any; // Removed to avoid using 'any'
  } | null;
  editMode: boolean;
  form: {
    word: string;
    description: string;
    example: string;
    // [key: string]: string; // Uncomment and adjust if you expect dynamic string fields
  };
  snackbar: {
    message: string;
    severity: "error" | "info" | "success" | "warning";
  } | null;
  onEdit: () => void;
  onCancel: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onDelete: () => void;
  setError: (error: string | null) => void;
  setSnackbar: (
    snackbar: { message: string; severity: "error" | "success" } | null
  ) => void;
}

function WordDetailUI({
  loading,
  error,
  word,
  editMode,
  form,
  snackbar,
  onEdit,
  onCancel,
  onChange,
  onSave,
  onDelete,
  setError,
  setSnackbar,
}: WordDetailUIProps) {
  return (
    <>
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 5,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
        }}
      >
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
          <>
            {editMode ? (
              <>
                <h2
                  style={{
                    color: "#1976d2",
                    marginBottom: 16,
                    fontWeight: 600,
                  }}
                >
                  Edit Word
                </h2>
                <form
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <TextField
                    name="word"
                    label="Word"
                    value={form.word}
                    onChange={onChange}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    name="description"
                    label="Description"
                    value={form.description}
                    onChange={onChange}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    name="example"
                    label="Example"
                    value={form.example}
                    onChange={onChange}
                    fullWidth
                  />
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onSave}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              </>
            ) : (
              <>
                <h2
                  style={{
                    color: "#1976d2",
                    marginBottom: 16,
                    fontWeight: 600,
                  }}
                >
                  {word.word}
                </h2>
                <div style={{ marginBottom: 12 }}>
                  <strong style={{ color: "#1976d2" }}>Description</strong>
                  <div>{word.description}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong style={{ color: "#1976d2" }}>Example</strong>
                  <div style={{ fontStyle: "italic", color: "#1976d2" }}>
                    {word.example}
                  </div>
                </div>
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button variant="contained" color="primary" onClick={onEdit}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={onDelete}>
                    Delete
                  </Button>
                </Box>
              </>
            )}
          </>
        ) : (
          <div>No word found.</div>
        )}
      </Box>
      <SnackbarMessage
        open={!!snackbar}
        message={snackbar?.message || ""}
        severity={snackbar?.severity || "info"}
        onClose={() => setSnackbar(null)}
      />
    </>
  );
}

// Container component for logic

function WordDetailPageContainer() {
  const { vocabId, folderId } = useParams();
  const { word, setWord, loading, error, setError } = useWordFetch(vocabId);
  const edit = useWordEdit(vocabId, word, setWord);
  const del = useWordDelete(vocabId, folderId);
  const { snackbar, setSnackbar } = useSnackbarState();

  // Compose error and snackbar logic for UI
  React.useEffect(() => {
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

  return (
    <WordDetailUI
      loading={loading}
      error={error}
      word={
        word
          ? {
              word: word.word,
              description: word.description ?? "",
              example: word.example ?? "",
            }
          : null
      }
      editMode={edit.editMode}
      form={edit.form}
      snackbar={snackbar}
      onEdit={edit.handleEdit}
      onCancel={edit.handleCancel}
      onChange={edit.handleChange}
      onSave={handleSave}
      onDelete={handleDelete}
      setError={setError}
      setSnackbar={setSnackbar}
    />
  );
}

export default WordDetailPageContainer;
