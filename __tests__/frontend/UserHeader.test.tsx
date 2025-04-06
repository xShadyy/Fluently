import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, afterEach, vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import UserHeader from "app/components/ui/UserHeader/UserHeader";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("app/components/ui/UserCard/UserCard", () => {
  const React = require("react");
  return {
    default: ({ user }: { user: any }) => (
      <div data-testid="user-card">User: {user.name}</div>
    ),
  };
});

describe("UserHeader", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
  };

  it("renders 'Not logged in' when the fetched user is null", async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      {
        ok: true,
        json: async () => ({ user: null }),
      },
    );

    renderWithProviders(<UserHeader />);
    await waitFor(() => {
      expect(screen.getByText("Not logged in")).toBeInTheDocument();
    });
  });

  it("renders the UserCard when a user is fetched", async () => {
    const mockUser = { name: "Test User" };

    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      {
        ok: true,
        json: async () => ({ user: mockUser }),
      },
    );

    renderWithProviders(<UserHeader />);
    await waitFor(() => {
      expect(screen.getByTestId("user-card")).toHaveTextContent(
        "User: Test User",
      );
    });
  });

  it("renders 'Not logged in' when fetch fails", async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Fetch error"),
    );
    renderWithProviders(<UserHeader />);
    await waitFor(() => {
      expect(screen.getByText("Not logged in")).toBeInTheDocument();
    });
  });
});
