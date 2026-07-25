import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

// App.jsx wires up global, app-wide concerns: authentication,
// routing, and toast notifications. AuthProvider MUST wrap
// RouterProvider — every page and ProtectedRoute calls useAuth(),
// which only works if they render somewhere INSIDE this provider's
// tree. This is the most common Context bug: consumers rendered
// outside their provider throw "useAuth must be used within an
// AuthProvider."
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />

      {/* Global toast notification renderer. Any component anywhere
          in the app can trigger a toast via: toast.success("Saved!")
          — no need to import <Toaster /> more than once. */}
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
  );
}

export default App;
