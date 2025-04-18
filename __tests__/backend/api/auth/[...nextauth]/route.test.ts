// __tests__/backend/api/auth/[...nextauth]/route.test.ts
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";

// Mocks for Prisma, bcrypt, and credentials provider
const mockFindUnique = vi.fn();
const mockCompare = vi.fn();

// Mock @prisma/client
vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    user: { findUnique: mockFindUnique },
  })),
}));

// Mock bcrypt with a default export containing compare
vi.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    compare: (...args: any[]) => mockCompare(...args),
  },
}));

// Mock credentials provider to return its config object directly
vi.mock("next-auth/providers/credentials", () => ({
  __esModule: true,
  default: (opts: any) => opts,
}));

// Mock NextAuth to capture its config
vi.mock("next-auth", () => ({
  __esModule: true,
  default: (config: any) => config,
}));

let config: any;
let authorize: Function;
let jwtCallback: Function;
let sessionCallback: Function;

// Import the NextAuth handler config after all mocks
beforeAll(async () => {
  const mod = await import("@/api/auth/[...nextauth]/route");
  config = mod.GET;
  // Extract the authorize function and callbacks
  const provider = config.providers[0];
  authorize = provider.authorize;
  jwtCallback = config.callbacks.jwt;
  sessionCallback = config.callbacks.session;
});

describe("NextAuth handler config", () => {
  beforeEach(() => {
    mockFindUnique.mockReset();
    mockCompare.mockReset();
  });

  it("defines a credentials provider with an authorize function", () => {
    expect(typeof authorize).toBe("function");
  });

  it("authorize throws when email or password missing", async () => {
    await expect(async () => authorize(undefined as any)).rejects.toThrow(
      "Email and password are required"
    );
    await expect(async () => authorize({ email: "", password: "" })).rejects.toThrow(
      "Email and password are required"
    );
  });

  it("authorize throws for invalid email", async () => {
    mockFindUnique.mockResolvedValue(null);
    await expect(async () =>
      authorize({ email: "no@user.com", password: "pass" })
    ).rejects.toThrow("Invalid email or password");
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: "no@user.com" },
    });
  });

  it("authorize throws for wrong password", async () => {
    const user = { id: "u1", email: "a@b.com", username: "user1", password: "hashed" };
    mockFindUnique.mockResolvedValue(user);
    mockCompare.mockResolvedValue(false);
    await expect(async () =>
      authorize({ email: "a@b.com", password: "wrong" })
    ).rejects.toThrow("Invalid email or password");
    expect(mockCompare).toHaveBeenCalledWith("wrong", "hashed");
  });

  it("authorize returns user object on success", async () => {
    const dbUser = {
      id: "u2",
      email: "c@d.com",
      username: "user2",
      password: "hashedpw",
      hasCompletedProficiencyQuiz: true,
    };
    mockFindUnique.mockResolvedValue(dbUser);
    mockCompare.mockResolvedValue(true);
    const result = await authorize({ email: dbUser.email, password: "pw" });
    expect(result).toEqual({
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      hasCompletedProficiencyQuiz: dbUser.hasCompletedProficiencyQuiz,
    });
  });

  it("jwt callback adds user fields to token", async () => {
    const token = { some: "data" };
    const user = { id: "u3", username: "usr3", hasCompletedProficiencyQuiz: false };
    const newToken = await jwtCallback({ token, user });
    expect(newToken).toMatchObject({
      some: "data",
      id: "u3",
      username: "usr3",
      hasCompletedProficiencyQuiz: false,
    });
  });

  it("session callback attaches token fields in session.user", async () => {
    const session = { user: {} as any };
    const token = { id: "u4", username: "usr4", hasCompletedProficiencyQuiz: true };
    const newSession = await sessionCallback({ session, token });
    expect(newSession.user).toMatchObject({
      id: "u4",
      username: "usr4",
      hasCompletedProficiencyQuiz: true,
    });
  });

  it("has correct session strategy and pages settings", () => {
    expect(config.session).toMatchObject({
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
    });
    expect(config.pages).toEqual({ signIn: "/login", error: "/login" });
  });
});
