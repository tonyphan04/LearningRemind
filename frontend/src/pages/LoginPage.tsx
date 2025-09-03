import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";
import { useToast } from "../hooks/useToast";

const LoginPage = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account || !password) {
      showToast("Please enter account and password.", "error");
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
          showToast(text || "Login failed. Please check your credentials.", "error");
          return;
        }
        if (data && data.error) {
          if (typeof data.error === "string") {
            showToast(data.error, "error");
          } else if (typeof data.error === "object" && data.error !== null) {
            const messages = Object.values(data.error).flat().filter(Boolean);
            if (messages.length > 0) {
              showToast(messages[0] as string, "error");
            } else {
              showToast("Login failed. Please check your credentials.", "error");
            }
          } else {
            showToast("Login failed. Please check your credentials.", "error");
          }
        } else {
          showToast("Login failed. Please check your credentials.", "error");
        }
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-blue-100">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">
            Learning Remind
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
                Account
              </label>
              <Input
                id="account"
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : "Login"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LoginPage;