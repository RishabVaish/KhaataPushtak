import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

// MainLayout is the persistent "frame" around every page. React
// Router's <Outlet /> is a placeholder — it renders whatever child
// route currently matches the URL. This means Dashboard, Login,
// CreateHisaab, etc. (built in later phases) will all automatically
// appear here, below the Navbar, without each page re-declaring it.
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
