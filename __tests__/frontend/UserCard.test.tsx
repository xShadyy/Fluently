import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import UserCard from "@/components/ui/UserCard/UserCard";

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "user123", email: "john@example.com" } },
    status: "authenticated",
    update: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("UserCard", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        username: "John Doe",
        email: "john@example.com",
      }),
    });
  });

  it("renders welcome text and user email", async () => {
    renderWithMantine(<UserCard />);
    expect(
      await screen.findByText(/welcome back john doe/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/john@example.com/i)).toBeInTheDocument();
  });
});
