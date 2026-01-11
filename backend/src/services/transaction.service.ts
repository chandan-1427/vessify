import { prisma } from "../../lib/prisma";
import type {
  ExtractTransactionResult,
  SaveTransactionInput,
} from "../types/transaction.types";

/**
 * 🔍 Preview-only extraction
 */
export function extractTransaction(text: string): ExtractTransactionResult {
  const cleanText = text.replace(/\s+/g, " ").trim();

  let amount = 0;
  let currency = "INR";
  let balance: number | null = null;
  let description = "Unknown Transaction";
  let type: "DEBIT" | "CREDIT" = "CREDIT";
  let date = new Date();

  /* 1️⃣ AMOUNT */
  const amountRegexes = [
    /Amount:\s*(-?[0-9,]+(?:\.[0-9]{1,2})?)/i,
    /₹\s*([0-9,]+(?:\.[0-9]{1,2})?)\s*(debited|dr)/i,
    /₹\s*([0-9,]+(?:\.[0-9]{1,2})?)\s*Dr/i,
  ];

  for (const regex of amountRegexes) {
    const match = cleanText.match(regex);
    if (match) {
      amount = Math.abs(parseFloat(match[1].replace(/,/g, "")));
      currency = "INR";
      type = "DEBIT";
      break;
    }
  }

  /* 2️⃣ SIMPLE ENGLISH TRANSFERS */
  if (amount === 0) {
    const englishMatch = cleanText.match(
      /(sent|paid|transferred)\s+([0-9,.]+)\s+(USD|INR|EUR|GBP)\s+to\s+(.+?)\s+on\s+([A-Za-z]+\s+\d{1,2})(?:st|nd|rd|th)?/i
    );

    if (englishMatch) {
      amount = parseFloat(englishMatch[2].replace(/,/g, ""));
      currency = englishMatch[3].toUpperCase();
      description = englishMatch[4].trim();
      type = "DEBIT";
      date = new Date(`${englishMatch[5]} ${new Date().getFullYear()}`);
    }
  }

  /* 3️⃣ BALANCE */
  const balanceRegexes = [
    /Balance after transaction:\s*([0-9,]+(?:\.[0-9]{1,2})?)/i,
    /Available Balance\s*→\s*₹([0-9,]+(?:\.[0-9]{1,2})?)/i,
    /Bal\s*([0-9,]+(?:\.[0-9]{1,2})?)/i,
  ];

  for (const regex of balanceRegexes) {
    const match = cleanText.match(regex);
    if (match) {
      balance = parseFloat(match[1].replace(/,/g, ""));
      break;
    }
  }

  /* 4️⃣ DATE */
  const dateRegexes = [
    /\b(\d{1,2}\s[a-z]{3}\s\d{4})\b/i,
    /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/i,
    /\b(\d{4}-\d{2}-\d{2})\b/i,
  ];

  for (const regex of dateRegexes) {
    const match = cleanText.match(regex);
    if (match) {
      date = new Date(match[1]);
      break;
    }
  }

  /* 5️⃣ DESCRIPTION */
  if (description === "Unknown Transaction") {
    const descMatch = cleanText.match(
      /Description:\s*(.+?)(Amount|Balance|$)/i
    );
    if (descMatch) {
      description = descMatch[1].trim();
    } else {
      description = cleanText
        .replace(
          /(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|₹|debited|dr|Bal|Balance|Available|Amount|[0-9,]+\.[0-9]{2})/gi,
          ""
        )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 120);
    }
  }

  /* 6️⃣ CONFIDENCE */
  let confidence = 0;
  if (amount > 0) confidence += 0.4;
  if (balance !== null) confidence += 0.2;
  if (date) confidence += 0.2;
  if (description !== "Unknown Transaction") confidence += 0.2;

  return {
    rawText: text,
    description,
    amount,
    currency,
    balance,
    type,
    confidence,
    date,
  };
}

/**
 * ✅ Persist after confirmation
 */
export async function saveTransaction(
  input: SaveTransactionInput,
  userId: string,
  orgId: string
) {
  return prisma.transaction.create({
    data: {
      ...input,
      userId,
      organizationId: orgId,
    },
  });
}
