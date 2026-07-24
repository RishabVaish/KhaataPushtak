import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";

// Centralized route definitions. MainLayout wraps every route below
// it (via nested routes + <Outlet />), so all pages share the Navbar
// automatically. Future phases will add more nested routes here
// (Dashboard, CreateHisaab, Login, etc.) and — for protected pages —
// wrap the element with a <ProtectedRoute> component.
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true, // renders at the exact "/" path
        element: <Home />,
      },
    ],
  },
]);

export default router;
