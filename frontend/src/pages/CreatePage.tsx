import React from "react";
import AddWordForm from "../components/AddWordForm";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import SnackbarMessage from "../components/SnackbarMessage";
import { useCreateFolder, useAddWordToFolder } from "../hooks/useCreateFolder";
const CreatePage: React.FC = () => {
  const [folderName, setFolderName] = React.useState("");
  const [folderDesc, setFolderDesc] = React.useState("");
  const [showWordModal, setShowWordModal] = React.useState(false);
  const [showAddWordPrompt, setShowAddWordPrompt] = React.useState(false);
  const {
    folderId,
    createFolder,
    loading: folderLoading,
    error: folderError,
  } = useCreateFolder();
  const {
    addWord,
    words,
    loading: wordLoading,
    error: wordError,
  } = useAddWordToFolder(folderId);
  const [snackbar, setSnackbar] = React.useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const handleCreateFolder = async () => {
    if (!folderName) {
      setSnackbar({ message: "Folder name required", severity: "error" });
      return;
    }
    const result = await createFolder(folderName, folderDesc);
    if (result.id) {
      setShowAddWordPrompt(true);
      setSnackbar({ message: "Folder created!", severity: "success" });
    } else if (result.error) {
      setSnackbar({ message: result.error, severity: "error" });
    }
  };

  // Show loading spinner if creating folder or adding word
  const isLoading = folderLoading || wordLoading;

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 4,
      }}
    >
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="20"
              cy="20"
              r="18"
              stroke="#1976d2"
              strokeWidth="4"
              strokeDasharray="90 60"
            />
          </svg>
        </Box>
      )}
      <Typography variant="h4" color="primary" mb={3} align="center">
        Create Vocab List
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Description (optional)"
          value={folderDesc}
          onChange={(e) => setFolderDesc(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateFolder}
        >
          Create Folder
        </Button>
      </Stack>
      {showAddWordPrompt && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6">
            Do you want to add words to this folder now?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowAddWordPrompt(false);
                setShowWordModal(true);
              }}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setShowAddWordPrompt(false);
              }}
            >
              No, I'll add later
            </Button>
          </Stack>
        </Box>
      )}
      {showWordModal && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <AddWordForm
            onSave={async (word, description, example) => {
              const result = await addWord(word, description, example);
              if (result.success) {
                setShowWordModal(false);
                setSnackbar({ message: "Word added!", severity: "success" });
              } else if (result.error) {
                setSnackbar({ message: result.error, severity: "error" });
              }
            }}
            onCancel={() => setShowWordModal(false)}
          />
        </Box>
      )}
      {folderId && words.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" color="primary">
            Words in this folder:
          </Typography>
          <Stack spacing={1} mt={1}>
            {words.map((w, i) => (
              <Box key={i} sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 1 }}>
                <Typography variant="subtitle1">
                  <b>{w.word}</b>
                </Typography>
                {w.description && (
                  <Typography variant="body2">{w.description}</Typography>
                )}
                {w.example && (
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: "italic", color: "primary.main" }}
                  >
                    Ex: {w.example}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
      <SnackbarMessage
        open={!!snackbar || !!folderError || !!wordError}
        message={snackbar?.message || folderError || wordError || ""}
        severity={
          snackbar?.severity || (folderError || wordError ? "error" : "info")
        }
        onClose={() => setSnackbar(null)}
      />
    </Box>
  );
};

export default CreatePage;
