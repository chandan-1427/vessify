import { jest } from "@jest/globals";
import { mockDeep, mockReset } from "jest-mock-extended";
import type { PrismaClient } from "../../../generated/prisma/client";

// 🧪 Create deep mock
export const prismaMock = mockDeep<PrismaClient>();

// 🔐 Mock lib/prisma everywhere
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  prisma: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});
