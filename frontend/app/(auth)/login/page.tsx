"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { 
  Lock, 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  ShieldCheck, 
  KeyRound 
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Maps standard auth errors to human-readable, non-leaking messages.
 */
const mapAuthError = (error: string | null) => {
  if (!error) return null;
  switch (error) {
    case "CredentialsSignin":
      return "Incorrect email or password. Please verify your details.";
    case "SessionRequired":
      return "Your session has expired. Please log in again to continue.";
    default:
      return "An authentication error occurred. Please try again or contact support.";
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formattedError = useMemo(() => mapAuthError(error), [error]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // Use router for a smooth SPA transition
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Default");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-[#020617]">
      {/* Structural SEO/A11y Navigation */}
      <Link 
        href="/" 
        className="mb-8 flex items-center text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
        aria-label="Return to homepage"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Back to Home
      </Link>

      <Card className="w-full max-w-md border-slate-200 shadow-2xl dark:border-slate-800">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider opacity-70">
              Secure Access
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Institutional Login
          </CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Access your secure ledger and transaction history.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@institution.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>

            {formattedError && (
              <Alert variant="destructive" className="py-2 animate-in fade-in duration-200" aria-live="assertive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {formattedError}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold h-11" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Secure Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col border-t border-slate-100 p-6 dark:border-slate-800">
          <p className="text-center text-sm text-slate-500">
            New to Vessify?{" "}
            <Link href="/register" className="font-bold text-emerald-600 hover:underline">
              Open a free account
            </Link>
          </p>
        </CardFooter>
      </Card>

      <div className="mt-8 flex items-center gap-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest">
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span className="flex items-center gap-1">
          <KeyRound className="h-3 w-3" /> Encrypted Session
        </span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}