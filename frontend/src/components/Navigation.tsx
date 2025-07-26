import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        padding: "20px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <Link
        to="/"
        style={{
          marginRight: "20px",
          textDecoration: "none",
          color: "#007bff",
        }}
      >
        Home
      </Link>
      <Link
        to="/create"
        style={{
          marginRight: "20px",
          textDecoration: "none",
          color: "#007bff",
        }}
      >
        Create
      </Link>
      <Link to="/view" style={{ textDecoration: "none", color: "#007bff" }}>
        View
      </Link>
    </nav>
  );
};

export default Navigation;
