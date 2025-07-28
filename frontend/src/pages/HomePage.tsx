import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 8,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 5,
        textAlign: "center",
      }}
    >
      <Typography variant="h3" color="primary" mb={2} fontWeight={700}>
        Welcome to Learning Remind
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={4}>
        Your personal learning and review assistant
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/create"
        >
          Create Vocab List
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          component={Link}
          to="/view"
        >
          View My Folders
        </Button>
      </Stack>
    </Box>
  );
};

export default HomePage;
