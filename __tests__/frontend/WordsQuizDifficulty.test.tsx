import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WordsQuizDifficulty from "@/components/ui/WordsQuizDifficulty/WordsQuizDifficulty";
import { uiClick, unlocked } from "@/utils/sound";
import { toast } from "react-hot-toast";
import "@testing-library/jest-dom";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/utils/sound", () => ({
  uiClick: { play: vi.fn() },
  unlocked: { play: vi.fn() },
}));

vi.mock("react-hot-toast", () => ({
  toast: { error: vi.fn() },
}));

const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
});

global.fetch = vi.fn();

function mockFetchResponses(
  completionData: any = {},
  achievementsData: any = { completions: [] },
) {
  (global.fetch as vi.Mock).mockImplementation((url: string) => {
    if (url.includes("/api/quiz/completion")) {
      return Promise.resolve({ json: () => Promise.resolve(completionData) });
    }
    if (url.includes("/api/quiz/achievements/check")) {
      return Promise.resolve({ json: () => Promise.resolve(achievementsData) });
    }
    return Promise.reject(new Error("Unhandled fetch"));
  });
}

describe("WordsQuizDifficulty Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSessionStorage.getItem.mockReturnValue(JSON.stringify(["beginner"]));
    mockFetchResponses({}, { completions: [] });
  });

  it("renders the component with initial state correctly", async () => {
    const { container } = render(<WordsQuizDifficulty />);

    const intermediateCard = container.querySelector<HTMLDivElement>(
      'div[data-difficulty="intermediate"]',
    )!;
    const advancedCard = container.querySelector<HTMLDivElement>(
      'div[data-difficulty="advanced"]',
    )!;

    await waitFor(() => {
      expect(intermediateCard.className).toMatch(/_locked_/);
      expect(advancedCard.className).toMatch(/_locked_/);
    });
  });

  it("allows selecting beginner difficulty and navigates correctly", async () => {
    const { container } = render(<WordsQuizDifficulty />);
    const beginnerCard = container.querySelector<HTMLDivElement>(
      'div[data-difficulty="beginner"]',
    )!;

    fireEvent.click(beginnerCard);
    expect(uiClick.play).toHaveBeenCalled();

    await waitFor(() => {
      expect(beginnerCard.className).toMatch(/_selected_/);
    });

    const startButton = await screen.findByText("Start Quiz");
    fireEvent.click(startButton);
    expect(mockPush).toHaveBeenCalledWith("/dashboard/words/beginner");
  });

  it("shows error toast when trying to select locked difficulty", () => {
    const { container } = render(<WordsQuizDifficulty />);
    const intermediateCard = container.querySelector<HTMLDivElement>(
      'div[data-difficulty="intermediate"]',
    )!;

    fireEvent.click(intermediateCard);
    expect(toast.error).toHaveBeenCalledWith(
      "Complete the previous quiz first!",
    );
  });

  it("unlocks intermediate difficulty when beginner is completed", async () => {
    mockFetchResponses(
      { beginner: true },
      {
        completions: [
          { difficulty: "BEGINNER", completedAt: new Date().toISOString() },
        ],
      },
    );

    const { container } = render(<WordsQuizDifficulty />);
    const intermediateCard = () =>
      container.querySelector<HTMLDivElement>(
        'div[data-difficulty="intermediate"]',
      )!;

    await waitFor(() => {
      expect(intermediateCard().className).toMatch(/_unlockable_/);
    });

    fireEvent.click(intermediateCard());
    expect(unlocked.play).toHaveBeenCalled();

    vi.useFakeTimers();
    vi.runAllTimers();
    vi.useRealTimers();

    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        "unlockedQuizzes",
        JSON.stringify(["beginner", "intermediate"]),
      );
    });
  });

  it("unlocks advanced difficulty when intermediate is completed", async () => {
    mockSessionStorage.getItem.mockReturnValue(
      JSON.stringify(["beginner", "intermediate"]),
    );
    mockFetchResponses(
      { beginner: true, intermediate: true },
      {
        completions: [
          { difficulty: "BEGINNER", completedAt: new Date().toISOString() },
          { difficulty: "INTERMEDIATE", completedAt: new Date().toISOString() },
        ],
      },
    );

    const { container } = render(<WordsQuizDifficulty />);
    const advancedCard = () =>
      container.querySelector<HTMLDivElement>(
        'div[data-difficulty="advanced"]',
      )!;

    await waitFor(() => {
      expect(advancedCard().className).toMatch(/_unlockable_/);
    });

    fireEvent.click(advancedCard());
    expect(unlocked.play).toHaveBeenCalled();

    vi.useFakeTimers();
    vi.runAllTimers();
    vi.useRealTimers();

    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        "unlockedQuizzes",
        JSON.stringify(["beginner", "intermediate", "advanced"]),
      );
    });
  });

  it("navigates back to dashboard when back button is clicked", () => {
    render(<WordsQuizDifficulty />);
    fireEvent.click(screen.getByText("Back to Dashboard"));
    expect(mockPush).toHaveBeenCalledWith("/dashboard/words");
  });

  it("resets unlocked quizzes when neither beginner nor intermediate are completed", async () => {
    mockFetchResponses({}, { completions: [] });
    render(<WordsQuizDifficulty />);
    await waitFor(() => {
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(
        "unlockedQuizzes",
      );
    });
  });
});
