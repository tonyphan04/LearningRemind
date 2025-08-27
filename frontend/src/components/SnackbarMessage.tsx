import React, { useEffect } from "react";

interface SnackbarMessageProps {
  open: boolean;
  message: string;
  severity?: "info" | "success" | "error" | "warning";
  onClose: () => void;
}

const severityStyles: Record<string, string> = {
  info: "bg-blue-100 text-blue-800 border-blue-300",
  success: "bg-green-100 text-green-800 border-green-300",
  error: "bg-red-100 text-red-800 border-red-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

const SnackbarMessage: React.FC<SnackbarMessageProps> = ({
  open,
  message,
  severity = "info",
  onClose,
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded border shadow-lg z-50 ${severityStyles[severity]}`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default SnackbarMessage;
