import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuthContext";

const Navigation = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 py-2">
        <div className="flex flex-row gap-4 flex-wrap">
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <Link to="/create" className="text-blue-600 hover:underline">
            Create
          </Link>
          <Link to="/view" className="text-blue-600 hover:underline">
            View
          </Link>
        </div>
        <Button onClick={handleLogout} className="ml-4">
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
