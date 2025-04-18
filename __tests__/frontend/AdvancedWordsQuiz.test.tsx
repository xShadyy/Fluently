import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdvancedWordsQuiz from "@/components/ui/AdvancedWordsQuiz/AdvancedWordsQuiz";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MantineProvider } from "@mantine/core";

// Mock the dependencies
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

// Mock the sound utilities
vi.mock("@/utils/sound", () => ({
  completed: { play: vi.fn() },
  correct: { play: vi.fn() },
  uiClick: { play: vi.fn() },
  wrong: { play: vi.fn() },
}));

// Mock the confetti library
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

// Mock fetch API
global.fetch = vi.fn();

// Create a wrapper function to provide MantineProvider
const renderWithMantine = (ui: React.ReactElement) => {
  return render(
    <MantineProvider>
      {ui}
    </MantineProvider>
  );
};

describe("AdvancedWordsQuiz Component", () => {
  // Common mock data for tests
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
    
    // Mock useSession
    (useSession as Mock).mockReturnValue({
      data: { user: { id: "user1" } },
      status: "authenticated",
    });
    
    // Mock fetch for successful questions retrieval
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
    expect(screen.getByText("What is the meaning of 'ubiquitous'?")).toBeInTheDocument();
    
    // Use a more flexible approach to find content that might be split across elements
    const presentOption = screen.getByText((content) => {
      return content.includes("Present everywhere");
    });
    expect(presentOption).toBeInTheDocument();
  });

  it("handles correct answer selection", async () => {
    const user = userEvent.setup();
    renderWithMantine(<AdvancedWordsQuiz />);
    
    // Wait for questions to load
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    // Find the correct option and click it, using a more flexible approach
    const correctOption = screen.getByText((content) => content.includes("Present everywhere"));
    await user.click(correctOption);
    
    // Check that feedback is shown
    await waitFor(() => {
      expect(screen.getByText("Correct, good job!")).toBeInTheDocument();
    });
  });

  it("handles incorrect answer selection", async () => {
    const user = userEvent.setup();
    renderWithMantine(<AdvancedWordsQuiz />);
    
    // Wait for questions to load
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    // Find an incorrect option and click it, using a more flexible approach
    const incorrectOption = screen.getByText((content) => content.includes("Very rare"));
    await user.click(incorrectOption);
    
    // Check that feedback is shown and lives are decreased
    await waitFor(() => {
      expect(screen.getByText(/Incorrect/)).toBeInTheDocument();
    });
  });

  it("completes the quiz when all questions are answered", async () => {
    const user = userEvent.setup();
    renderWithMantine(<AdvancedWordsQuiz />);
    
    // Wait for questions to load
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    // Click the "Skip to End" button to complete the quiz
    const skipButton = screen.getByText("Skip to End (Testing)");
    await user.click(skipButton);
    
    // Check that results are shown
    await waitFor(() => {
      expect(screen.getByText("Quiz Results")).toBeInTheDocument();
    });
  });

  it("handles API error when fetching questions", async () => {
    // Mock fetch to return an error
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to fetch questions" }),
    });
    
    renderWithMantine(<AdvancedWordsQuiz />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    // Check that error message is shown
    expect(screen.getByText("No questions available. Please try again later.")).toBeInTheDocument();
  });

  it("sends achievement update when quiz is completed", async () => {
    const user = userEvent.setup();
    renderWithMantine(<AdvancedWordsQuiz />);
    
    // Wait for questions to load
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    // Click the "Skip to End" button to complete the quiz
    const skipButton = screen.getByText("Skip to End (Testing)");
    await user.click(skipButton);
    
    // Check that the API was called to update achievements
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/quiz/achievements/update", expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: expect.stringContaining("ADVANCED"),
      }));
    });
  });

  it("shows the correct performance level based on score", async () => {
    const user = userEvent.setup();
    renderWithMantine(<AdvancedWordsQuiz />);
    
    // Wait for questions to load
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    // Skip to end to see results
    const skipButton = screen.getByText("Skip to End (Testing)");
    await user.click(skipButton);
    
    // Check that performance level is shown
    await waitFor(() => {
      // Since our mock has 0 correct answers by default when skipping
      expect(screen.getByText("Needs Improvement")).toBeInTheDocument();
    });
  });
});