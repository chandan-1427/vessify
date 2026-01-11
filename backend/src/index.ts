import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { authRouter } from "./routes/auth.routes.js";
import { txRouter } from "./routes/transactions.routes.js";

const CLIENT_ORIGIN = process.env.BASE_URL_CLIENT
  ? new URL(process.env.BASE_URL_CLIENT).origin
  : "http://localhost:3001";

export const app = new Hono();

/* 🔑 CORS MUST COME FIRST */
app.use(
  "*",
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use("*", logger());

// Routes
app.route("/api/auth", authRouter);
app.route("/api/transactions", txRouter);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`🚀 Server ready at http://localhost:${info.port}`);
    console.log(`🌍 Allowed CORS origin: ${CLIENT_ORIGIN}`);
  }
);
