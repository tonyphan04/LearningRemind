import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, setError, loading } = useLogin(onLoginSuccess);
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
    await login(username, password);
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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
