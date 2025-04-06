import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import AdvancedWordsQuiz from "@/components/ui/AdvancedWordsQuiz/AdvancedWordsQuiz";
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@/utils/sound", () => ({
  correct: { play: vi.fn() },
  wrong: { play: vi.fn() },
  completed: { play: vi.fn() },
  uiClick: { play: vi.fn() },
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const mockQuestions = [
  {
    id: "q1",
    text: "What is the capital of France?",
    options: [
      { id: "a1", text: "Paris" },
      { id: "a2", text: "London" },
      { id: "a3", text: "Berlin" },
    ],
    correctAnswer: { wordsOptionId: "a1" },
  },
];

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ questions: mockQuestions }),
      }),
    ),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("AdvancedWordsQuiz component", () => {
  it("renders loading state initially", () => {
    renderWithMantine(<AdvancedWordsQuiz />);
    expect(screen.getByText(/loading quiz questions/i)).toBeInTheDocument();
  });

  it("renders first question after loading", async () => {
    renderWithMantine(<AdvancedWordsQuiz />);
    await screen.findByText(/what is the capital of france/i);
    expect(screen.getByText(/question 1 out of 1/i)).toBeInTheDocument();
  });

  it("shows correct feedback when correct answer is selected", async () => {
    renderWithMantine(<AdvancedWordsQuiz />);
    await screen.findByText(/what is the capital of france/i);
    const correctBtn = screen.getByRole("button", { name: /paris/i });
    fireEvent.click(correctBtn);
    await screen.findByText(/correct, good job/i);
  });

  it("shows incorrect feedback when wrong answer is selected", async () => {
    renderWithMantine(<AdvancedWordsQuiz />);
    await screen.findByText(/what is the capital of france/i);
    const wrongBtn = screen.getByRole("button", { name: /london/i });
    fireEvent.click(wrongBtn);
    await screen.findByText(/incorrect. the correct answer is: paris/i);
  });
});
