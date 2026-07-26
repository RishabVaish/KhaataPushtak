import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

// Navbar reads auth state directly from context — no props threaded down from MainLayout. Now also renders ThemeToggle, which reads ThemeContext the same way.
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Derives a single initial for the small-screen avatar circle — falls back gracefully if name is somehow empty.
  const initial = user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <header className="border-b border-(--color-border) bg-(--color-surface) sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="font-semibold text-lg tracking-tight shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) rounded"
        >
          KhaataPushtak
        </Link>

        {/* aria-label gives assistive tech a clear landmark name for
            this nav region, distinct from any other <nav> on the page. */}
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-2 sm:gap-4"
        >
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {/* Avatar circle: always visible, gives identity even
                  on the smallest screens without taking horizontal
                  space the way full text would. */}
              <span
                className="w-8 h-8 rounded-full bg-(--color-accent)/15 text-(--color-accent) text-sm font-semibold flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                {initial}
              </span>
              {/* Full name only shown from `sm` breakpoint up — on
                  phones, the avatar above already conveys identity,
                  and this text would otherwise force wrapping or
                  crowd the Logout button. */}
              <span className="hidden sm:inline text-sm text-(--color-text-secondary)">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-(--color-text-primary) hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) rounded px-1"
              >
                <FiLogOut />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) rounded px-1"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-3 py-1.5 rounded-lg bg-(--color-accent) text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--color-accent)"
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
