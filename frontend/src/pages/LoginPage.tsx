import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { login, error, setError, loading } = useLogin(onLoginSuccess);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!account || !password) {
      setError("Please enter account and password.");
      return;
    }
    await login(account, password);
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
