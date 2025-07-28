import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useNavigate, Link } from "react-router-dom";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();

  useEffect(() => {
    // If token exists, consider user logged in
    const token = localStorage.getItem("token");
    if (token) {
      onLoginSuccess();
      navigate("/");
    }
  }, [onLoginSuccess, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        // Store token in localStorage for later API calls
        const { token } = await res.json();
        localStorage.setItem("token", token);
        onLoginSuccess();
        navigate("/"); // Redirect to home after login
      } else {
        let data;
        try {
          data = await res.json();
          // Debug: log the data for inspection
          console.log("Login error response data:", data);
        } catch {
          // If response is not JSON, fallback to text
          const text = await res.text();
          setError(text || "Login failed. Please check your credentials.");
          return;
        }
        if (data && data.error) {
          if (typeof data.error === "string") {
            setError(data.error);
          } else if (typeof data.error === "object" && data.error !== null) {
            // Collect all error messages from the object
            const messages = Object.values(data.error).flat().filter(Boolean);
            setError(messages.join(". "));
          } else {
            setError("Login failed. Please check your credentials.");
          }
        } else if (res.status === 404) {
          setError("Account does not exist. Please sign up.");
        } else {
          setError("Login failed. Please check your credentials.");
        }
      }
    } catch (err) {
      setError("Network error: " + err);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 4,
      }}
    >
      <Typography variant="h4" color="primary" mb={3} align="center">
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <Typography variant="body2" align="center" mt={2}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Sign Up
            </Link>
          </Typography>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginPage;
