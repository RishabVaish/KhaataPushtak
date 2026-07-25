import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// Navbar reads auth state directly from context — it does NOT
// receive isAuthenticated/user as props from MainLayout. This is
// the whole point of Context: components subscribe directly to
// global state without threading props through every ancestor.
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clears AuthContext state + localStorage (see AuthContext.jsx)
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="border-b border-(--color-border) bg-(--color-surface)">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-tight">
          KhaataPushtak
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            // ── Logged-in state ──────────────────────────────
            <>
              <span className="text-sm text-(--color-text-secondary)">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-(--color-text-primary) hover:text-red-500 transition-colors"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          ) : (
            // ── Guest state ──────────────────────────────────
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-3 py-1.5 rounded-lg bg-(--color-accent) text-white hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
