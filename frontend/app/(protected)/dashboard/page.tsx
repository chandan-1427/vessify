import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Landmark, 
  LogOut, 
  User, 
  ShieldCheck, 
  Activity 
} from "lucide-react";

import TransactionExtractor from "./transaction-extractor";
import TransactionsList from "./transactions-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "@/components/auth/logout-button"; // Client component for signOut

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-50">
      {/* --- CONTROL BAR (Header) --- */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-[#020617]/80">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-600 shadow-lg shadow-emerald-500/20">
              <Landmark className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Vessify Ledger
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Session Identity Indicator */}
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3 dark:border-slate-800 sm:pr-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <div className="hidden flex-col text-left lg:flex">
                <span className="text-xs font-bold leading-none">{session.user?.email}</span>
                <span className="mt-1 text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <ShieldCheck className="h-2.5 w-2.5" /> Verified Session
                </span>
              </div>
            </div>

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT PIPELINE --- */}
      <main className="mx-auto max-w-5xl p-4 pt-8 sm:p-6 sm:pt-12">
        <div className="grid gap-10">
          
          {/* Section 1: Data Entry / Extraction */}
          <section aria-labelledby="extraction-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="extraction-heading" className="text-lg font-bold tracking-tight">
                  Data Ingestion
                </h2>
                <p className="text-xs text-slate-500">Input raw text for structured extraction</p>
              </div>
              <Badge variant="outline" className="h-6 gap-1 border-slate-200 text-[10px] uppercase dark:border-slate-800">
                <Activity className="h-3 w-3 text-emerald-500" /> Engine Active
              </Badge>
            </div>
            <TransactionExtractor />
          </section>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          {/* Section 2: Ledger / History */}
          <section aria-labelledby="ledger-heading" className="space-y-4">
            <div>
              <h2 id="ledger-heading" className="text-lg font-bold tracking-tight">
                Historical Ledger
              </h2>
              <p className="text-xs text-slate-500">Manage and audit your transaction records</p>
            </div>
            <TransactionsList />
          </section>
        </div>
      </main>

      {/* --- FOOTER STATUS --- */}
      <footer className="mt-auto border-t border-slate-200 py-6 dark:border-slate-800">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between text-[10px] font-medium text-slate-400 uppercase tracking-widest">
          <span>System v2.4.0</span>
          <span>© 2026 Vessify Assets Secure Environment</span>
        </div>
      </footer>
    </div>
  );
}