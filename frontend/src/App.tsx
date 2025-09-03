import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import ViewPage from "./pages/ViewPage";
import FolderWordsPage from "./pages/FolderWordsPage";
import WordDetailPage from "./pages/WordDetailPage";
import Navigation from "./components/Navigation";
import LoginPage from "./pages/LoginPage";
import SignupForm from "./pages/SignupForm";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuthContext";
import "./App.css";

// Separate component for routes that need auth state
function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      ) : (
        <>
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/view" element={<ViewPage />} />
            <Route path="/view/folder" element={<FolderWordsPage />} />
            <Route
              path="/view/folder/:folderId/vocab/:vocabId"
              element={<WordDetailPage />}
            />
          </Routes>
        </>
      )}
    </>
  );
}

// Main App component wraps everything with providers
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
