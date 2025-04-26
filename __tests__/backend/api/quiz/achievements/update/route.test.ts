import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

const mockFindUnique = vi.fn();
const mockFindFirst = vi.fn();
const mockUpsert = vi.fn();
const mockGetServerSession = vi.fn();

vi.mock("next-auth", () => ({
  getServerSession: mockGetServerSession,
}));

vi.mock("@/api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

function makeRequest(body?: any): NextRequest {
  return {
    json: () => Promise.resolve(body || {}),
  } as unknown as NextRequest;
}

describe("POST /route", () => {
  let POST: (req: NextRequest) => Promise<import("next/server").NextResponse>;

  beforeEach(async () => {
    vi.resetModules();
    mockFindUnique.mockReset();
    mockFindFirst.mockReset();
    mockUpsert.mockReset();
    mockGetServerSession.mockReset();

    vi.mock("@prisma/client", () => ({
      PrismaClient: vi.fn().mockImplementation(() => ({
        user: { findUnique: mockFindUnique },
        quizCompletion: {
          upsert: mockUpsert,
          findFirst: mockFindFirst,
        },
      })),
    }));

    const mod = await import("@/api/quiz/achievements/update/route");
    POST = mod.POST;
  });

  it("401 Not authenticated when no sessionId cookie", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const req = makeRequest();
    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Not authenticated" });
  });

  it("401 Invalid session when session not found", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { email: "test@example.com" },
    });
    mockFindUnique.mockResolvedValue(null);

    const req = makeRequest();
    const res = await POST(req);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "User not found" });
  });

  it("200 returns success + quizCompletion on upsert", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { email: "test@example.com" },
    });
    mockFindUnique.mockResolvedValue({
      id: "user1",
      email: "test@example.com",
    });

    mockFindFirst.mockResolvedValue({ id: "prev-completion" });

    const completedAt = new Date();
    const mockQuizCompletion = {
      id: "qc1",
      userId: "user1",
      difficulty: "BEGINNER",
      score: 85,
      completedAt,
    };
    mockUpsert.mockResolvedValue(mockQuizCompletion);

    const req = makeRequest({
      level: "BEGINNER",
      score: 85,
    });
    const res = await POST(req);

    expect(mockUpsert).toHaveBeenCalledWith({
      where: {
        userId_difficulty: {
          userId: "user1",
          difficulty: "BEGINNER",
        },
      },
      update: {
        score: 85,
        completedAt: expect.any(Date),
      },
      create: {
        userId: "user1",
        difficulty: "BEGINNER",
        score: 85,
      },
    });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual({
      success: true,
      quizCompletion: {
        ...mockQuizCompletion,
        completedAt: completedAt.toISOString(),
      },
    });
  });

  it("500 if upsert throws an error", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { email: "test@example.com" },
    });
    mockFindUnique.mockResolvedValue({
      id: "user1",
      email: "test@example.com",
    });
    mockUpsert.mockRejectedValue(new Error("db error"));

    const req = makeRequest({
      level: "BEGINNER",
      score: 85,
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Failed to update quiz achievement",
    });
  });
});
