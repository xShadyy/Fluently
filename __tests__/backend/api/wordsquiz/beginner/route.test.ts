import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const mockWordsQuestionFindMany = vi.fn();
vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(() => ({
    wordsQuestion: {
      findMany: mockWordsQuestionFindMany,
    },
  })),
}));

describe("GET /api/wordsquiz/beginner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWordsQuestionFindMany.mockReset();
  });

  it("returns beginner words questions successfully", async () => {
    const mockQuestions = [
      {
        id: "q1",
        text: "Beginner Question 1",
        difficulty: "BEGINNER",
        game: { type: "WORDS" },
        options: [
          { id: "o1", text: "Option 1" },
          { id: "o2", text: "Option 2" },
        ],
        correctAnswer: {
          wordsOption: { id: "o1", text: "Correct Answer" },
        },
      },
    ];

    mockWordsQuestionFindMany.mockResolvedValue(mockQuestions);

    const { GET } = await import("@/api/wordsquiz/beginner/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ questions: mockQuestions });
    expect(mockWordsQuestionFindMany).toHaveBeenCalledWith({
      where: {
        difficulty: "BEGINNER",
        game: { type: "WORDS" },
      },
      include: {
        options: true,
        correctAnswer: { include: { wordsOption: true } },
      },
    });
  });

  it("returns 500 on database error", async () => {
    mockWordsQuestionFindMany.mockRejectedValue(
      new Error("Database connection failed"),
    );

    const { GET } = await import("@/api/wordsquiz/beginner/route");
    const response = await GET();

    expect(response.status).toBe(500);
  });

  it("returns empty array when no questions found", async () => {
    mockWordsQuestionFindMany.mockResolvedValue([]);

    const { GET } = await import("@/api/wordsquiz/beginner/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ questions: [] });
  });
});
