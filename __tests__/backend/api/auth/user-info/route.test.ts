import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

let GET: (req: NextRequest) => Promise<import("next/server").NextResponse>;

const mockFindUnique = vi.fn();
const mockGetToken = vi.fn();

function makeRequest(userId?: string): NextRequest {
  const url = new URL(
    `https://example.com/api/auth/user-info${userId ? `?userId=${userId}` : ""}`,
  );
  return {
    nextUrl: url,
    cookies: {
      get: vi.fn(),
    },
  } as unknown as NextRequest;
}

describe("GET /api/auth/user-info", () => {
  beforeEach(async () => {
    vi.resetModules();
    mockFindUnique.mockReset();
    mockGetToken.mockReset();

    vi.mock("@prisma/client", () => ({
      PrismaClient: vi.fn().mockImplementation(() => ({
        user: { findUnique: mockFindUnique },
      })),
    }));

    vi.mock("next-auth/jwt", () => ({
      getToken: mockGetToken,
    }));

    const mod = await import("@/api/auth/user-info/route");
    GET = mod.GET;
  });

  it("returns 400 Bad Request when no userId is provided", async () => {
    const req = makeRequest();
    const res = await GET(req);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "User ID is required" });
  });

  it("returns 401 Unauthorized when no token is found", async () => {
    mockGetToken.mockResolvedValue(null);

    const req = makeRequest("user123");
    const res = await GET(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 401 Unauthorized when token userId doesn't match requested userId", async () => {
    mockGetToken.mockResolvedValue({ id: "different-user" });

    const req = makeRequest("user123");
    const res = await GET(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 404 Not Found when user isn't in the database", async () => {
    mockGetToken.mockResolvedValue({ id: "user123" });
    mockFindUnique.mockResolvedValue(null);

    const req = makeRequest("user123");
    const res = await GET(req);

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "User not found" });
  });

  it("returns user data when request is valid", async () => {
    const mockUser = {
      id: "user123",
      username: "testuser",
      email: "test@example.com",
      createdAt: new Date("2023-01-01").toISOString(),
    };

    mockGetToken.mockResolvedValue({ id: "user123" });
    mockFindUnique.mockResolvedValue(mockUser);

    const req = makeRequest("user123");
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(mockUser);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "user123" },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });
  });

  it("returns 500 Internal Server Error when database query fails", async () => {
    mockGetToken.mockResolvedValue({ id: "user123" });
    mockFindUnique.mockRejectedValue(new Error("Database connection failed"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const req = makeRequest("user123");
    const res = await GET(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal server error" });

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
