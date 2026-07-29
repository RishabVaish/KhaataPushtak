import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import FullPageLoader from "../components/FullPageLoader";

// React.lazy splits each page into its OWN JS chunk, fetched only
// when that route is actually visited — instead of one giant bundle
// containing Login + Register + Dashboard + everything they import,
// all downloaded before a first-time visitor even logs in. This is
// route-level code splitting, the highest-impact, lowest-risk form
// of it (no behavior changes, just how/when the JS is downloaded).
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const NotFound = lazy(() => import("../pages/NotFound"));

// withSuspense wraps a lazy-loaded element in <Suspense>, showing
// FullPageLoader while that page's chunk downloads (typically
// milliseconds on a good connection, but real on slow ones). Defined
// once here instead of repeating <Suspense fallback={...}> 5 times.
const withSuspense = (Element) => (
  <Suspense fallback={<FullPageLoader />}>
    <Element />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: withSuspense(Home),
      },
      {
        path: "login",
        element: withSuspense(Login),
      },
      {
        path: "register",
        element: withSuspense(Register),
      },
      {
        path: "dashboard",
        element: <ProtectedRoute>{withSuspense(Dashboard)}</ProtectedRoute>,
      },
      {
        // Catch-all: matches any URL that hit NO route above.
        // MUST be the last entry — React Router checks routes in
        // order, and a wildcard placed earlier would swallow every
        // other path.
        path: "*",
        element: withSuspense(NotFound),
      },
    ],
  },
]);

export default router;
