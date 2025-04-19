import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

let GET: (req: NextRequest) => Promise<import("next/server").NextResponse>;
const mockFindUnique = vi.fn();
const mockFindMany = vi.fn();

function makeRequest(sessionId?: string): NextRequest {
  return {
    cookies: {
      get: vi
        .fn()
        .mockImplementation((name: string) =>
          name === "sessionId" && sessionId ? { value: sessionId } : undefined,
        ),
    },
  } as unknown as NextRequest;
}

describe("GET /route", () => {
  beforeEach(async () => {
    vi.resetModules();
    mockFindUnique.mockReset();
    mockFindMany.mockReset();

    vi.mock("@prisma/client", () => ({
      PrismaClient: vi.fn().mockImplementation(() => ({
        session: { findUnique: mockFindUnique },
        quizCompletion: { findMany: mockFindMany },
      })),
    }));

    const mod = await import("@/api/quiz/achievements/check/route");
    GET = mod.GET;
  });

  it("401 Not authenticated when no sessionId cookie", async () => {
    const req = makeRequest();
    const res = await GET(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Not authenticated" });
  });

  it("401 Invalid session when session not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const req = makeRequest("nope");
    const res = await GET(req);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "nope" },
      include: { user: true },
    });
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Invalid session" });
  });

  it("401 Session expired when session.expiresAt is in the past", async () => {
    const past = new Date(Date.now() - 1000);
    mockFindUnique.mockResolvedValue({
      id: "sess1",
      expiresAt: past,
      user: { id: "user1" },
    });

    const req = makeRequest("sess1");
    const res = await GET(req);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "sess1" },
      include: { user: true },
    });
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Session expired" });
  });

  it("200 returns success + completions in descending order", async () => {
    const future = new Date(Date.now() + 1000);
    mockFindUnique.mockResolvedValue({
      id: "sess2",
      expiresAt: future,
      user: { id: "user2" },
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

    const req = makeRequest("sess2");
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
    const future = new Date(Date.now() + 1000);
    mockFindUnique.mockResolvedValue({
      id: "sess3",
      expiresAt: future,
      user: { id: "user3" },
    });
    mockFindMany.mockImplementation(() => {
      throw new Error("db error");
    });

    const req = makeRequest("sess3");
    const res = await GET(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Failed to fetch quiz completions",
    });
  });
});
