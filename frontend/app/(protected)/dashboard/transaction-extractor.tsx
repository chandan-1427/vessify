"use client";

import { useState, useMemo } from "react";
import { 
  ShieldCheck, 
  FileSearch, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  RefreshCcw,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type ExtractedTransaction = {
  id: string;
  amount: number;
  currency: string;
  description: string;
  type: "DEBIT" | "CREDIT";
  balance: number | null;
  confidence: number;
  date: string;
};

export default function TransactionExtractor() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExtractedTransaction | null>(null);
  const [saving, setSaving] = useState(false);


  async function handleExtract() {
    if (!text.trim()) {
      setError("Please provide transaction text to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    // We keep the old result visible until the new one arrives for UI stability
    // but clear it on a fresh, successful start if desired.

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions/extract`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "The system could not identify transaction patterns in this text.");
      }

      setResult(data.data);
      setText(""); 
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "A secure connection error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions/save`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(result),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save transaction.");
      }

      // Clear preview after successful save
      setResult(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save transaction.");
    } finally {
      setSaving(false);
    }
  }

  const confidenceColor = useMemo(() => {
    if (!result) return "text-zinc-500";
    if (result.confidence > 0.8) return "text-emerald-600";
    if (result.confidence > 0.5) return "text-amber-600";
    return "text-red-600";
  }, [result]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* 1. INPUT SECTION */}
      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-emerald-600" />
            Transaction Analysis
          </CardTitle>
          <p className="text-sm text-slate-500">
            Paste an SMS, email, or statement snippet to structure the data.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              id="raw-input"
              placeholder="e.g. ₹1,200.00 debited from Acct XX123..."
              className="min-h-[140px] font-mono text-sm bg-slate-50/50 dark:bg-slate-900/50 resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="Raw transaction text"
              aria-describedby="input-hint"
              disabled={loading}
            />
          </div>

          <p id="input-hint" className="text-[11px] text-slate-400 flex items-start gap-1">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            Supported: Bank SMS, UPI alerts, and standard bank statement line items.
          </p>

          {error && (
            <Alert variant="destructive" className="py-3" aria-live="assertive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 font-bold h-11"
            onClick={handleExtract}
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Patterns...
              </>
            ) : (
              "Run Extraction Engine"
            )}
          </Button>
        </CardContent>
        <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 border-t py-3 justify-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            End-to-End Encrypted Processing
          </p>
        </CardFooter>
      </Card>

      {/* 2. PREVIEW SECTION */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="border-emerald-100 bg-emerald-50/10 dark:border-emerald-900/30 dark:bg-emerald-950/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">Extraction Preview</CardTitle>
                  <p className="text-xs text-slate-500">
                    Verify the details below before saving to your ledger.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`${confidenceColor} bg-white dark:bg-black font-mono`}
                >
                  {(result.confidence * 100).toFixed(0)}% Match
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Description
                    </span>
                    <p className="font-semibold truncate">
                      {result.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Amount
                    </span>
                    <p
                      className={`font-bold ${
                        result.type === "DEBIT"
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {result.type === "DEBIT" ? "-" : "+"}{" "}
                      {result.amount.toLocaleString()} {result.currency}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Date
                    </span>
                    <p>
                      {new Date(result.date).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Balance Impact
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">
                      {result.balance
                        ? `${result.balance.toLocaleString()} ${result.currency}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>

                <Separator className="bg-slate-200 dark:bg-slate-800" />

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Confirm & Save
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1"
                    size="sm"
                    onClick={() => setResult(null)}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Discard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}