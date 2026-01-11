import { z } from "zod";

export const extractTransactionSchema = z.object({
  text: z.string().min(5).max(5000),
});

export const saveTransactionSchema = z.object({
  rawText: z.string(),
  description: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3),
  balance: z.number().nullable(),
  type: z.enum(["DEBIT", "CREDIT"]),
  confidence: z.number().min(0).max(1),
  date: z.coerce.date(),
});
