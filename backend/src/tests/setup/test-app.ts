import { Hono } from "hono";
import { authRouter } from "../../routes/auth.routes";
import { txRouter } from "../../routes/transactions.routes";

export function createTestApp() {
  const app = new Hono();

  // Attach your routes exactly as they are in your main src/index.ts
  app.route("/api/auth", authRouter);
  app.route("/api/transactions", txRouter);

  return app;
}

// Export the type of the app so testClient can provide autocomplete
export type AppType = ReturnType<typeof createTestApp>;