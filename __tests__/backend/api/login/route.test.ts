import { POST } from "@/api/login/route";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    session: {
      upsert: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: () => data,
      cookies: {
        set: jest.fn(),
      },
      ...options,
    })),
  },
}));

const prisma = new PrismaClient();

describe("Login API route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if isRegister is true", async () => {
    const request = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "password123",
        keepLoggedIn: false,
        isRegister: true,
      }),
    };

    const response = await POST(request as unknown as Request);

    expect(response.json()).toEqual({ error: "Invalid request" });
    expect(response.status).toBe(400);
  });

  it("returns 400 if email or password is missing", async () => {
    const request = {
      json: jest.fn().mockResolvedValue({
        email: "",
        password: "",
        keepLoggedIn: false,
        isRegister: false,
      }),
    };

    const response = await POST(request as unknown as Request);

    expect(response.json()).toEqual({
      error: "Email and password are required",
    });
    expect(response.status).toBe(400);
  });

  it("returns 401 if user is not found", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const request = {
      json: jest.fn().mockResolvedValue({
        email: "nonexistent@example.com",
        password: "password123",
        keepLoggedIn: false,
        isRegister: false,
      }),
    };

    const response = await POST(request as unknown as Request);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "nonexistent@example.com" },
    });
    expect(response.json()).toEqual({ error: "Invalid email or password" });
    expect(response.status).toBe(401);
  });

  it("returns 401 if password does not match", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-id",
      email: "test@example.com",
      password: "hashed-password",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const request = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "wrongpassword",
        keepLoggedIn: false,
        isRegister: false,
      }),
    };

    const response = await POST(request as unknown as Request);

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrongpassword",
      "hashed-password",
    );
    expect(response.json()).toEqual({ error: "Invalid email or password" });
    expect(response.status).toBe(401);
  });

  it("creates a session and returns user data for valid credentials", async () => {
    const mockUser = {
      id: "user-id",
      username: "testuser",
      email: "test@example.com",
      password: "hashed-password",
      createdAt: new Date("2023-01-01T00:00:00Z"),
    };
    const mockSession = {
      id: "session-id",
      expiresAt: new Date("2023-01-02T00:00:00Z"),
    };

    prisma.user.findUnique.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    prisma.session.upsert.mockResolvedValue(mockSession);

    const request = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "password123",
        keepLoggedIn: true,
        isRegister: false,
      }),
    };

    const response = await POST(request as unknown as Request);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashed-password",
    );
    expect(prisma.session.upsert).toHaveBeenCalledWith({
      where: { userId: "user-id" },
      update: { expiresAt: expect.any(Date) },
      create: {
        user: { connect: { id: "user-id" } },
        expiresAt: expect.any(Date),
      },
    });
    expect(response.json()).toEqual({
      user: {
        id: "user-id",
        username: "testuser",
        email: "test@example.com",
        createdAt: new Date("2023-01-01T00:00:00Z"),
      },
    });
    expect(response.cookies.set).toHaveBeenCalledWith("sessionId", "session-id", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: expect.any(Date),
    });
  });

  it("returns 500 if an internal server error occurs", async () => {
    prisma.user.findUnique.mockRejectedValue(new Error("Database error"));

    const request = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "password123",
        keepLoggedIn: false,
        isRegister: false,
      }),
    };

    const response = await POST(request as unknown as Request);

    expect(response.json()).toEqual({ error: "Internal server error" });
    expect(response.status).toBe(500);
  });
});