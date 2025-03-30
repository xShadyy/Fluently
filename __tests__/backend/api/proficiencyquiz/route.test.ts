import { GET } from "@/api/proficiencyquiz/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    question: {
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

describe("ProficiencyQuiz API route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns questions successfully", async () => {
    const mockQuestions = [
      {
        id: "question-1",
        text: "What is the capital of France?",
        options: [
          { id: "option-1", text: "Paris" },
          { id: "option-2", text: "London" },
        ],
        correctAnswer: {
          id: "correct-1",
          option: { id: "option-1", text: "Paris" },
        },
      },
    ];

    prisma.question.findMany.mockResolvedValue(mockQuestions);

    const response = await GET();

    expect(prisma.question.findMany).toHaveBeenCalledWith({
      where: { gameId: "game-proficiency" },
      include: {
        options: true,
        correctAnswer: {
          include: { option: true },
        },
      },
    });

    expect(response.json()).toEqual({ questions: mockQuestions });
    expect(response.status).toBe(200);
  });

  it("returns 500 if an error occurs", async () => {
    prisma.question.findMany.mockRejectedValue(new Error("Database error"));

    const response = await GET();

    expect(prisma.question.findMany).toHaveBeenCalledWith({
      where: { gameId: "game-proficiency" },
      include: {
        options: true,
        correctAnswer: {
          include: { option: true },
        },
      },
    });

    expect(response.json()).toEqual({ error: "Internal server error" });
    expect(response.status).toBe(500);
  });
});