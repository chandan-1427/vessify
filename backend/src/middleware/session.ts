// src/middleware/session.ts
import { createMiddleware } from "hono/factory";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

export const sessionMiddleware = createMiddleware(async (c, next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    });

    if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const activeOrgId = session.session.activeOrganizationId;

    // ❌ Explicitly require an active organization
    if (!activeOrgId) {
        return c.json(
            { error: "No active organization selected" },
            403
        );
    }

    // 🔐 Enforce membership (CRITICAL for multi-tenancy)
    const membership = await prisma.member.findFirst({
        where: {
            userId,
            organizationId: activeOrgId,
        },
        select: { organizationId: true },
    });

    if (!membership) {
        return c.json(
            { error: "Forbidden: not a member of this organization" },
            403
        );
    }

    // ✅ Auth context (trusted)
    c.set("user", session.user);
    c.set("orgId", membership.organizationId);

    await next();
});
