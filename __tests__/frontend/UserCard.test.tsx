import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UserCard from "app/components/ui/UserCard/UserCard";
import "@testing-library/jest-dom";

vi.mock("@mantine/core", () => {
  const Group = ({ children, gap, mb }) => (
    <div data-testid="mantine-group" data-gap={gap} data-mb={mb}>
      {children}
    </div>
  );
  const Stack = ({ children, gap, align }) => (
    <div data-testid="mantine-stack" data-gap={gap} data-align={align}>
      {children}
    </div>
  );
  const Text = ({ children, size, c, fw }) => (
    <div
      data-testid="mantine-text"
      data-size={size}
      data-color={c}
      data-fontweight={fw}
    >
      {children}
    </div>
  );
  const Avatar = ({ children, size, radius, color, src }) => (
    <div
      data-testid="mantine-avatar"
      data-size={size}
      data-radius={radius}
      data-color={color}
      data-src={src}
    >
      {children}
    </div>
  );

  function Menu({ children }) {
    return <div data-testid="menu-root">{children}</div>;
  }
  Menu.Target = ({ children }) => (
    <div data-testid="menu-target">{children}</div>
  );
  Menu.Dropdown = ({ children }) => (
    <div data-testid="menu-dropdown">{children}</div>
  );
  Menu.Item = ({ children }) => <div data-testid="menu-item">{children}</div>;
  Menu.Label = ({ children }) => <div data-testid="menu-label">{children}</div>;
  Menu.Divider = () => <div data-testid="menu-divider" />;
  return { Group, Stack, Text, Avatar, Menu };
});

describe("UserCard Component", () => {
  const mockUser = {
    username: "John Doe",
    email: "john.doe@example.com",
    createdAt: "2023-01-01T00:00:00.000Z",
  };

  it("renders correctly with user data", () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText(/Welcome back John Doe/i)).toBeInTheDocument();

    expect(screen.getByText(mockUser.email)).toBeInTheDocument();

    const avatar = screen.getByTestId("mantine-avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute(
      "data-src",
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockUser.username}`,
    );
  });

  it("renders avatar with correct initials when no avatar image is provided", () => {
    render(<UserCard user={mockUser} />);
    const avatar = screen.getByTestId("mantine-avatar");
    expect(avatar).toHaveTextContent("JD");
  });

  it("handles single name usernames correctly for initials", () => {
    const singleNameUser = {
      username: "John",
      email: "john@example.com",
      createdAt: "2023-01-01T00:00:00.000Z",
    };
    render(<UserCard user={singleNameUser} />);
    const avatar = screen.getByTestId("mantine-avatar");
    expect(avatar).toHaveTextContent("JO");
  });

  it("handles empty username gracefully", () => {
    const noNameUser = {
      username: "",
      email: "anonymous@example.com",
      createdAt: "2023-01-01T00:00:00.000Z",
    };
    render(<UserCard user={noNameUser} />);
    const avatar = screen.getByTestId("mantine-avatar");
    expect(avatar).toHaveTextContent("");
  });

  it("renders with proper Mantine components and styling", () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByTestId("mantine-group")).toBeInTheDocument();
    expect(screen.getByTestId("mantine-stack")).toBeInTheDocument();

    const texts = screen.getAllByTestId("mantine-text");

    expect(texts[0]).toHaveAttribute("data-size", "lg");
    expect(texts[0]).toHaveAttribute("data-color", "whitesmoke");
    expect(texts[0]).toHaveAttribute("data-fontweight", "500");

    expect(texts[1]).toHaveAttribute("data-size", "md");
    expect(texts[1]).toHaveAttribute("data-color", "rgb(251, 207, 232)");
  });
});
