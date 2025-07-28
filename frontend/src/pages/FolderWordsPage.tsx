import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import AddWordForm from "../components/AddWordForm";
import { useFolder, useWords } from "../hooks/useFolderWords";

const FolderWordsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get("id");
  const {
    folderName,
    loading: folderLoading,
    error: folderError,
  } = useFolder(folderId);
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
    <Box
      sx={{
        maxWidth: 700,
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
        fontWeight={600}
      >
        Words in {folderName}
      </Typography>
      {(folderLoading || wordsLoading) && (
        <Typography align="center" color="text.secondary" mb={2}>
          Loading...
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => setShowAddWordModal(true)}
      >
        Add Word
      </Button>
      <Dialog
        open={showAddWordModal}
        onClose={() => setShowAddWordModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add Word to {folderName}</DialogTitle>
        <DialogContent>
          <AddWordForm
            onSave={handleAddWord}
            onCancel={() => setShowAddWordModal(false)}
          />
        </DialogContent>
      </Dialog>
      {/* Removed word dialog, now handled by navigation to WordDetailPage */}
      <Box sx={{ mt: 2 }}>
        {words.length === 0 && !wordsLoading && (
          <Typography variant="body2" color="text.secondary">
            No words in this folder.
          </Typography>
        )}
        {words.map((w) => (
          <Card
            key={w.id}
            sx={{
              bgcolor: "#f5faff",
              borderRadius: 1,
              boxShadow: 0,
              cursor: "pointer",
              mb: 2,
            }}
            onClick={() => navigate(`/view/folder/${folderId}/vocab/${w.id}`)}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>
                {w.word}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {w.description}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", color: "primary.main" }}
              >
                Ex: {w.example}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      {(message || folderError || wordsError) && (
        <Typography color="error" align="center" mt={2}>
          {message || folderError || wordsError}
        </Typography>
      )}
    </Box>
  );
};

export default FolderWordsPage;
