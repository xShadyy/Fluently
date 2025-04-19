import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Translator from "@/components/ui/Translator/Translator";
import { uiClick } from "@/utils/sound";
import "@testing-library/jest-dom";

vi.mock("@/utils/sound", () => ({
  uiClick: { play: vi.fn() },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

global.SpeechSynthesisUtterance = class {
  text: string;
  lang: string;
  constructor(text: string) {
    this.text = text;
    this.lang = "";
  }
};

const mockSpeak = vi.fn();
Object.defineProperty(global, "speechSynthesis", {
  value: { speak: mockSpeak },
});

Object.defineProperty(navigator, "clipboard", {
  value: { writeText: vi.fn() },
});

describe("Translator Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ translatedText: "Hello world" }),
    });
  });

  it("renders correctly with initial states", () => {
    render(<Translator />);

    const polishOptions = screen.getAllByRole("option", { name: "Polish" });
    expect(polishOptions.length).toBeGreaterThan(0);

    const ukOptions = screen.getAllByRole("option", { name: "English (UK)" });
    expect(ukOptions.length).toBeGreaterThan(0);

    expect(
      screen.getByPlaceholderText("Enter text in Polish"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Translation")).toBeInTheDocument();

    expect(screen.getByText("0/500")).toBeInTheDocument();
  });

  it("updates character count when typing", () => {
    render(<Translator />);

    const input = screen.getByPlaceholderText("Enter text in Polish");
    fireEvent.change(input, { target: { value: "Test" } });

    expect(screen.getByText("4/500")).toBeInTheDocument();
  });

  it("calls translation API when text is entered", () => {
    vi.useFakeTimers();
    render(<Translator />);

    const input = screen.getByPlaceholderText("Enter text in Polish");
    fireEvent.change(input, { target: { value: "Test text" } });

    vi.advanceTimersByTime(500);

    expect(mockFetch).toHaveBeenCalledWith("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Test text",
        sourceLang: "PL",
        targetLang: "EN-GB",
      }),
    });

    vi.useRealTimers();
  });

  it("displays translated text when API returns successfully", async () => {
    render(<Translator />);

    const input = screen.getByPlaceholderText("Enter text in Polish");
    fireEvent.change(input, { target: { value: "Test text" } });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Translation")).toHaveValue(
        "Hello world",
      );
    });
  });

  it("displays error message when translation fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Translation error" }),
    });

    render(<Translator />);

    const input = screen.getByPlaceholderText("Enter text in Polish");
    fireEvent.change(input, { target: { value: "Test text" } });

    await waitFor(() => {
      expect(
        screen.getByText("Translation failed. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("swaps languages when swap button is clicked", () => {
    render(<Translator />);

    expect(
      screen.getByPlaceholderText("Enter text in Polish"),
    ).toBeInTheDocument();

    const [swapButton] = screen.getAllByRole("button");
    fireEvent.click(swapButton);

    expect(
      screen.getByPlaceholderText("Enter text in English (UK)"),
    ).toBeInTheDocument();
    expect(uiClick.play).toHaveBeenCalled();
  });

  it("calls text-to-speech when listen button is clicked", () => {
    render(<Translator />);

    const input = screen.getByPlaceholderText("Enter text in Polish");
    fireEvent.change(input, { target: { value: "Test text" } });

    const [listenButton] = screen.getAllByTitle("Listen");
    fireEvent.click(listenButton);

    expect(mockSpeak).toHaveBeenCalled();
    expect(uiClick.play).toHaveBeenCalled();

    const utteranceArg = mockSpeak.mock.calls[0][0];
    expect(utteranceArg.text).toBe("Test text");
    expect(utteranceArg.lang).toBe("pl");
  });

  it("copies text to clipboard when copy button is clicked", () => {
    render(<Translator />);

    const input = screen.getByPlaceholderText("Enter text in Polish");
    fireEvent.change(input, { target: { value: "Test text" } });

    const [copyButton] = screen.getAllByTitle("Copy");
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Test text");
    expect(uiClick.play).toHaveBeenCalled();
  });

  it("changes source language when selected", async () => {
    render(<Translator />);

    const selects = screen.getAllByRole("combobox");
    const sourceSelect = selects[0];
    fireEvent.change(sourceSelect, { target: { value: "es" } });

    expect(
      screen.getByPlaceholderText("Enter text in Spanish"),
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Enter text in Spanish");
    fireEvent.change(input, { target: { value: "Hola" } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body: expect.stringContaining("ES") }),
      );
    });
  });

  it("changes target language when selected", async () => {
    render(<Translator />);

    const selects = screen.getAllByRole("combobox");
    const targetSelect = selects[1];
    fireEvent.change(targetSelect, { target: { value: "de" } });

    const input = screen.getByPlaceholderText("Enter text in Polish");
    fireEvent.change(input, { target: { value: "Test" } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body: expect.stringContaining("DE") }),
      );
    });
  });

  it("doesn't allow more than 500 characters", () => {
    render(<Translator />);

    const input = screen.getByPlaceholderText("Enter text in Polish");
    const longText = "a".repeat(600);
    fireEvent.change(input, { target: { value: longText } });

    expect(input.value.length).toBeLessThanOrEqual(500);

    expect(screen.getByText("0/500")).toBeInTheDocument();
  });
});
