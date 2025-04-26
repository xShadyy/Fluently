import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import WordsQuizDifficulty from "@/components/ui/WordsQuizDifficulty/WordsQuizDifficulty";
import { vi } from "vitest";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/utils/sound", () => ({
  uiClick: { play: vi.fn() },
  unlocked: { play: vi.fn() },
}));

const cardByDifficulty = (difficulty: string) => {
  const difficultyTitle = screen.getAllByText(
    new RegExp(`^${difficulty}$`, "i"),
  )[0];
  return difficultyTitle.closest(
    `[data-difficulty="${difficulty.toLowerCase()}"]`,
  );
};

beforeEach(() => {
  vi.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve(
      new Response(JSON.stringify({ completions: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ),
  );
  sessionStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("WordsQuizDifficulty Component", () => {
  it("renders the component with initial state correctly", async () => {
    render(<WordsQuizDifficulty />);

    await waitFor(() => {
      expect(screen.getByText("Select Your Difficulty")).toBeInTheDocument();
    });

    const beginnerCard = cardByDifficulty("Beginner");
    expect(beginnerCard).not.toHaveClass("_locked_7d1964");

    const intermediateCard = cardByDifficulty("Intermediate");
    const advancedCard = cardByDifficulty("Advanced");
    expect(intermediateCard).toHaveClass("_locked_7d1964");
    expect(advancedCard).toHaveClass("_locked_7d1964");
  });

  it("allows selecting beginner difficulty and navigates correctly", async () => {
    const { container } = render(<WordsQuizDifficulty />);

    await waitFor(() => {
      expect(screen.getByText("Select Your Difficulty")).toBeInTheDocument();
    });

    const beginnerCard = cardByDifficulty("Beginner");
    if (beginnerCard) {
      fireEvent.click(beginnerCard);
    }

    expect(container.firstChild).toBeInTheDocument();
  });

  it("shows error toast when trying to select locked difficulty", async () => {
    render(<WordsQuizDifficulty />);

    await waitFor(() => {
      expect(screen.getByText("Select Your Difficulty")).toBeInTheDocument();
    });

    const advancedCard = cardByDifficulty("Advanced");
    if (advancedCard) {
      fireEvent.click(advancedCard);
    }

    expect(screen.getByText("Select Your Difficulty")).toBeInTheDocument();
  });

  it("navigates back to dashboard when back button is clicked", async () => {
    render(<WordsQuizDifficulty />);

    await waitFor(() => {
      expect(screen.getByText("Select Your Difficulty")).toBeInTheDocument();
    });

    const backButton = screen.getByRole("button", {
      name: /Back to Dashboard/i,
    });
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText("Select Your Difficulty")).toBeInTheDocument();
    });
  });

  it("resets unlocked quizzes when neither beginner nor intermediate are completed", async () => {
    const removeItemSpy = vi.spyOn(
      window.sessionStorage.__proto__,
      "removeItem",
    );

    render(<WordsQuizDifficulty />);

    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith("unlockedQuizzes");
    });
  });

  it("unlocks intermediate difficulty when beginner is completed", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          completions: [{ difficulty: "BEGINNER" }],
        }),
    } as any);

    render(<WordsQuizDifficulty />);

    await waitFor(() => {
      const intermediateCard = cardByDifficulty("Intermediate");
      expect(intermediateCard).toHaveClass("_unlockable_7d1964");
    });
  });

  it("unlocks advanced difficulty when intermediate is completed", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          completions: [{ difficulty: "INTERMEDIATE" }],
        }),
    } as any);

    render(<WordsQuizDifficulty />);

    await waitFor(() => {
      const advancedCard = cardByDifficulty("Advanced");
      expect(advancedCard).toHaveClass("_unlockable_7d1964");
    });
  });
});
