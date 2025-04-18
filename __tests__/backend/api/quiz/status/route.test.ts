// __tests__/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

let GET: (req: NextRequest) => Promise<import("next/server").NextResponse>;
const mockFindUnique = vi.fn();

// Helper to build a fake NextRequest with an optional sessionId cookie
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

describe("GET /route", () => {
  beforeEach(async () => {
    // Reset module registry so our prisma mock is applied fresh
    vi.resetModules();
    mockFindUnique.mockReset();

    // Mock PrismaClient to use our findUnique spy
    vi.mock("@prisma/client", () => ({
      PrismaClient: vi.fn().mockImplementation(() => ({
        session: { findUnique: mockFindUnique },
      })),
    }));

    // Dynamically import AFTER mocking
    const mod = await import("@/api/quiz/status/route");
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

  it("401 Session expired when expiresAt is in the past", async () => {
    const past = new Date(Date.now() - 1000);
    mockFindUnique.mockResolvedValue({
      id: "sess1",
      expiresAt: past,
      user: { hasCompletedProficiencyQuiz: true },
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

  it("200 returns hasCompleted=true when user has completed the quiz", async () => {
    const future = new Date(Date.now() + 1000);
    mockFindUnique.mockResolvedValue({
      id: "sess2",
      expiresAt: future,
      user: { hasCompletedProficiencyQuiz: true },
    });
    const req = makeRequest("sess2");
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ hasCompleted: true });
  });

  it("200 returns hasCompleted=false when user has not completed the quiz", async () => {
    const future = new Date(Date.now() + 1000);
    mockFindUnique.mockResolvedValue({
      id: "sess3",
      expiresAt: future,
      user: { hasCompletedProficiencyQuiz: false },
    });
    const req = makeRequest("sess3");
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ hasCompleted: false });
  });
});
