import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Root from "@/components/ui/RootContents/RootContents";
import { MantineProvider } from "@mantine/core";
import { vi } from "vitest";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("./RootContents.module.css", () => ({
  root: "root",
  title: "title",
  subtitle: "subtitle",
  button: "button",
}));

describe("Root component", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  test("renders without crashing", () => {
    render(
      <MantineProvider>
        <Root />
      </MantineProvider>
    );
    expect(screen.getByText(/Expand your knowledge/i)).toBeInTheDocument();
    expect(screen.getByText(/Fluently is an app to help your education/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Get Started/i })).toBeInTheDocument();
  });

  test("clicking Get Started button navigates to /login", () => {
    render(
      <MantineProvider>
        <Root />
      </MantineProvider>
    );
    const button = screen.getByRole("button", { name: /Get Started/i });
    fireEvent.click(button);
    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});
