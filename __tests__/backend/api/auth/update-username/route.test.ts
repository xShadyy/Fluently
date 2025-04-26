import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";
import { Session } from "next-auth";

let PUT: (req: NextRequest) => Promise<import("next/server").NextResponse>;

const mockUpdate = vi.fn();
const mockGetServerSession = vi.fn();

function makeRequest(body: any = {}): NextRequest {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

describe("PUT /api/auth/update-username", () => {
  beforeEach(async () => {
    vi.resetModules();
    mockUpdate.mockReset();
    mockGetServerSession.mockReset();

    vi.mock("@prisma/client", () => ({
      PrismaClient: vi.fn().mockImplementation(() => ({
        user: { update: mockUpdate },
      })),
    }));

    vi.mock("next-auth/next", () => ({
      getServerSession: mockGetServerSession,
    }));

    const mod = await import("@/api/auth/update-username/route");
    PUT = mod.PUT;
  });

  it("returns 401 Unauthorized when no session is found", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const req = makeRequest({ username: "newUsername" });
    const res = await PUT(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 401 Unauthorized when session has no user", async () => {
    mockGetServerSession.mockResolvedValue({
      user: null,
    } as unknown as Session);

    const req = makeRequest({ username: "newUsername" });
    const res = await PUT(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 400 Bad Request when username is missing", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user123" },
    } as Session);

    const req = makeRequest({ username: "" });
    const res = await PUT(req);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Username is required" });
  });

  it("returns 400 Bad Request when username is only whitespace", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user123" },
    } as Session);

    const req = makeRequest({ username: "   " });
    const res = await PUT(req);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Username is required" });
  });

  it("updates username successfully when request is valid", async () => {
    const mockUser = {
      id: "user123",
      email: "test@example.com",
      username: "newUsername",
    };

    mockGetServerSession.mockResolvedValue({
      user: { id: "user123" },
    } as Session);
    mockUpdate.mockResolvedValue(mockUser);

    const req = makeRequest({ username: "newUsername" });
    const res = await PUT(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(mockUser);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "user123" },
      data: { username: "newUsername" },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  });

  it("trims whitespace from username", async () => {
    const mockUser = {
      id: "user123",
      email: "test@example.com",
      username: "newUsername",
    };

    mockGetServerSession.mockResolvedValue({
      user: { id: "user123" },
    } as Session);
    mockUpdate.mockResolvedValue(mockUser);

    const req = makeRequest({ username: "  newUsername  " });
    const res = await PUT(req);

    expect(res.status).toBe(200);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "user123" },
      data: { username: "newUsername" },
      select: expect.any(Object),
    });
  });

  it("returns 500 Internal Server Error when database update fails", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user123" },
    } as Session);
    mockUpdate.mockRejectedValue(new Error("Database error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const req = makeRequest({ username: "newUsername" });
    const res = await PUT(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal server error" });

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
