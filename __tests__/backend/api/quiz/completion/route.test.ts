import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

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

describe("GET /api/quiz/completion", () => {
  let GET: (req: NextRequest) => Promise<import("next/server").NextResponse>;

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

    const mod = await import("@/api/quiz/completion/route");
    GET = mod.GET;
  });

  it("returns 401 Unauthorized when no sessionId cookie is set", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const req = makeRequest();
    const res = await GET(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Not authenticated" });
  });

  it("returns 401 Invalid session when sessionId not found in DB", async () => {
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

  it("returns the correct completion flags for a valid session", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { email: "test@example.com" },
    });
    mockFindUnique.mockResolvedValue({
      id: "user1",
      email: "test@example.com",
    });

    const mockCompletions = [
      {
        id: "qc1",
        userId: "user1",
        difficulty: "BEGINNER",
        score: 85,
        completedAt: new Date(Date.now() - 5000),
      },
    ];
    mockFindMany.mockResolvedValue(mockCompletions);

    const req = makeRequest();
    const res = await GET(req);

    expect(res.status).toBe(200);
    const responseBody = await res.json();

    expect(responseBody.success).toBe(true);
    expect(responseBody.completions).toHaveLength(1);
    expect(responseBody.completions[0].difficulty).toBe("BEGINNER");
  });

  it("catches unexpected errors and returns 500", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { email: "test@example.com" },
    });
    mockFindUnique.mockResolvedValue({
      id: "user1",
      email: "test@example.com",
    });
    mockFindMany.mockRejectedValue(new Error("Database error"));

    const req = makeRequest();
    const res = await GET(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Failed to fetch quiz completions",
    });
  });
});
