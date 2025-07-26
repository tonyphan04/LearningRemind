import { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add login logic
    alert(`Login with: ${email}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "80px",
        maxWidth: 400,
        margin: "80px auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <div style={{ marginTop: 8, textAlign: "center" }}>
        Don't have an account? <Link to="/signup">Register</Link>
      </div>
    </form>
  );
};

export default LoginForm;
