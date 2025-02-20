import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { MantineProvider } from "@mantine/core";
import LoginForm from "../app/components/LoginForm/loginForm";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginForm Component", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  const renderWithMantine = (component: React.ReactNode) =>
    render(<MantineProvider>{component}</MantineProvider>);

  it("renders login form correctly", () => {
    renderWithMantine(<LoginForm />);
    expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/hello@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your password/i)).toBeInTheDocument();
  });

  it("shows an error when fields are empty", async () => {
    renderWithMantine(<LoginForm />);
    fireEvent.click(screen.getByText(/Login/i));
    expect(screen.getByText(/Email and password are required/i)).toBeInTheDocument();
  });

  it("calls API on successful login and stores token", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ token: "fake-jwt-token" }),
      } as Response)
    );

    renderWithMantine(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/hello@gmail.com/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Your password/i), {
      target: { value: "password123" },
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/Login/i));
    });

    // Wait for async state updates
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(global.fetch).toHaveBeenCalledWith("/api/login", expect.any(Object));
    expect(localStorage.getItem("token")).toBe("fake-jwt-token");
    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });
});
