import { describe, it, expect } from "vitest";
import { POST } from "@/api/logout/route";

describe("POST /api/logout", () => {
  it("clears token cookie and returns success", async () => {
    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });

    const cookie = response.cookies.get("token");
    expect(cookie).toBeDefined();
    expect(cookie?.maxAge).toBe(0);
    expect(cookie?.path).toBe("/login");
  });
});
