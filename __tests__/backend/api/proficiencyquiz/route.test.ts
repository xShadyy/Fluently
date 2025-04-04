import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";

const mockQuestionFindMany = vi.fn();

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(() => ({
    question: {
      findMany: mockQuestionFindMany,
    },
  })),
}));

describe("GET /api/proficiencyquiz", () => {
  beforeEach(() => {
    mockQuestionFindMany.mockReset();
  });

  it("returns questions when DB query succeeds", async () => {
    mockQuestionFindMany.mockResolvedValue([
      {
        id: "q1",
        content: "What is 2+2?",
        gameId: "game-proficiency",
        options: [],
        correctAnswer: { option: {} },
      },
    ]);

    const { GET } = await import("@/api/proficiencyquiz/route");
    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveProperty("questions");
    expect(json.questions[0].id).toBe("q1");
  });

  it("returns 500 when DB fails", async () => {
    mockQuestionFindMany.mockRejectedValue(new Error("DB error"));

    const { GET } = await import("@/api/proficiencyquiz/route");
    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "Internal server error" });
  });
});
