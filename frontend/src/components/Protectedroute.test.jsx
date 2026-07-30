import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";

// Mock useAuth so each test controls exactly what auth state
// ProtectedRoute sees, without needing a real AuthProvider,
// localStorage, or API calls.
const mockUseAuth = vi.fn();
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Helper: renders ProtectedRoute inside a router so <Navigate>
// (used internally for redirects) has somewhere valid to redirect
// to/from.
const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Secret Dashboard Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe("ProtectedRoute", () => {
  it("shows a loader while auth state is still being checked", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: true });
    renderWithRouter();

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.queryByText("Secret Dashboard Content"),
    ).not.toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });
    renderWithRouter();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(
      screen.queryByText("Secret Dashboard Content"),
    ).not.toBeInTheDocument();
  });

  it("renders the protected content when authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, loading: false });
    renderWithRouter();

    expect(screen.getByText("Secret Dashboard Content")).toBeInTheDocument();
  });
});
