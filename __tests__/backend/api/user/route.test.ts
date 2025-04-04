import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const mockSessionFindUnique = vi.fn();
const mockUserUpdate = vi.fn();

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(() => ({
    session: {
      findUnique: mockSessionFindUnique,
    },
    user: {
      update: mockUserUpdate,
    },
  })),
}));

const mockRequest = (options: { 
  sessionId?: string, 
  method?: 'GET' | 'PUT',
  body?: any 
}): NextRequest => ({
  cookies: {
    get: vi.fn((name: string) => 
      name === 'sessionId' && options.sessionId 
        ? { value: options.sessionId } 
        : undefined
    ),
  },
  json: async () => options.body || {},
  method: options.method || 'GET',
} as unknown as NextRequest);

describe("GET /api/user", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionFindUnique.mockReset();
  });

  it("returns 401 when no session cookie exists", async () => {
    const { GET } = await import("@/api/user/route");
    const req = mockRequest({});
    const res = await GET(req);
    
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Not authenticated" });
  });

  it("returns 401 for invalid session", async () => {
    mockSessionFindUnique.mockResolvedValue(null);
    
    const { GET } = await import("@/api/user/route");
    const req = mockRequest({ sessionId: "invalid-session" });
    const res = await GET(req);
    
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Invalid session" });
  });

  it("returns 401 for expired session", async () => {
    mockSessionFindUnique.mockResolvedValue({
      expiresAt: new Date(2020, 0, 1),
      user: { id: "1", username: "test", email: "test@test.com" }
    });
    
    const { GET } = await import("@/api/user/route");
    const req = mockRequest({ sessionId: "expired-session" });
    const res = await GET(req);
    
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Session expired" });
  });

  it("returns user data for valid session", async () => {
    const mockUser = { 
      id: "user-1", 
      username: "testuser", 
      email: "test@example.com", 
      createdAt: new Date() 
    };
    
    mockSessionFindUnique.mockResolvedValue({
      expiresAt: new Date(2030, 0, 1),
      user: mockUser
    });

    const { GET } = await import("@/api/user/route");
    const req = mockRequest({ sessionId: "valid-session" });
    const res = await GET(req);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data.user).toEqual({
      id: mockUser.id,
      username: mockUser.username,
      email: mockUser.email,
      createdAt: mockUser.createdAt.toISOString(),
    });
  });
});

describe("PUT /api/user", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionFindUnique.mockReset();
    mockUserUpdate.mockReset();
  });

  it("returns 400 for empty username", async () => {
    mockSessionFindUnique.mockResolvedValue({
      expiresAt: new Date(2030, 0, 1),
      user: { id: "user-1" }
    });

    const { PUT } = await import("@/api/user/route");
    const req = mockRequest({
      sessionId: "valid-session",
      method: "PUT",
      body: { username: "" }
    });
    
    const res = await PUT(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Username cannot be empty" });
  });

  it("updates username successfully", async () => {
    const mockUser = { 
      id: "user-1", 
      username: "new-username", 
      email: "test@example.com" 
    };
    
    mockSessionFindUnique.mockResolvedValue({
      expiresAt: new Date(2030, 0, 1),
      user: { id: "user-1" }
    });
    
    mockUserUpdate.mockResolvedValue(mockUser);

    const { PUT } = await import("@/api/user/route");
    const req = mockRequest({
      sessionId: "valid-session",
      method: "PUT",
      body: { username: "new-username" }
    });
    
    const res = await PUT(req);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data.user).toEqual(mockUser);
    expect(mockUserUpdate).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { username: "new-username" }
    });
  });

  it("returns 500 on database error", async () => {
    mockSessionFindUnique.mockResolvedValue({
      expiresAt: new Date(2030, 0, 1),
      user: { id: "user-1" }
    });
    
    mockUserUpdate.mockRejectedValue(new Error("Database error"));

    const { PUT } = await import("@/api/user/route");
    const req = mockRequest({
      sessionId: "valid-session",
      method: "PUT",
      body: { username: "new-username" }
    });
    
    const res = await PUT(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to update user" });
  });
});
