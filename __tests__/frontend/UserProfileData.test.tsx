import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserProfileData from "@/components/ui/UserProfileData/UserProfileData";
import { useSession } from "next-auth/react";
import { MantineProvider } from "@mantine/core";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

global.fetch = vi.fn();

vi.mock("@/utils/sound", () => ({
  uiClick: { play: vi.fn() },
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<{}>) => (
      <div data-testid="edit-username-form" {...props}>
        {children}
      </div>
    ),
  },
}));

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("UserProfileData Component", () => {
  const mockUpdateSession = vi.fn();
  const mockUser = {
    id: "user123",
    email: "test@example.com",
    username: "testuser",
    hasCompletedProficiencyQuiz: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSession).mockReturnValue({
      data: {
        user: mockUser,
        expires: "",
      },
      status: "authenticated",
      update: mockUpdateSession,
    });

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        username: "testuser",
        createdAt: "2023-01-01T00:00:00Z",
      }),
      text: async () => "",
    } as Response);
  });

  it("renders loading state when session is loading", async () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "loading",
      update: mockUpdateSession,
    });

    renderWithMantine(<UserProfileData />);

    const loaderElement = document.querySelector(".mantine-Loader-root");
    expect(loaderElement).toBeInTheDocument();
  });

  it("shows message when user is not authenticated", async () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: mockUpdateSession,
    });

    renderWithMantine(<UserProfileData />);

    expect(
      screen.getByText("Please sign in to view your profile."),
    ).toBeInTheDocument();
  });

  it("fetches and displays user information when authenticated", async () => {
    renderWithMantine(<UserProfileData />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/user-info"),
        expect.any(Object),
      );
    });

    expect(screen.getByText(/Username:(.*)testuser/)).toBeInTheDocument();
    expect(screen.getByText(/Email:(.*)test@example.com/)).toBeInTheDocument();
  });

  it("enters edit mode when the edit button is clicked", async () => {
    renderWithMantine(<UserProfileData />);

    await waitFor(() => {
      expect(screen.getByText(/Username:(.*)testuser/)).toBeInTheDocument();
    });

    const editButton = screen.getByLabelText("Edit Username");
    fireEvent.click(editButton);

    expect(
      screen.getByPlaceholderText("Enter new username"),
    ).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("cancels editing when cancel button is clicked", async () => {
    renderWithMantine(<UserProfileData />);

    await waitFor(() => {
      expect(screen.getByText(/Username:(.*)testuser/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Edit Username"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(
      screen.queryByPlaceholderText("Enter new username"),
    ).not.toBeInTheDocument();
  });

  it("successfully updates the username", async () => {
    vi.mocked(global.fetch).mockImplementation(async (url) => {
      if (url === "/api/auth/update-username") {
        return {
          ok: true,
          json: async () => ({ username: "newUsername" }),
        } as Response;
      }
      return {
        ok: true,
        json: async () => ({
          username: "testuser",
          createdAt: "2023-01-01T00:00:00Z",
        }),
        text: async () => "",
      } as Response;
    });

    renderWithMantine(<UserProfileData />);

    await waitFor(() => {
      expect(screen.getByText(/Username:(.*)testuser/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Edit Username"));

    const usernameInput = screen.getByPlaceholderText("Enter new username");
    fireEvent.change(usernameInput, { target: { value: "newUsername" } });

    const saveButton = screen.getByText("Save");
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/update-username",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ username: "newUsername" }),
      }),
    );

    expect(mockUpdateSession).toHaveBeenCalled();
  });

  it("handles API errors when updating username", async () => {
    vi.mocked(global.fetch).mockImplementation(async (url) => {
      if (url === "/api/auth/update-username") {
        return {
          ok: false,
          json: async () => ({ error: "Username already exists" }),
        } as Response;
      }
      return {
        ok: true,
        json: async () => ({
          username: "testuser",
          createdAt: "2023-01-01T00:00:00Z",
        }),
        text: async () => "",
      } as Response;
    });

    renderWithMantine(<UserProfileData />);

    await waitFor(() => {
      expect(screen.getByText(/Username:(.*)testuser/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Edit Username"));
    fireEvent.change(screen.getByPlaceholderText("Enter new username"), {
      target: { value: "newUsername" },
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Save"));
    });

    expect(screen.getByText("Username already exists")).toBeInTheDocument();
  });

  it("disables the save button when username is unchanged", async () => {
    renderWithMantine(<UserProfileData />);

    await waitFor(() => {
      expect(screen.getByText(/Username:(.*)testuser/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Edit Username"));

    const editSection = screen.getByTestId("edit-username-form");
    const saveButton = within(editSection).getByRole("button", {
      name: /save/i,
    });

    expect(saveButton).toBeDisabled();
  });

  it("handles API errors when fetching user info", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithMantine(<UserProfileData />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching user info:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });
});
