import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/components/ui/LoginForm/loginForm";
import { vi, type Mock } from "vitest";
import { MantineProvider } from "@mantine/core";
import React from "react";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const renderWithMantine = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("LoginForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("renders the form elements", () => {
    renderWithMantine(<LoginForm />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("displays an error when email and password are empty", async () => {
    renderWithMantine(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    expect(
      await screen.findByText("Email and password are required"),
    ).toBeInTheDocument();
  });

  it("calls login API and redirects on successful login", async () => {
    const fetchMock = global.fetch as unknown as Mock;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderWithMantine(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/login", expect.any(Object));
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays an error message on failed login attempt", async () => {
    const errorMessage = "Invalid email or password";
    const fetchMock = global.fetch as unknown as Mock;
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage }),
    });

    renderWithMantine(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
