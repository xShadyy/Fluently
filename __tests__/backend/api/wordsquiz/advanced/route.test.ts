import { GET } from "@/api/wordsquiz/advanced/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    wordsQuestion: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      json: () => data,
      status: 200,
    })),
    error: jest.fn(() => ({
      json: () => ({ error: "Internal server error" }),
      status: 500,
    })),
  },
}));

const prisma = new PrismaClient();

describe("Advanced WordsQuiz API route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns advanced questions successfully", async () => {
    const mockQuestions = [
      {
        id: "question-1",
        text: "What is the meaning of 'ephemeral'?",
        options: [
          { id: "option-1", text: "Lasting a short time" },
          { id: "option-2", text: "Eternal" },
        ],
        correctAnswer: {
          id: "correct-1",
          wordsOption: { id: "option-1", text: "Lasting a short time" },
        },
      },
    ];

    prisma.wordsQuestion.findMany.mockResolvedValue(mockQuestions);

    const response = await GET();

    expect(prisma.wordsQuestion.findMany).toHaveBeenCalledWith({
      where: {
        difficulty: "ADVANCED",
        game: {
          type: "WORDS",
        },
      },
      include: {
        options: true,
        correctAnswer: {
          include: { wordsOption: true },
        },
      },
    });

    expect(response.json()).toEqual({ questions: mockQuestions });
    expect(response.status).toBe(200);
  });

  it("returns 500 if an error occurs", async () => {
    prisma.wordsQuestion.findMany.mockRejectedValue(new Error("Database error"));

    const response = await GET();

    expect(prisma.wordsQuestion.findMany).toHaveBeenCalledWith({
      where: {
        difficulty: "ADVANCED",
        game: {
          type: "WORDS",
        },
      },
      include: {
        options: true,
        correctAnswer: {
          include: { wordsOption: true },
        },
      },
    });

    expect(response.json()).toEqual({ error: "Internal server error" });
    expect(response.status).toBe(500);
  });
});