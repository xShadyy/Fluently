import React from "react";
import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import DashRoot from "@/components/ui/DashboardGrouped/DashboardGrouped";
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@/components/ui/UserHeader/UserHeader", () => ({
  default: () => <div data-testid="dashboard-header">DashboardHeader</div>,
}));

vi.mock("@/components/ui/SideMenu/SideMenu", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock("@/components/ui/ProficiencyQuiz/ProficiencyQuiz", () => ({
  default: () => <div data-testid="proficiency-quiz">ProficiencyQuiz</div>,
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("DashboardGrouped (DashRoot) component", () => {
  it("renders all expected child components", () => {
    renderWithMantine(<DashRoot />);
    expect(screen.getByTestId("dashboard-header")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("proficiency-quiz")).toBeInTheDocument();
  });
});
