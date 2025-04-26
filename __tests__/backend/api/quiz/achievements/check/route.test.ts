import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

let GET: (req: NextRequest) => Promise<import("next/server").NextResponse>;
const mockFindUnique = vi.fn();
const mockFindMany = vi.fn();
const mockGetServerSession = vi.fn();

vi.mock("next-auth", () => ({
  getServerSession: mockGetServerSession,
}));

vi.mock("@/api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

function makeRequest(): NextRequest {
  return {} as unknown as NextRequest;
}

describe("GET /route", () => {
  beforeEach(async () => {
    vi.resetModules();
    mockFindUnique.mockReset();
    mockFindMany.mockReset();
    mockGetServerSession.mockReset();

    vi.mock("@prisma/client", () => ({
      PrismaClient: vi.fn().mockImplementation(() => ({
        user: { findUnique: mockFindUnique },
        quizCompletion: { findMany: mockFindMany },
      })),
    }));

    const mod = await import("@/api/quiz/achievements/check/route");
    GET = mod.GET;
  });

  it("401 Not authenticated when no sessionId cookie", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const req = makeRequest();
    const res = await GET(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Not authenticated" });
  });

  it("401 Invalid session when session not found", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { email: "test@example.com" },
    });
    mockFindUnique.mockResolvedValue(null);

    const req = makeRequest();
    const res = await GET(req);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "User not found" });
  });

  it("200 returns success + completions in descending order", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { email: "test@example.com" },
    });
    mockFindUnique.mockResolvedValue({
      id: "user2",
      email: "test@example.com",
    });

    const returnedCompletions = [
      {
        id: "qc1",
        userId: "user2",
        difficulty: "BEGINNER",
        score: 90,
        completedAt: new Date(Date.now() - 5000),
      },
      {
        id: "qc2",
        userId: "user2",
        difficulty: "INTERMEDIATE",
        score: 75,
        completedAt: new Date(Date.now() - 10000),
      },
    ];
    mockFindMany.mockResolvedValue(returnedCompletions);

    const req = makeRequest();
    const res = await GET(req);

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: "user2" },
      orderBy: { completedAt: "desc" },
    });
    expect(res.status).toBe(200);

    const json = await res.json();
    const expected = returnedCompletions.map((c) => ({
      ...c,
      completedAt: c.completedAt.toISOString(),
    }));

    expect(json).toEqual({ success: true, completions: expected });
  });

  it("500 if findMany throws an error", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { email: "test@example.com" },
    });
    mockFindUnique.mockResolvedValue({
      id: "user3",
      email: "test@example.com",
    });
    mockFindMany.mockImplementation(() => {
      throw new Error("db error");
    });

    const req = makeRequest();
    const res = await GET(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Failed to fetch quiz completions",
    });
  });
});
