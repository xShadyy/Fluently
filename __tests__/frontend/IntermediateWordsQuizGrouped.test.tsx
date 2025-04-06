import React from "react";
import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import DashRoot from "@/components/ui/IntermediateWordsQuizGrouped/IntermediateWordsQuizGrouped";
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@/components/ui/UserHeader/UserHeader", () => ({
  default: ({ disableAnimation }: any) => (
    <div data-testid="user-header">UserHeader: {String(disableAnimation)}</div>
  ),
}));

vi.mock("@/components/ui/SideMenu/SideMenu", () => ({
  default: ({ disableAnimation }: any) => (
    <div data-testid="side-menu">SideMenu: {String(disableAnimation)}</div>
  ),
}));

vi.mock("@/components/ui/IntermediateWordsQuiz/IntermediateWordsQuiz", () => ({
  default: () => (
    <div data-testid="intermediate-quiz">IntermediateWordsQuiz</div>
  ),
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

describe("DashRoot (IntermediateWordsQuizGrouped) component", () => {
  it("renders subcomponents with default props", () => {
    renderWithMantine(<DashRoot />);
    expect(screen.getByTestId("user-header")).toHaveTextContent("false");
    expect(screen.getByTestId("side-menu")).toHaveTextContent("false");
    expect(screen.getByTestId("intermediate-quiz")).toBeInTheDocument();
  });

  it("passes disableAnimation=true to children", () => {
    renderWithMantine(<DashRoot disableAnimation={true} />);
    expect(screen.getByTestId("user-header")).toHaveTextContent("true");
    expect(screen.getByTestId("side-menu")).toHaveTextContent("true");
  });
});
