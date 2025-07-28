import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import ViewPage from "./pages/ViewPage";
import FolderWordsPage from "./pages/FolderWordsPage";
import WordDetailPage from "./pages/WordDetailPage";
import Navigation from "./components/Navigation";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {!isAuthenticated ? (
        <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
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
    </Router>
  );
}

export default App;
