if (typeof window !== "undefined" && !window.matchMedia) {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }
  
  import React from "react";
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { describe, it, beforeEach, afterEach, vi } from "vitest";
  
  const pushMock = vi.fn();
  vi.mock("next/navigation", () => ({
    useRouter: () => ({
      push: pushMock,
    }),
    usePathname: () => "/",
  }));
  
  vi.mock("@/utils/sound", () => ({
    uiClick: {
      play: vi.fn(() => true),
    },
  }));
  
  import WordsQuiz from "app/components/ui/WordsQuizDifficulty/WordsQuizDifficulty";
  
  describe("WordsQuiz", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
  
    afterEach(() => {
      vi.resetAllMocks();
    });
  
    it("renders the heading and difficulty cards", () => {
      render(<WordsQuiz />);
      expect(screen.getByText("Select Your Difficulty")).toBeInTheDocument();
      expect(screen.getByText("Beginner")).toBeInTheDocument();
      expect(screen.getByText("Intermediate")).toBeInTheDocument();
      expect(screen.getByText("Advanced")).toBeInTheDocument();
    });
  
    it("selects a difficulty and shows the confirm button", async () => {
      render(<WordsQuiz />);
      const beginnerCard = screen.getByText("Beginner");
      await userEvent.click(beginnerCard);
      const confirmButton = await screen.findByRole("button", { name: /confirm/i });
      expect(confirmButton).toBeInTheDocument();
    });
  
    it("calls onSelect and navigates when confirm button is clicked", async () => {
      const onSelectMock = vi.fn();
      render(<WordsQuiz onSelect={onSelectMock} />);
      const intermediateCard = screen.getByText("Intermediate");
      await userEvent.click(intermediateCard);
      const confirmButton = await screen.findByRole("button", { name: /confirm/i });
      expect(confirmButton).toBeInTheDocument();
      await userEvent.click(confirmButton);
      expect(onSelectMock).toHaveBeenCalledWith("intermediate");
      expect(pushMock).toHaveBeenCalledWith("/dashboard/words/intermediate");
    });
  });
  