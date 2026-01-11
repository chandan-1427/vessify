import { Hono } from "hono";
import { sessionMiddleware } from "../middleware/session";
import { rateLimit } from "../middleware/rateLimit";
import {
  extractTransaction,
  saveTransaction,
} from "../services/transaction.service";
import { prisma } from "../../lib/prisma";
import {
  extractTransactionSchema,
  saveTransactionSchema,
} from "../types/transaction.schema";
const txRouter = new Hono<{
  Variables: {
    user: any;
    orgId: string | null;
  };
}>();

/**
 * 🔍 Preview-only extraction
 */
txRouter.post(
  "/extract",
  sessionMiddleware,
  rateLimit({ limit: 20, windowMs: 60_000 }),
  async (c) => {
    const orgId = c.get("orgId");
    if (!orgId) {
      return c.json({ error: "No organization context" }, 400);
    }

    const parsed = extractTransactionSchema.safeParse(
      await c.req.json()
    );

    if (!parsed.success) {
      return c.json(
        { error: "Invalid extraction input" },
        400
      );
    }

    const { text } = parsed.data;
    const data = extractTransaction(text);

    return c.json({ success: true, data });
  }
);

/**
 * ✅ Persist after confirmation
 */
txRouter.post(
  "/save",
  sessionMiddleware,
  rateLimit({ limit: 40, windowMs: 60_000 }),
  async (c) => {
    const user = c.get("user");
    const orgId = c.get("orgId");

    if (!orgId) {
      return c.json({ error: "No organization context" }, 400);
    }

    const parsed = saveTransactionSchema.safeParse(
      await c.req.json()
    );

    if (!parsed.success) {
      return c.json(
        { error: "Invalid transaction payload" },
        400
      );
    }

    const tx = await saveTransaction(
      parsed.data,
      user.id,
      orgId
    );

    return c.json({ success: true, data: tx });
  }
);

/**
 * GET /api/transactions
 */
txRouter.get("/", sessionMiddleware, async (c) => {
  const orgId = c.get("orgId");
  if (!orgId) {
    return c.json({ error: "No organization context" }, 403);
  }

  const limit = Math.min(Number(c.req.query("limit")) || 10, 50);
  const cursor = c.req.query("cursor");

  const transactions = await prisma.transaction.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return c.json({
    data: transactions,
    nextCursor:
      transactions.length === limit
        ? transactions[transactions.length - 1].id
        : null,
  });
});

export { txRouter };
