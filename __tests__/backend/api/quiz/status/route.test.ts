import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

const mockFindUnique = vi.fn();
const mockGetServerSession = vi.fn();

vi.mock("next-auth", () => ({
  getServerSession: mockGetServerSession,
}));

vi.mock("@/api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

function makeRequest(searchParams?: Record<string, string>): NextRequest {
  return {
    nextUrl: {
      searchParams: new URLSearchParams(searchParams),
    },
  } as unknown as NextRequest;
}

describe("GET /route", () => {
  let GET: (req: NextRequest) => Promise<import("next/server").NextResponse>;

  beforeEach(async () => {
    vi.resetModules();
    mockFindUnique.mockReset();
    mockGetServerSession.mockReset();

    vi.mock("@prisma/client", () => ({
      PrismaClient: vi.fn().mockImplementation(() => ({
        user: { findUnique: mockFindUnique },
      })),
    }));

    const mod = await import("@/api/quiz/status/route");
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
      select: { hasCompletedProficiencyQuiz: true },
    });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "User not found" });
  });

  it("200 returns hasCompleted=true when user has completed the quiz", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { email: "test@example.com" },
    });
    mockFindUnique.mockResolvedValue({
      hasCompletedProficiencyQuiz: true,
    });

    const req = makeRequest();
    const res = await GET(req);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      select: { hasCompletedProficiencyQuiz: true },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      hasCompleted: true,
    });
  });

  it("200 returns hasCompleted=false when user has not completed the quiz", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { email: "test@example.com" },
    });
    mockFindUnique.mockResolvedValue({
      hasCompletedProficiencyQuiz: false,
    });

    const req = makeRequest();
    const res = await GET(req);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      select: { hasCompletedProficiencyQuiz: true },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      hasCompleted: false,
    });
  });
});
