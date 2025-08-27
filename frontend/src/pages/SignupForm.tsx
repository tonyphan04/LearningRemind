import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useAuth";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, setError, success, loading } = useSignup();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    await signup(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center py-10 relative overflow-hidden">
      {/* Decorative SVG background for extra depth */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#3b82f6"
            fillOpacity="0.2"
            d="M0,160L80,165.3C160,171,320,181,480,165.3C640,149,800,107,960,117.3C1120,128,1280,192,1360,224L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8 border border-blue-100 z-10">
        {/* Logo or icon above heading */}
        <div className="flex justify-center mb-4">
          <svg
            width="40"
            height="40"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="24" fill="#3b82f6" />
            <path
              d="M16 32L24 16L32 32"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-wide font-sans">
          Create your account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm bg-blue-50 placeholder-blue-400 transition-all duration-200"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm bg-blue-50 placeholder-blue-400 transition-all duration-200"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white hover:scale-105 hover:brightness-110 hover:bg-blue-700 w-full py-3 rounded-xl font-semibold shadow text-base transition-all duration-200"
          >
            Sign Up
          </Button>
          {error && (
            <p className="text-red-500 text-center font-semibold mt-2 text-base">
              {error}
            </p>
          )}
          {success && (
            <p className="text-blue-600 text-center font-semibold mt-2 text-base">
              {success}
            </p>
          )}
        </form>
        <p className="text-center mt-6 text-base text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
