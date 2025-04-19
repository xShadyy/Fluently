import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdvancedWordsQuiz from "@/components/ui/AdvancedWordsQuiz/AdvancedWordsQuiz";
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

describe("AdvancedWordsQuiz Component", () => {
  const mockQuestions = [
    {
      id: "1",
      text: "What is the meaning of 'ubiquitous'?",
      options: [
        { id: "opt1", text: "Present everywhere" },
        { id: "opt2", text: "Very rare" },
        { id: "opt3", text: "Significant" },
        { id: "opt4", text: "Peculiar" },
      ],
      correctAnswer: { wordsOptionId: "opt1" },
    },
    {
      id: "2",
      text: "What does 'ephemeral' mean?",
      options: [
        { id: "opt5", text: "Lasting forever" },
        { id: "opt6", text: "Lasting for a short time" },
        { id: "opt7", text: "Very beautiful" },
        { id: "opt8", text: "Extremely large" },
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
    renderWithMantine(<AdvancedWordsQuiz />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders quiz questions after loading", async () => {
    renderWithMantine(<AdvancedWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Question 1 out of 2")).toBeInTheDocument();
    expect(
      screen.getByText("What is the meaning of 'ubiquitous'?"),
    ).toBeInTheDocument();

    const presentOption = screen.getByText((content) => {
      return content.includes("Present everywhere");
    });
    expect(presentOption).toBeInTheDocument();
  });

  it("handles correct answer selection", async () => {
    const user = userEvent.setup();
    renderWithMantine(<AdvancedWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const correctOption = screen.getByText((content) =>
      content.includes("Present everywhere"),
    );
    await user.click(correctOption);

    await waitFor(() => {
      expect(screen.getByText("Correct, good job!")).toBeInTheDocument();
    });
  });

  it("handles incorrect answer selection", async () => {
    const user = userEvent.setup();
    renderWithMantine(<AdvancedWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const incorrectOption = screen.getByText((content) =>
      content.includes("Very rare"),
    );
    await user.click(incorrectOption);

    await waitFor(() => {
      expect(screen.getByText(/Incorrect/)).toBeInTheDocument();
    });
  });

  it("completes the quiz when all questions are answered", async () => {
    const user = userEvent.setup();
    renderWithMantine(<AdvancedWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const skipButton = screen.getByText("Skip to End (Testing)");
    await user.click(skipButton);

    await waitFor(() => {
      expect(screen.getByText("Quiz Results")).toBeInTheDocument();
    });
  });

  it("handles API error when fetching questions", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to fetch questions" }),
    });

    renderWithMantine(<AdvancedWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText("No questions available. Please try again later."),
    ).toBeInTheDocument();
  });

  it("sends achievement update when quiz is completed", async () => {
    const user = userEvent.setup();
    renderWithMantine(<AdvancedWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const skipButton = screen.getByText("Skip to End (Testing)");
    await user.click(skipButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/quiz/achievements/update",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: expect.stringContaining("ADVANCED"),
        }),
      );
    });
  });

  it("shows the correct performance level based on score", async () => {
    const user = userEvent.setup();
    renderWithMantine(<AdvancedWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const skipButton = screen.getByText("Skip to End (Testing)");
    await user.click(skipButton);

    await waitFor(() => {
      expect(screen.getByText("Needs Improvement")).toBeInTheDocument();
    });
  });
});
