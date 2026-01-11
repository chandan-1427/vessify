import { txRouter } from "../../../src/routes/transactions.routes";
import { prisma } from "../../../lib/prisma";
import { describe, it, expect, beforeEach } from "@jest/globals";

describe("Cross-Organization Isolation Suite", () => {
  const ORG_A = "org_apple";
  const ORG_B = "org_banana";
  const USER_ID = "user_shared_id";

beforeEach(async () => {
  await prisma.transaction.deleteMany();

  const baseData = {
    userId: USER_ID,
    rawText: "Test transaction", 
    type: "DEBIT" as const,      
    date: new Date(),            
  };

  await prisma.transaction.create({
    data: { 
      ...baseData,
      description: "Secret Org A Data", 
      amount: 100, 
      organizationId: ORG_A 
    }
  });

  await prisma.transaction.create({
    data: { 
      ...baseData,
      description: "Secret Org B Data", 
      amount: 500, 
      organizationId: ORG_B 
    }
  });
});

  it("should NEVER return transactions from another organization", async () => {
    const res = await txRouter.request("/", {
      method: "GET",
      headers: { "x-test-org-id": ORG_A } 
    });

    const body = await res.json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0].description).toBe("Secret Org A Data");
    
    const hasOrgBData = body.data.some((t: any) => t.organizationId === ORG_B);
    expect(hasOrgBData).toBe(false);
  });

  it("should return 400/403 when organization context is missing", async () => {
    const res = await txRouter.request("/", {
      method: "GET",
      headers: { "x-test-org-id": "" }
    });

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe("No organization context");
  });
});