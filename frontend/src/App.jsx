import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./routes/AppRoutes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import FullPageLoader from "./components/FullPageLoader";

// AppContent reads auth state and gates the ENTIRE router behind
// AuthContext's initial "checking localStorage" phase. Without this,
// Navbar would briefly render its "Guest" state (Login/Register
// links) for an already-logged-in user, flashing to "Logged in" a
// moment later once rehydration finishes. This must be a separate
// component (not inline in App) because useAuth() can only be
// called INSIDE AuthProvider's tree.
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  return <RouterProvider router={router} />;
};

function App() {
  return (
    // ErrorBoundary wraps EVERYTHING — an error inside ThemeContext,
    // AuthContext, or any page should show the recovery screen, not
    // a blank white page.
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
