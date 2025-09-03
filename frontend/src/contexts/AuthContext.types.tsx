import { createContext } from "react";

// Define the shape of our authentication context
export interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
