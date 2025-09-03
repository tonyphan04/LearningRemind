import { useState } from "react";
import type { ReactNode } from "react";
import { ToastContext } from "../contexts/ToastContext";
import type { Toast, ToastType } from "../contexts/ToastContext";
import { useToast } from "../hooks/useToast";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: ToastType = "info",
    duration = 5000
  ) => {
    const id = Date.now().toString();
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration !== Infinity) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }

    return id;
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// useToast is now in a separate file: src/hooks/useToast.ts

// Toast container component
function ToastContainer() {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast: Toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Individual toast component
const typeStyles: Record<ToastType, string> = {
  success: "bg-green-100 border-green-500 text-green-800",
  error: "bg-red-100 border-red-500 text-red-800",
  warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
  info: "bg-blue-100 border-blue-500 text-blue-800",
};

const typeIcons: Record<ToastType, string> = {
  success: "✓",
  error: "✗",
  warning: "⚠",
  info: "ℹ",
};

function Toast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div
      className={`flex items-start p-4 rounded-lg shadow-lg border-l-4 ${
        typeStyles[toast.type]
      } animate-fade-in`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-2 font-bold">
        {typeIcons[toast.type]}
      </div>
      <div className="flex-grow">{toast.message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

// Add this to your CSS or tailwind.config.js
// .animate-fade-in {
//   animation: fadeIn 0.3s ease-in-out;
// }
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(-10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
