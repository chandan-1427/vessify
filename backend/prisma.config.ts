// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    // 👇 IMPORTANT: use DIRECT connection for Prisma Migrate
    url: process.env["DIRECT_URL"],
  },
});
