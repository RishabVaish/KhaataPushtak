import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

// MainLayout is the persistent "frame" around every page. React Router's <Outlet /> renders whatever child route matched the URL.
const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-(--color-bg)">
      <Navbar />
      {/* Responsive padding: tighter on mobile (px-4), roomier on
          larger screens (sm:px-6). key={pathname} forces React to
          treat each new route as a fresh element, re-triggering the
          fade-in animation on every navigation — a lightweight page
          transition with no routing-transition library needed. */}
      <main
        key={location.pathname}
        className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 animate-fade-in"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
