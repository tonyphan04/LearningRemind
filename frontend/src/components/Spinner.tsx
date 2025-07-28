// Simple Material UI loading spinner
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Spinner: React.FC = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight={120}
  >
    <CircularProgress color="primary" />
  </Box>
);

export default Spinner;
