import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageDashboard from "@/components/ui/Dashboard/LanguageDashboard";
import { MantineProvider } from "@mantine/core";

global.fetch = vi.fn();

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const renderWithMantine = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("LanguageDashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (localStorageMock.clear as any)();

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        completions: [
          { difficulty: "Beginner", completedAt: new Date().toISOString() },
        ],
      }),
    });
  });

  it("renders the main dashboard elements correctly", async () => {
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/quiz/achievements/check");
    });

    expect(screen.getByText("Words Learned")).toBeInTheDocument();
    expect(screen.getByText("Daily Goal")).toBeInTheDocument();
    expect(screen.getByText("Current Streak")).toBeInTheDocument();
    expect(screen.getByText("Time Spent")).toBeInTheDocument();

    expect(screen.getByText("Skill Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Weekly Progress")).toBeInTheDocument();
  });

  it("shows the correct achievement status", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        completions: [
          { difficulty: "Beginner", completedAt: new Date().toISOString() },
        ],
      }),
    });

    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(screen.getByText("Word Quiz Achievements")).toBeInTheDocument();

    const achievements = screen.getAllByText(/Master|Expert|Champion/);
    expect(achievements).toHaveLength(3);
  });

  it("initializes localStorage with learning start time on first visit", async () => {
    localStorageMock.getItem.mockReturnValue(null);

    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });

    await waitFor(
      () => {
        expect(localStorageMock.setItem).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );

    const calls = (localStorageMock.setItem as any).mock.calls;
    const learningStartTimeCall = calls.find(
      ([key]: [string, any]) => key === "learningStartTime",
    );
    expect(learningStartTimeCall).toBeDefined();
  });

  it("uses existing localStorage start time if available", async () => {
    const mockDate = new Date(2023, 0, 1).toISOString();
    localStorageMock.getItem.mockReturnValue(mockDate);

    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });

    const calls = (localStorageMock.setItem as any).mock.calls;
    const learningStartTimeCall = calls.find(
      ([key]: [string, any]) => key === "learningStartTime",
    );
    expect(learningStartTimeCall).toBeUndefined();
  });

  it("allows adding new words via the modal", async () => {
    const user = userEvent.setup();

    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });

    const addButton = screen.getByText("Add");
    await user.click(addButton);

    expect(
      screen.getByText("How many new words did you learn today?"),
    ).toBeInTheDocument();

    const input = screen.getByRole("spinbutton");
    await user.clear(input);
    await user.type(input, "50");

    const submitButton = screen.getByText("Add Words");
    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("How many new words did you learn today?"),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText("1300")).toBeInTheDocument();
  });

  it("displays daily goal data correctly", async () => {
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });

    const dailyGoalSection = screen.getByText("Daily Goal").closest("div");
    expect(dailyGoalSection).toBeInTheDocument();

    if (dailyGoalSection) {
      const value = within(
        dailyGoalSection.parentElement as HTMLElement,
      ).getByText("75%");
      expect(value).toBeInTheDocument();
    }
  });

  it("displays streak data correctly", async () => {
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });

    expect(screen.getByText("12 days")).toBeInTheDocument();
    expect(screen.getByText("Keep it up! 🔥")).toBeInTheDocument();
  });

  it("displays skill breakdown correctly", async () => {
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });

    const skills = ["Reading", "Writing", "Listening", "Speaking"];

    skills.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it("displays weekly progress correctly", async () => {
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    weekdays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it("handles achievement data with multiple completed quizzes", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        completions: [
          { difficulty: "Beginner", completedAt: new Date().toISOString() },
          { difficulty: "Intermediate", completedAt: new Date().toISOString() },
          { difficulty: "Advanced", completedAt: new Date().toISOString() },
        ],
      }),
    });

    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/quiz/achievements/check");
    });

    const achievementsSection = screen
      .getByText("Word Quiz Achievements")
      .closest("div");
    expect(achievementsSection).toBeInTheDocument();

    const achievementCards = screen
      .getAllByText(/Master|Expert|Champion/)
      .map((el) => el.closest("[class*='achievementCard']"));
    expect(achievementCards).toHaveLength(3);

    achievementCards.forEach((card) => {
      expect(card).not.toHaveClass("lockedAchievement");
    });
  });

  it("handles fetch failure gracefully", async () => {
    (global.fetch as any).mockRejectedValue(new Error("API error"));

    console.error = vi.fn();

    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/quiz/achievements/check");
    });

    expect(screen.getByText("Words Learned")).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });
});
