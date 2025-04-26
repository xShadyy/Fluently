import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import Materials from "@/components/ui/Materials/Materials";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    create: () => (props: any) => <a {...props} />,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("Materials Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the main header and subtitle", () => {
    renderWithMantine(<Materials />);
    expect(
      screen.getByRole("heading", { name: /english learning materials/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/discover the best resources/i),
    ).toBeInTheDocument();
  });

  it("renders all tabs", () => {
    renderWithMantine(<Materials />);
    expect(screen.getByRole("tab", { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /reading/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /video/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /audio/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /interactive/i }),
    ).toBeInTheDocument();
  });

  it("renders level filter buttons", () => {
    renderWithMantine(<Materials />);
    expect(
      screen.getByRole("button", { name: /all levels/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /beginner/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /intermediate/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /advanced/i }),
    ).toBeInTheDocument();
  });

  it("expands a resource card on click", async () => {
    const user = userEvent.setup();
    renderWithMantine(<Materials />);
    const titles = screen.getAllByRole("heading", { level: 3 });
    await user.click(titles[0]);

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: /visit resource/i }),
      ).toBeInTheDocument();
    });
  });

  it("filters resources by type", async () => {
    const user = userEvent.setup();
    renderWithMantine(<Materials />);
    await user.click(screen.getByRole("tab", { name: /reading/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/reading/i).length).toBeGreaterThan(0);
    });
  });

  it("filters resources by level", async () => {
    const user = userEvent.setup();
    renderWithMantine(<Materials />);
    await user.click(screen.getByRole("button", { name: /beginner/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/beginner/i).length).toBeGreaterThan(0);
    });
  });

  it("shows no results and reset button", async () => {
    const user = userEvent.setup();
    renderWithMantine(<Materials />);
    await user.click(screen.getByRole("tab", { name: /interactive/i }));
    await user.click(screen.getByRole("button", { name: /advanced/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/no interactive resources found/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /reset level filter/i }),
      ).toBeInTheDocument();
    });
  });
});
