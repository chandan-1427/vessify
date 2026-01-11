import { txRouter } from "../../../src/routes/transactions.routes";
import { prisma } from "../../../lib/prisma";
import { describe, it, expect, beforeEach, afterAll } from "@jest/globals";

const mockContext = {
  user: { id: "user_1" },
  orgId: "org_alpha",
};

describe("Transactions Functional Suite", () => {
  beforeEach(async () => {
    await prisma.transaction.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /extract", () => {
    it("should extract bank-style SMS correctly (INR/Debit)", async () => {
      const sms = "Amount: 1,500.50 Description: Starbucks ₹ 1,500.50 debited Bal 45,000";
      
      const res = await txRouter.request("/extract", {
        method: "POST",
        body: JSON.stringify({ text: sms }),
        headers: { "Content-Type": "application/json" },
      });

      const { data } = await res.json();

      expect(res.status).toBe(200);
      expect(data.amount).toBe(1500.5);
      expect(data.currency).toBe("INR");
      expect(data.type).toBe("DEBIT");
      expect(data.balance).toBe(45000);
      expect(data.confidence).toBeGreaterThanOrEqual(0.8);
    });

    it("should extract simple English transfers correctly", async () => {
      const text = "Sent 50.00 USD to Amazon.com on Jan 9th";
      
      const res = await txRouter.request("/extract", {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: { "Content-Type": "application/json" },
      });

      const { data } = await res.json();

      expect(data.amount).toBe(50);
      expect(data.currency).toBe("USD");
      expect(data.description).toBe("Amazon.com");
    });
  });

  describe("GET / (Pagination)", () => {
    it("should paginate transactions correctly using cursor", async () => {
      for (let i = 1; i <= 3; i++) {
        await prisma.transaction.create({
          data: {
            rawText: `Tx ${i}`,
            amount: i * 10,
            description: `Desc ${i}`,
            userId: "user_1",
            organizationId: "org_alpha",
            type: "DEBIT", 
            date: new Date(),
          },
        });
      }

      const res1 = await txRouter.request("/?limit=2");
      const page1 = await res1.json();

      expect(page1.data).toHaveLength(2);
      expect(page1.nextCursor).toBeDefined();

      const res2 = await txRouter.request(`/?limit=2&cursor=${page1.nextCursor}`);
      const page2 = await res2.json();

      expect(page2.data).toHaveLength(1);
      expect(page2.nextCursor).toBeNull();
    });
  });
});