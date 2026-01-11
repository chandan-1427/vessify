"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Loader2
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  type: "DEBIT" | "CREDIT";
  date: string;
  balance: number | null;
  confidence: number;
};

export default function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const isInitialMount = useRef(true);

  const fetchTransactions = useCallback(async (loadMore = false) => {
    // Prevent concurrent duplicate fetches
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions`);
      if (loadMore && cursor) url.searchParams.set("cursor", cursor);
      url.searchParams.set("limit", "10");

      const res = await fetch(url.toString(), { credentials: "include" });
      
      if (!res.ok) throw new Error("Failed to synchronize transaction ledger.");

      const data = await res.json();

      setTransactions((prev) => (loadMore ? [...prev, ...data.data] : data.data));
      setCursor(data.nextCursor);
      setHasMore(Boolean(data.nextCursor));
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "A connection error occurred.");
    } finally {
      setLoading(false);
    }
  }, [cursor, loading]);

  // Initial load and Freshness Polling (every 30s)
  useEffect(() => {
    if (isInitialMount.current) {
      fetchTransactions();
      isInitialMount.current = false;
    }

    const interval = setInterval(() => fetchTransactions(), 30000);
    return () => clearInterval(interval);
  }, [fetchTransactions]);

  const renderSkeletons = () => (
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
        <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <Card className="border-slate-200 shadow-sm dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <History className="h-5 w-5 text-emerald-600" />
            Transaction Ledger
          </CardTitle>
          <p className="text-xs text-slate-500">
            Real-time extracted financial activity.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => fetchTransactions()} 
            disabled={loading}
            className="h-8 px-2 lg:px-3"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <span className="text-[10px] text-slate-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/10 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="rounded-md border border-slate-100 dark:border-slate-800">
          <Table>
            <TableCaption className="sr-only">List of extracted transactions and their confidence scores.</TableCaption>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && transactions.length === 0 ? renderSkeletons() : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <TableCell className="text-xs font-medium text-slate-500">
                      {new Date(tx.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </TableCell>
                    
                    <TableCell className="max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="truncate block font-medium" title={tx.description}>
                          {tx.description}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge 
                        className="font-bold text-[10px] uppercase tracking-wider"
                        variant={tx.type === "DEBIT" ? "secondary" : "default"}
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-mono font-bold">
                      <span className={tx.type === "DEBIT" ? "text-red-600" : "text-emerald-600"}>
                        {tx.type === "DEBIT" ? "−" : "+"}
                        {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        <span className="ml-1 text-[10px] text-slate-400">{tx.currency}</span>
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-flex items-center justify-end gap-1 cursor-help">
                              {tx.confidence > 0.8 ? (
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 text-amber-500" />
                              )}
                              <span className="text-xs font-semibold">
                                {(tx.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="text-[11px]">
                            {tx.confidence > 0.8 
                              ? "High precision extraction" 
                              : "Review recommended: Pattern match below 80%"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-900">
              <History className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">No transactions indexed</h3>
            <p className="text-xs text-slate-500">Enter a bank message above to begin extraction.</p>
          </div>
        )}
      </CardContent>

      {hasMore && (
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            className="w-full text-xs text-slate-500 hover:text-emerald-600"
            onClick={() => fetchTransactions(true)}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "View Older Transactions"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}