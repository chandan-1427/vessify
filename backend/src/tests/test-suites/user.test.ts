import { authRouter } from "../../../src/routes/auth.routes";
import { prisma } from "../../../lib/prisma";
import { describe, it, expect, beforeEach, afterAll } from "@jest/globals";

const extractCookie = (res: Response) => {
  const cookies = res.headers.get("set-cookie");
  return cookies ? cookies.split(",")[0] : "";
};

describe("Auth Router Integration Tests", () => {
  const testUser = {
    email: "dev@example.com",
    password: "Password123!",
    name: "Dev User",
  };

  beforeEach(async () => {
    const deleteMembers = prisma.member.deleteMany();
    const deleteOrgs = prisma.organization.deleteMany();
    const deleteSessions = prisma.session.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteMembers, deleteOrgs, deleteSessions, deleteUsers]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /register", () => {
    it("should create a user, organization, and return a session cookie", async () => {
      const res = await authRouter.request("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUser),
      });

      expect(res.status).toBe(200);

      const user = await prisma.user.findUnique({ where: { email: testUser.email } });
      expect(user).toBeDefined();

      const org = await prisma.organization.findFirst({
        where: { name: `${testUser.name}'s Workspace` },
      });
      expect(org).toBeDefined();

      const membership = await prisma.member.findFirst({
        where: { userId: user?.id, organizationId: org?.id },
      });
      expect(membership?.role).toBe("admin");

      const setCookie = res.headers.get("set-cookie");
      expect(setCookie).toContain("better-auth.session_token");
    });

    it("should handle registration idempotency for existing users", async () => {
      await authRouter.request("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUser),
      });

      const res = await authRouter.request("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUser),
      });

      expect(res.status).toBe(200);
    });

    it("should return 400 if email is missing", async () => {
      const res = await authRouter.request("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "123", name: "No Email" }),
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBe("Email and password are required");
    });
  });

  describe("POST /login", () => {
    beforeEach(async () => {
      await authRouter.request("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUser),
      });
    });

    it("should login successfully and return a valid session", async () => {
      const res = await authRouter.request("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      expect(res.status).toBe(200);
      expect(res.headers.get("set-cookie")).toBeDefined();
    });

    it("should fail login with incorrect password", async () => {
      const res = await authRouter.request("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: "WrongPassword",
        }),
      });

      expect(res.status).toBe(401);
    });
  });

  describe("Multi-tenant Session Continuity", () => {
    it("should ensure a login session has an activeOrganizationId", async () => {
      const loginRes = await authRouter.request("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUser),
      });

      const cookie = extractCookie(loginRes);

      const sessionRes = await authRouter.request("/get-session", {
        method: "GET",
        headers: { "Cookie": cookie },
      });

      const sessionData = await sessionRes.json();
      expect(sessionData.session.activeOrganizationId).toBeDefined();
      expect(sessionData.session.activeOrganizationId).not.toBeNull();
    });
  });
});