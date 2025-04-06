if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/",
}));

vi.mock("app/components/ui/SideMenu/SideMenu", () => {
  const React = require("react");
  return {
    default: ({ disableAnimation }: { disableAnimation?: boolean }) => (
      <div data-testid="sidemenu">
        SideMenu - disableAnimation: {disableAnimation ? "true" : "false"}
      </div>
    ),
  };
});

vi.mock("app/components/ui/UserHeader/UserHeader", () => {
  const React = require("react");
  return {
    default: ({ disableAnimation }: { disableAnimation?: boolean }) => (
      <div data-testid="user-header">
        UserHeader - disableAnimation: {disableAnimation ? "true" : "false"}
      </div>
    ),
  };
});

vi.mock("app/components/ui/WordsQuizDifficulty/WordsQuizDifficulty", () => {
  const React = require("react");
  return {
    default: () => (
      <div data-testid="words-quiz-difficulty">WordsQuizDifficulty</div>
    ),
  };
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, afterEach } from "vitest";
import { MantineProvider } from "@mantine/core";
import DashRoot from "app/components/ui/WordsQuizDifficultyGrouped/WordsQuizDifficultyGrouped";

const renderWithProviders = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("DashRoot (WordsQuizDifficultyGrouped)", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders child components with default props (disableAnimation false)", () => {
    renderWithProviders(<DashRoot />);
    expect(screen.getByTestId("user-header")).toHaveTextContent(
      "disableAnimation: false",
    );
    expect(screen.getByTestId("sidemenu")).toHaveTextContent(
      "disableAnimation: false",
    );
    expect(screen.getByTestId("words-quiz-difficulty")).toBeInTheDocument();
  });

  it("renders child components with disableAnimation true", () => {
    renderWithProviders(<DashRoot disableAnimation={true} />);
    expect(screen.getByTestId("user-header")).toHaveTextContent(
      "disableAnimation: true",
    );
    expect(screen.getByTestId("sidemenu")).toHaveTextContent(
      "disableAnimation: true",
    );
    expect(screen.getByTestId("words-quiz-difficulty")).toBeInTheDocument();
  });
});
