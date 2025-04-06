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
        Sidemenu - disableAnimation: {disableAnimation ? "true" : "false"}
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

vi.mock("app/components/ui/UserProfileData/UserProfileData", () => {
  const React = require("react");
  return {
    default: () => <div data-testid="user-profile-data">UserProfileData</div>,
  };
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, afterEach } from "vitest";
import { MantineProvider } from "@mantine/core";
import DashRoot from "app/components/ui/UserProfileDataGrouped/UserProfileDataGrouped";

const renderWithProviders = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("DashRoot", () => {
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
    expect(screen.getByTestId("user-profile-data")).toBeInTheDocument();
  });

  it("renders child components with disableAnimation true", () => {
    renderWithProviders(<DashRoot disableAnimation={true} />);
    expect(screen.getByTestId("user-header")).toHaveTextContent(
      "disableAnimation: true",
    );
    expect(screen.getByTestId("sidemenu")).toHaveTextContent(
      "disableAnimation: true",
    );
    expect(screen.getByTestId("user-profile-data")).toBeInTheDocument();
  });
});
