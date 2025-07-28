import React from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Spinner from "../components/Spinner";
import SnackbarMessage from "../components/SnackbarMessage";
import { apiFetch } from "../api";

type Word = {
  word: string;
  description: string;
  example: string;
};

const WordDetailPage: React.FC = () => {
  const { vocabId } = useParams();
  const [word, setWord] = React.useState<Word | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!vocabId) return;
    setLoading(true);
    apiFetch(`/api/vocabs/${vocabId}`)
      .then(setWord)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [vocabId]);

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 6,
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
          <Typography variant="h4" color="primary" mb={2} fontWeight={600}>
            {word.word}
          </Typography>
          <Typography variant="subtitle1" color="primary">
            Description
          </Typography>
          <Typography mb={2}>{word.description}</Typography>
          <Typography variant="subtitle1" color="primary">
            Example
          </Typography>
          <Typography sx={{ fontStyle: "italic", color: "primary.main" }}>
            {word.example}
          </Typography>
        </>
      ) : (
        <Typography>No word found.</Typography>
      )}
    </Box>
  );
};

export default WordDetailPage;
