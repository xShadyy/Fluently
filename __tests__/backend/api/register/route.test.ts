import { POST } from "@/api/register/route";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: () => data,
      ...options,
    })),
  },
}));

const prisma = new PrismaClient();

describe("Register API route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if isRegister is false", async () => {
    const request = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "password123",
        username: "testuser",
        isRegister: false,
      }),
    };

    const response = await POST(request as unknown as NextRequest);

    expect(response.json()).toEqual({ error: "Invalid request" });
    expect(response.status).toBe(400);
  });

  it("returns 400 if email, password, or username is missing", async () => {
    const request = {
      json: jest.fn().mockResolvedValue({
        email: "",
        password: "",
        username: "",
        isRegister: true,
      }),
    };

    const response = await POST(request as unknown as NextRequest);

    expect(response.json()).toEqual({
      error: "Email, password, and username are required",
    });
    expect(response.status).toBe(400);
  });

  it("returns 409 if a user with the same email already exists", async () => {
    prisma.user.findUnique.mockResolvedValueOnce({ id: "existing-user-id" });

    const request = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "password123",
        username: "testuser",
        isRegister: true,
      }),
    };

    const response = await POST(request as unknown as NextRequest);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(response.json()).toEqual({
      error: "A user with this email already exists",
    });
    expect(response.status).toBe(409);
  });

  it("returns 409 if the username is already taken", async () => {
    prisma.user.findUnique
      .mockResolvedValueOnce(null) 
      .mockResolvedValueOnce({ id: "existing-user-id" }); 

    const request = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "password123",
        username: "testuser",
        isRegister: true,
      }),
    };

    const response = await POST(request as unknown as NextRequest);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: "testuser" },
    });
    expect(response.json()).toEqual({
      error: "Username is already taken",
    });
    expect(response.status).toBe(409);
  });

  it("creates a new user and returns 201 on success", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");
    prisma.user.create.mockResolvedValue({
      id: "new-user-id",
      email: "test@example.com",
      username: "testuser",
      password: "hashed-password",
    });

    const request = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "password123",
        username: "testuser",
        isRegister: true,
      }),
    };

    const response = await POST(request as unknown as NextRequest);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: "testuser" },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        username: "testuser",
        password: "hashed-password",
      },
    });
    expect(response.json()).toEqual({ message: "User created successfully" });
    expect(response.status).toBe(201);
  });

  it("returns 500 if an internal server error occurs", async () => {
    prisma.user.findUnique.mockRejectedValue(new Error("Database error"));

    const request = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "password123",
        username: "testuser",
        isRegister: true,
      }),
    };

    const response = await POST(request as unknown as NextRequest);

    expect(response.json()).toEqual({ error: "Internal server error" });
    expect(response.status).toBe(500);
  });
});