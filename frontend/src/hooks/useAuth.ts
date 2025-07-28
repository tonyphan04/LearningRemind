import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function useLogin(onLoginSuccess: () => void) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem("token", token);
        onLoginSuccess();
        navigate("/");
      } else {
        let data;
        try {
          data = await res.json();
        } catch {
          const text = await res.text();
          setError(text || "Login failed. Please check your credentials.");
          setLoading(false);
          return;
        }
        if (data && data.error) {
          if (typeof data.error === "string") {
            setError(data.error);
          } else if (typeof data.error === "object" && data.error !== null) {
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
    } finally {
      setLoading(false);
    }
  };

  return { login, error, setError, loading };
}

export function useSignup() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async (email: string, password: string) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        setError(text || "Signup failed");
        setLoading(false);
        return;
      }
      if (res.ok) {
        setSuccess("Signup successful! You can now log in.");
        setTimeout(() => navigate("/login"), 1200);
      } else if (data && data.error) {
        if (typeof data.error === "string") {
          setError(data.error);
        } else if (typeof data.error === "object" && data.error !== null) {
          const messages = Object.values(data.error).flat().filter(Boolean);
          setError(messages.join(". "));
        } else {
          setError("Signup failed");
        }
      } else {
        setError("Signup failed");
      }
    } catch (err) {
      setError("Network error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return { signup, error, setError, success, loading };
}
