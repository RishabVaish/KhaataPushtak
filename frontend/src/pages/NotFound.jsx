import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Button from "../components/Button";

// Renders when a URL matches no route in AppRoutes.jsx (via the "*"
// catch-all route). Without this, an unknown URL would render a
// blank MainLayout with an empty <Outlet /> — confusing, with no
// path back into the app.
const NotFound = () => {
  useDocumentTitle("Page Not Found");

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
      <p className="text-6xl font-bold text-(--color-accent) mb-2">404</p>
      <h1 className="text-xl font-semibold mb-2">Page not found</h1>
      <p className="text-(--color-text-secondary) text-sm max-w-sm mb-6">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/">
        <Button>
          <FiArrowLeft />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
