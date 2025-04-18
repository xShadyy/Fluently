import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SideMenu from "@/components/ui/SideMenu/SideMenu";
import { usePathname, useRouter } from "next/navigation";
import { MantineProvider } from "@mantine/core";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock("@/utils/sound", () => ({
  uiClick: { play: vi.fn() },
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<{}>) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}));

const renderWithMantine = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("SideMenu Component", () => {
  const mockRouterPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRouter).mockReturnValue({
      push: mockRouterPush,
    } as any);

    vi.mocked(usePathname).mockReturnValue("/dashboard");
  });

  it("renders all navigation links", () => {
    renderWithMantine(<SideMenu />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Materials")).toBeInTheDocument();
    expect(screen.getByText("Words")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Translator")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("highlights the active link based on pathname", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard/materials");

    renderWithMantine(<SideMenu />);

    const materialsLink = screen.getByText("Materials").closest("button");
    expect(materialsLink?.className).toContain("_active_");

    const dashboardLink = screen.getByText("Dashboard").closest("button");
    expect(dashboardLink?.className).not.toContain("_active_");
  });

  it("handles more specific routes correctly", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard/words/advanced");

    renderWithMantine(<SideMenu />);

    const wordsLink = screen.getByText("Words").closest("button");
    expect(wordsLink?.className).toContain("_active_");
  });

  it("navigates when a link is clicked", () => {
    renderWithMantine(<SideMenu />);

    const materialsLink = screen.getByText("Materials");
    fireEvent.click(materialsLink);

    expect(mockRouterPush).toHaveBeenCalledWith("/dashboard/materials");
  });

  it("logs out when clicking the logout button", () => {
    renderWithMantine(<SideMenu />);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(mockRouterPush).toHaveBeenCalledWith("/login");
  });

  it("uses motion animation by default", () => {
    renderWithMantine(<SideMenu />);

    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
  });

  it("disables animation when disableAnimation=true", () => {
    renderWithMantine(<SideMenu disableAnimation={true} />);

    expect(screen.queryByTestId("motion-div")).not.toBeInTheDocument();
  });
});
