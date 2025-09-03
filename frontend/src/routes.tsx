import type { RouteObject } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import ViewPage from "./pages/ViewPage";
import FolderWordsPage from "./pages/FolderWordsPage";
import WordDetailPage from "./pages/WordDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupForm from "./pages/SignupForm";

/**
 * Routes accessible without authentication
 */
export const publicRoutes: RouteObject[] = [
  {
    path: "/signup",
    element: <SignupForm />,
  },
  {
    path: "*",
    element: <LoginPage />,
  },
];

/**
 * Routes that require authentication
 */
export const privateRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/create",
    element: <CreatePage />,
  },
  {
    path: "/view",
    element: <ViewPage />,
  },
  {
    path: "/view/folder",
    element: <FolderWordsPage />,
  },
  {
    path: "/view/folder/:folderId/vocab/:vocabId",
    element: <WordDetailPage />,
  },
];
