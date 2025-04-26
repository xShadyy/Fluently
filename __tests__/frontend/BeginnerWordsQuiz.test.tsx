import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BeginnerWordsQuiz from "@/components/ui/BeginnerWordsQuiz/BeginnerWordsQuiz";
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

describe("BeginnerWordsQuiz Component", () => {
  const mockQuestions = [
    {
      id: "1",
      text: "What is 'hello' in Spanish?",
      options: [
        { id: "opt1", text: "Hola" },
        { id: "opt2", text: "Adiós" },
        { id: "opt3", text: "Gracias" },
        { id: "opt4", text: "Por favor" },
      ],
      correctAnswer: { wordsOptionId: "opt1" },
    },
    {
      id: "2",
      text: "What is 'goodbye' in Spanish?",
      options: [
        { id: "opt5", text: "Hola" },
        { id: "opt6", text: "Adiós" },
        { id: "opt7", text: "Gracias" },
        { id: "opt8", text: "Por favor" },
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
    renderWithMantine(<BeginnerWordsQuiz />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders quiz questions after loading", async () => {
    renderWithMantine(<BeginnerWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Question 1 out of 2")).toBeInTheDocument();
    expect(screen.getByText("What is 'hello' in Spanish?")).toBeInTheDocument();

    const holaOption = screen.getByText((content) => {
      return content.includes("Hola");
    });
    expect(holaOption).toBeInTheDocument();
  });

  it("handles correct answer selection", async () => {
    const user = userEvent.setup();
    renderWithMantine(<BeginnerWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const correctOption = screen.getByText((content) =>
      content.includes("Hola"),
    );
    await user.click(correctOption);

    await waitFor(() => {
      expect(screen.getByText("Correct, good job!")).toBeInTheDocument();
    });
  });

  it("handles incorrect answer selection", async () => {
    const user = userEvent.setup();
    renderWithMantine(<BeginnerWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const incorrectOption = screen.getByText((content) =>
      content.includes("Adiós"),
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

    renderWithMantine(<BeginnerWordsQuiz />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText("No questions available. Please try again later."),
    ).toBeInTheDocument();
  });
});
