"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Code2, 
  Zap, 
  CheckCircle2, 
  Copy, 
  RefreshCcw, 
  Smartphone, 
  Mail, 
  FileText, 
  ChevronLeft
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 1. Define strict types for our presets to avoid 'any'
type PresetKey = "sms" | "email" | "csv";

interface PresetData {
  label: string;
  icon: React.ReactNode;
  input: string;
  output: Record<string, any>;
}

const PRESETS: Record<PresetKey, PresetData> = {
  sms: {
    label: "SMS Alert",
    icon: <Smartphone className="w-4 h-4" />,
    input: "Txn: Debit A/c XX1234 for USD 45.00 at STARBUCKS NYC on 12-01-26. Avl Bal: USD 2,450.20",
    output: {
      id: "tx_98231",
      timestamp: "2026-01-12T14:22:01Z",
      amount: 45.00,
      currency: "USD",
      type: "DEBIT",
      merchant: { name: "Starbucks", category: "Food & Beverage", location: "New York, NY" },
      account_suffix: "1234",
      balance_snapshot: 2450.20,
      confidence: 0.998
    }
  },
  email: {
    label: "Email Receipt",
    icon: <Mail className="w-4 h-4" />,
    input: "Your subscription for 'CloudSaaS Pro' has been renewed. Amount: $299.00. Billing Date: Jan 11, 2026. Payment Method: Visa ....9012",
    output: {
      id: "tx_sub_004",
      timestamp: "2026-01-11T09:00:00Z",
      amount: 299.00,
      currency: "USD",
      type: "DEBIT",
      merchant: { name: "CloudSaaS", category: "Software", location: "San Francisco, CA" },
      payment_method: "Visa-9012",
      tags: ["subscription", "recurring"],
      confidence: 0.994
    }
  },
  csv: {
    label: "Raw CSV Row",
    icon: <FileText className="w-4 h-4" />,
    input: "2026-01-10, \"CHECK DEPOSIT #441\", , 1200.00, \"CLEARED\"",
    output: {
      id: "tx_dep_552",
      timestamp: "2026-01-10T12:00:00Z",
      amount: 1200.00,
      currency: "USD",
      type: "CREDIT",
      merchant: { name: "Internal Deposit", category: "Transfer" },
      status: "CLEARED",
      confidence: 1.0
    }
  }
};

export default function TechnicalDemo() {
  const [activeTab, setActiveTab] = useState<PresetKey>("sms");
  const [inputText, setInputText] = useState(PRESETS.sms.input);
  const [isParsing, setIsParsing] = useState(false);

  // 2. Extracted parse logic to be reused
  const triggerParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
    }, 800);
  };

  // 3. Handle tab change: Update state synchronously in the handler 
  // to avoid the 'cascading renders' effect warning.
  const handleTabChange = (value: string) => {
    const key = value as PresetKey;
    setActiveTab(key);
    setInputText(PRESETS[key].input);
    triggerParse();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <Link 
          href="/" 
          className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Interactive Parser Demo
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Paste any unstructured financial string below to see our schema extraction in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Select Input Type
              </label>
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-3 w-full h-12">
                  {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
                    <TabsTrigger key={key} value={key} className="gap-2">
                      {PRESETS[key].icon} {PRESETS[key].label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-none">
              <CardContent className="p-0">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-48 p-4 bg-transparent resize-none focus:outline-none text-lg font-mono"
                  placeholder="Paste raw financial text here..."
                />
                <div className="p-3 border-t bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-mono">Input: UTF-8 Text</span>
                  <Button 
                    size="sm" 
                    onClick={triggerParse} 
                    disabled={isParsing} 
                    className="bg-emerald-600 hover:bg-emerald-500"
                  >
                    {isParsing ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    Parse Transaction
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">~42ms</div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-500 uppercase">Avg Latency</div>
               </div>
               <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-xl">99.9%</div>
                  <div className="text-xs text-blue-700 dark:text-blue-500 uppercase">Parsing Accuracy</div>
               </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <Card className="relative border-none bg-slate-900 text-slate-100 shadow-2xl overflow-hidden min-h-[520px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Response Object</span>
                </div>
                <Badge variant="outline" className="text-[10px] border-slate-700 text-emerald-400">
                  200 OK
                </Badge>
              </div>
              
              <CardContent className="p-6 font-mono text-sm overflow-auto">
                <AnimatePresence mode="wait">
                  {isParsing ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-80 space-y-4"
                    >
                      <RefreshCcw className="w-8 h-8 text-emerald-500 animate-spin" />
                      <p className="text-slate-500 animate-pulse">Running RegEx Engine...</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-2 text-emerald-500 text-xs">
                            <CheckCircle2 className="w-4 h-4" /> Valid Schema Extracted
                         </div>
                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-800">
                            <Copy className="w-4 h-4 text-slate-400" />
                         </Button>
                      </div>
                      <pre className="text-emerald-300">
                        {JSON.stringify(PRESETS[activeTab].output, null, 2)}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}