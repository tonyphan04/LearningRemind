// import { StrictMode } from 'react' - Temporarily commented out
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Comment explaining why StrictMode is disabled
// StrictMode intentionally runs effects twice in development to help find bugs
// This can cause duplicate API calls, which is expected in development only
// In production, effects will only run once
createRoot(document.getElementById("root")!).render(
  // Temporarily disabled StrictMode to prevent duplicate API calls during development
  // <StrictMode>
  <App />
  // </StrictMode>
);
