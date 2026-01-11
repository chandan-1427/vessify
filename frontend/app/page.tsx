"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { 
  ArrowRight, Landmark, Menu, 
  Wallet, History, Lock, 
  FileJson, Code2, CheckCircle2, Shield
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * @name fadeInUp
 * Optimized variants with reduced motion support
 */
const getVariants = (shouldReduceMotion: boolean | null) => ({
  initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
});

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const variants = useMemo(() => getVariants(shouldReduceMotion), [shouldReduceMotion]);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-50 selection:bg-emerald-500/30 font-sans antialiased">
      
      {/* --- ACCESSIBLE NAVIGATION --- */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/60 bg-white/95 dark:border-slate-800/60 dark:bg-[#020617]/95 shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Vessify Assets Home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
              <Landmark className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Vessify <span className="text-emerald-600">Assets</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm" className="font-semibold" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5" asChild>
              <Link href="/register">Create Free Account</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuItem asChild><Link href="/docs">Docs</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/login">Login</Link></DropdownMenuItem>
                <DropdownMenuItem asChild className="text-emerald-600 font-bold"><Link href="/register">Sign Up</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <main id="main-content">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="initial" animate="animate" variants={variants} className="text-center">
              <Badge className="mb-6 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border py-1 px-4">
                <Lock className="mr-2 h-3.5 w-3.5 inline" /> SOC2 Type II & GDPR Compliant Infrastructure
              </Badge>
              
              <h1 id="hero-heading" className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl leading-[1.1]">
                Convert Unstructured Financial <br className="hidden lg:block" /> 
                Text into <span className="text-emerald-600">Actionable JSON Data.</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Stop manual entry. Programmatically parse bank SMS alerts, raw CSV statements, and payment emails into institutional-grade structured schemas with 99.9% RegEx accuracy.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-bold bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20" asChild>
                  <Link href="/register">Start Building Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-semibold" asChild>
                  <Link href="/demo">View Technical Demo</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- TRUST & COMPLIANCE SIGNALS --- */}
        <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617]/50 py-12">
          <div className="container mx-auto max-w-7xl px-4 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 font-bold text-slate-400"><Shield className="h-5 w-5" /> 256-BIT ENCRYPTION</div>
            <div className="flex items-center gap-2 font-bold text-slate-400"><CheckCircle2 className="h-5 w-5" /> 99.9% UPTIME SLA</div>
            <div className="flex items-center gap-2 font-bold text-slate-400"><Code2 className="h-5 w-5" /> OPEN BANKING API</div>
            <div className="flex items-center gap-2 font-bold text-slate-400"><FileJson className="h-5 w-5" /> AUTO-SCHEMA MAPPING</div>
          </div>
        </section>

        {/* --- TECHNICAL VALUE PROP (SEO) --- */}
        <section className="py-24 bg-white dark:bg-[#020617]" id="features">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Built for High-Velocity Fintech Engineering</h2>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <History className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Historical Audit Trail</h3>
                      <p className="text-slate-600 dark:text-slate-400">Index years of legacy bank messaging into a queryable SQL database. Our engine handles pagination and deduplication automatically.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Global Wallet Normalization</h3>
                      <p className="text-slate-600 dark:text-slate-400">From UPI and IMPS to SWIFT and SEPA—normalize diverse messaging formats into a single, unified transaction object.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm text-emerald-400">
                <div className="flex gap-2 mb-4 border-b border-slate-800 pb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <pre><code>{`// Out-of-the-box Extraction Logic
{
  "source": "SMS_ALERT",
  "raw": "Amt: 1,500.00 Dr to Starbucks",
  "extracted": {
    "amount": 1500.00,
    "currency": "INR",
    "type": "DEBIT",
    "merchant": "Starbucks",
    "confidence_score": 0.998
  }
}`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* --- LONG-FORM SEO / EDUCATIONAL CONTENT --- */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Modernizing Financial Data Orchestration</h2>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 space-y-6">
              <p>
                In the current fintech landscape, <strong>unstructured financial data</strong> remains the biggest hurdle for automated wealth management and bookkeeping apps. <strong>Vessify Assets</strong> solves this by providing a developer-first extraction API. By utilizing advanced Regular Expression (RegEx) patterns and heuristic analysis, we eliminate the need for manual data entry.
              </p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Enterprise-Grade Data Security</h3>
              <p>
                Security is our core product. We employ <strong>AES-256 bit encryption</strong> for all data at rest and TLS 1.3 for data in transit. Our multi-tenant architecture ensures that every organization&apos;s data remains strictly isolated at the database level using Prisma-level middleware and PostgreSQL row-level security concepts.
              </p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Scale with Open Banking Initiatives</h3>
              <p>
                Whether you are building a personal finance manager or an institutional reconciliation tool, our platform scales with your needs. Integrate our API to handle high-concurrency parsing requests, allowing your team to focus on core features rather than building regex parsers for every new bank format.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-[#020617]">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Landmark className="h-5 w-5 text-emerald-600" /> Vessify Assets
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Institutional-grade transaction parsing for the next generation of fintech applications.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 sm:gap-24">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Product</h4>
              <ul className="text-sm space-y-2">
                <li><Link href="/docs" className="hover:text-emerald-600">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-emerald-600">API Status</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Legal</h4>
              <ul className="text-sm space-y-2">
                <li><Link href="/privacy" className="hover:text-emerald-600">Privacy Policy</Link></li>
                <li><Link href="/security" className="hover:text-emerald-600">Security Model</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}