import { useAuth } from "../context/AuthContext";

// TEMPORARY placeholder — proves ProtectedRoute + AuthContext work
// together correctly. Will be REPLACED by the real Dashboard
// (stats cards, Hisaab list, search/filter UI) in a later phase.
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
      <h1 className="text-2xl font-semibold mb-2">Welcome, {user?.name} 👋</h1>
      <p className="text-[var(--color-text-secondary)]">
        This is a protected page — you can only see this because you're logged
        in. The real dashboard comes next.
      </p>
    </div>
  );
};

export default Dashboard;
