import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { removeToken } from "../utils/token";

const Navigation = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeToken();
    navigate("/login");
    window.location.reload();
  };
  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        bgcolor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        p: { xs: 1, sm: 2 },
        borderBottom: "1px solid #ccc",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontWeight: 500,
            }}
          >
            Home
          </Link>
          <Link
            to="/create"
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontWeight: 500,
            }}
          >
            Create
          </Link>
          <Link
            to="/view"
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontWeight: 500,
            }}
          >
            View
          </Link>
        </Stack>
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{ minWidth: 90 }}
        >
          Logout
        </Button>
      </Stack>
    </Box>
  );
};

export default Navigation;
