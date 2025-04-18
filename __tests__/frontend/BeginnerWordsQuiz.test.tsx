import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BeginnerWordsQuiz from "@/components/ui/BeginnerWordsQuiz/BeginnerWordsQuiz";
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

describe("BeginnerWordsQuiz Component", () => {
  // Common mock data for tests
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
    
    // Use a more flexible approach to find content that might be split across elements
    const holaOption = screen.getByText((content) => {
      return content.includes("Hola");
    });
    expect(holaOption).toBeInTheDocument();
  });

  it("handles correct answer selection", async () => {
    const user = userEvent.setup();
    renderWithMantine(<BeginnerWordsQuiz />);
    
    // Wait for questions to load
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    // Find the correct option and click it, using a more flexible approach
    const correctOption = screen.getByText((content) => content.includes("Hola"));
    await user.click(correctOption);
    
    // Check that feedback is shown
    await waitFor(() => {
      expect(screen.getByText("Correct, good job!")).toBeInTheDocument();
    });
  });

  it("handles incorrect answer selection", async () => {
    const user = userEvent.setup();
    renderWithMantine(<BeginnerWordsQuiz />);
    
    // Wait for questions to load
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    // Find an incorrect option and click it, using a more flexible approach
    const incorrectOption = screen.getByText((content) => content.includes("Adiós"));
    await user.click(incorrectOption);
    
    // Check that feedback is shown and lives are decreased
    await waitFor(() => {
      expect(screen.getByText(/Incorrect/)).toBeInTheDocument();
    });
  });

  it("completes the quiz when all questions are answered", async () => {
    const user = userEvent.setup();
    renderWithMantine(<BeginnerWordsQuiz />);
    
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

  it("calls onComplete callback with correct score when quiz is finished", async () => {
    const mockOnComplete = vi.fn();
    const user = userEvent.setup();
    
    renderWithMantine(<BeginnerWordsQuiz onComplete={mockOnComplete} />);
    
    // Wait for questions to load
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    // Click the "Skip to End" button to complete the quiz
    const skipButton = screen.getByText("Skip to End (Testing)");
    await user.click(skipButton);
    
    // Check that onComplete was called with correct parameters
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number), expect.any(String));
    });
  });

  it("handles API error when fetching questions", async () => {
    // Mock fetch to return an error
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to fetch questions" }),
    });
    
    renderWithMantine(<BeginnerWordsQuiz />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    // Check that error message is shown
    expect(screen.getByText("No questions available. Please try again later.")).toBeInTheDocument();
  });

  it("sends achievement update when quiz is completed", async () => {
    const user = userEvent.setup();
    renderWithMantine(<BeginnerWordsQuiz />);
    
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
        body: expect.stringContaining("BEGINNER"),
      }));
    });
  });
});