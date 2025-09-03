import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuthContext";

const LoginPage: React.FC = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!account || !password) {
      setError("Please enter account and password.");
      return;
    }

    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: account, password }),
      });

      if (res.ok) {
        const { token } = await res.json();
        login(token); // Use AuthContext's login function
        navigate("/"); // Navigate to home page
      } else {
        let data;
        try {
          data = await res.json();
        } catch {
          const text = await res.text();
          setError(text || "Login failed. Please check your credentials.");
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-gray-50 placeholder-gray-400"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-gray-50 placeholder-gray-400"
          />
          <div className="flex items-center justify-between text-sm mt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-blue-600 h-4 w-4 rounded"
              />
              <span className="text-gray-700">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline font-semibold"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2 rounded-lg font-semibold text-base mt-2 hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          {error && (
            <p className="text-red-500 text-center font-semibold mt-2 text-base">
              {error}
            </p>
          )}
        </form>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-2 text-gray-400 text-sm">Or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <Link to="/signup" className="w-full">
          <Button
            type="button"
            className="w-full py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold bg-white hover:bg-blue-50 transition"
          >
            Register New Account
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
