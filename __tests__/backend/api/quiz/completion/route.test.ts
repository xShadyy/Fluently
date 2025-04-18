// __tests__/backend/api/quiz/completion/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

let GET: (req: NextRequest) => Promise<import("next/server").NextResponse>;

// these mocks live in module scope so we can inspect them in each test
const mockFindUnique = vi.fn();
const mockFindMany = vi.fn();

// helper to fake a NextRequest with or without a sessionId cookie
function makeRequest(sessionId?: string): NextRequest {
  return {
    cookies: {
      get: vi.fn().mockImplementation((name: string) =>
        name === "sessionId" && sessionId
          ? { value: sessionId }
          : undefined
      ),
    },
  } as unknown as NextRequest;
}

describe("GET /api/quiz/completion", () => {
  beforeEach(async () => {
    // clear PrismaClient cache & our mocks
    vi.resetModules();
    mockFindUnique.mockReset();
    mockFindMany.mockReset();

    // now mock @prisma/client so that when route.ts imports it, it sees our fakes
    vi.mock("@prisma/client", () => ({
      PrismaClient: vi.fn().mockImplementation(() => ({
        session: { findUnique: mockFindUnique },
        quizCompletion: { findMany: mockFindMany },
      })),
    }));

    // dynamically import your route _after_ setting up the mock
    const mod = await import("@/api/quiz/completion/route");
    GET = mod.GET;
  });

  it("returns 401 Unauthorized when no sessionId cookie is set", async () => {
    const req = makeRequest();
    const res = await GET(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 401 Invalid session when sessionId not found in DB", async () => {
    mockFindUnique.mockResolvedValue(null);

    const req = makeRequest("nonexistent");
    const res = await GET(req);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "nonexistent" },
      select: { userId: true },
    });
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Invalid session" });
  });

  it("returns the correct completion flags for a valid session", async () => {
    mockFindUnique.mockResolvedValue({ userId: "user123" });
    mockFindMany.mockResolvedValue([
      { difficulty: "BEGINNER" },
      { difficulty: "ADVANCED" },
    ]);

    const req = makeRequest("good-session");
    const res = await GET(req);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "good-session" },
      select: { userId: true },
    });
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: "user123" },
      select: { difficulty: true },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      beginner: true,
      intermediate: false,
      advanced: true,
    });
  });

  it("catches unexpected errors and returns 500", async () => {
    mockFindUnique.mockImplementation(() => {
      throw new Error("db is down");
    });

    const req = makeRequest("whatever");
    const res = await GET(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal Server Error" });
  });
});
