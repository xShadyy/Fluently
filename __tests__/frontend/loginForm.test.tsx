import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MantineProvider } from "@mantine/core";
import LoginForm from "@/components/ui/LoginForm/loginForm";

// Mocking dependencies with factory functions to prevent hoisting issues
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({ push: mockPush }),
}));

// Using a factory function that returns the mock implementation
vi.mock("next-auth/react", () => {
  return {
    __esModule: true,
    signIn: vi.fn(),
  };
});

// Import the mocked module after mocking
import { signIn } from "next-auth/react";
const mockSignIn = signIn as ReturnType<typeof vi.fn>;

describe("LoginForm", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockSignIn.mockReset();
  });

  const renderWithMantine = (ui: React.ReactElement) =>
    render(ui, {
      wrapper: ({ children }) => <MantineProvider>{children}</MantineProvider>,
    });

  it("renders the login form correctly", () => {
    renderWithMantine(<LoginForm />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("calls signIn and redirects on successful login", async () => {
    mockSignIn.mockResolvedValue({ url: "/dashboard", error: undefined });

    renderWithMantine(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/Email address/i), "test@e.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "secret");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "test@e.com",
        password: "secret",
        redirect: false,
        callbackUrl: "/dashboard",
      });
    });
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("displays error when signIn returns an error", async () => {
    mockSignIn.mockResolvedValue({ error: "Invalid credentials" });

    renderWithMantine(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/Email address/i), "a@b.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("displays validation error when email or password is missing", async () => {
    renderWithMantine(<LoginForm />);
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText("Email and password are required")
    ).toBeInTheDocument();
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("handles unexpected errors during login", async () => {
    mockSignIn.mockRejectedValue(new Error("Unexpected error"));

    renderWithMantine(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/Email address/i), "test@e.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "secret");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText("An error occurred during login")
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("toggles 'Keep me logged in' checkbox", async () => {
    renderWithMantine(<LoginForm />);
    const checkbox = screen.getByLabelText(/Keep me logged in/i);

    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("renders social media links", () => {
    renderWithMantine(<LoginForm />);
    
    // Get all links in the document
    const links = screen.getAllByRole("link");
    
    // Find links by their href attributes
    const instagramLink = links.find(link => 
      link.getAttribute('href') === "https://www.instagram.com/g80.shadyy/"
    );
    const linkedinLink = links.find(link => 
      link.getAttribute('href') === "https://www.linkedin.com/in/tymoteusz-netter/"
    );
    const githubLink = links.find(link => 
      link.getAttribute('href') === "https://github.com/xShadyy"
    );
    
    expect(instagramLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
  });
});