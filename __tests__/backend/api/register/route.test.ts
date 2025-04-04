import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

const mockUserFindUnique = vi.fn();
const mockUserCreate = vi.fn();

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(() => ({
    user: {
      findUnique: mockUserFindUnique,
      create: mockUserCreate,
    },
  })),
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
  },
}));

const makeRequest = (body: any): NextRequest => ({
  json: async () => body,
  cookies: { get: vi.fn() },
} as unknown as NextRequest);

describe("POST /api/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserFindUnique.mockReset();
  });

  it("returns 409 if user exists by email", async () => {
    mockUserFindUnique.mockResolvedValue({ id: "u1" });

    const { POST } = await import("@/api/register/route");
    const req = makeRequest({
      isRegister: true,
      email: "test@example.com",
      password: "pass",
      username: "user",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.error).toBe("A user with this email already exists");
  });

  it("returns 409 if user exists by username", async () => {
    mockUserFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: "u2" }); 

    const { POST } = await import("@/api/register/route");
    const req = makeRequest({
      isRegister: true,
      email: "test@example.com",
      password: "pass",
      username: "user",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.error).toBe("Username is already taken");
  });

  it("returns 500 if something goes wrong", async () => {
    mockUserFindUnique.mockRejectedValue(new Error("DB error"));

    const { POST } = await import("@/api/register/route");
    const req = makeRequest({
      isRegister: true,
      email: "test@example.com",
      password: "pass",
      username: "user",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});
