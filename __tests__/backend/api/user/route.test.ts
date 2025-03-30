import { GET, PUT } from "@/api/user/route";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    session: {
      findUnique: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: () => data,
      ...options,
    })),
  },
}));

const prisma = new PrismaClient();

describe("User API route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("returns 401 if session cookie is missing", async () => {
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined),
        },
      };

      const response = await GET(request as unknown as NextRequest);

      expect(response.json()).toEqual({ error: "Not authenticated" });
      expect(response.status).toBe(401);
    });

    it("returns 401 if session is invalid", async () => {
      prisma.session.findUnique.mockResolvedValue(null);

      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: "invalid-session-id" }),
        },
      };

      const response = await GET(request as unknown as NextRequest);

      expect(prisma.session.findUnique).toHaveBeenCalledWith({
        where: { id: "invalid-session-id" },
        include: { user: true },
      });
      expect(response.json()).toEqual({ error: "Invalid session" });
      expect(response.status).toBe(401);
    });

    it("returns 401 if session is expired", async () => {
      prisma.session.findUnique.mockResolvedValue({
        id: "session-id",
        expiresAt: new Date(Date.now() - 1000), // Expired session
        user: {},
      });

      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: "session-id" }),
        },
      };

      const response = await GET(request as unknown as NextRequest);

      expect(response.json()).toEqual({ error: "Session expired" });
      expect(response.status).toBe(401);
    });

    it("returns user data if session is valid", async () => {
      const mockUser = {
        id: "user-id",
        username: "testuser",
        email: "test@example.com",
        createdAt: new Date("2023-01-01T00:00:00Z"),
      };

      prisma.session.findUnique.mockResolvedValue({
        id: "session-id",
        expiresAt: new Date(Date.now() + 1000), // Valid session
        user: mockUser,
      });

      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: "session-id" }),
        },
      };

      const response = await GET(request as unknown as NextRequest);

      expect(response.json()).toEqual({ user: mockUser });
    });
  });

  describe("PUT", () => {
    it("returns 401 if session cookie is missing", async () => {
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined),
        },
      };

      const response = await PUT(request as unknown as NextRequest);

      expect(response.json()).toEqual({ error: "Not authenticated" });
      expect(response.status).toBe(401);
    });

    it("returns 401 if session is invalid", async () => {
      prisma.session.findUnique.mockResolvedValue(null);

      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: "invalid-session-id" }),
        },
      };

      const response = await PUT(request as unknown as NextRequest);

      expect(prisma.session.findUnique).toHaveBeenCalledWith({
        where: { id: "invalid-session-id" },
        include: { user: true },
      });
      expect(response.json()).toEqual({ error: "Invalid session" });
      expect(response.status).toBe(401);
    });

    it("returns 401 if session is expired", async () => {
      prisma.session.findUnique.mockResolvedValue({
        id: "session-id",
        expiresAt: new Date(Date.now() - 1000), // Expired session
        user: {},
      });

      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: "session-id" }),
        },
      };

      const response = await PUT(request as unknown as NextRequest);

      expect(response.json()).toEqual({ error: "Session expired" });
      expect(response.status).toBe(401);
    });

    it("returns 400 if username is missing or empty", async () => {
      prisma.session.findUnique.mockResolvedValue({
        id: "session-id",
        expiresAt: new Date(Date.now() + 1000), // Valid session
        user: { id: "user-id" },
      });

      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: "session-id" }),
        },
        json: jest.fn().mockResolvedValue({ username: "" }),
      };

      const response = await PUT(request as unknown as NextRequest);

      expect(response.json()).toEqual({ error: "Username cannot be empty" });
      expect(response.status).toBe(400);
    });

    it("updates the username and returns updated user data", async () => {
      const mockUpdatedUser = {
        id: "user-id",
        username: "newusername",
        email: "test@example.com",
        createdAt: new Date("2023-01-01T00:00:00Z"),
      };

      prisma.session.findUnique.mockResolvedValue({
        id: "session-id",
        expiresAt: new Date(Date.now() + 1000), // Valid session
        user: { id: "user-id" },
      });

      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: "session-id" }),
        },
        json: jest.fn().mockResolvedValue({ username: "newusername" }),
      };

      const response = await PUT(request as unknown as NextRequest);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-id" },
        data: { username: "newusername" },
      });
      expect(response.json()).toEqual({ user: mockUpdatedUser });
    });

    it("returns 500 if an error occurs during update", async () => {
      prisma.session.findUnique.mockResolvedValue({
        id: "session-id",
        expiresAt: new Date(Date.now() + 1000), // Valid session
        user: { id: "user-id" },
      });

      prisma.user.update.mockRejectedValue(new Error("Database error"));

      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: "session-id" }),
        },
        json: jest.fn().mockResolvedValue({ username: "newusername" }),
      };

      const response = await PUT(request as unknown as NextRequest);

      expect(response.json()).toEqual({ error: "Failed to update user" });
      expect(response.status).toBe(500);
    });
  });
});