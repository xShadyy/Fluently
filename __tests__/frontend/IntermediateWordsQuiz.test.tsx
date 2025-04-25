import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IntermediateWordsQuiz from "@/components/ui/IntermediateWordsQuiz/IntermediateWordsQuiz";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MantineProvider } from "@mantine/core";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("@/utils/sound", () => ({
  completed: { play: vi.fn() },
  correct: { play: vi.fn() },
  uiClick: { play: vi.fn() },
  wrong: { play: vi.fn() },
}));

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

global.fetch = vi.fn();

const renderWithMantine = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("IntermediateWordsQuiz Component", () => {
  const mockQuestions = [
    {
      id: "1",
      text: "What is 'procrastinate' in this sentence: 'I always procrastinate my assignments until the last minute.'?",
      options: [
        { id: "opt1", text: "To delay doing something" },
        { id: "opt2", text: "To finish quickly" },
        { id: "opt3", text: "To organize neatly" },
        { id: "opt4", text: "To concentrate deeply" },
      ],
      correctAnswer: { wordsOptionId: "opt1" },
    },
    {
      id: "2",
      text: "What does 'versatile' mean?",
      options: [
        { id: "opt5", text: "Harmful" },
        { id: "opt6", text: "Having many uses or skills" },
        { id: "opt7", text: "Extremely large" },
        { id: "opt8", text: "Very expensive" },
      ],
      correctAnswer: { wordsOptionId: "opt6" },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useSession as Mock).mockReturnValue({
      data: { user: { id: "user1" } },
      status: "authenticated",
    });

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ questions: mockQuestions }),
    });
  });

  it("renders loading state initially", async () => {
    renderWithMantine(<IntermediateWordsQuiz />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders quiz questions after loading", async () => {
    renderWithMantine(<IntermediateWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Question 1 out of 2")).toBeInTheDocument();
    expect(
      screen.getByText(
        "What is 'procrastinate' in this sentence: 'I always procrastinate my assignments until the last minute.'?",
      ),
    ).toBeInTheDocument();

    const delayOption = screen.getByText((content) => {
      return content.includes("To delay doing something");
    });
    expect(delayOption).toBeInTheDocument();
  });

  it("handles correct answer selection", async () => {
    const user = userEvent.setup();
    renderWithMantine(<IntermediateWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const correctOption = screen.getByText((content) =>
      content.includes("To delay doing something"),
    );
    await user.click(correctOption);

    await waitFor(() => {
      expect(screen.getByText("Correct, good job!")).toBeInTheDocument();
    });
  });

  it("handles incorrect answer selection", async () => {
    const user = userEvent.setup();
    renderWithMantine(<IntermediateWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const incorrectOption = screen.getByText((content) =>
      content.includes("To finish quickly"),
    );
    await user.click(incorrectOption);

    await waitFor(() => {
      expect(screen.getByText(/Incorrect/)).toBeInTheDocument();
    });
  });

  it("handles API error when fetching questions", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to fetch questions" }),
    });

    renderWithMantine(<IntermediateWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText("No questions available. Please try again later."),
    ).toBeInTheDocument();
  });
});
