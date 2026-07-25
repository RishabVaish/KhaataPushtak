import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

// Centralized route definitions. MainLayout wraps every route below
// it (via nested routes + <Outlet />), so all pages share the Navbar
// automatically. Protected pages are wrapped in <ProtectedRoute> —
// note the route itself always exists and matches the URL; the GUARD
// only decides what renders once matched.
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true, // renders at the exact "/" path
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
