export type ExtractTransactionResult = {
  rawText: string;
  description: string;
  amount: number;
  currency: string;
  balance: number | null;
  type: "DEBIT" | "CREDIT";
  confidence: number;
  date: Date;
};

export type SaveTransactionInput = ExtractTransactionResult;
