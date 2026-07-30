import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../../context/AuthContext";

// Mock the service layer — AuthContext should never talk to a real
// backend in a unit test. This also verifies the architectural rule
// that AuthContext depends on authService, not axios directly.
vi.mock("../../services/authService", () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  getProfile: vi.fn(),
}));

const authService = await import("../../services/authService");

// A minimal consumer component to exercise the context through its
// public API, the same way a real page (Login.jsx) would.
const TestConsumer = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <p data-testid="status">{isAuthenticated ? "logged-in" : "logged-out"}</p>
      <p data-testid="username">{user?.name || "none"}</p>
      <button onClick={() => login("ravi@test.com", "secret123")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("starts logged out with no stored session", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("logged-out");
    });
  });

  it("logs in successfully and persists the session to localStorage", async () => {
    authService.loginUser.mockResolvedValue({
      success: true,
      data: {
        _id: "1",
        name: "Ravi",
        email: "ravi@test.com",
        token: "fake-jwt-token",
      },
    });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("logged-in");
    });
    expect(screen.getByTestId("username")).toHaveTextContent("Ravi");
    expect(localStorage.getItem("khaatapushtak_token")).toBe("fake-jwt-token");
  });

  it("logs out and clears localStorage", async () => {
    authService.loginUser.mockResolvedValue({
      success: true,
      data: {
        _id: "1",
        name: "Ravi",
        email: "ravi@test.com",
        token: "fake-jwt-token",
      },
    });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await user.click(screen.getByText("Login"));
    await waitFor(() => screen.getByText("logged-in"));

    await user.click(screen.getByText("Logout"));

    expect(screen.getByTestId("status")).toHaveTextContent("logged-out");
    expect(localStorage.getItem("khaatapushtak_token")).toBeNull();
  });
});
