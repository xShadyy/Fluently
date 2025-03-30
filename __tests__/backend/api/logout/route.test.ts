import { POST } from "@/api/logout/route";
import { NextResponse } from "next/server";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      json: () => data,
      cookies: {
        set: jest.fn((key, value, options) => ({ key, value, options })),
      },
      headers: new Map(),
    })),
  },
}));

describe("Logout API route", () => {
  it("returns success and clears the token cookie", async () => {
    const response = await POST();

    const data = response.json();
    expect(data).toEqual({ success: true });

    const setCookieHeader = jest.mocked(response.cookies.set).mock.calls[0];
    expect(setCookieHeader).toBeTruthy();
    expect(setCookieHeader[0]).toBe("token");
    expect(setCookieHeader[1]).toBe("");
    expect(setCookieHeader[2]).toMatchObject({
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/login",
    });
  });
});