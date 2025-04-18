// __tests__/backend/api/quiz/achievements/update/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

let POST: (req: NextRequest) => Promise<import("next/server").NextResponse>;

const mockFindUnique = vi.fn();
const mockUpsert = vi.fn();

// Helper to fake a NextRequest with optional sessionId cookie and JSON body
function makeRequest(
  sessionId?: string,
  body?: Record<string, any>
): NextRequest {
  return {
    cookies: {
      get: vi.fn().mockImplementation((name: string) =>
        name === "sessionId" && sessionId
          ? { value: sessionId }
          : undefined
      ),
    },
    json: vi.fn().mockResolvedValue(body || {}),
  } as unknown as NextRequest;
}

describe("POST /route", () => {
  beforeEach(async () => {
    // Reset module registry & mocks
    vi.resetModules();
    mockFindUnique.mockReset();
    mockUpsert.mockReset();

    // Mock PrismaClient
    vi.mock("@prisma/client", () => ({
      PrismaClient: vi.fn().mockImplementation(() => ({
        session: { findUnique: mockFindUnique },
        quizCompletion: { upsert: mockUpsert },
      })),
    }));

    // Import handler after mocking
    const mod = await import("@/api/quiz/achievements/update/route");
    POST = mod.POST;
  });

  it("401 Not authenticated when no sessionId cookie", async () => {
    const req = makeRequest();
    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Not authenticated" });
  });

  it("401 Invalid session when session not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const req = makeRequest("nope");
    const res = await POST(req);

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
    const res = await POST(req);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "sess1" },
      include: { user: true },
    });
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Session expired" });
  });

  it("200 returns success + quizCompletion on upsert", async () => {
    const future = new Date(Date.now() + 1000);
    mockFindUnique.mockResolvedValue({
      id: "sess2",
      expiresAt: future,
      user: { id: "user2" },
    });

    const body = { level: "BEGINNER", score: 85 };
    // Mock returns a Date instance for completedAt
    const returnedQC = {
      id: "qc1",
      userId: "user2",
      difficulty: "BEGINNER",
      score: 85,
      completedAt: new Date(),
    };
    mockUpsert.mockResolvedValue(returnedQC);

    const req = makeRequest("sess2", body);
    const res = await POST(req);

    expect(mockUpsert).toHaveBeenCalledWith({
      where: {
        userId_difficulty: {
          userId: "user2",
          difficulty: "BEGINNER",
        },
      },
      update: {
        score: 85,
        completedAt: expect.any(Date),
      },
      create: {
        userId: "user2",
        difficulty: "BEGINNER",
        score: 85,
      },
    });

    expect(res.status).toBe(200);

    // Parse JSON and compare ISO string for completedAt
    const json = await res.json();
    const expectedQC = {
      ...returnedQC,
      completedAt: returnedQC.completedAt.toISOString(),
    };

    expect(json).toEqual({
      success: true,
      quizCompletion: expectedQC,
    });
  });

  it("500 if upsert throws an error", async () => {
    const future = new Date(Date.now() + 1000);
    mockFindUnique.mockResolvedValue({
      id: "sess3",
      expiresAt: future,
      user: { id: "user3" },
    });

    mockUpsert.mockImplementation(() => {
      throw new Error("boom");
    });

    const req = makeRequest("sess3", { level: "ADVANCED", score: 50 });
    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Failed to update quiz achievement",
    });
  });
});