import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { useAuth } from "../hooks/useAuth";

vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn()
}));

vi.mock("react-router", () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>
}));

const mockedUseAuth = vi.mocked(useAuth);

beforeEach(() => {
  mockedUseAuth.mockReset();
});

describe("RouteGuards", () => {
  it("hides protected content while auth is loading", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: true,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn()
    });

    const { container } = render(
      <ProtectedRoute>
        <div>Secret content</div>
      </ProtectedRoute>
    );

    expect(container.firstChild).toBeNull();
  });

  it("redirects unauthenticated users from protected routes", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn()
    });

    render(
      <ProtectedRoute>
        <div>Secret content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("navigate")).toHaveTextContent("/login");
  });

  it("renders protected content when the user is signed in", () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "user-1", email: "test@example.com" },
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn()
    });

    render(
      <ProtectedRoute>
        <div>Secret content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Secret content")).toBeInTheDocument();
  });

  it("redirects signed in users away from public routes", () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "user-1", email: "test@example.com" },
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn()
    });

    render(
      <PublicRoute>
        <div>Login screen</div>
      </PublicRoute>
    );

    expect(screen.getByTestId("navigate")).toHaveTextContent("/dashboard");
  });
});
