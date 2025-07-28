import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface AddWordFormProps {
  onSave: (word: string, description: string, example: string) => void;
  onCancel: () => void;
}

const AddWordForm: React.FC<AddWordFormProps> = ({ onSave, onCancel }) => {
  const [word, setWord] = useState("");
  const [description, setDescription] = useState("");
  const [example, setExample] = useState("");
  const [wordError, setWordError] = useState("");
  const [descError, setDescError] = useState("");
  const [exampleError, setExampleError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    setWordError("");
    setDescError("");
    setExampleError("");
    if (!word) {
      setWordError("Word is required");
      hasError = true;
    }
    if (!description) {
      setDescError("Description is required");
      hasError = true;
    }
    if (!example) {
      setExampleError("Example is required");
      hasError = true;
    }
    if (hasError) return;
    onSave(word, description, example);
    setWord("");
    setDescription("");
    setExample("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 2,
        minWidth: 320,
      }}
    >
      <Typography variant="h6" color="primary" mb={2}>
        Add Word
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          error={!!wordError}
          helperText={wordError}
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!descError}
          helperText={descError}
          fullWidth
        />
        <TextField
          label="Example"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          error={!!exampleError}
          helperText={exampleError}
          fullWidth
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button variant="outlined" color="primary" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddWordForm;
