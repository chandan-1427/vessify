// src/routes/auth.routes.ts
import { Hono } from "hono";
import {
  registerAndLoginUser,
  loginUser,
  logoutUser,
} from "../services/auth.service.js";
import type { RegisterInput, LoginInput } from "../types/auth.types.js";
import { auth } from "../lib/auth.js";

const authRouter = new Hono();

authRouter.post("/register", async (c) => {
  const body = await c.req.json<RegisterInput>();

  if (!body.email || !body.password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  try {
    const res = await registerAndLoginUser(body);
    return new Response(res.body, res);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

authRouter.post("/login", async (c) => {
  const body = await c.req.json<LoginInput>();

  try {
    const res = await loginUser(body);
    return new Response(res.body, res);
  } catch (err: any) {
    return c.json({ error: err.message }, 401);
  }
});

authRouter.post("/logout", async (c) => {
  const res = await logoutUser(c.req.raw.headers);
  return new Response(res.body, res);
});

/**
 * Better Auth internal handlers
 * MUST be last
 */
authRouter.all("/*", (c) => auth.handler(c.req.raw));

export { authRouter };
