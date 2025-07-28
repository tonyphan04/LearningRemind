import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

import { useSignup } from "../hooks/useAuth";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, setError, success, loading } = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await signup(email, password);
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
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" align="center">
              {success}
            </Typography>
          )}
          <Typography align="center" variant="body2">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Stack>
      </form>
    </Box>
  );
};

export default SignupForm;
