import { useState } from "react";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add signup logic
    alert(`Signup with: ${email}`);
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
      <h2>Sign Up</h2>
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
      <button type="submit">Sign Up</button>
      <div style={{ marginTop: 8, textAlign: "center" }}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </form>
  );
};

export default SignupForm;
