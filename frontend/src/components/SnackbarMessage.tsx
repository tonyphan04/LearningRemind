// Reusable Material UI Snackbar for error/success/info messages
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import type { AlertProps } from "@mui/material/Alert";

interface SnackbarMessageProps {
  open: boolean;
  message: string;
  severity?: AlertProps["severity"];
  onClose: () => void;
}

const SnackbarMessage: React.FC<SnackbarMessageProps> = ({
  open,
  message,
  severity = "info",
  onClose,
}) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <MuiAlert
      elevation={6}
      variant="filled"
      onClose={onClose}
      severity={severity}
      sx={{ width: "100%" }}
    >
      {message}
    </MuiAlert>
  </Snackbar>
);

export default SnackbarMessage;
