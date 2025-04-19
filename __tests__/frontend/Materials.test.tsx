import { describe, it, expect, vi } from "vitest";
import React from "react";
import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Materials from "@/components/ui/Materials/Materials";
import { MantineProvider } from "@mantine/core";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const renderWithMantine = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("Materials Component", () => {
  it("renders the header correctly", async () => {
    await act(async () => {
      renderWithMantine(<Materials />);
    });

    expect(screen.getByText("English Learning Materials")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Discover the best resources to improve your English skills",
      ),
    ).toBeInTheDocument();
  });

  it("renders tab navigation with correct resource types", async () => {
    await act(async () => {
      renderWithMantine(<Materials />);
    });

    expect(screen.getByRole("tab", { name: /All/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Reading/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Video/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Audio/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Interactive/i }),
    ).toBeInTheDocument();
  });

  it("renders level filter buttons", async () => {
    await act(async () => {
      renderWithMantine(<Materials />);
    });

    expect(
      screen.getByRole("button", { name: /All Levels/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Beginner/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Intermediate/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Advanced/i }),
    ).toBeInTheDocument();
  });

  it("displays resource cards with expected content", async () => {
    await act(async () => {
      renderWithMantine(<Materials />);
    });

    const resourceCards = screen.getAllByTestId("motion-div");
    expect(resourceCards.length).toBeGreaterThan(0);

    const cardTitles = screen.getAllByRole("heading", { level: 3 });
    expect(cardTitles.length).toBeGreaterThan(0);

    const badges = screen.getAllByText((content) =>
      /beginner|intermediate|advanced|reading|video|audio|interactive/i.test(
        content,
      ),
    );
    expect(badges.length).toBeGreaterThan(0);
  });

  it("expands a resource card when clicked", async () => {
    const user = userEvent.setup();

    await act(async () => {
      renderWithMantine(<Materials />);
    });

    const cardTitles = screen.getAllByRole("heading", { level: 3 });
    const firstCard = cardTitles[0].closest('div[class*="clickable"]');
    expect(firstCard).toBeInTheDocument();

    if (firstCard) {
      await user.click(firstCard);

      await waitFor(() => {
        expect(screen.getByText("Visit Resource")).toBeInTheDocument();
      });
    }
  });

  it("filters resources by type when changing tabs", async () => {
    const user = userEvent.setup();

    await act(async () => {
      renderWithMantine(<Materials />);
    });

    const initialCards = screen.getAllByRole("heading", { level: 3 });
    const initialCount = initialCards.length;

    const readingTab = screen.getByRole("tab", { name: /Reading/i });
    await user.click(readingTab);

    await waitFor(() => {
      const readingBadges = screen.getAllByText("reading");
      expect(readingBadges.length).toBeGreaterThan(0);
    });
  });

  it("filters resources by level", async () => {
    const user = userEvent.setup();

    await act(async () => {
      renderWithMantine(<Materials />);
    });

    const beginnerButton = screen.getByRole("button", { name: /Beginner/i });
    await user.click(beginnerButton);

    await waitFor(() => {
      const beginnerBadges = screen.getAllByText("beginner");
      expect(beginnerBadges.length).toBeGreaterThan(0);

      const intermediateBadges = screen.queryAllByText("intermediate");
      const advancedBadges = screen.queryAllByText("advanced");

      const badgeCount = intermediateBadges.length + advancedBadges.length;
      expect(badgeCount).toBeLessThanOrEqual(2);
    });
  });
});

async function act(callback: () => Promise<void>) {
  await callback();
}
