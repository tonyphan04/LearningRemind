import { useState } from "react";

export function useSnackbarState() {
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);
  return { snackbar, setSnackbar };
}
