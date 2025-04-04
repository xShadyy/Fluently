import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { POST } from "@/api/login/route";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

vi.mock("@prisma/client", () => {
  const mockPrisma = {
    user: { findUnique: vi.fn() },
    session: { upsert: vi.fn() }
  };
  return { PrismaClient: vi.fn(() => mockPrisma) };
});

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn()
  }
}));

const mockedBcrypt = bcrypt as unknown as {
  compare: Mock;
};

const prisma = new PrismaClient();

describe("POST /api/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if password does not match", async () => {
    (prisma.user.findUnique as Mock).mockResolvedValue({
      id: "1",
      email: "test@example.com",
      password: "hashedpassword",
      username: "testuser",
      createdAt: new Date(),
    });

    mockedBcrypt.compare.mockResolvedValue(false);

    const request = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "wrongpassword" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid email or password");
  });

  it("creates a session and returns user data on successful login", async () => {
    (prisma.user.findUnique as Mock).mockResolvedValue({
      id: "1",
      email: "test@example.com",
      password: "hashedpassword",
      username: "testuser",
      createdAt: new Date(),
    });

    mockedBcrypt.compare.mockResolvedValue(true);

    (prisma.session.upsert as Mock).mockResolvedValue({
      id: "session-id-123",
      userId: "1",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const request = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password",
        keepLoggedIn: false,
        isRegister: false,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user).toEqual({
      id: "1",
      username: "testuser",
      email: "test@example.com",
      createdAt: expect.any(String),
    });
  });
});
