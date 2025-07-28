import React from "react";
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
  const { folders, loading, error } = useFolders();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  React.useEffect(() => {
    if (error) setSnackbarOpen(true);
  }, [error]);

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
        ) : (
          folders.map((folder: Folder) => (
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
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  {folder.name}
                </Typography>
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
          ))
        )}
      </Stack>
      <SnackbarMessage
        open={snackbarOpen}
        message={error || ""}
        severity="error"
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default ViewPage;
