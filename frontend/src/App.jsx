import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// App.jsx wires up global, app-wide concerns: theme, authentication,
// routing, and toast notifications. Provider order here (Theme
// outside Auth) doesn't matter functionally — they're independent
// of each other — but both MUST wrap RouterProvider, since pages
// and components call useTheme()/useAuth() and can only do that
// from inside these providers' trees.
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />

        {/* Global toast notification renderer. Uses our CSS
            variables for background/text/border, so toasts
            automatically re-theme along with the rest of the app —
            no separate dark-mode toast config needed. */}
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
  );
}

export default App;
