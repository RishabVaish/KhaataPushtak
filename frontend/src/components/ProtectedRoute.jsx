import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ProtectedRoute wraps any page that requires a logged-in user.
// Usage in AppRoutes.jsx:
//   { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> }
//
// It reads auth state from context (never checks localStorage
// directly — AuthContext is the single source of truth) and either
// redirects to /login or renders the protected page.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While AuthContext is still checking localStorage on initial
  // page load, we DON'T redirect yet — doing so would cause a
  // flash-redirect to /login even for an already-logged-in user
  // whose session just hasn't finished loading. A brief loading
  // state prevents this "flicker."
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-(--color-text-secondary)">
        Loading...
      </div>
    );
  }

  // Navigate with `replace` swaps the current history entry instead
  // of pushing a new one — so clicking "back" after being redirected
  // doesn't bounce the user back into the protected page they were
  // just kicked out of.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
