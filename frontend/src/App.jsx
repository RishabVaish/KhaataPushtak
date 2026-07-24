import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./routes/AppRoutes";

// App.jsx stays intentionally minimal — it only wires up global,
// app-wide concerns: routing and toast notifications. As we add
// AuthContext in Phase 2.2, it will wrap <RouterProvider /> here too,
// so auth state is available to every page in the app.
function App() {
  return (
    <>
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
    </>
  );
}

export default App;
